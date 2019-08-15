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

        [AllowAnonymous]
        [Route("/api/page/{pageId:int}/{revisionId:int?}")]
        public IActionResult PageContent(int pageId, int? revisionId)
        {
            var data = _Db.Pages
                .Include(i => i.PageRevisions)
                    .ThenInclude(i1 => i1.CreatedBy)
                .Include(i => i.PageRevisions)
                    .ThenInclude(pr => pr.TextFields)
                    .ThenInclude(tf => tf.link)                    
                .ToList()
                .Select(s => new {
                s.Id,
                s.Name,
                s.Public,
                updated = new {
                    at = s.Latest.CreatedAt,
                    by = s.Latest.CreatedBy.Name
                },
                text = s.Latest.TextFields.Select(s1 => new { 
                        s1.Id,
                        s1.Heading,
                        s1.SlotNo,
                        s1.Text,
                        link = new
                        {
                           id = s1.link?.Id,
                           text = s1.link?.Text,
                           href = s1.link?.Href,
                           color = s1.link?.Color,
                           align = s1.link?.Align,
                           isButton = s1.link?.IsButton
                        }
                }),
                media = new { }, //s.GetRevision(null) != null ? s.GetRevision(null).Media : new { }
                User.Identity.IsAuthenticated
            }).FirstOrDefault();

            if (data == null || !data.Public && !User.Identity.IsAuthenticated)
                return NotFound();

            return Ok(data);
        }

        [Authorize]
        [HttpPost]        
        [Route("/api/page/{pageId:int}/text/{fieldId:int}")]
        public async Task<IActionResult> UpdateTextField(int pageId, int fieldId, IFormCollection request)
        {
            // Retrieve page from database

            // Deal with null returns

            // Validate inputs

            // Duplicate latest revision

            // Associate unchanged text fields with the new revision

            // Create new textField with supplied text

            // Save changes


            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("/api/page/{pageId:int}/visibility")]
        public async Task<IActionResult> ToggleVisbility(int pageId)
        {
            var page = await _Db.Pages.Where(c => c.Id == pageId).FirstOrDefaultAsync();
            if (page == null)
                return BadRequest("Page does not exist");

            page.Public = !page.Public;

            await _Db.SaveChangesAsync();
            return Ok();
        }
    }
}
 