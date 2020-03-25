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
using System;
using System.IO;
using System.Xml;
using System.Collections.Generic;

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
            var page = await _Db.Pages
                .Include(i => i.PageRevisions)
                    .ThenInclude(i => i.Template)
                .Where(c => c.Name == "Home")
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

        [HttpGet, Route("/education")]
        public async Task<IActionResult> EducationHomePage()
        {
            var page = await _Db.Pages
                .Include(i => i.PageRevisions)
                    .ThenInclude(i => i.Template)
                .Where(c => c.Name == "Education")
                .FirstOrDefaultAsync();

            if (page == null || (!page.Public && !User.Identity.IsAuthenticated)) {
                return NotFound();
            }

            if (page.Latest.Template == null) {
                return BadRequest("Fatal error - no page template found");
            }

            ViewData["pageName"] = "Deep Cove Outdoor Education Trust";
            ViewData["templateId"] = page.Latest.Template.Id;
            ViewData["pageId"] = page.Id;
            ViewData["Description"] = page.Description;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }

        [AllowAnonymous, HttpGet("discover")]
        public IActionResult AndroidAppRedirect()
        {
            string appUrl = _Db.SystemSettings.First().UrlGooglePlay;
            if (string.IsNullOrEmpty(appUrl)) throw new ArgumentNullException(appUrl, "No application URL was found.");
            return Redirect(appUrl);
        }

        [AllowAnonymous, HttpGet, Route("/api/notices")]
        public async Task<IActionResult> WebsiteNoticesAsync()
        {
            try
            {
                var notices = await _Db.Notices.Where(c => c.Active && c.Noticeboard != Noticeboard.app)
                    .Select(s => new { 
                        s.Title,
                        s.Urgent,
                        s.LongDesc,
                        s.UpdatedAt
                    })
                    .OrderByDescending(o => o.Urgent)
                    .ThenBy(o => o.UpdatedAt)
                    .ToListAsync();
                
                return Ok(notices);

            } catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous, HttpGet("sitemap")]
        [ResponseCache(VaryByHeader = "User-Agent", Duration = 60)]
        public async Task<IActionResult> GenerateSitemap()
        {
            try
            {
                List<Page> pages = await _Db.Pages.Where(p => p.Public).ToListAsync();

                XmlWriterSettings settings = new XmlWriterSettings();
                settings.Indent = true;
                settings.NewLineOnAttributes = true;

                MemoryStream xml = new MemoryStream();
                XmlWriter writer = XmlWriter.Create(xml, settings);

                // Urlset
                writer.WriteStartElement(null, "urlset", "http://www.sitemaps.org/schemas/sitemap/0.9");

                foreach (Page page in pages)
                {
                    // Url
                    writer.WriteStartElement(null, "url", null);

                    // Location
                    writer.WriteStartElement(null, "loc", null);
                    writer.WriteValue(new Uri(Request.BaseUrl(), 
                        (page.Name == "" || page.Name == "Home") ? "/" : page.AbsoluteUrl));
                    writer.WriteEndElement();
                    // Close location

                    // Lastmod
                    writer.WriteStartElement(null, "lastmod", null);
                    writer.WriteValue(page.UpdatedAt.ToString("yyyy-MM-dd"));
                    writer.WriteEndElement();
                    // Close lastmod

                    // Priority
                    double priority = page.Name == "" || page.Name == "Home" ? 1.0 : page.Name == "Contact Us" 
                        ? 0.8 : page.Section == Section.main ? 0.6 : 0.4;

                    writer.WriteStartElement(null, "priority", null);
                    writer.WriteValue(priority);
                    writer.WriteEndElement();
                    // Close priority

                    // Close url
                    writer.WriteEndElement();
                }

                // Close urlset
                writer.WriteEndElement();

                // Flush writer and return stream to beginning
                writer.Flush();
                xml.Seek(0, SeekOrigin.Begin);

                // Return stream contents as a file download
                return new FileStreamResult(xml, "application/xml") { FileDownloadName = "sitemap.xml" };

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error generating sitemap: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                throw ex;
            }
        }
    }
}
