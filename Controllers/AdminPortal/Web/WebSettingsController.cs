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
    [Route("/admin/web/settings")]
    public class WebSettingsController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<WebSettingsController> _Logger;

        public WebSettingsController(WebsiteDataContext db, ILogger<WebSettingsController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/Web/Settings.cshtml");
        }

        [HttpGet("data")]
        public async Task<IActionResult> Data()
        {
            try
            {
                return Ok(await _Db.WebsiteSettings.FirstOrDefaultAsync());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error getting website settings: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error getting website settings, please try again later");
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSettings(IFormCollection request)
        {
            try
            {
                WebsiteSettings settings = await _Db.WebsiteSettings.FirstOrDefaultAsync();
                settings.Email = request.Str("email");
                settings.Phone = request.Str("phone");
                settings.FacebookUrl = request.Str("facebookUrl");
                settings.FooterText = request.Str("footerText");

                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating website settings: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error updating website settings, please try again later");
            }
        }
        
    }
}