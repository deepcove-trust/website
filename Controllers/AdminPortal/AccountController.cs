using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Deepcove_Trust_Website.Models;
using Microsoft.EntityFrameworkCore;
using Deepcove_Trust_Website.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Deepcove_Trust_Website.Data;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/admin-portal/account")]
    public class AccountController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly IPasswordHasher<Account> _Hasher;
        private readonly ILogger<AccountController> _Logger;
        
        public AccountController(WebsiteDataContext db, IPasswordHasher<Account> hasher, ILogger<AccountController> logger)
        {
            _Db = db;
            _Hasher = hasher;
            _Logger = logger;
        }

        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/Account.cshtml");
        }

        [HttpGet("data")]
        public async Task<IActionResult> Data()
        {
            try
            {
                return Ok(await _Db.Accounts.Select(s => new {
                    s.Id,
                    s.Name,
                    s.Email,
                    s.PhoneNumber
                }).Where(c => c.Id == User.AccountId()).FirstOrDefaultAsync());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving data for account belonging to {0}: {1}", User.AccountName(), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection request)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(User.AccountId());
                account.Name = request.Str("name");
                account.Email = request.Str("email");
                account.PhoneNumber = request.Str("phone");
                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Information updated for account belonging to {0}", account.Name);
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating account belonging to {0}: {1}", User.AccountName(), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("We could not update your account, please try again later");
            }
        }

        [HttpPost("password")]
        public async Task<IActionResult> Password(IFormCollection request)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(User.AccountId());

                // Old passwords do not match
                if (_Hasher.VerifyHashedPassword(account, account.Password, request.Str("currentPassword")) != PasswordVerificationResult.Success)
                    return BadRequest("Your current password was not correct");

                // New passwords do not match
                if (request.Str("newPassword") != request.Str("confirmPassword"))
                    return BadRequest("Your new password and confirmation password do not match");

                // Update Password
                account.Password = _Hasher.HashPassword(account, request.Str("newPassword"));
                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Password updated for account belonging to {0}", account.Name);
                return Ok();
            } 
            catch (Exception ex)
            {
                _Logger.LogError("Error updating password for account belonging to {0}: {1}", User.AccountName(), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later");
            }
            
        }
    }
}