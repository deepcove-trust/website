using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Features.Emails;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/reset-password")]
    public class RequestPasswordResetController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly IConfiguration _Config;
        private readonly IEmailService _EmailService;
        private readonly ILogger<RequestPasswordResetController> _Logger;

        public RequestPasswordResetController(WebsiteDataContext db, IConfiguration configuration, IEmailService emailService, ILogger<RequestPasswordResetController> logger)
        {
            _Db = db;
            _Config = configuration;
            _EmailService = emailService;
            _Logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            // Redirect authenticated users
            // to the dashboard
            if (User.Identity.IsAuthenticated)
            {
                return Redirect(Url.Action(
                    "Index",
                    "Dashboard",
                    new { area = "admin" }
                ));
            }

            return View(viewName: "~/Views/Authentication/RequestPasswordReset.cshtml");
        }

        public async Task<IActionResult> Index(IFormCollection request)
        {
            try
            {
                Account account = await _Db.Accounts.Where(c => c.Email == request.Str("email")).FirstOrDefaultAsync();
                if (account != null)
                {
                    List<PasswordReset> oldTokens = await _Db.PasswordResets.Where(c => c.Account.Id == account.Id).ToListAsync() ?? new List<PasswordReset>();
                    foreach (PasswordReset resetToken in oldTokens)
                    {
                        resetToken.ExpiresAt = DateTime.UtcNow;
                    }

                    PasswordReset reset = new PasswordReset(
                        account, 
                        DateTime.UtcNow.AddMinutes(_Config["LoginSettings:PasswordResetTokenLength"].ToInt())
                    );

                    await _Db.AddAsync(reset);
                    await _Db.SaveChangesAsync();
                    await _EmailService.SendPasswordResetEmailAsync(reset, this.Request.BaseUrl());
                    
                    _Logger.LogInformation("Password reset requested for account belonging to {0}", account.Name);
                }
                
                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error requesting password reset for account belonging to {0}: {1}", request.Str("email"), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again later", ex.Message));
            }
        }
    }
}