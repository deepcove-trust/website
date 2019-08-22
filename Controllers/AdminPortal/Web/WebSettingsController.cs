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

        public IActionResult Index(string tab)
        {
            ViewData["tab"] = tab;
            return View(viewName: "~/Views/AdminPortal/Web/Settings.cshtml");
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
                        s.Phone
                    },
                    footer = new {

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
                SystemSettings settings = await _Db.SystemSettings.FirstOrDefaultAsync();

                await _Db.AddAsync(new SystemSettings
                {
                    // Update the new information
                    EmailBookings = request.Str("emailBookings"),
                    EmailGeneral = request.Str("emailGeneral"),
                    Phone = request.Str("phone"),
                    UrlFacebook = request.Str("urlFacebook"),
                    UrlGooglePlay = request.Str("urlGooglePlay"),
                    UrlGoogleMaps = request.Str("urlGoogleMaps"),

                    // These fields aren't in this endpoint, bring settings from the last record
                    FooterText = settings.FooterText,
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
    }
}