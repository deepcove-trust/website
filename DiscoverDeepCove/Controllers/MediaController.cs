using System;
using System.Linq;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult Index()
        {
            try
            {//TODO: Return only media used in the verious areas of the app.
                return Ok(_Db.Media.Where(c => c.IsPublic).Select(s => new
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
                        Title = (s as ImageMedia) != null ? (s as ImageMedia).Title : s.Filename,
                        Source = "Source here", 
                        Show_Copyright = false, 
                        s.Size,
                        s.Filename,
                        Updated_At = s.UpdatedAt
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