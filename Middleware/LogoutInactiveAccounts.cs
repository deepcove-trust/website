using System.Threading.Tasks;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Deepcove_Trust_Website.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class LogoutInactiveAccounts
    {
        private readonly RequestDelegate _next;

        public LogoutInactiveAccounts(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext, Data.WebsiteDataContext db)
        {
            if (httpContext.User.Identity.IsAuthenticated)
            {
                Account account = db.Accounts.Find(httpContext.User.AccountId());
                if(account != null && !account.Active)
                {
                    httpContext.SignOutAsync();
                    httpContext.Response.Redirect("/error/inactive");
                }
            }

            return _next(httpContext);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class LogoutInactiveAccountsExtensions
    {
        public static IApplicationBuilder UseLogoutInactiveAccounts(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LogoutInactiveAccounts>();
        }
    }
}
