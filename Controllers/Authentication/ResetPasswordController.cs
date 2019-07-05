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

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/reset-password/{token}")]
    public class ResetPasswordController : Controller
    {
        private readonly Data.WebsiteDataContext _Db;
        private PasswordHasher<Account> _Hasher;

        public ResetPasswordController(Data.WebsiteDataContext db)
        {
            _Db = db;
            _Hasher = new PasswordHasher<Account>();
        }

        [HttpGet]
        public IActionResult Index(string token)
        {
            // Redirect authenticated users
            // to the dashboard
            if (User.Identity.IsAuthenticated)
                return Redirect("/admin-portal");

            return View(viewName: "~/Views/Authentication/ResetPassword.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Index(string token, IFormCollection request)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest("Invalid reset token");

            try
            {
                PasswordReset reset = await _Db.PasswordReset.Include(i => i.Account)
                    .Where(c => c.Token == token && c.Account.Email == request.Str("email") && c.ExpiresAt > DateTime.UtcNow)
                    .FirstOrDefaultAsync();

                if (reset == null)
                    return BadRequest("Reset token invalid or expired");

                if (request.Str("password") != request.Str("passswordConfirm"))
                    return BadRequest("Your password and password confirmation do not match");


                Account account = await _Db.Accounts.FindAsync(reset.Account.Id);
                account.Password = _Hasher.HashPassword(account, request.Str("password"));
                reset.ExpiresAt = DateTime.UtcNow;

                await _Db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                //Error exception
                Console.WriteLine(ex.Message);
                return BadRequest("Something went wrong, please try again later");
            }
            
            return Ok();
        }
    }
}