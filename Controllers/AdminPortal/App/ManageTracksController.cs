using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Configuration;
using Deepcove_Trust_Website.DiscoverDeepCove;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using static Deepcove_Trust_Website.Helpers.Utils;
using Microsoft.AspNetCore.Http;
using Deepcove_Trust_Website.Helpers;

namespace Deepcove_Trust_Website.Controllers
{
    [Authorize, Area("admin"), Route("admin/app/tracks")]
    public class ManageTracksController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly IConfiguration _Config;
        
        public ManageTracksController(WebsiteDataContext db, IConfiguration config)
        {
            _Db = db;
            _Config = config;
        }

        // GET: /admin/app/tracks
        public IActionResult Index()
        {
            // Send the mapbox public access token to the view
            ViewBag.MapBoxToken = _Config["MapBoxToken"];
            return View(viewName: "~/Views/AdminPortal/App/Tracks.cshtml");
        }

        // GET: /admin/app/tracks/data
        [HttpGet("data")]
        public async Task<IActionResult> GetTracks()
        {
            List<Track> tracks = await _Db.Tracks.Include(t => t.Activities).ToListAsync();

            return Ok(tracks.Select(track => new
            {
                track.Id,
                track.Name,
                track.Active,
                ActivityCount = track.Activities.Where(a => a.Active).ToList().Count,                
                DisabledCount = track.Activities.Where(a => !a.Active).ToList().Count
            }));
        }

        // GET: /admin/app/tracks/{trackId:int}
        [HttpGet("{trackId:int}")]
        public async Task<IActionResult> GetTrackDetails(int trackId)
        {
            Track track = await _Db.Tracks.Include(t => t.Activities).Where(t => t.Id == trackId).FirstOrDefaultAsync();

            if (track == null) return NotFound(new ResponseHelper
                ("Something went wrong. Please refresh the page and contact a developer if the problem persist.",
                "Unable to find database record for this track."));

            return Ok(new
            {
                track.Id,
                track.Name,
                track.Active,
                boundingBox = track.GetBoundingBox(_Db),
                Activities = track.Activities.Select(activity => new
                {
                    activity.Id,
                    activity.ActivityType,
                    activity.Active,
                    activity.Title,
                    activity.CoordX,
                    activity.CoordY
                })
            });
        }

        // GET: /admin/app/tracks/{trackId:int}/{activityId:int}
        [HttpGet("{trackId:int}/{activityId:int}")]
        public async Task<IActionResult> GetActivityDetails(int trackId, int activityId)
        {
            Activity activity = await _Db.Activities
                .Include(a => a.Image)
                .Include(a => a.FactFile)
                .Include(a => a.ActivityImages)
                .Where(a => a.Id == activityId)
                .FirstOrDefaultAsync();

            if(activity == null) return NotFound(new ResponseHelper
                ("Something went wrong. Please refresh the page and contact a developer if the problem persist.",
                "Unable to find database record for this activity."));

            return Ok(new
            {
                activity.Id,
                FactFile = activity.FactFile != null ? new
                {
                    activity.FactFile.Id,
                    activity.FactFile.PrimaryName
                } : null,
                activity.ActivityType,
                activity.Active,
                activity.Description,
                activity.Task,
                activity.Title,
                activity.QrCode,
                activity.CoordX,
                activity.CoordY
            });
        }

        // POST: /admin/app/tracks
        [HttpPost]
        public async Task<IActionResult> AddTrack(string name)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest(new ResponseHelper("You must provide a track name."));

            Track track = new Track
            {
                Name = name,
                Active = false
            };

            await _Db.AddAsync(track);
            await _Db.SaveChangesAsync();

            return Ok(track.Id);
        }

        // PATCH: /admin/app/tracks/{id:int}
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> UpdateTrackName(int id, string name)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest(new ResponseHelper("You must provide a track name."));

            Track track = await _Db.Tracks.FindAsync(id);

            if (track == null) return NotFound(new ResponseHelper("Something went wrong, please refesh the page and try again.", "Could not find track in database."));

            track.Name = name;

            await _Db.SaveChangesAsync();

            return Ok();
        }
    }
}
