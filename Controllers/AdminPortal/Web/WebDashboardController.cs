using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        [AllowAnonymous]
        [Route("/{pageName}")]
        public IActionResult page(string pageName)
        {
            var page = _Db.Pages.Where(c => c.Name == pageName.Replace('-', ' ')).FirstOrDefault();
            if (page == null || !page.Public && !User.Identity.IsAuthenticated)
                return NotFound();

            return Ok(pageName);
        }
    }
}