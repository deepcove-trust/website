using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin")]
    [Route("admin/noticeboard")]
    public class NoticeboardController : Controller
    {
        private readonly ILogger<NoticeboardController> _Logger;
        private readonly WebsiteDataContext _Database;

        public NoticeboardController(ILogger<NoticeboardController> logger, WebsiteDataContext database)
        {
            _Logger = logger;
            _Database = database;
        }

        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/Noticeboard.cshtml");
        }

        [HttpGet("data")]
        public async Task<IActionResult> Data()
        {
            try
            {
                List<Notice> notices = await _Database.Notices.Where(c => c.DeletedAt == null).OrderBy(o => o.CreatedAt).ToListAsync();
                var x = new
                {
                    important = notices.Where(c => c.Urgent == 1 && c.Active).ToList(),
                    normal = notices.Where(c => c.Urgent == 0 && c.Active).ToList(),
                    disabled = notices.Where(c => !c.Active).ToList()
                };
                return Ok(x);
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving notices data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }
    }
}
