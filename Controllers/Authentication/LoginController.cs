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
using Microsoft.Extensions.Logging;
using Deepcove_Trust_Website.Data;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/login")]
    public class LoginController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private IPasswordHasher<Account> _Hasher;
        private readonly ILogger<LoginController> _Logger;

        public LoginController(WebsiteDataContext db, IPasswordHasher<Account> hasher, ILogger<LoginController> logger)
        {
            _Db = db;
            _Hasher = hasher;
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
                    "Page",
                    new { area = "admin-portal,web" }
                ));
            }

            return View(viewName: "~/Views/Authentication/Login.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection request, string ReturnUrl)
        {
            if (!User.Identity.IsAuthenticated)
            {
                try
                {
                    Account account = await _Db.Accounts.Where(c => c.Email == request.Str("email")).FirstOrDefaultAsync();

                    // No Account
                    if (account == null)
                    {
                        _Logger.LogInformation("User attempted logging in with invalid email address");
                        return Unauthorized(new ResponseHelper("Invalid email or password"));
                    }

                    // Invalid Password
                    if (_Hasher.VerifyHashedPassword(account, account.Password, request.Str("password")) != PasswordVerificationResult.Success)
                    {
                        _Logger.LogInformation("User attempted logging into account belonging to {0} with invalid password", account.Name);
                        return Unauthorized(new ResponseHelper("Invalid email or password"));
                    }

                    // Inactive Account
                    if (!account.Active)
                    {
                        _Logger.LogInformation("User attempted logging into account belonging to {0}, but the account needs to be activated", account.Name);
                        return Unauthorized(new ResponseHelper("Your account requires activation from an administrator"));
                    }


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

                    _Logger.LogDebug("User has logged into account belonging to {0}", account.Name);
                }
                catch (Exception ex)
                {
                    _Logger.LogError("Error while logging in: {0}", ex.Message);
                    _Logger.LogError(ex.StackTrace);
                    return BadRequest(new ResponseHelper("Something went wrong, please try again later", ex.Message));
                }
            }

            if (string.IsNullOrEmpty(ReturnUrl))
            {
                ReturnUrl = Url.Action(
                    "Index",
                    "Page",
                    new { area = "admin-portal,web" }
                );
            } else
            {
                ReturnUrl = this.Request.BaseUrl() + ReturnUrl.Substring(1);
            }

            return Ok(ReturnUrl);
        }

        /// <summary>
        /// Logs the user out of the application and redirects to index.
        /// </summary>
        [Authorize]
        [Route("/logout")]
        public async Task<IActionResult> Logout()
        {
            string name = User.AccountName();
            await HttpContext.SignOutAsync();
            _Logger.LogDebug("User has logged out of account belonging to {0}", name);
            return Redirect("/");
        }
    }
}