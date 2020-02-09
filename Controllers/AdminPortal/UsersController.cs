using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Features.Emails;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers
{
    [Authorize, Area("admin"), Route("/admin/users")]
    public class UsersController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly IEmailService _EmailService;
        private readonly ILogger<UsersController> _Logger;

        public UsersController(WebsiteDataContext db, IEmailService emailService, ILogger<UsersController> logger)
        {
            _Db = db;
            _EmailService = emailService;
            _Logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {

            return View(viewName: "~/Views/AdminPortal/Users.cshtml");
        }
        [HttpGet("v2")]
        public IActionResult V2()
        {
            return View(viewName: "~/Views/Admin/UserAccounts.cshtml");
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
                    s.Developer,
                    s.ForcePasswordReset,
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
        
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateAccountStatus(int id)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(id);

                // Stop a user from disabling their own account
                if (account.Id == User.AccountId())
                    return Conflict("You cannot alter your own account status");

                // Non Developers cannot alter developer accounts
                if (account.Developer && !_Db.Accounts.Find(User.AccountId()).Developer)
                    return BadRequest("You cannot change the settings of a developer's account");

                account.Active = !account.Active;


                await _Db.SaveChangesAsync();
                _Logger.LogInformation("{0} has {1} {2}s account", User.AccountName(), (account.Active ? "Activated" : "Deactivated"), account.Name);

                await _EmailService.SendAccountStatusAsync(account.Active, account.ToEmailContact(), HttpContext.Request.BaseUrl());
                return Ok($"{(account.Active ? "Activated" : "Deactivated")} {account.Name}s account");
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error changing the status of an account (Account Id: {0}): {1}", id, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again later", ex.Message));
            }
        }

        [HttpPut("{id}/reset")]
        public async Task<IActionResult> ForcePasswordReset(int id)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(id);
                
                // Stop a user force resetting thier own password
                if (account.Id == User.AccountId())
                    return Conflict("You cannot force yourself to reset your password.");

                // Non Developers cannot alter developer accounts
                if (account.Developer && !_Db.Accounts.Find(User.AccountId()).Developer)
                    return BadRequest("You cannot change the settings of a developer's account");

                account.ForcePasswordReset = true;

                await _Db.SaveChangesAsync();
                _Logger.LogInformation("{0} requires {1} to reset their password next time they login", User.AccountName(), account.Name);
                
                return Ok($"{account.Name} will need to reset their password next time they login, we will send an email so they know");
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error forcing account to reset their password (Account Id: {0}): {1}", id, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again later", ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount(int id, IFormCollection request)
        {
            try
            {
                //bool sendStatusEmail = false;

                Account account = await _Db.Accounts.FindAsync(id);

                // Non Developers cannot alter developer accounts
                if (account.Developer && !_Db.Accounts.Find(User.AccountId()).Developer)
                    return BadRequest("You cannot change the settings of a developer's account");

                account.Name = request.Str("name");
                account.Email = request.Str("email");
                account.PhoneNumber = request.Str("phoneNumber");

                    
                await _Db.SaveChangesAsync();
                _Logger.LogInformation("Information updated for account belonging to {0}", account.Name);
                
                return Ok($"{account.Name}'s account has been updated");
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
                _EmailService.SendAccountStatusAsync(false, account.ToEmailContact(), Request.BaseUrl());

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