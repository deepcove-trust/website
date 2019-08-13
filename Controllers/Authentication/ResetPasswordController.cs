using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Deepcove_Trust_Website.Features.Emails;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/reset-password/{token}")]
    public class ResetPasswordController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private IPasswordHasher<Account> _Hasher;
        private readonly ILogger<ResetPasswordController> _Logger;

        public ResetPasswordController(WebsiteDataContext db, IPasswordHasher<Account> hasher, ILogger<ResetPasswordController> logger)
        {
            _Db = db;
            _Hasher = hasher;
            _Logger = logger;
        }

        [HttpGet]
        public IActionResult Index(string token)
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

            return View(viewName: "~/Views/Authentication/ResetPassword.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Index(string token, IFormCollection request)
        {
            if (string.IsNullOrEmpty(token))
            {
                _Logger.LogDebug("Password reset attempted ({0}) with no token provided", request.Str("email"));
                return BadRequest("Invalid reset token");
            }

            try
            {
                PasswordReset reset = await _Db.PasswordResets.Include(i => i.Account)
                    .Where(c => c.Token == token && c.Account.Email == request.Str("email") && c.ExpiresAt > DateTime.UtcNow)
                    .FirstOrDefaultAsync();

                if (reset == null)
                {
                    _Logger.LogDebug("Password reset attempted ({0}) with expired or invalid token", request.Str("email"));
                    return BadRequest("Reset token invalid or expired");
                }

                if (request.Str("password") != request.Str("passswordConfirm"))
                {
                    _Logger.LogDebug("Password reset attempted ({0}) with mismatching passwords", request.Str("email"));
                    return BadRequest("Your password and password confirmation do not match");
                }


                Account account = await _Db.Accounts.FindAsync(reset.Account.Id);
                account.Password = _Hasher.HashPassword(account, request.Str("password"));
                account.ForcePasswordReset = false;
                reset.ExpiresAt = DateTime.UtcNow;
                

                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Password has been updated for account belonging to {0}", account.Name);

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating password for account belonging to {0}: {1}", request.Str("email"), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later");
            }            
        }
    }
}