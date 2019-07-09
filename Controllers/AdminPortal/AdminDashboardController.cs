using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/admin-portal")]
    public class AdminDashboardController : Controller
    {
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/Dashboard.cshtml");
        }
    }
}