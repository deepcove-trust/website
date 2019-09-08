using System.Linq;
using Deepcove_Trust_Website.Models;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Deepcove_Trust_Website.Helpers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Deepcove_Trust_Website.Controllers
{
    public class WebsiteController : Controller
    {
        private readonly ILogger<WebsiteController> _Logger;
        private readonly WebsiteDataContext _Db;
        private readonly IConfiguration _Configuration;

        public WebsiteController(WebsiteDataContext db, ILogger<WebsiteController> logger, IConfiguration config)
        {
            _Db = db;
            _Logger = logger;
            _Configuration = config;
        }

        [AllowAnonymous]
        [Route("/{pageName}")]
        public async Task<IActionResult> MainPage(string pageName)
        {
            Page page = await _Db.Pages
                .Include(i => i.PageRevisions)
                    .ThenInclude(i => i.Template)
                .Where(c =>
                    c.Name.EqualsIgnoreCase(pageName.Replace('-', ' '))
                    && c.Section == Section.main)
                .FirstOrDefaultAsync();

            if (page == null || (!page.Public && !User.Identity.IsAuthenticated))
                return NotFound();

            // Todo: Mail Developers with custom exception
            if (page.Latest.Template == null)
                return BadRequest("Fatal error - no page template found.");

            ViewData["pageName"] = page.Name;
            ViewData["templateId"] = page.Latest.Template.Id;
            ViewData["pageId"] = page.Id;
            ViewData["Description"] = page.Description;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }

        [AllowAnonymous]
        [Route("/education/{pageName}")]
        public IActionResult EducationPage(string pageName)
        {
            Page page = _Db.Pages
                .Include(i => i.PageRevisions)
                    .ThenInclude(i => i.Template)
                .Where(c =>
                    c.Name.EqualsIgnoreCase(pageName.Replace('-', ' '))
                    && c.Section == Section.education)
                .FirstOrDefault();

            if (page == null || !page.Public && !User.Identity.IsAuthenticated)
                return NotFound();

            // Todo: Mail Developers with custom exception
            if (page.Latest.Template == null)
            {
                _Logger.LogError("Page {0} requested but page template is not specified.", pageName);
                return BadRequest("Something went wrong, please try again later.");
            }

            ViewData["pageName"] = page.Name;
            ViewData["templateId"] = page.Latest.Template.Id;
            ViewData["pageId"] = page.Id;
            ViewData["Description"] = page.Description;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }

        public async Task<IActionResult> HomePage()
        {
            var page = await _Db.Pages.
                Include(i => i.PageRevisions)
                    .ThenInclude(i => i.Template)
                .Where(c => c.Name == "")
                .FirstOrDefaultAsync();

            if (page == null || (!page.Public && !User.Identity.IsAuthenticated))
                return NotFound();

            // Todo: Mail Developers with custom exception
            if (page.Latest.Template == null)
                return BadRequest("Fatal error - no page template found.");

            ViewData["pageName"] = "Deep Cove Outdoor Education Trust";
            ViewData["templateId"] = page.Latest.Template.Id;
            ViewData["pageId"] = page.Id;
            ViewData["Description"] = page.Description;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }
    }
}
