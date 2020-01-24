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
using static Deepcove_Trust_Website.Helpers.Utils;
using Microsoft.AspNetCore.Http;
using Deepcove_Trust_Website.Helpers;

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
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("")]
        public async Task<IActionResult> Create(IFormCollection request)
        {
            try
            {
                Enum.TryParse(request.Str("noticeboard"), out Noticeboard noticeboard);

                Notice n = new Notice
                {
                    Title = request.Str("title"),
                    Noticeboard =  noticeboard,
                    LongDesc = request.Str("long_desc"),
                    Urgent = request.Int("urgent"),
                    Active = request.Bool("active"),
                };

                await _Database.AddAsync(n);
                await _Database.SaveChangesAsync();
                return Ok();
            } 
            catch(Exception ex)
            {
                _Logger.LogError("Error saving notice: {0}", ex.Message);
                _Logger.LogTrace(ex.StackTrace);
                return BadRequest(new ResponseHelper("Error issuing the notice, try again later.", ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, IFormCollection request)
        {
            Notice n = await _Database.Notices.FindAsync(id); ;

            try
            {
                Enum.TryParse(request.Str("noticeboard"), out Noticeboard noticeboard);

                n.Title = request.Str("title");
                n.Noticeboard = noticeboard;
                n.LongDesc = request.Str("long_desc");
                n.Urgent = request.Int("urgent");
                n.Active = request.Bool("active");

                _Database.Update(n);
                await _Database.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating notice: {0}", ex.Message);
                _Logger.LogTrace(ex.Message);
                return BadRequest(new ResponseHelper($"Error updating \"{n.Title}\".", ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            Notice n = await _Database.Notices.FindAsync(id); ;

            try
            {
                _Database.Remove(n);
                await _Database.SaveChangesAsync();
                return Ok($"{n.Title} has been deleted.");
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error deleting notice: {0}", ex.Message);
                _Logger.LogTrace(ex.Message);
                return BadRequest(new ResponseHelper($"\"{n.Title}\" could not be deleted, please try again later.", ex.Message));
            }
        }
    }
}
