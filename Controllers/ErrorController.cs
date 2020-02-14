using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Deepcove_Trust_Website.Controllers
{
    [Route("error")]
    public class ErrorController : Controller
    {
        [HttpGet("password-reset")]
        public IActionResult PasswordExpired()
        {
            Response.StatusCode = 401;
            return View(viewName: "~/Views/Errors/PasswordExpired.cshtml");
        }

        [HttpGet("inactive")]
        public IActionResult Inactive()
        {
            Response.StatusCode = 403;
            return View(viewName: "~/Views/Errors/Inactive.cshtml");
        }

        [HttpGet("not-found")]
        public IActionResult PageNotFound()
        {
            Response.StatusCode = 404;
            return View(viewName: "~/Views/Errors/NotFound.cshtml");
        }


        [HttpGet("server-error")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult InternalServerError(string requestId = "")
        {
            Response.StatusCode = 500;
            return View(viewName: "~/Views/Errors/InternalServerError.cshtml", new ErrorViewModel { RequestId = requestId });
        }
    }
}