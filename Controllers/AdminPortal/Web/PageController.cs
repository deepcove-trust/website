using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Web
{
    [Authorize]
    [Area("admin-portal,web")]
    [Route("/admin/web/pages")]
    public class PageController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<PageController> _Logger;

        public PageController(WebsiteDataContext db, ILogger<PageController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        [HttpGet("{filter}")]
        public IActionResult Index(string filter)
        {
            ViewData["PageName"] = filter;
            return View(viewName: "~/Views/AdminPortal/Web/Pages.cshtml");
        }

        [HttpGet("{filter}/data")]
        public async Task<IActionResult> PageList(string filter)
        {
            if (!Enum.IsDefined(typeof(Section), filter))           
                return BadRequest($"Invalid filter. Please use one of the following: {string.Join(", ", Enum.GetNames(typeof(Section)))}");

            try
            {
                return Ok(await _Db.Pages.Where(w => w.Section == Enum.Parse<Section>(filter))
                    .Select(s => new {
                        s.Id,
                        s.Name,
                        template = s.Template.Name,
                        s.Public,
                        s.CreatedAt,
                        s.UpdatedAt
                    }).ToListAsync());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving {0} pages: {1}", filter, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("We could not retrieve the pages, please try again later");
            }
        }
    }
}