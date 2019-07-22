using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.WebPortal
{
    [Authorize]
    [Area("admin-portal,web")]
    [Route("/admin-portal/web")]
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/Web/Dashboard.cshtml");
        }
    }
}