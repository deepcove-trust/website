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
using Newtonsoft.Json;

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
        public IActionResult GetRevision(int pageId, int? revisionId)
        {
            try
            {
                var page = _Db.Pages.Where(c => c.Id == pageId)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(pr => pr.RevisionTextComponents)
                            .ThenInclude(tc => tc.TextComponent)
                                .ThenInclude(btn => btn.CmsButton)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(pr => pr.RevisionMediaComponents)
                            .ThenInclude(mc => mc.MediaComponent)
                                .ThenInclude(mc => mc.ImageMedia)
                    .Include(i => i.PageRevisions)
                        .ThenInclude(revision => revision.Template)
                    .ToList()
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Public,
                        s.Section,
                        templateId = s.GetRevision(revisionId).Template.Id,
                        textComponents = s.GetRevision(revisionId).RevisionTextComponents.OrderBy(o => o.TextComponent.SlotNo)
                            .Select(txt => new
                            {
                                txt.TextComponent.Id,
                                txt.TextComponent.Text,
                                txt.TextComponent.SlotNo,
                                button = txt.TextComponent.CmsButton != null ? new
                                {
                                    txt.TextComponent.CmsButton.Id,
                                    txt.TextComponent.CmsButton.Align,
                                    txt.TextComponent.CmsButton.Color,
                                    txt.TextComponent.CmsButton.Href,
                                    txt.TextComponent.CmsButton.Text
                                } : null
                            }).ToList(),
                        mediaComponents = s.GetRevision(revisionId).RevisionMediaComponents.OrderBy(o => o.MediaComponent.SlotNo)
                            .Select(img => new
                        {
                                img.MediaComponent.Id,
                                img.MediaComponent.SlotNo,
                                img.MediaComponent.YouTubeEmbed,
                                img.MediaComponent.ImageMediaId,
                                img.MediaComponent?.ImageMedia?.Filename,
                                img.MediaComponent?.ImageMedia?.Alt,
                                copyright = new
                                {
                                    img.MediaComponent?.ImageMedia?.Source,
                                    showSymbol = img.MediaComponent?.ImageMedia?.ShowCopyright
                                }
                            }),
                        s.GetRevision(revisionId).Created,
                        /// <remarks>
                        /// Global settings not tied to a revision, needed for some templates
                        /// </remarks>
                        otherComponents = new
                        {
                            googleMaps = _Db.SystemSettings.Last().UrlGoogleMaps,
                            captchaSiteKey = _Config.GetSection("RecaptchaSettings").GetValue<String>("SiteKey")
                        },
                        enums = User.Identity.IsAuthenticated ? new {
                            Align = Enum.GetValues(typeof(Align)),
                            Color = Enum.GetValues(typeof(Color))
                        } : null
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

                List<TextComponent> newRevisionTextComponents =
                    request.Deserialize(typeof(List<TextComponent>), "textComponents");
                
                List<MediaComponent> newRevisionMediaComponents = 
                    request.Deserialize(typeof(List<MediaComponent>), "imageComponents");

                // Todo: Do this after the view has had template switching enabled
                // Load template from database 
                // PageTemplate template = await _Db.PageTemplates
                //    .FindAsync(request.Int("templateId"));

                // Fetch the original revision
                PageRevision old = await _Db.PageRevisions
                  .Include(pr => pr.Template)
                  .Include(pr => pr.RevisionMediaComponents)
                      .ThenInclude(rmc => rmc.MediaComponent)
                  .Include(pr => pr.RevisionTextComponents)
                      .ThenInclude(rtc => rtc.TextComponent)
                          .ThenInclude(tc => tc.CmsButton)
                  .Where(pr => pr.Page == page)
                  .OrderByDescending(pr => pr.CreatedAt)
                  .FirstOrDefaultAsync();

                var oldRevision = new
                {
                    old.Template,
                    TextComponents = old.RevisionTextComponents
                    .Select(rtc => rtc.TextComponent)
                    .OrderBy(tc => tc.SlotNo)
                    .ToList(),

                    MediaComponents = old.RevisionMediaComponents
                    .Select(rmc => rmc.MediaComponent)
                    .OrderBy(tc => tc.SlotNo)
                    .ToList()
                };

                // Create the new page revision
                PageRevision newRevision = new PageRevision
                {
                    Page = page,
                    Template = oldRevision.Template,
                    Reason = request.Str("reason"),
                    CreatedBy = await _Db.Accounts.FindAsync(User.AccountId()),
                };

                // Assign the new revision an ID
                await _Db.AddAsync(newRevision);

                for (int i = 0; i < newRevision.Template.TextAreas; i++)
                {
                    TextComponent textComponentToSave = null;

                    // Only save a new text component if it has changed
                    if(!newRevisionTextComponents[i].Equals(oldRevision.TextComponents[i]))
                    {
                        textComponentToSave = newRevisionTextComponents[i];

                        // Set ID to 0 so that EF Core assigns us a new one
                        textComponentToSave.Id = 0;

                        // Save a new button if the components button does not yet exist in database.
                        if (textComponentToSave.CmsButton != null 
                            && !textComponentToSave.CmsButton.Equals(oldRevision.TextComponents[i].CmsButton))
                        {
                            await _Db.AddAsync(textComponentToSave.CmsButton);
                        }

                        // Generate ID for the new TextComponent
                        await _Db.AddAsync(textComponentToSave);
                    }

                    // Add association between component and new revision
                    await _Db.AddAsync(new RevisionTextComponent
                    {
                        // Use the new components ID if it exists, other use existing (unchanged) component
                        // from previous revision
                        TextComponentId = textComponentToSave?.Id ?? oldRevision.TextComponents[i].Id,
                        PageRevisionId = newRevision.Id
                    });                    
                }

                // Do the same for media components
                for(int i = 0; i < newRevision.Template.MediaAreas; i++)
                {
                    MediaComponent mediaComponentToSave = null;

                    // Only create new media component if the old one was modified
                    if (!newRevisionMediaComponents[i].Equals(oldRevision.MediaComponents[i]))
                    {
                        mediaComponentToSave = newRevisionMediaComponents[i];

                        // Generate new ID
                        mediaComponentToSave.Id = 0;
                        await _Db.AddAsync(mediaComponentToSave);
                    }

                    // Add association to new revision
                    await _Db.AddAsync(new RevisionMediaComponent
                    {
                        PageRevisionId = newRevision.Id,
                        MediaComponentId = mediaComponentToSave?.Id ?? oldRevision.MediaComponents[i].Id
                    });                    
                }

                // Save changes
                await _Db.SaveChangesAsync();

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