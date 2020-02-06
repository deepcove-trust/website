using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    [Route("/api/app/factfiles")]
    public class FactFileController : Controller
    {
        private WebsiteDataContext _Db;
        private ILogger<FactFileCategory> _Logger;

        public FactFileController(WebsiteDataContext db, ILogger<FactFileCategory> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns a list of active fact files, their Id and update timestamp
        /// </summary>
        public IActionResult Index()
        {
            try
            {
                return Ok(_Db.FactFileEntries
                    .Where(c => c.Active)
                    .Select(s => new
                    {
                        s.Id,
                        updated_at = s.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                    }).ToList()
                );
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving fact file entries list: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        /// <summary>
        /// Returns the data about a given fact file, including it's nuggets
        /// </summary>
        [HttpGet("{id:int}")]
        public IActionResult FileEntry(int id)
        {            
            try
            {
                var factFile = _Db.FactFileEntries
                    .Where(c => c.Id == id && c.Active)
                    .Select(s => new
                    {
                        s.Id,
                        alt_name = s.AltName,
                        primary_name = s.PrimaryName,
                        updated_at = s.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                        body_text = s.BodyText,
                        category_id = s.CategoryId,
                        main_image_id = s.MainImageId,
                        listen_audio_id = s.ListenAudioId,
                        pronounce_audio_id = s.PronounceAudioId,
                        images = s.FactFileEntryImages.Select(s1 => s1.MediaFileId),
                        nuggets = _Db.FactFileNuggets.Where(c => c.FactFileEntryId == id).Select(nugget => new
                        {
                            nugget.Id,
                            fact_file_entry_id = nugget.FactFileEntryId,
                            image_id = nugget.ImageId,
                            nugget.Name,
                            order_index = nugget.OrderIndex,
                            nugget.Text
                        }).ToList()
                    }).FirstOrDefault();

                if (factFile == null) return NotFound();

                return Ok(factFile);
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving fact file data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        /// <summary>
        /// Returns a list of fact file categories
        /// </summary>
        [HttpGet("categories")]
        public IActionResult Categories()
        {
            try
            {
                return Ok(_Db.FactFileCategories
                    .Include(cat => cat.FactFileEntries)
                    .Where(c => c.FactFileEntries.Count > 0)
                    .Select(s => new
                {
                    s.Id,
                    s.Name
                }).ToList());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving fact file categories list: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}