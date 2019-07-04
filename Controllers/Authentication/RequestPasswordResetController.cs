using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/reset-password")]
    public class ForgotPasswordController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View(viewName: "~/Views/Authentication/RequestPasswordReset.cshtml");
        }
    }
}