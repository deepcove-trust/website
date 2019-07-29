using System;
using System.Collections.Generic;
using System.Linq;
using Deepcove_Trust_Website.Models;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Deepcove_Trust_Website.Controllers
{
    public class WebsiteController : Controller
    {
        private readonly WebsiteDataContext _Db;
        public WebsiteController(WebsiteDataContext db)
        {
            _Db = db;
        }

        [AllowAnonymous]
        [Route("/{pageName}")]
        public IActionResult mainPage(string pageName)
        {
            Page page = _Db.Pages.Include(i => i.Template)
                .Where(c => c.Name == pageName.Replace('-', ' ') && c.Section == Section.main).FirstOrDefault();

            if (page == null || !page.Public && !User.Identity.IsAuthenticated)
                return NotFound();

            // Todo: Mail Developers with custom exception
            if (page.Template == null)
            {
                return BadRequest("Fatal error - no page template found.");
            }

            ViewData["pageName"] = page.Name;
            ViewData["templateId"] = page.Template.Id;
            ViewData["pageId"] = page.Id;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }

        [AllowAnonymous]
        [Route("/education/{pageName}")]
        public IActionResult educationPage(string pageName)
        {
            Page page = _Db.Pages.Include(i => i.Template)
                .Where(c => c.Name == pageName.Replace('-', ' ') && c.Section == Section.education).FirstOrDefault();

            if (page == null || !page.Public && !User.Identity.IsAuthenticated)
                return NotFound();

            // Todo: Mail Developers with custom exception
            if(page.Template == null)
            {
                return BadRequest("Fatal error - no page template found.");
            }
                
            ViewData["pageName"] = page.Name;
            ViewData["templateId"] = page.Template.Id;
            ViewData["pageId"] = page.Id;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }
    }
}