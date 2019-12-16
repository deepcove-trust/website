using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Controllers
{
    [AllowAnonymous]
    [Route("api/notices")]
    public class NoticeboardController : Controller
    {
        private readonly ILogger<NoticeboardController> _Logger;
        private readonly WebsiteDataContext _Db;

        public NoticeboardController(ILogger<NoticeboardController> logger, WebsiteDataContext db)
        {
            _Logger = logger;
            _Db = db;
        }

        [HttpGet("app")]
        public async Task<IActionResult> GetAppNotices()
        {
            try
            {
                return Ok(await _Db.Notices.Where(n => n.Noticeboard == Noticeboard.app || n.Noticeboard == Noticeboard.all).ToListAsync());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving app notices: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpGet("web")]
        public async Task<IActionResult> GetWebNotices()
        {
            try
            {
                return Ok(await _Db.Notices.Where(n => n.Noticeboard == Noticeboard.web || n.Noticeboard == Noticeboard.all).ToListAsync());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving web notices: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
        }
        
    }
}
