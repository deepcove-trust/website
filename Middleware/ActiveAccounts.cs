using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Deepcove_Trust_Website.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class ActiveAccounts
    {
        private readonly RequestDelegate _next;
        private WebsiteDataContext _Db;
        private HttpContext _Http;

        public ActiveAccounts(RequestDelegate next)
        {
            _next = next;
        }

        public async Task<Task> InvokeAsync(HttpContext httpContext, WebsiteDataContext db)
        {
            _Db = db;
            _Http = httpContext;

            if (_Http.User.Identity.IsAuthenticated)
            {
                Account account = await _Db.Accounts.FindAsync(_Http.User.AccountId());
                if(account != null && !account.Active)
                {
                    await _Http.SignOutAsync();
                    _Http.Response.Redirect("/error/inactive");
                }
            }
            
            return _next(_Http);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ActiveAccountsExtensions
    {
        public static IApplicationBuilder UseActiveAccounts(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ActiveAccounts>();
        }
    }
}
