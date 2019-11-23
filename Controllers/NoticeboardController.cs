using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            return Ok();
        }

        [HttpGet("web")]
        public async Task<IActionResult> GetWebNotices()
        {
            return Ok();
        }
        
    }
}
