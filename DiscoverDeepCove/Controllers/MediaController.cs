using System;
using System.Linq;
using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.DiscoverDeepCove.Controllers
{
    [Route("/api/app/quizzes")]
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
        public IActionResult Index()
        {
            try
            {//TODO: Return only media used in the verious areas of the app.
                return Ok(_Db.Media.Where(c => c.IsPublic).Select(s => new
                    {
                        s.Id,
                        s.MediaType,
                        s.Size,
                        s.UpdatedAt
                    }).ToList()
                );
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving media list: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        /// <summary>
        /// Gets the meta data about the requested media
        /// </summary>
        /// <param name="Ids">Space seperated URL query example <code>?ids=20 21 545</code></param>
        /// <returns></returns>
        [HttpGet("data")]
        public IActionResult Data(string Ids)
        {
            try
            {
                int[] MediaIds = Array.ConvertAll(Ids.Replace("%20", " ").Split(' '),
                    s => int.Parse(s)
                );

                return Ok(_Db.Media.Where(c => MediaIds.Contains(c.Id)).Select(s => new
                    {
                        s.Id,
                        s.MediaType,
                        s.Name,
                        s.Size,
                        s.Filename,
                        s.FilePath,
                        s.UpdatedAt
                    }).ToList()
                );
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving media data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        [HttpPost("")]
        public IActionResult Download(IFormCollection request)
        {
            // Get an array of image ints from the body "ids". Then return a zip of those files??
            throw new NotImplementedException();
        }
    }
}