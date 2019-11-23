using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [AllowAnonymous]
    [Route("/api/notices")]
    public class ManageNoticeboardController : Controller
    {
        private readonly ILogger<ManageNoticeboardController> _Logger;
        private readonly WebsiteDataContext _Db;

        public ManageNoticeboardController(ILogger<ManageNoticeboardController> logger, WebsiteDataContext db)
        {
            _Logger = logger;
            _Db = db;
        }

        public async Task<IActionResult> GetAll()
        {
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> AddNotice(IFormCollection request)
        {
            return Ok();
        }

        [HttpPatch("{int:id}")]
        public async Task<IActionResult> ToggleVisibility()
        {
            return Ok();
        }

        [HttpDelete("{int:id}")]
        public async Task<IActionResult> DeleteNotice()
        {
            return Ok();
        }
    }
}
