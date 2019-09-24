using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Logging;

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
                return Ok(_Db.FactFileEntries.Where(c => c.Active)
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
                var factFile = _Db.FactFileEntries.Where(c => c.Id == id && c.Active)
                    .Select(s => new
                    {
                        s.Id,
                        s.AltName,
                        s.PrimaryName,
                        s.BodyText,
                        category_name = s.Category.Id,
                        main_image_id = s.MainImage.Id,
                        listen_audio_id = s.ListenAudio.Id,
                        pronounce_audio_id = s.PronounceAudio.Id,
                        images = s.FactFileEntryImages.Select(s1 => s1.MediaFile.Id),
                        nuggets = _Db.FactFileNuggets.Where(c => c.FactFileEntry.Id == id).Select(s1 => new
                        {
                            s1.Id,
                            image_id = s1.Image.Id,
                            s1.Name,
                            order_index = s1.OrderIndex,
                            s1.Text
                        }).ToList()
                    }).FirstOrDefault();

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
                return Ok(_Db.FactFileCategories.Select(s => new
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