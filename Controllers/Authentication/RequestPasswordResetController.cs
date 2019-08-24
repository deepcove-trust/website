using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Features.Emails;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/reset-password")]
    public class RequestPasswordResetController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly IConfiguration _Configuration;
        private readonly IEmailService _Smtp;
        private readonly ILogger<RequestPasswordResetController> _Logger;

        public RequestPasswordResetController(WebsiteDataContext db, IConfiguration configuration, IEmailService smtp, ILogger<RequestPasswordResetController> logger)
        {
            _Db = db;
            _Configuration = configuration;
            _Smtp = smtp;
            _Logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            // Redirect authenticated users
            // to the dashboard
            if (User.Identity.IsAuthenticated)
                return Redirect(
                    Url.Action(
                        "Index",
                        "AdminDashboard",
                        new { area = "admin-portal" }
                    )
                );

            return View(viewName: "~/Views/Authentication/RequestPasswordReset.cshtml");
        }

        public async Task<IActionResult> Index(IFormCollection request)
        {
            try
            {
                Account account = await _Db.Accounts.Where(c => c.Email == request.Str("email")).FirstOrDefaultAsync();
                if (account != null)
                {
                    List<PasswordReset> resetTokens = await _Db.PasswordResets.Include(i => i.Account).Where(c => c.Account.Id == account.Id).ToListAsync();
                    if (resetTokens != null)
                        foreach (PasswordReset resetToken in resetTokens)
                            resetToken.ExpiresAt = DateTime.UtcNow;

                    PasswordReset reset = new PasswordReset
                    {
                        Account = account,
                        Token = Utils.RandomString(20),
                        ExpiresAt = DateTime.UtcNow.AddMinutes(_Configuration.GetSection("LoginSettings").GetValue<int>("PasswordResetTokenLength"))
                    };

                    await _Db.AddAsync(reset);
                    await _Db.SaveChangesAsync();

                    await _Smtp.SendRazorEmailAsync(null,
                        new EmailContact { Name = account.Name, Address = account.Email },
                        "Password Reset",
                        "PasswordReset",
                        new Views.Emails.Models.PasswordReset
                        {
                            Name = account.Name,
                            Token = reset.Token,
                            BaseUrl = this.Request.BaseUrl()
                        }
                    );

                    _Logger.LogInformation("Password reset requested for account belonging to {0}", account.Name);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error requesting password reset for account belonging to {0}: {1}", request.Str("email"), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later");
            }
        }
    }
}