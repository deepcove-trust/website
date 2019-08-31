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
        public IActionResult MainPage(string pageName)
        {
            Page page = _Db.Pages.Include(i => i.Template)
                .Where(c => c.Name.ToLower() == pageName.Replace('-', ' ').ToLower() && c.Section == Section.main).FirstOrDefault();

            if (page == null || (!page.Public && !User.Identity.IsAuthenticated))
                return NotFound();

            // Todo: Mail Developers with custom exception
            if (page.Template == null)
            {
                return BadRequest("Fatal error - no page template found.");
            }

            ViewData["pageName"] = page.Name;
            ViewData["templateId"] = page.Template.Id;
            ViewData["pageId"] = page.Id;
            ViewData["Description"] = page.Description;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }

        [AllowAnonymous]
        [Route("/education/{pageName}")]
        public IActionResult EducationPage(string pageName)
        {
            Page page = _Db.Pages.Include(i => i.Template)
                .Where(c => c.Name.ToLower() == pageName.Replace('-', ' ').ToLower() && c.Section == Section.education).FirstOrDefault();

            if (page == null || !page.Public && !User.Identity.IsAuthenticated)
                return NotFound();

            // Todo: Mail Developers with custom exception
            if (page.Template == null)
            {
                _Logger.LogError("Page {0} requested but page template is not specified.", pageName);
                return BadRequest("Something went wrong, please try again later.");
            }

            ViewData["pageName"] = page.Name;
            ViewData["templateId"] = page.Template.Id;
            ViewData["pageId"] = page.Id;
            ViewData["Description"] = page.Description;
            return View(viewName: "~/Views/PageTemplate.cshtml");
        }

        [AllowAnonymous]
        [Route("/api/page/{pageId:int}/{revisionId:int?}")]
        public IActionResult PageContent(int pageId, int? revisionId)
        {
            try
            {
                var data = _Db.Pages
                    .Include(i => i.PageRevisions)
                        .ThenInclude(i1 => i1.CreatedBy)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextFields)
                        .ThenInclude(rtf => rtf.TextField)
                        .ThenInclude(tf => tf.Link)
                    .Where(p => p.Id == pageId)
                    .ToList()
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Public,
                        updated = new
                        {
                            at = s.Latest.CreatedAt,
                            by = s.Latest.CreatedBy?.Name
                        },
                        text = s.Latest.RevisionTextFields.OrderBy(o => o.TextField.SlotNo).Select(s1 => new
                        {
                            s1.TextField.Id,
                            pageId = s.Id,
                            s1.TextField.Heading,
                            s1.TextField.SlotNo,
                            s1.TextField.Text,
                            link = new
                            {
                                id = s1.TextField.Link?.Id,
                                text = s1.TextField.Link?.Text,
                                href = s1.TextField.Link?.Href,
                                color = s1.TextField.Link?.Color,
                                align = s1.TextField.Link?.Align,
                                isButton = s1.TextField.Link?.IsButton
                            }
                        }),
                        media = new { }, //s.GetRevision(null) != null ? s.GetRevision(null).Media : new { }
                                         // if null, user is not authenticated

                        other = new {
                            googleMaps = _Db.SystemSettings.OrderByDescending(o => o.Id).Select(settings => settings.UrlGoogleMaps).FirstOrDefault(),
                            captchaSiteKey =  _Configuration.GetSection("RecaptchaSettings").GetValue<String>("SiteKey")
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
