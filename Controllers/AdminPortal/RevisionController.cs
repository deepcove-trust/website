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
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Web
{
    [Authorize]
    [Area("admin-portal, web")]
    [Route("/api/pages")]
    public class RevisionController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<RevisionController> _Logger;
        private readonly IConfiguration _Config;


        public RevisionController(WebsiteDataContext _db, ILogger<RevisionController> _logger, IConfiguration config)
        {
            _Db = _db;
            _Logger = _logger;
            _Config = config;
        }

        /// <summary>
        /// Returns detailed data for a given page id and revision ID.
        /// 
        /// If no revision ID is provided, the latest revision will be returned.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{pageId:int}/revision/{revisionId?}")]
        public async Task<IActionResult> GetRevision(int pageId, int? revisionId)
        {
            try
            {
                var page = _Db.Pages.Where(c => c.Id == pageId)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextComponents)
                            .ThenInclude(tc => tc.TextComponent)
                                .ThenInclude(btn => btn.CmsButton)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(revision => revision.Template)
                    .ToList()
                    .Select(s => new {
                        s.Id,
                        s.Name,
                        s.Public,
                        s.Section,
                        templateId = s.GetRevision(revisionId).Template.Id,
                        textComponents = s.GetRevision(revisionId).RevisionTextComponents.OrderBy(o => o.TextComponent.SlotNo)
                            .Select(txt => new {
                                txt.TextComponent.Id,
                                txt.TextComponent.Heading,
                                txt.TextComponent.Text,
                                txt.TextComponent.SlotNo,
                                link = txt.TextComponent.CmsButton != null ? new {
                                    txt.TextComponent.CmsButton.Id,
                                    txt.TextComponent.CmsButton.Align,
                                    txt.TextComponent.CmsButton.Color,
                                    txt.TextComponent.CmsButton.Href,
                                    txt.TextComponent.CmsButton.Text
                                } : null
                            }).ToList(),                        
                        mediaComponents = new { },
                        s.GetRevision(revisionId).Created,
                        /// <remarks>
                        /// Global settings not tied to a revision, needed for some templates
                        /// </remarks>
                        otherComponents = new
                        {
                            googleMaps = _Db.SystemSettings.Last().UrlGoogleMaps,
                            captchaSiteKey = _Config.GetSection("RecaptchaSettings").GetValue<String>("SiteKey")
                        }
                    })
                    .FirstOrDefault();

                /**
                 * Return 404 if
                 * 1. No Page Exists
                 * 2. The page is private, and the requestor is not authenticated
                 */
                if (page == null || !page.Public && !User.Identity.IsAuthenticated)
                    return NotFound();

                return Ok(page);
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving revision data for page {0} (revision ID: {1}: {2}",
                    pageId, revisionId != 0 ? revisionId.ToString() : "Latest",
                    ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        [HttpPost("{pageId:int}/revision")]
        public async Task<IActionResult> CreateRevision(int pageId, IFormCollection request)
        {
            /* To be supplied in request body - 
             * 
             * Reason for change - e.g. Updated pricing information
             * Template ID 
             * Collection of text components 
             * Collection of media components
             * 
             */
            try
            {
                // Load page from database
                Page page = await _Db.Pages.FindAsync(pageId);
                if (page == null)
                    return BadRequest("No page exists for given page ID");

                // Load template from database
                PageTemplate template = await _Db.PageTemplates
                    .FindAsync(request.Int("templateId"));
                if (template == null)
                    return BadRequest("No template exists for given template ID");


                // Create the new page revision
                PageRevision newRevision = new PageRevision
                {
                    Page = page,
                    Template = template,
                    Reason = request.Str("reason"),
                    CreatedBy = await _Db.Accounts.FindAsync(User.AccountId()),
                };

                /*
                 * For each text component slot, we will either:
                 * a) Use the text component provided in the request body
                 * or, if there is no component provided for that slot
                 * b) Create a link between the new revision and the old revisions
                 * component
                 * 
                 * TextComponent tc;
                 * 
                 * foreach(int i; i < number of text slots){
                 *     if(request["textComponents"][i] != null){
                 *         tc = new TextComponent { request supplies fields }
                 *         db.add(tc) 
                 *     }
                 *     
                 *     Create the link between the new revision and either the
                 *     new text component, or the old revisions text component
                 * }
                 * 
                 * ** Do the same for media text components **
                 *     
                 *  Save database changes
                 */

                _Logger.LogDebug("New page revision created for page {0} ({1}): {2}", pageId, page.Name, newRevision.Reason);

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error creating new revision for page {0}: {1}", pageId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        /// <summary>
        /// Reverts a given page to a given page revision.
        /// </summary>
        /// <param name="revisionId">The revision ID must belong to the given page.</param>
        /// <returns></returns>
        [HttpPut("{pageId:int}/revision/{revisionId:int}")]
        public async Task<IActionResult> Revert(int pageId, int revisionId)
        {
            try
            {
                Page page = await _Db.Pages
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.Template)
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextComponents)
                            .ThenInclude(rtc => rtc.TextComponent)
                    .Include(p => p.PageRevisions)
                        .ThenInclude(pr => pr.RevisionMediaComponents)
                            .ThenInclude(rmc => rmc.MediaComponent)
                    .Where(p => p.Id == pageId)
                    .FirstOrDefaultAsync();

                // Ensure page exists
                if (page == null)
                    return BadRequest("No page exists for given page ID");

                // Ensure that the revision belongs to the correct page
                if (!page.PageRevisions.Any(pr => pr.Id == revisionId))
                    return BadRequest("Given page does not contain a revision for the given revision ID");

                PageRevision revertTo = page.PageRevisions.Find(pr => pr.Id == revisionId);

                // Create a new revision for the page, that is a copy of the supplied revision
                PageRevision newRevision = new PageRevision
                {
                    Reason = string.Format("Reverted page to revision: {0}", revertTo.Reason),
                    CreatedBy = await _Db.Accounts.FindAsync(User.AccountId()),
                    Page = page,
                    Template = revertTo.Template
                };

                await _Db.AddAsync(newRevision);

                // Create associations between the existing text components and the new revision
                foreach (RevisionTextComponent rtc in revertTo.RevisionTextComponents)
                {
                    await _Db.AddAsync(new RevisionTextComponent
                    {
                        PageRevisionId = newRevision.Id,
                        TextComponentId = rtc.TextComponentId
                    });
                }

                // Do the same for existing media components
                foreach (RevisionMediaComponent rmc in revertTo.RevisionMediaComponents)
                {
                    await _Db.AddAsync(new RevisionMediaComponent
                    {
                        PageRevisionId = newRevision.Id,
                        MediaComponentId = rmc.MediaComponentId
                    });
                }

                // Execute the database transaction
                await _Db.SaveChangesAsync();

                _Logger.LogDebug("{0} page reverted to revision {1} ({2}) by {3}",
                    page.Name, revisionId, revertTo.Reason, User.AccountName());

                return Ok();

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error reverting page {0} to revision {1}: {2}", pageId, revisionId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        /// <summary>
        /// Returns the ID, author, date and reason for each revision for the 
        /// given page ID.
        /// </summary>
        [HttpGet("{pageId:int}/revisions")]
        public async Task<IActionResult> GetAllRevisions(int pageId)
        {
            try
            {
                return Ok(await _Db.PageRevisions
                    .Include(pr => pr.Page)
                    .Include(pr => pr.CreatedBy)
                    .Where(pr => pr.Page.Id == pageId)
                    .Select(pr => new
                    {
                        pr.Id,
                        pr.Reason,
                        pr.CreatedAt,
                        pr.CreatedBy.Name
                    }).ToListAsync());

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error getting list of revisions for page {0}: {1}", pageId, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}