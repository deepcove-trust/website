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
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/App/Dashboard.cshtml");
        }
    }
}