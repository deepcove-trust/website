using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{

    [Route("/api/app/config")]
    public class ConfigController : Controller
    {
        private WebsiteDataContext _Db;
        private ILogger<ConfigController> _Logger;

        public ConfigController(WebsiteDataContext db, ILogger<ConfigController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns the Mobile Application Master Config
        /// </summary>
        public IActionResult Index()
        {
            try
            {
                return Ok(_Db.Config.Select(s => new
                {
                    s.MasterUnlockCode
                }).Last());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving configuration data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}