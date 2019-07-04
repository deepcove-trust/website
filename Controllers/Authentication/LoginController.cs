using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/login")]
    public class LoginController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View(viewName: "~/Views/Authentication/Login.cshtml");
        }

        /// <summary>
        /// Logs the user out of the application and redirects to index.
        /// </summary>
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return Redirect("/");
        }
    }
}