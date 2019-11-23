using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Settings
{
    [Authorize]
    [Area("admin-portal,web")]
    [Route("/admin/settings/navbar")]
    public class NavbarSettingsController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<NavbarSettingsController> _Logger;

        public NavbarSettingsController(WebsiteDataContext db, ILogger<NavbarSettingsController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns a JSON representation of the navbar links, for consumption by the CMS
        /// </summary>
        /// <returns></returns>        
        public async Task<IActionResult> GetNavbar()
        {
            try
            {
                List<NavItem> navItems = await _Db.NavItems
                    .Include(item => item.Page)
                    .Include(items => items.NavItemPages)
                        .ThenInclude(nip => nip.Page)
                    .ToListAsync();

                return Ok(navItems.Select(item => new {
                    item.Text,
                    item.Url,
                    pageId = item.Page?.Id,
                    pageName = item.Page?.Name,
                    section = item.Section,
                    children = item.NavItemPages.Count > 0 ? item.NavItemPages.Select(nip => new
                    {
                        nip.Text,
                        nip.Url,
                        pageId = nip.Page?.Id,
                        pageName = nip.Page?.Name,
                    }) : null
                }));
                
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error sending navbar data to CMS: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Error processing the request");
            }
        }

        [HttpPost]
        public async Task<IActionResult> EditNavbar(IFormCollection request)
        {
            try
            {
                List<NavItem> newMainNavbar = request.Deserialize(typeof(List<NavItem>), "main");
                List<NavItem> newEducationNavbar = request.Deserialize(typeof(List<NavItem>), "education");

                return StatusCode(501); // Todo: Implement this method
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating navbar data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Error processing the request");
            }
        }
    }
}
