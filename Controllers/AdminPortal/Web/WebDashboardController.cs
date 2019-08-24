using System;
using System.Collections.Generic;
using System.Linq;
using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.WebPortal
{
    [Authorize]
    [Area("admin-portal,web")]
    [Route("/admin/web")]
    public class DashboardController : Controller
    {
        private readonly WebsiteDataContext _Db;
        public DashboardController(WebsiteDataContext db)
        {
            _Db = db;
        }

        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/Web/Dashboard.cshtml");
        }
    }
}