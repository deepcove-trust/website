using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using Deepcove_Trust_Website.Models;
using Deepcove_Trust_Website.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;


namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/login")]
    public class LoginController : Controller
    {
        private readonly Data.WebsiteDataContext _Db;
        private IPasswordHasher<Account> _Hasher;

        public LoginController(Data.WebsiteDataContext db, IPasswordHasher<Account> hasher)
        {
            _Db = db;
            _Hasher = hasher;
        }

        [HttpGet]
        public IActionResult Index()
        {
            // Redirect authenticated users
            // to the dashboard
            if (User.Identity.IsAuthenticated)
                return Redirect("/admin-portal");

            return View(viewName: "~/Views/Authentication/Login.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection request)
        {
            Account account = await _Db.Accounts.Where(c => c.Email ==  request.Str("email")).FirstOrDefaultAsync();

            // No Account
            if (account == null)
                return Unauthorized("Invalid email or password");

            // Invalid Password
            if (_Hasher.VerifyHashedPassword(account, account.Password, request.Str("password")) != PasswordVerificationResult.Success)
                return Unauthorized("Invalid email or password");
            
            // Inactive Account
            if (!account.Active)
                return Unauthorized("Your account requires activation from an administrator before you can login");


            var claims = new List<Claim>
            {
                new Claim("id", account.Id.ToString()),
                new Claim("name", account.Name),
                new Claim("email", account.Email)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                IsPersistent = true,
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            account.LastLogin = DateTime.UtcNow;
            await _Db.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Logs the user out of the application and redirects to index.
        /// </summary>
        [Authorize]
        [Route("/logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Redirect("/");
        }
    }
}