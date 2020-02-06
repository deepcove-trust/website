using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.DiscoverDeepCove.Controllers
{
    [AllowAnonymous]
    public class NoticeboardController : Controller
    {
        private readonly ILogger<NoticeboardController> _Logger;
        private readonly WebsiteDataContext _Database;

        public NoticeboardController(ILogger<NoticeboardController> logger, WebsiteDataContext database)
        {
            _Logger = logger;
            _Database = database;
        }

        [Route("api/notices/app")]
        public async Task<IActionResult> GetAppNotices()
        {
            try
            {
                return Ok(await _Database.Notices.Where(n => n.Noticeboard != Noticeboard.web).ToListAsync());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving app notices: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
        }
    }
}
