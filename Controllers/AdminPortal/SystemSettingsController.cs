using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Web
{
    [Authorize]
    [Area("admin-portal,web")]
    [Route("/admin/settings")]
    public class WebSettingsController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<WebSettingsController> _Logger;

        public WebSettingsController(WebsiteDataContext db, ILogger<WebSettingsController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        public IActionResult Index(string tab)
        {
            ViewData["tab"] = tab;
            return View(viewName: "~/Views/AdminPortal/Web/SystemSettings.cshtml");
        }                                           
    }
}