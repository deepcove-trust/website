using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.AppPortal
{
    [Authorize]
    [Area("admin-portal,app")]
    [Route("/admin/app")]
    public class PageController : Controller
    {        
        public IActionResult Index()
        {            
            return View(viewName: "~/Views/AdminPortal/App/Overview.cshtml");
        }

        [Route("factfiles")]
        public IActionResult FactFiles()
        {
            return View(viewName: "~/Views/AdminPortal/App/FactFiles.cshtml");
        }

        [Route("quizzes")]
        public IActionResult Quizzes()
        {
            return View(viewName: "~/Views/AdminPortal/App/Quizzes.cshtml");
        }

        [Route("tracks")]
        public IActionResult Tracks()
        {
            return View(viewName: "~/Views/AdminPortal/App/Tracks.cshtml");
        }

        [Route("settings")]
        public IActionResult Settings()
        {
            return View(viewName: "~/Views/AdminPortal/App/Settings.cshtml");
        }
    }
}