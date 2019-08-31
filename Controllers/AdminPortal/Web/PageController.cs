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
            if (!Enum.IsDefined(typeof(Section), filter))
                return BadRequest($"Invalid filter. Please use one of the following: {string.Join(", ", Enum.GetNames(typeof(Section)))}");

            try
            {
                List<Page> pages = await _Db.Pages
                    .Where(p => p.Section == Enum.Parse<Section>(filter))
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.Template)
                    .Include(p => p.PageRevisions)
                            .ThenInclude(t => t.CreatedBy)
                    .ToListAsync();


                return Ok(pages.Select(s => new
                {
                    s.Id,
                    s.Name,
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






        /// <summary>
        /// Returns the page metadata update view
        /// </summary>
        [HttpGet("{pageId:int}")]
        public async Task<IActionResult> UpdatePageIndex(int pageId)
        {
            Page page = await _Db.Pages.FindAsync(pageId);

            if (page == null)
                return NotFound();

            ViewData["PageId"] = page.Id;
            return View(viewName: "~/Views/AdminPortal/Web/PageUpdate.cshtml");
        }

        [HttpGet("{pageId:int}/data")]
        public async Task<IActionResult> PageData(int pageId)
        {
            var page = await _Db.Pages
                .Where(c => c.Id == pageId)
                .Include(i => i.PageRevisions)
                .Select(s => new
                {
                    s.Name,
                    s.Description,
                    s.Section,
                    s.Latest.Template
                }).FirstOrDefaultAsync();

            if (page == null)
                return NotFound();

            return Ok(page);
        }

      
        

        /// <summary>
        /// *** DEPRECATED ***
        /// </summary>
        [HttpPost]
        [Route("/api/page/{pageId:int}/text/{slotNum:int}")]
        public async Task<IActionResult> UpdateTextField(int pageId, int slotNum, IFormCollection request)
        {
            try
            {
                // Retrieve page from database
                Page page = await _Db.Pages
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextComponents)
                        .ThenInclude(rtf => rtf.TextComponent)
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.CreatedBy)
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.Template)
                    .FirstOrDefaultAsync(p => p.Id == pageId);

                // Deal with null returns
                if (page == null)
                {
                    return NotFound("Page not found.");
                }

                // Validate inputs

                PageRevision latestRevision = page.Latest;

                // Duplicate latest revision
                PageRevision newRevision = new PageRevision
                {
                    Page = page,
                    Template = page.Latest.Template,
                    RevisionTextComponents = new List<RevisionTextComponent>(),
                    CreatedBy = await _Db.Accounts.FindAsync(User.AccountId())
                };

                // Generate the id field
                await _Db.PageRevisions.AddAsync(newRevision);

                // Link the new revision to the same fields as the existing revision
                foreach (RevisionTextComponent field in latestRevision.RevisionTextComponents)
                {
                    // Only copy text fields across if they are not the one being edited
                    if (field.TextComponent.SlotNo != slotNum)
                    {
                        newRevision.RevisionTextComponents.Add(new RevisionTextComponent
                        {
                            PageRevisionId = newRevision.Id,
                            TextComponentId = field.TextComponentId
                        });
                    }
                }

                CmsButton newButton = null;

                // Create new link object if the updated text field includes one
                if (!string.IsNullOrWhiteSpace(request.Str("link[text]")))
                {
                    Enum.TryParse(request.Str("link[color]"), true, out Color color);
                    Enum.TryParse(request.Str("link[align]"), true, out Align align);

                    newButton = new CmsButton
                    {
                        Text = request.Str("link[text]"),
                        Href = request.Str("link[href]"),
                        IsButton = request.Bool("link[isButton]"),
                        Color = color,
                        Align = align
                    };

                    await _Db.CmsButtons.AddAsync(newButton);
                    await _Db.SaveChangesAsync();
                }

                // Create new textField with supplied text
                TextComponent newField = new TextComponent
                {
                    SlotNo = slotNum,
                    Heading = request.Str("heading"), // get value from request                
                    Text = request.Str("text"),
                    CmsButton = newButton
                };

                // Generate an Id for the new text field
                await _Db.TextComponents.AddAsync(newField);

                newRevision.RevisionTextComponents.Add(new RevisionTextComponent
                {
                    PageRevisionId = newRevision.Id,
                    TextComponentId = newField.Id
                });

                // Save changes
                await _Db.SaveChangesAsync();

                _Logger.LogDebug("Text field {0} on {1} has been updated", slotNum, page.Name);

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating text field {0} on page {1}: ", slotNum, pageId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later");
            }

        }

        [HttpPost]
        [Route("/api/page/{pageId:int}/visibility")]
        public async Task<IActionResult> ToggleVisbility(int pageId)
        {
            try
            {
                var page = await _Db.Pages.Where(c => c.Id == pageId).FirstOrDefaultAsync();
                if (page == null)
                    return BadRequest("Page does not exist");

                page.Public = !page.Public;

                await _Db.SaveChangesAsync();

                _Logger.LogDebug("Page {0} has been toggled to {1} visible.", page.Name, page.Public ? "" : "not");

                return Ok();

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error toggling visibility of page {0}: {1}", pageId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        [HttpDelete]
        [Route("/api/page/{pageId:int}")]
        public async Task<IActionResult> DeletePage(int pageId)
        {
            try
            {
                var page = await _Db.Pages.Where(c => c.Id == pageId)
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextComponents)
                            .ThenInclude(rtf => rtf.TextComponent)
                    .FirstOrDefaultAsync();

                if (page == null)
                {
                    return NotFound("Page not found.");
                }

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
                return BadRequest("Something went wrong, please try again later");
            }
        }
    }
}