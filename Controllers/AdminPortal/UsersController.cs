using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Deepcove_Trust_Website.Features.Emails;
using Microsoft.EntityFrameworkCore;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Deepcove_Trust_Website.Data;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/admin/users")]
    public class UsersController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly IEmailService _Smtp;
        private readonly ILogger<UsersController> _Logger;

        public UsersController(WebsiteDataContext db, IEmailService smtp, ILogger<UsersController> logger)
        {
            _Db = db;
            _Smtp = smtp;
            _Logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {

            return View(viewName: "~/Views/AdminPortal/Users.cshtml");
        }

        [HttpGet("data")]
        public async Task<IActionResult> Data()
        {
            try
            {
                return Ok(
                await _Db.Accounts.OrderBy(o => o.Name).Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Email,
                    s.PhoneNumber,
                    s.Active,
                    timestamps = new { signup = Utils.PrettyDate(s.CreatedAt), lastLogin = Utils.DiffForHumans(s.LastLogin) }
                }).ToListAsync());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving account data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(ex.Message);
            }

        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> ForceResetPassword(int id)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(id);
                account.ForcePasswordReset = true;
                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Account belonging to {0} will be forced to reset password on next login", account.Name);

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error forcing password reset for account belonging to {0}: {1}", User.AccountName(), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(int id, IFormCollection request)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(id);

                if (!string.IsNullOrEmpty(request.Str("email")))
                    account.Email = request.Str("email");

                if(!string.IsNullOrEmpty(request.Str("phone")))
                    account.PhoneNumber = request.Str("phone");


                if (!string.IsNullOrEmpty(request.Str("status"))) {
                    if (account.Id == User.AccountId())
                        return Forbid("You are not allowed to change your own status");

                    account.Active = request.Str("status") == "Active" ? true : false;
                }

                _Logger.LogInformation("Information updated for account belonging to {0}", account.Name);

                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating account (Id: {0}): {1}", id, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(id);
                if (account.Id == User.AccountId())
                    return Forbid("You are not allowed to delete your own account");

                account.DeletedAt = DateTime.UtcNow;
                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Account belonging to {0} was deleted", account.Name);

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error deleting account (Id: {0}): {1}", id, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("The account could not be deleted. Please try again later.");
            }
        }
    }
}