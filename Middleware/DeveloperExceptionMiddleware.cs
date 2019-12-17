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

        public async Task Invoke(HttpContext httpContext, IEmailService _EmailService)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await _EmailService.SendExceptionEmailAsync(ex, httpContext);
                httpContext.Response.Redirect("/Home/Error");
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