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
    [Route("/admin/web/pages")]
    public class PageController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<PageController> _Logger;

        public PageController(WebsiteDataContext db, ILogger<PageController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns the page dashboard
        /// </summary>
        /// <param name="filter">Filter that only displays the main website or education website <see cref="Section"/></param>
        /// <returns></returns>
        [HttpGet]
        public IActionResult Index(string filter = "main")
        {
            ViewData["PageName"] = filter;
            return View(viewName: "~/Views/AdminPortal/Web/Pages.cshtml");
        }

        /// <summary>
        /// Returns the page creation view
        /// </summary>
        /// <param name="filter">Filter used to set some settings <see cref="Section"/></param>
        /// <returns></returns>
        [HttpGet("new")]
        public IActionResult NewPageIndex(string filter = "main")
        {
            ViewData["Filter"] = filter;
            return View(viewName: "~/Views/AdminPortal/Web/PageNew.cshtml");
        }

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
            var page = await _Db.Pages.Where(c => c.Id == pageId)
                .Select(s => new
                {
                    s.Name,
                    s.Description,
                    s.Section
                }).FirstOrDefaultAsync();

            if (page == null)
                return NotFound();

            return Ok(page);
        }

        /// <summary>
        /// Returns a list of all pages within the website.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [HttpGet("data")]
        public async Task<IActionResult> PageList(string filter)
        {
            if (!Enum.IsDefined(typeof(Section), filter))
                return BadRequest($"Invalid filter. Please use one of the following: {string.Join(", ", Enum.GetNames(typeof(Section)))}");

            try
            {
                return Ok(_Db.Pages
                    .Where(w => w.Section == Enum.Parse<Section>(filter))
                    .Include(i => i.PageRevisions)
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        template = new
                        {
                            s.Template.Id,
                            s.Template.Name
                        },
                        s.Description,
                        s.Public,
                        s.AbsoluteUrl
                        //Updated = new
                        //{
                        //    at = s.Latest.CreatedAt,
                        //    by = s.Latest.CreatedBy.Name
                        //}
                    }).ToList()
                );
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving {0} pages: {1}", filter, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("We could not retrieve the pages, please try again later");
            }
        }

        /// <summary>
        /// Creates a new web page
        /// </summary>
        [HttpPost("new")]
        public async Task<IActionResult> CreatePage(IFormCollection request, 
            [Bind("Name", "Description", "Section")] Page page)
        {
            Template template = await _Db.PageTemplates.FindAsync(request.Int("templateId"));

            // Validate request inputs as per model data annotations
            if (ModelState.IsValid && template != null)
            {
                try
                {
                    page.Template = template;
                    await _Db.AddAsync(page);

                    // Create initial page revision
                    PageRevision pageRevision = new PageRevision
                    {
                        Page = page,
                        CreatedBy = await _Db.Accounts.FindAsync(User.AccountId())
                    };
                    await _Db.AddAsync(pageRevision);

                    // Create empty text fields, and associate to new page
                    for(int i = 0; i < template.TextAreas; i++)
                    {
                        TextField textField = new TextField { SlotNo = i };
                        await _Db.AddAsync(textField);
                        await _Db.AddAsync(new RevisionTextField
                        {
                            TextField = textField,
                            PageRevision = pageRevision,
                        });
                    }

                    await _Db.SaveChangesAsync();
                    return Ok(this.Request.BaseUrl() + page.AbsoluteUrl);

                }          
                catch (Exception ex)
                {
                    _Logger.LogWarning("Error creating new page: {0}", ex.Message);
                    _Logger.LogWarning(ex.StackTrace);
                    return BadRequest("There was an error creating the page. Please try again later.");
                }                
            }

            // else model state isn't valid
            return BadRequest("There was a problem"); // Todo: give better feedback...
        }

        [HttpPost]
        [Route("/api/page/{pageId:int}/text/{slotNum:int}")]
        public async Task<IActionResult> UpdateTextField(int pageId, int slotNum, IFormCollection request)
        {
            try
            {
                // Retrieve page from database
                Page page = await _Db.Pages
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextFields)
                        .ThenInclude(rtf => rtf.TextField)
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.CreatedBy)
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
                    RevisionTextFields = new List<RevisionTextField>(),
                    CreatedBy = await _Db.Accounts.FindAsync(1)   // (User.AccountId())
                };

                // Generate the id field
                await _Db.PageRevisions.AddAsync(newRevision);

                // Link the new revision to the same fields as the existing revision
                foreach (RevisionTextField field in latestRevision.RevisionTextFields)
                {
                    // Only copy text fields across if they are not the one being edited
                    if (field.TextField.SlotNo != slotNum)
                    {
                        newRevision.RevisionTextFields.Add(new RevisionTextField
                        {
                            PageRevisionId = newRevision.Id,
                            TextFieldId = field.TextFieldId
                        });
                    }
                }

                Link newLink = null;

                // Create new link object if the updated text field includes one
                if (!string.IsNullOrWhiteSpace(request.Str("link[text]")))
                {
                    Enum.TryParse(request.Str("link[color]"), true, out Color color);
                    Enum.TryParse(request.Str("link[align]"), true, out Align align);

                    newLink = new Link
                    {
                        Text = request.Str("link[text]"),
                        Href = request.Str("link[href]"),
                        IsButton = request.Bool("link[isButton]"),
                        Color = color,
                        Align = align
                    };

                    await _Db.CmsLink.AddAsync(newLink);
                    await _Db.SaveChangesAsync();
                }

                // Create new textField with supplied text
                TextField newField = new TextField
                {
                    SlotNo = slotNum,
                    Heading = request.Str("heading"), // get value from request                
                    Text = request.Str("text"),
                    Link = newLink
                };

                // Generate an Id for the new text field
                await _Db.TextField.AddAsync(newField);

                newRevision.RevisionTextFields.Add(new RevisionTextField
                {
                    PageRevisionId = newRevision.Id,
                    TextFieldId = newField.Id
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
                        .ThenInclude(pr => pr.RevisionTextFields)
                            .ThenInclude(rtf => rtf.TextField)
                    .FirstOrDefaultAsync();

                if (page == null)
                {
                    return NotFound("Page not found.");
                }

                // First, mark all text fields for removal
                foreach(PageRevision rev in page.PageRevisions)
                {
                    foreach(RevisionTextField rtf in rev.RevisionTextFields)
                    {
                        _Db.Remove(rtf.TextField);
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