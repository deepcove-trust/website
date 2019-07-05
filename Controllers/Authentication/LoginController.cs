using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Models;
using Deepcove_Trust_Website.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/login")]
    public class LoginController : Controller
    {
        private readonly Data.WebsiteDataContext _Db;
        private PasswordHasher<Account> _Hasher;

        public LoginController(Data.WebsiteDataContext db)
        {
            _Db = db;
            _Hasher = new PasswordHasher<Account>();
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

            //IF Username or password is invalid;
            if (account == null || account.Password == _Hasher.HashPassword(account, request.Str("password")))
                return Unauthorized("Invalid email or password");


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