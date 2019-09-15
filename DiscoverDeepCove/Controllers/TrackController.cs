using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    [Route("/api/app/tracks")]
    public class TrackController : Controller
    {
        private WebsiteDataContext _Db;
        private readonly ILogger<TrackController> _Logger;

        public TrackController(WebsiteDataContext db, ILogger<TrackController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns a list of active tracks
        /// </summary>
        public IActionResult Index()
        {
            try
            {
                return Ok(_Db.Tracks.Where(c => c.Active)
                    .Select(s => new
                    {
                        s.Id,
                        s.Name
                    }).ToList()
                );
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving tracks data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        /// <summary>
        /// Returns the active activities for a given track
        /// </summary>
        /// <param name="id">Track ID</param>
        [HttpGet("{id:int}/activities")]
        public IActionResult Activities(int id)
        {
            try
            {
                var Activities = _Db.Activities.Where(c => c.Track.Id == id && c.Track.Active && c.Active)
                    .Select(s => new
                    {
                        s.Id,
                        s.UpdatedAt
                    }).ToList();

                return Ok(Activities);
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving track activities: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}