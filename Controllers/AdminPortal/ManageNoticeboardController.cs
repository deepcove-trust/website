using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
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
            try
            {
                return Ok(await _Db.Notices.ToListAsync());
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving notices: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddNotice(IFormCollection request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Str("notice")))
                    return BadRequest("No JSON data was provided.");

                Notice notice = JsonConvert.DeserializeObject<Notice>(request.Str("notice"));

                await _Db.AddAsync(notice);
                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Notice {0} ({1}) created", notice.Id, notice.Title);

                return Ok();

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error adding new notice: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpPut]
        public async Task<IActionResult> EditNotice(IFormCollection request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Str("notice")))
                    return BadRequest("No JSON data was provided.");

                Notice changedNotice = JsonConvert.DeserializeObject<Notice>(request.Str("notice"));

                _Db.Update(changedNotice);

                await _Db.SaveChangesAsync();               

                _Logger.LogInformation("Notice {0} ({1}) modified", changedNotice.Id, changedNotice.Title);

                return Ok();

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error adding new notice: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
        }


        [HttpPatch("{id:int}")]
        public async Task<IActionResult> ToggleVisibility(int id)
        {
            try
            {
                Notice notice = await _Db.Notices.FindAsync(id);

                if (notice == null) return NotFound();

                notice.Active = !notice.Active;

                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Notice {0} ({1}) set to {2}", notice.Id, notice.Title, notice.Active ? "active" : "inactive");

                return Ok();

            }
            catch(Exception ex)
            {
                _Logger.LogError("Error toggling notice visiblity: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
            
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteNotice(int id)
        {
            try
            {
                Notice notice = await _Db.Notices.FindAsync(id);

                if (notice == null) return NotFound();

                _Db.Remove(notice);
                await _Db.SaveChangesAsync();

                _Logger.LogInformation("Notice {0} ({1}) deleted", notice.Id, notice.Title);

                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error deleting notice: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest();
            }
        }
    }
}
