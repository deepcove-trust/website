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
    [Route("/admin/settings")]
    public class WebSettingsController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<WebSettingsController> _Logger;

        public WebSettingsController(WebsiteDataContext db, ILogger<WebSettingsController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        public IActionResult Index(string tab)
        {
            ViewData["tab"] = tab;
            return View(viewName: "~/Views/AdminPortal/Web/SystemSettings.cshtml");
        }

        [HttpGet("data")]
        public async Task<IActionResult> Data()
        {
            try
            {
                return Ok(await _Db.SystemSettings.OrderByDescending(o => o.Id)
                    .Select(s => new
                {
                    contact = new {
                        Email = new
                        {
                            bookings = s.EmailBookings,
                            general = s.EmailGeneral
                        },
                        Urls = new
                        {
                            Facebook = s.UrlFacebook,
                            GooglePlay = s.UrlGooglePlay,
                            GoogleMaps = s.UrlGoogleMaps
                        },
                        s.Phone,
                        MissionStatement = s.FooterText
                    },
                    QuickLinks = new {
                        a = new {
                            title = s.LinkTitleA,
                            pages = _Db.Pages.Where(c => c.QuickLink == QuickLinkSection.A).Select(s1 => new { s1.Name, s1.Section, s1.Id }).ToList(),
                        },
                        b = new {
                            title = s.LinkTitleB,
                            pages = _Db.Pages.Where(c => c.QuickLink == QuickLinkSection.B).Select(s1 => new { s1.Name, s1.Section, s1.Id }).ToList(),
                        },
                        avaliable = _Db.Pages.Where(c => c.QuickLink == QuickLinkSection.None).Select(s1 => new { s1.Name, s1.Section, s1.Id}).ToList()
                    }
                }).FirstOrDefaultAsync());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error getting website settings: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error getting website settings, please try again later");
            }
        }

        [HttpPost("contact")]
        public async Task<IActionResult> UpdateContactSettings(IFormCollection request)
        {
            try
            {
                SystemSettings settings = await _Db.SystemSettings.OrderByDescending(o => o.Id).FirstOrDefaultAsync();

                await _Db.AddAsync(new SystemSettings
                {
                    // Update the new information
                    EmailBookings = request.Str("emailBookings"),
                    EmailGeneral = request.Str("emailGeneral"),
                    Phone = request.Str("phone"),
                    UrlFacebook = request.Str("urlFacebook"),
                    UrlGooglePlay = request.Str("urlGooglePlay"),
                    UrlGoogleMaps = request.Str("urlGoogleMaps"),
                    FooterText = request.Str("missionStatement"),

                    // These fields aren't in this endpoint, bring settings from the last record
                    LinkTitleA = settings.LinkTitleA, 
                    LinkTitleB = settings.LinkTitleB
                });

                await _Db.SaveChangesAsync();
                _Logger.LogInformation($"{User.AccountName()} updated the sites contact settings");
                return Ok();
                
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating system contact settings: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error updating system contact settings, please try again later");
            }
        }

        [HttpDelete("quicklink/{pageId}")]
        public async Task<IActionResult> RemoveQuickLink(int pageId)
        {
            try
            {
                Page page = await _Db.Pages.FindAsync(pageId);
                page.QuickLink = QuickLinkSection.None;
                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error removing quick link: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error removing quick link, please try again later");
            }
        }

        [HttpPost("quicklink/{pageId:int}/{sectionId:int}")]
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

        [HttpPut("quicklink/{sectionId:int}")]
        public async Task<IActionResult> UpdateQuickLinks(IFormCollection request, int sectionId)
        {
            try
            {
                SystemSettings settings = await _Db.SystemSettings.OrderByDescending(o => o.Id).FirstOrDefaultAsync();

                await _Db.AddAsync(new SystemSettings
                {
                    // Update the new information
                    LinkTitleA = (sectionId == (int)QuickLinkSection.A) ? request.Str("title") : settings.LinkTitleA,
                    LinkTitleB = (sectionId == (int)QuickLinkSection.B) ? request.Str("title") : settings.LinkTitleB,

                    // These fields aren't in this endpoint, bring settings from the last record
                    EmailBookings = settings.EmailBookings,
                    EmailGeneral = settings.EmailGeneral,
                    Phone = settings.Phone,
                    UrlFacebook = settings.UrlFacebook,
                    UrlGooglePlay = settings.UrlGooglePlay,
                    UrlGoogleMaps = settings.UrlGoogleMaps,
                    FooterText = settings.FooterText,
                });

                await _Db.SaveChangesAsync();
                _Logger.LogInformation($"{User.AccountName()} updated the quick link settings");
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating quick link title: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error updating quick link title, please try again later");
            }
        }

        /// <summary>
        /// Returns a JSON representation of the navbar links, for consumption by the CMS
        /// </summary>
        /// <returns></returns>
        [HttpGet("navbar")]
        public async Task<IActionResult> GetNavbar()
        {
            try
            {
                List<NavItem> navItems = await _Db.NavItems
                    .Include(item => item.Page)
                    .Include(items => items.NavItemPages)
                        .ThenInclude(nip => nip.Page)
                    .ToListAsync();

                return Ok(new {
                    main = navItems.Where(item => item.Section == Section.main).Select(item => new {
                        item.Text,
                        item.Url,
                        pageId = item.Page?.Id,
                        pageName = item.Page?.Name,
                        children = item.NavItemPages.Count > 0 ? item.NavItemPages.Select(nip => new
                        {
                            nip.Text,
                            nip.Url,
                            pageId = nip.Page?.Id,
                            pageName = nip.Page?.Name,
                        }) : null
                    }),
                    education = navItems.Where(item => item.Section == Section.education).Select(item => new {
                        item.Text,
                        item.Url,
                        pageId = item.Page?.Id,
                        pageName = item.Page?.Name,
                        children = item.NavItemPages.Count > 0 ? item.NavItemPages.Select(nip => new
                        {
                            nip.Text,
                            nip.Url,
                            pageId = nip.Page?.Id,
                            pageName = nip.Page?.Name,
                        }) : null
                    }),
                });
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error sending navbar data to CMS: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Error processing the request");
            }
        }
                
        [HttpPost("navbar")]
        public async Task<IActionResult> EditNavbar(IFormCollection request)
        {
            try
            {
                List<NavItem> newMainNavbar = request.Deserialize(typeof(List<NavItem>), "main");
                List<NavItem> newEducationNavbar = request.Deserialize(typeof(List<NavItem>), "education");                

                return Ok(); // TODO: Implement save changes
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating navbar data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Error processing the request");
            }            
        }
    }
}