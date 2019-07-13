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

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/admin-portal/users")]
    public class UsersController : Controller
    {
        private readonly Data.WebsiteDataContext _Db;
        private readonly IEmailService _Smtp;

        public UsersController(Data.WebsiteDataContext db, IEmailService smtp)
        {
            _Db = db;
            _Smtp = smtp;
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
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("The account could not be deleted. Please try again later.");
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
                        return Forbid("You are not allwoed to change your own status");

                    account.Active = request.Str("status") == "Active" ? true : false;
                }
                

                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest("Something went wrong please try again");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            try
            {
                Account account = await _Db.Accounts.FindAsync(id);
                account.DeletedAt = DateTime.UtcNow;
                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("The account could not be deleted. Please try again later.");
            }
        }
    }
}