using System;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Features.Emails;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

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

        public async Task Invoke(HttpContext httpContext, IEmailService email)
        {
            try
            {
                await _next(httpContext);
            }
            catch(Exception ex)
            {
                await email.SendExceptionEmailAsync(ex, httpContext);
                
                if (httpContext.Response.HasStarted)
                {
                    // Log RahRoh
                    throw;
                }
                
                httpContext.Response.Clear();
                httpContext.Response.StatusCode = 500;
                httpContext.Response.Redirect("/home/error");
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