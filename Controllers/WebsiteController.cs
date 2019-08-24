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

namespace Deepcove_Trust_Website.Controllers
{
    public class WebsiteController : Controller
    {
        private readonly ILogger<WebsiteController> _Logger;
        private readonly WebsiteDataContext _Db;
        public WebsiteController(WebsiteDataContext db, ILogger<WebsiteController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        [AllowAnonymous]
        [Route("/{pageName}")]
        public IActionResult MainPage(string pageName)
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
        public IActionResult EducationPage(string pageName)
        {
            Page page = _Db.Pages.Include(i => i.Template)
                .Where(c => c.Name == pageName.Replace('-', ' ') && c.Section == Section.education).FirstOrDefault();

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

        /// <summary>
        /// Creates a new page revision, based off of the latest revision, with an updated text field.
        /// </summary>
        /// <param name="pageId">The ID of the page being revised</param>
        /// <param name="slotNum">The slot number of the text field being updated</param>
        /// <param name="request">
        /// Key values:
        /// "heading" - (optional) the text to display as the heading |
        /// "text" - the text to display in the body of the text field |
        /// "link-text" - (optional) the text to display in the link - this field is used to determine 
        /// whether or the updated field contains a link |
        /// "link-href" - (optional) the URL to which the link is linked to |
        /// "link-isButton" = (optional) if true, link will display as bootstrap button |
        /// "link-color" = (optional) sets the color of the link using the Color enum |
        /// "link-align" = (optional) sets the alignment of the link using the Align enum 
        /// </param>
        /// <returns></returns>
        //[Authorize] // Todo: Reinstate this
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

        [Authorize]
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

            }catch(Exception ex)
            {
                _Logger.LogError("Error toggling visibility of page {0}: {1}", pageId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        [Authorize]
        [HttpDelete]
        [Route("/api/page/{pageId:int}")]
        public async Task<IActionResult> DeletePage(int pageId)
        {
            try
            {
                var page = await _Db.Pages.Where(c => c.Id == pageId).FirstOrDefaultAsync();

                if (page == null)
                {
                    return NotFound("Page not found.");
                }

                page.DeletedAt = DateTime.UtcNow;
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
