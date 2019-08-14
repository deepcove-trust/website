using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers
{
    [Route("error")]
    public class ErrorController : Controller
    {
        
        [HttpGet("inactive")]
        public IActionResult Inactive()
        {
            return View(viewName: "~/Views/Errors/Inactive.cshtml");
        }

        [HttpGet("password-reset")]
        public IActionResult PasswordExpired()
        {
            return View(viewName: "~/Views/Errors/PasswordExpired.cshtml");
        }
    }
}