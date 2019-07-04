using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/reset-password/{token}")]
    public class ResetPasswordController : Controller
    {
        [HttpGet]
        public IActionResult Index(string token)
        {
            return View(viewName: "~/Views/Authentication/ResetPassword.cshtml");
        }
    }
}