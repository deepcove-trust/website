using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Settings
{
    [Authorize]
    [Area("admin-portal,web")]
    [Route("/admin/settings/contact")]
    public class ContactSettingsController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<ContactSettingsController> _Logger;

        public ContactSettingsController(WebsiteDataContext db, ILogger<ContactSettingsController> logger)
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
                    }).FirstOrDefaultAsync());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error getting contact settings: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest("Error getting contact settings, please try again later");
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateContactSettings(IFormCollection request)
        {
            try
            {
                SystemSettings settings = await _Db.SystemSettings.OrderByDescending(o => o.Id).FirstOrDefaultAsync();

                // Update the new information
                settings.EmailBookings = request.Str("emailBookings");
                settings.EmailGeneral = request.Str("emailGeneral");
                settings.Phone = request.Str("phone");
                settings.UrlFacebook = request.Str("urlFacebook");
                settings.UrlGooglePlay = request.Str("urlGooglePlay");
                settings.UrlGoogleMaps = request.Str("urlGoogleMaps");
                settings.FooterText = request.Str("missionStatement");

                // Save to database
                await _Db.SaveChangesAsync();
                _Logger.LogInformation($"{User.AccountName()} updated the sites contact settings");
                return Ok();

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating system contact settings: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest(new ResponseHelper("Error updating system contact settings, please try again later", ex.Message));
            }
        }
    }
}
