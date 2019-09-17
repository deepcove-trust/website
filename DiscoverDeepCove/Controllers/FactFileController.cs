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
                        s.UpdatedAt
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
                        Category_Name = s.Category.Id,
                        Main_Image_Id = s.MainImage.Id,
                        Listen_Audio_Id = s.ListenAudio.Id,
                        Pronounce_Audio_Id = s.PronounceAudio.Id,
                        Images = s.FactFileEntryImages.Select(s1 => s1.MediaFile.Id),
                        Nuggets = _Db.FactFileNuggets.Where(c => c.FactFileEntry.Id == id).Select(s1 => new
                        {
                            s1.Id,
                            Image_Id = s1.Image.Id,
                            s1.Name,
                            s1.OrderIndex,
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