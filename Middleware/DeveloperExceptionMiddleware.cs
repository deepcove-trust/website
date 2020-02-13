using System;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Features.Emails;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

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

        public async Task Invoke(HttpContext httpContext, IEmailService email, ILogger<DeveloperExceptionMiddleware> logger)
        {
            try
            {
                await _next(httpContext);
            }
            catch(Exception ex)
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


            try
            {
                // Trigger the exception handler
                if (httpContext.Response.StatusCode == StatusCodes.Status404NotFound)
                {
                    throw new Exception($"{httpContext.Request.Path} could not be found");
                }
            }
            catch(Exception ex)
            {   // Handle an internal server error
                httpContext.Response.Clear();
                httpContext.Response.StatusCode = 404;
                httpContext.Response.Redirect($"/error/not-found");
            }
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class DeveloperExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseDeveloperExceptionMails(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<DeveloperExceptionMiddleware>();
        }
    }
}