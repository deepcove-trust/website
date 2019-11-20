using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.DiscoverDeepCove.Controllers
{
    [Route("/api/app/media")]
    public class MediaController : Controller
    {
        private WebsiteDataContext _Db;
        private ILogger<MediaController> _Logger;


        public MediaController(WebsiteDataContext db, ILogger<MediaController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns a list of media files used in the mobile application
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> Index()
        {
            try
            {
                List<int?> appMediaIds = new List<int?>();

                // Add all image IDs used within the application
                appMediaIds.AddRange(await _Db.Activities.Where(w => w.Active && w.Track.Active).Select(s => s.ImageId).ToListAsync());
                appMediaIds.AddRange(await _Db.ActivityImages.Where(w => w.Activity.Active && w.Activity.Track.Active).Select(s => (int?)s.ImageId).ToListAsync());
                appMediaIds.AddRange(await _Db.FactFileEntries.Where(w => w.Active && w.Category.Active).Select(s => (int?)s.MainImageId).ToListAsync());
                appMediaIds.AddRange(await _Db.FactFileEntryImages.Where(w => w.FactFileEntry.Active && w.FactFileEntry.Category.Active).Select(s => (int?)s.MediaFileId).ToListAsync());
                appMediaIds.AddRange(await _Db.FactFileNuggets.Where(w => w.FactFileEntry.Active && w.FactFileEntry.Category.Active).Select(s => s.ImageId).ToListAsync());
                appMediaIds.AddRange(await _Db.QuizAnswers.Where(w => w.QuizQuestion.Quiz.Active).Select(s => s.ImageId).ToListAsync());
                appMediaIds.AddRange(await _Db.QuizQuestions.Where(w => w.Quiz.Active).Select(s => s.ImageId).ToListAsync());
                appMediaIds.AddRange(await _Db.Quizzes.Where(w => w.Active).Select(s => (int?)s.ImageId).ToListAsync());

                // Add all audio IDs used within the application
                appMediaIds.AddRange(await _Db.FactFileEntries.Where(w => w.Active && w.Category.Active).Select(s => s.ListenAudioId).ToListAsync());
                appMediaIds.AddRange(await _Db.FactFileEntries.Where(w => w.Active && w.Category.Active).Select(s => s.PronounceAudioId).ToListAsync());
                appMediaIds.AddRange(await _Db.QuizQuestions.Where(w => w.Quiz.Active).Select(s => s.AudioId).ToListAsync());

                appMediaIds = appMediaIds.Distinct().ToList();
                
                return Ok(_Db.Media.Where(c => appMediaIds.Contains(c.Id)).Select(s => new
                    {
                        s.Id,
                        s.Size,
                        s.Filename,
                        UpdatedAt = s.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                    }).ToList()
                );;
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving media list: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        /// <summary>
        /// Gets the meta data about the requested media.
        /// </summary>
        [HttpGet("{id:int}")]
        public IActionResult Data(int id)
        {
            try
            {
                return Ok(_Db.Media.Where(c => c.Id == id).Select(s => new
                    {
                        s.Id,
                        s.MediaType.Category,
                        Name = (s as ImageMedia) != null ? (s as ImageMedia).Title : s.Filename,
                        s.Source,
                        show_copyright = s.ShowCopyright, 
                        s.Size,
                        s.Filename,
                        updated_at = s.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                }).FirstOrDefault()
                );
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving media data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}