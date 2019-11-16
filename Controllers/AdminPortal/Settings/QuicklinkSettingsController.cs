using System;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Settings
{
    [Authorize]
    [Area("admin-portal,web")]
    [Route("/admin/settings/quicklinks")]
    public class QuicklinkSettingsController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<QuicklinkSettingsController> _Logger;

        public QuicklinkSettingsController(WebsiteDataContext db, ILogger<QuicklinkSettingsController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        [HttpGet("")]
        public async Task<IActionResult> Data()
        {
            try
            {
                return Ok(await _Db.SystemSettings.OrderByDescending(o => o.Id)
                    .Select(s => new
                    {
                        a = new
                        {
                            title = s.LinkTitleA,
                            pages = _Db.Pages.Where(c => c.QuickLink == QuickLinkSection.A)
                                .Select(s1 => new { s1.Name, s1.Section, s1.Id })
                                .OrderBy(o => o.Name)
                                .ToList(),
                        },
                        b = new
                        {
                            title = s.LinkTitleB,
                            pages = _Db.Pages.Where(c => c.QuickLink == QuickLinkSection.B)
                                .Select(s1 => new { s1.Name, s1.Section, s1.Id })
                                .OrderBy(o => o.Name)
                                .ToList(),
                        },
                        avaliable = _Db.Pages.Where(c => c.QuickLink == QuickLinkSection.None)
                                .Select(s1 => new { s1.Name, s1.Section, s1.Id })
                                .OrderBy(o => o.Name)
                                .ToList()
                    }).FirstOrDefaultAsync());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error getting quicklink settings: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error getting quicklink settings, please try again later");
            }
        }

        [HttpPost("{pageId:int}/{sectionId:int}")]
        public async Task<IActionResult> AddQuickLink(int pageId, int sectionId)
        {
            try
            {
                Page page = await _Db.Pages.FindAsync(pageId);
                page.QuickLink = (QuickLinkSection)sectionId;
                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error adding quick link: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error adding quick link, please try again later");
            }
        }

        [HttpDelete("{pageId}")]
        public async Task<IActionResult> RemoveQuickLink(int pageId)
        {
            try
            {
                Page page = await _Db.Pages.FindAsync(pageId);
                page.QuickLink = QuickLinkSection.None;
                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error removing quick link: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error removing quick link, please try again later");
            }
        }
    
        /// <summary>
        /// Updates the quick link section title(s)
        /// </summary>
        [HttpPut("{sectionId:int}")]
        public async Task<IActionResult> UpdateQuickLinks(IFormCollection request, int sectionId)
        {
            try
            {
                SystemSettings settings = await _Db.SystemSettings.OrderByDescending(o => o.Id).FirstOrDefaultAsync();

                // Update changed fields
                settings.LinkTitleA = (sectionId == (int)QuickLinkSection.A) ? request.Str("title") : settings.LinkTitleA;
                settings.LinkTitleB = (sectionId == (int)QuickLinkSection.B) ? request.Str("title") : settings.LinkTitleB;

                // Save to database
                await _Db.SaveChangesAsync();
                _Logger.LogInformation($"{User.AccountName()} updated the quick link settings");
                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating quick link title: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error updating quick link title, please try again later");
            }
        }
    }
}
