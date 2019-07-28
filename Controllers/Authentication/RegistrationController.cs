using System;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using Deepcove_Trust_Website.Features.Emails;
using Deepcove_Trust_Website.Features;
using Microsoft.Extensions.Logging;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Configuration;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Authorize]
    [Route("/register")]
    public class RegistrationController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly IConfiguration _Configuration;
        private IPasswordHasher<Account> _Hasher;
        private IEmailService _Smtp;
        private readonly ILogger<RegistrationController> _Logger;

        public RegistrationController(WebsiteDataContext db, IConfiguration configuration, IEmailService smtp, IPasswordHasher<Account> hasher, ILogger<RegistrationController> logger)
        {
            _Db = db;
            _Smtp = smtp;
            _Hasher = hasher;
            _Logger = logger;
            _Configuration = configuration;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View(viewName: "~/Views/Authentication/Register.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection request)
        {
            Account account = await _Db.Accounts.Where(c => c.Email == request.Str("email")).FirstOrDefaultAsync();
            if (account != null) {
                _Logger.LogDebug("Unable to create account using {0} as an account already exists for this email address", request.Str("email"));
                return BadRequest("An account with that email address already exists");
            }

            try
            {
                account = new Account
                {
                    Email = request.Str("email"),
                    Name = request.Str("name"),
                    Active = false,
                };

                account.Password = _Hasher.HashPassword(account, Utils.RandomString(30));
                await _Db.AddAsync(account);                

                PasswordReset reset = new PasswordReset
                {
                    Account = account,
                    Token = Utils.RandomString(42),
                    ExpiresAt = DateTime.UtcNow.AddHours(_Configuration.GetSection("LoginSettings").GetValue<int>("NewAccountResetTokenLength"))
                };

                await _Db.AddAsync(reset);
                await _Db.SaveChangesAsync();

                _Logger.LogInformation("New account created - Name: {0}, Email: {1}", account.Name, account.Email);

                EmailContact sendTo = new EmailContact { Name = account.Name, Address = account.Email };

                await _Smtp.SendRazorEmailAsync(null,
                    sendTo,
                    "Account Created",
                    "AccountCreated",
                    new Views.Emails.Models.AccountCreated {
                        Name = account.Name,
                        Recipient = sendTo,
                        CreatedBy = new EmailContact {
                            Name = User.AccountName(),
                            Address = User.AccountEmail()
                        },
                        Token = reset.Token,
                        BaseUrl = this.Request.BaseUrl()
                    }
                );

                return Ok();
            } 
            catch(Exception ex)
            {
                _Logger.LogError("Error while creating new account: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later");
            }
            
        }
    }
}