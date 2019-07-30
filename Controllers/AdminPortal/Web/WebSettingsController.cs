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

        [HttpPut("contact")]
        public async Task<IActionResult> UpdateContact(IFormCollection request)
        {
            try
            {
                WebsiteSettings settings = await _Db.WebsiteSettings.FirstOrDefaultAsync();

                settings.FacebookUrl = request.Str("facebook");
                settings.ContactEmail = request.Str("email");
                settings.ContactPhone = request.Str("phone");

                await _Db.SaveChangesAsync();
                _Logger.LogInformation("{0} updated the website contact information", User.AccountName());

                return Ok();
            } 
            catch(Exception ex)
            {
                _Logger.LogError("Error updating website contact information: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error updating website contact information, please try again later");
            }
            
        }

        [HttpPut("statement")]
        public async Task<IActionResult> UpdateMissionStatement(IFormCollection request)
        {
            try
            {
                WebsiteSettings settings = await _Db.WebsiteSettings.FirstOrDefaultAsync();
                settings.MissionStatment = request.Str("statement");

                await _Db.SaveChangesAsync();
                _Logger.LogInformation("{0} updated the website mission statement.", User.AccountName());

                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating website mission statement: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error updating website mission statement, please try again later");
            }
        }

        [HttpPut("category")]
        public async Task<IActionResult> QuickLinks(IFormCollection request)
        {
            try
            {
                WebsiteSettings settings = await _Db.WebsiteSettings.FirstOrDefaultAsync();
                settings.QLinksTitleA = request.Str("titleA");
                settings.QLinksTitleB = request.Str("titleB");

                await _Db.SaveChangesAsync();
                _Logger.LogInformation("{0} updated the website quick link titles", User.AccountName());
                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating website quick link titles: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error updating website quick link titles, please try again later");
            }
        }

        [HttpPost("category")]
        public async Task<IActionResult> AddQuickLink(IFormCollection request)
        {

            return NotFound("Not Implemented");
        }

        [HttpDelete("category")]
        public async Task<IActionResult> RemoveQuickLink(IFormCollection request)
        {
            return NotFound("Not Implemented");
        }

        
    }
}