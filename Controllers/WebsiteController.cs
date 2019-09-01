using System;
using System.Collections.Generic;
using System.Linq;
using Deepcove_Trust_Website.Models;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
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

        [AllowAnonymous]
        [Route("/api/page/{pageId:int}/{revisionId:int?}")]
        public async Task<IActionResult> PageContent(int pageId, int? revisionId)
        {
            try
            {
                var pages = await _Db.Pages
                    .Include(i => i.PageRevisions)
                        .ThenInclude(i1 => i1.CreatedBy)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(i => i.RevisionTextComponents)
                            .ThenInclude(rtf => rtf.TextComponent)
                                .ThenInclude(tf => tf.CmsButton)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(i => i.RevisionMediaComponents)
                            .ThenInclude(i => i.MediaComponent)
                    .Where(p => p.Id == pageId)
                    .ToListAsync();

                var data = pages.Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Public,
                        updated = new
                        {
                            at = s.Latest.CreatedAt,
                            by = s.Latest.CreatedBy?.Name
                        },
                        text = s.Latest.RevisionTextComponents
                            .OrderBy(o => o.TextComponent.SlotNo)
                            .Select(s1 => new
                            {
                                s1.TextComponent.Id,
                                pageId = s.Id,
                                s1.TextComponent.Heading,
                                s1.TextComponent.SlotNo,
                                s1.TextComponent.Text,
                                link = new
                                {
                                    id = s1.TextComponent.CmsButton?.Id,
                                    text = s1.TextComponent.CmsButton?.Text,
                                    href = s1.TextComponent.CmsButton?.Href,
                                    color = s1.TextComponent.CmsButton?.Color,
                                    align = s1.TextComponent.CmsButton?.Align,
                                    isButton = s1.TextComponent.CmsButton?.IsButton
                                }
                            }),
                        media = s.Latest.RevisionMediaComponents
                            .OrderBy(o => o.MediaComponent.SlotNo)
                            .Select(s1 => new {
                                s1.MediaComponent.Id,
                                s1.MediaComponent.SlotNo,                                
                                // put media file data here
                            }),

                        other = new
                        {
                            googleMaps = _Db.SystemSettings.OrderByDescending(o => o.Id).Select(settings => settings.UrlGoogleMaps).FirstOrDefault(),
                            captchaSiteKey = _Configuration.GetSection("RecaptchaSettings").GetValue<String>("SiteKey")
                        },
                        settings = User.Identity.IsAuthenticated ? new
                        {
                            colors = Enum.GetNames(typeof(Color)),
                            alignments = Enum.GetNames(typeof(Align))
                        } : null
                    }).FirstOrDefault();

                if (data == null || !data.Public && !User.Identity.IsAuthenticated)
                    return NotFound();

                return Ok(data);
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving data for page {0}: {1}", pageId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}
