using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Features.Emails;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Deepcove_Trust_Website.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class RequirePasswordReset
    {
        private readonly RequestDelegate _next;

        public RequirePasswordReset(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext, WebsiteDataContext db, IConfiguration config, IEmailService smtp)
        {
            if (httpContext.User.Identity.IsAuthenticated)
            {
                Account account = db.Accounts.Find(httpContext.User.AccountId());
                if (account.ForcePasswordReset)
                {
                    //Clear old tokens
                    List<PasswordReset> oldTokens = db.PasswordResets.Where(c => c.Account.Id == account.Id).ToList() ?? new List<PasswordReset>();
                    foreach(PasswordReset token in oldTokens)
                    {
                        token.ExpiresAt = DateTime.UtcNow;
                    }

                    // Get new token
                    PasswordReset newToken = new PasswordReset
                    {
                        Account = account,
                        Token = Utils.RandomString(20),
                        ExpiresAt = DateTime.UtcNow.AddMinutes(int.Parse(config["LoginSettings:PasswordResetTokenLength"]))
                    };

                    // send email
                    smtp.SendRazorEmailAsync(null,
                        new EmailContact { Name = account.Name, Address = account.Email },
                        "Password Reset",
                        "Password Reset",
                        new Views.Emails.Models.PasswordReset
                        {
                            Name = account.Name,
                            Token = newToken.Token,
                            Email = account.Email,
                            BaseUrl = httpContext.Request.BaseUrl()
                        }
                    );

                    httpContext.SignOutAsync();
                    httpContext.Response.Redirect("/error/password-reset");
                }
            }

            return _next(httpContext);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class RequirePasswordResetExtensions
    {
        public static IApplicationBuilder UseRequirePasswordReset(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequirePasswordReset>();
        }
    }
}
