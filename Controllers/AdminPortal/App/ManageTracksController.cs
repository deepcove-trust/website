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
        public async Task<IActionResult> GetTracks()
        {
            List<Track> tracks = await _Db.Tracks.Include(t => t.Activities).ToListAsync();

            return Ok(tracks.Select(track => new
            {
                track.Id,
                track.Name,
                track.Active,
                ActivityCount = track.Activities.Where(a => a.Active).ToList().Count,                
            }));
        }

        // GET: /admin/app/tracks/{trackId:int}
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
    }
}
