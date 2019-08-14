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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Deepcove_Trust_Website.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class ForcePasswordReset
    {
        private readonly RequestDelegate _next;
        private IConfiguration _Configuration;
        private WebsiteDataContext _Db;
        private IEmailService _Smtp;
        private HttpContext _Http;
        

        public ForcePasswordReset(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, WebsiteDataContext db, IConfiguration configuration, IEmailService smtp)
        {
            _Db = db;
            _Http = httpContext;
            _Smtp = smtp;
            _Configuration = configuration;


            if (_Http.User.Identity.IsAuthenticated)
            {
                Account user = _Db.Accounts.Find(_Http.User.AccountId());
                if (user.ForcePasswordReset)
                {
                    List<PasswordReset> resetTokens = await _Db.PasswordResets.Include(i => i.Account).Where(c => c.Account.Id == user.Id).ToListAsync();
                    if (resetTokens != null)
                        foreach (PasswordReset resetToken in resetTokens)
                            resetToken.ExpiresAt = DateTime.UtcNow;

                    PasswordReset reset = new PasswordReset
                    {
                        Account = user,
                        Token = Utils.RandomString(20),
                        ExpiresAt = DateTime.UtcNow.AddMinutes(_Configuration.GetSection("LoginSettings").GetValue<int>("PasswordResetTokenLength"))
                    };

                    await _Db.AddAsync(reset);
                    await _Db.SaveChangesAsync();

                    // Fire off reset email.
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    _Smtp.SendRazorEmailAsync(null,
                        new EmailContact { Name = user.Name, Address = user.Email },
                        "Password Reset",
                        "PasswordReset",
                        new Views.Emails.Models.PasswordReset
                        {
                            Name = user.Name,
                            Token = reset.Token,
                            BaseUrl = _Http.Request.BaseUrl()
                        }
                    );
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

                    //We require them to change their password, 
                    //let's log them out and tell hem why.
                    await _Http.SignOutAsync();
                    _Http.Response.Redirect("/error/password-reset");

                }//If no password reset is required, go to next.
            }// If user is not logged in, go to next.

            await _next.Invoke(_Http);
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ForcePasswordResetExtensions
    {
        public static IApplicationBuilder UseForcePasswordReset(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ForcePasswordReset>();
        }
    }
}
