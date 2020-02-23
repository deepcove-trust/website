using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;
using Deepcove_Trust_Website.Features.RazorRender;
using Deepcove_Trust_Website.Features.Emails;
using Microsoft.Extensions.Configuration;

namespace Deepcove_Trust_Website.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class DeveloperExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public DeveloperExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, IEmailService email, ILogger<DeveloperExceptionMiddleware> logger, IViewRenderer viewRenderer)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                string requestId = System.Diagnostics.Activity.Current?.Id ?? httpContext.TraceIdentifier;
                await email.SendExceptionEmailAsync(ex, httpContext, requestId);
                logger.LogError($"EXCEPTION THROWN | EXCEPTION ID: {requestId}\n" +
                        $"Message: {ex.Message}\n" +
                        $"{ex.StackTrace}\n\n" +
                        $"Inner Exception: {ex.InnerException?.Message ?? ""}\n" +
                        $"{ex.InnerException?.StackTrace ?? ""}\n\n" +
                        $"END EXCEPTION"
                    );

                if (httpContext.Response.HasStarted)
                {
                    logger.LogWarning("The response has already started, the exception will not be handled.");
                    throw;
                }

                // Handle an internal server error
                httpContext.Response.Clear();
                httpContext.Response.StatusCode = 500;
                httpContext.Response.Redirect($"/error/server-error?requestId={requestId}");
            }
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class DeveloperExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseDeveloperExceptionMails(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<DeveloperExceptionMiddleware>();
                //.UseMiddleware<NotfoundExceptionMiddleware>(); Disabled until I can fix search engine 404s
        }
    }

    public class NotfoundExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public NotfoundExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, IEmailService email, 
            ILogger<DeveloperExceptionMiddleware> logger, IViewRenderer viewRenderer, IConfiguration config)
        {
            try
            {
                // Trigger the exception handler
                if (bool.Parse(config["logging.404emails"]) && httpContext.Response.StatusCode == StatusCodes.Status404NotFound)
                {
                    if (!httpContext.Response.Headers.ContainsKey("errorstop"))
                        throw new Exception($"{httpContext.Request.PathBase + httpContext.Request.Path} could not be found");
                }
            }
            // Handle page not found
            catch (Exception ex)
            {   // Only send emails if the request did not come from a search engine bot
                // Bots list from: https://perishablepress.com/list-all-user-agents-top-search-engines/ Feb 2020
                if (!IsSpiderBot(logger, httpContext.Request.Headers["User-Agent"]))
                {
                    string requestId = System.Diagnostics.Activity.Current?.Id ?? httpContext.TraceIdentifier;
                    await email.SendExceptionEmailAsync(ex, httpContext, requestId);
                    logger.LogError($"EXCEPTION THROWN | EXCEPTION ID: {requestId}\n" +
                            $"Message: {ex.Message}\n" +
                            $"{ex.StackTrace}\n\n" +
                            $"Inner Exception: {ex.InnerException?.Message ?? ""}\n" +
                            $"{ex.InnerException?.StackTrace ?? ""}\n\n" +
                            $"END EXCEPTION"
                        );
                }

                httpContext.Response.Redirect("/error/not-found");
            }
        }

        private bool IsSpiderBot(ILogger<DeveloperExceptionMiddleware> _logger, string useragent_string)
        {
            List<SpiderBotAgents> UserAgents = JsonConvert.DeserializeObject<List<SpiderBotAgents>>
                (File.ReadAllText("Data/spiderbot_useragents.json"));

            foreach (SpiderBotAgents agent in UserAgents)
            {
                foreach (string exp in agent.Regex)
                {
                    if (useragent_string.Contains(exp))
                    {
                        _logger.LogDebug($"404 caused by spiderbot: {agent.Owner}");
                        return true;
                    }
                }
            }

            return false;
        }

        private struct SpiderBotAgents
        {
            public string Owner { get; set; }
            public List<string> Regex { get; set; }
        }
    }
}