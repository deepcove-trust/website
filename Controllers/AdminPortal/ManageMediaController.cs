using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/admin/media")]
    public class ManageMediaController : Controller
    {
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/ManageMedia.cshtml");
        }
    }
}