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

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/api")]
    public class ApiController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<ApiController> _Logger;

        public ApiController(WebsiteDataContext db, ILogger<ApiController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns data for each template in the application.
        /// </summary>
        [HttpGet]
        [Route("page/templates")]
        public async Task<IActionResult> GetTemplateData()
        {
            try
            {
                return Ok(await _Db.PageTemplates.Select(s => new
                {
                    id = s.Id,
                    name = s.Name,
                    description = s.Description,
                    textAreas = s.TextAreas,
                    mediaAreas = s.MediaAreas
                }).ToListAsync());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving template data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Error processing request, please see logs for more information.");
            }
        }

        [HttpGet]
        [Route("sections")]
        public IActionResult GetSections()
        {
            return Ok(Enum.GetNames(typeof(Section)));
        }
    }
}
