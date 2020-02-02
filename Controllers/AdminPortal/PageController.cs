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
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Web
{
    [Authorize]
    [Area("admin")]
    [Route("/admin/pages")]
    public class PageController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<PageController> _Logger;

        public PageController(WebsiteDataContext db, ILogger<PageController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        [HttpGet]
        //GET: /admin/pages
        public IActionResult Index(string filter = "main")
        {
            ViewData["PageName"] = filter;
            return View(viewName: "~/Views/AdminPortal/Pages.cshtml");
        }


        [HttpGet("data")]
        //GET: /admin/pages/data
        public async Task<IActionResult> IndexData(string filter = "main")
        {
            if (!Enum.IsDefined(typeof(Section), filter) && filter != "all")
                return BadRequest($"Invalid filter. Please use one of the following: {string.Join(", ", Enum.GetNames(typeof(Section)), "all")}");

            try
            {
                List<Page> pages = await _Db.Pages
                    .Where(p =>  filter == "all" ||  p.Section == Enum.Parse<Section>(filter))
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.Template)
                    .Include(p => p.PageRevisions)
                            .ThenInclude(t => t.CreatedBy)
                    .ToListAsync();


                return Ok(pages.Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Section,
                    template = new
                    {
                        s.Latest.Template.Id,
                        s.Latest.Template.Name,
                    },
                    s.Description,
                    s.Public,
                    s.AbsoluteUrl,
                    Updated = new
                    {
                        at = s.Latest.CreatedAt,
                        by = s.Latest.CreatedBy != null ? s.Latest.CreatedBy.Name : ""
                    }
                })
                .ToList());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving {0} pages: {1}", filter, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("We could not retrieve the pages, please try again later");
            }
        }
        
        [HttpGet("create")]
        //GET: /admin/pages/create
        public IActionResult Create(string filter = "main")
        {
            ViewData["Filter"] = filter;
            return View(viewName: "~/Views/AdminPortal/PageNew.cshtml");
        }

        [HttpPost("create")]
        //POST: /admin/pages/create
        public async Task<IActionResult> Create(IFormCollection request, 
            [Bind("Name", "Description", "Section")] Page page)
        {
            PageTemplate template = await _Db.PageTemplates.FindAsync(
                request.Int("templateId"));

            if (template == null)
                return NotFound($"The chosen template was not found.");

            if (!ModelState.IsValid)
                return BadRequest("Server side validation failed.");

            try
            {
                await _Db.AddAsync(page);

                // Create initial page revision
                PageRevision pageRevision = new PageRevision
                {
                    Page = page,
                    Template = template,
                    CreatedBy = await _Db.Accounts.FindAsync(User.AccountId())
                };
                await _Db.AddAsync(pageRevision);

                // Create empty text fields, and associate to new page
                for (int i = 0; i < template.TextAreas; i++)
                {
                    TextComponent textField = new TextComponent { SlotNo = i };
                    await _Db.AddAsync(textField);
                    await _Db.AddAsync(new RevisionTextComponent
                    {
                        TextComponent = textField,
                        PageRevision = pageRevision,
                    });
                }

                // Create empty media fields, and associate to new page
                for (int i = 0; i < template.MediaAreas; i++)
                {
                    MediaComponent mediaComponent = new MediaComponent { SlotNo = i };
                    await _Db.AddAsync(mediaComponent);
                    await _Db.AddAsync(new RevisionMediaComponent
                    {
                        PageRevisionId = pageRevision.Id,
                        MediaComponentId = mediaComponent.Id
                    });
                }

                // Save all to database in one transaction
                await _Db.SaveChangesAsync();

                // Return new page URL to the caller
                return Ok(this.Request.BaseUrl() + page.AbsoluteUrl);

            }
            catch (Exception ex)
            {
                _Logger.LogWarning("Error creating new page: {0}", ex.Message);
                _Logger.LogWarning(ex.StackTrace);
                return BadRequest("There was an error creating the page. Please try again later.");
            }
        }

        [HttpGet("{pageId:int}")]
        //GET: /admin/pages/{pageId:int}
        public async Task<IActionResult> Details(int pageId)
        {
            if (await _Db.Pages.FindAsync(pageId) == null)
                return NotFound();

            ViewData["PageId"] = pageId;
            return View(viewName: "~/Views/AdminPortal/PageUpdate.cshtml");
        }

        [HttpGet("{pageId:int}/data")]
        //GET: /admin/pages/{pageId}/data
        public async Task<IActionResult> DetailsData(int pageId)
        {
            var page = await _Db.Pages
                .Where(c => c.Id == pageId)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Description,
                    s.Section
                }).FirstOrDefaultAsync();

            if (page == null)
                return NotFound();

            return Ok(page);
        }

        [HttpPut("{pageId:int}")]
        //PUT /admin/pages/{pageId}
        public async Task<IActionResult> UpdatePage(int pageId, IFormCollection request,
            [Bind("Name", "Description", "Section")] Page changes)
        {
            Page page = await _Db.Pages.FindAsync(pageId);

            if (page == null)
                return NotFound();

            try
            {
                page.Name = changes.Name;
                page.Description = changes.Description;
                page.Section = changes.Section;
                page.Public = request.Bool("public");

                await _Db.SaveChangesAsync();

                return Ok(
                    Url.Action("Index", "Page", null, "https"));
            }
            catch (Exception ex)
            {
                _Logger.LogWarning("Error updating page settings: {0}", ex.Message);
                _Logger.LogWarning(ex.StackTrace);
                return BadRequest(new ResponseHelper("There was an error updating the page settings. Please try again later.", ex.Message));
            }
        }
            
        
        [HttpPut("{pageId:int}/visibility")]
        //PUT /admin/pages/{pageId}/visibility
        public async Task<IActionResult> UpdatePageVisibility(int pageId, IFormCollection request)
        {
            try
            {
                Page page = await _Db.Pages.FindAsync(pageId);

                if (page == null)
                    return NotFound();

                page.Public = request.Bool("visbility");
                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogWarning("Error updating page settings: {0}", ex.Message);
                _Logger.LogWarning(ex.StackTrace);
                return BadRequest(new ResponseHelper("There was an error updating the page settings. Please try again later.", ex.Message));
            }
        }

        [HttpDelete("{pageId}")]
        //DELETE: /admin/pages/{pageId}
        public async Task<IActionResult> Delete(int pageId)
        {
            try
            {
                var page = await _Db.Pages.Where(c => c.Id == pageId)
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextComponents)
                            .ThenInclude(rtf => rtf.TextComponent)
                    .FirstOrDefaultAsync();

                if (page == null)
                    return NotFound();

                // First, mark all text fields for removal
                foreach (PageRevision rev in page.PageRevisions)
                {
                    foreach (RevisionTextComponent rtf in rev.RevisionTextComponents)
                    {
                        _Db.Remove(rtf.TextComponent);
                    }
                    _Db.Remove(rev);
                }

                _Db.Remove(page);
                await _Db.SaveChangesAsync();

                _Logger.LogDebug("Page {0} has been deleted", page.Name);

                return Ok(Url.Action(
                    "Index",
                    "Page", new
                    {
                        area = "admin-portal,web",
                        filter = page.Section.ToString()
                    })
                );
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error deleting page {0}: {1}", pageId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again later", ex.Message));
            }
        }
    }
}