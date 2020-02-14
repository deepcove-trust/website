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
using System.ComponentModel.DataAnnotations;

namespace Deepcove_Trust_Website.Controllers
{
    public class ActivityArgs : IValidatableObject
    {
        [Required]
        public ActivityType ActivityType { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public string Task { get; set; }
        public int? FactFileId { get; set; }
        public int? ImageId { get; set; }
        public int[] Images { get; set; }
        [Required]
        public double CoordX { get; set; }
        [Required]
        public double CoordY { get; set; }
        [Required]
        public string QrCode { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            // Different activity types require different validation logic

            if(ActivityType == ActivityType.informational)
            {
                if (FactFileId == null) yield return new ValidationResult("You must select a fact file to link to this activity.", new string[] { "FactFileId" });
            } else
            {
                if (string.IsNullOrEmpty(Description) && string.IsNullOrEmpty(Task))
                    yield return new ValidationResult("You must provide at least one of: Description, Task", new string[] { "Description" });
            }

            if(ActivityType == ActivityType.pictureTapActivity)
            {
                if (ImageId == null) yield return new ValidationResult("You must provide an image.", new string[] { "ImageId" });
            }

            if(ActivityType == ActivityType.pictureSelectActivity)
            {
                // Note - using to hashset means we can detect if the same image has been selected more than once.
                if (Images.ToHashSet().Count != 3) yield return new ValidationResult("You must provide three image options", new string[] { "Images" });
            }
        }
    }

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

        // GET: /admin/app/tracks/{trackId:int}/activities/{activityId:int}
        [HttpGet("{trackId:int}/activities/{activityId:int}")]
        public async Task<IActionResult> GetActivityDetails(int trackId, int activityId)
        {
            Activity activity = await _Db.Activities
                .Include(a => a.Image)
                .Include(a => a.FactFile)
                .Include(a => a.ActivityImages)
                    .ThenInclude(i => i.Image)
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
                ActivityType = (int)activity.ActivityType,
                activity.Active,
                activity.Description,
                activity.Task,
                activity.Title,
                Image = activity.Image != null ? new
                {
                    activity.Image.Id,
                    activity.Image.Filename
                } : null,
                Images = activity.ActivityImages.Select(image => new
                {
                    Id = image.ImageId,
                    image.Image.Filename
                }),
                activity.QrCode,
                activity.CoordX,
                activity.CoordY
            });
        }

        // GET: /admin/app/tracks/validate-qr
        [HttpGet("validate-qr")]
        public async Task<IActionResult> ValidateQR(string qrCode, int excludeId = 0) => Ok(await IsValidQrCode(qrCode, excludeId));

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

        // POST: /admin/app/tracks/{trackId: int}/activities
        [HttpPost("{trackId:int}/activities")]
        public async Task<IActionResult> AddBlankActivity(double lng, double lat, int trackId)
        {
            if (lng == 0 || lat == 0) return BadRequest(new ResponseHelper("Something went wrong. Please refresh the page and try again", "Server requires lat and lng values"));

            Activity activity = new Activity
            {
                TrackId = trackId,
                ActivityType = ActivityType.textAnswerActivity,
                Title = "New Activity",
                Description = "New Activity Description",
                Active = false,
                CoordX = lng,
                CoordY = lat
            };

            await _Db.AddAsync(activity);
            await _Db.SaveChangesAsync();

            return Ok(activity.Id);
        }

        // PATCH /admin/app/tracks/{trackId:int}/activities/{activityId:int}/toggle
        [HttpPatch("{trackId:int}/activities/{activityId:int}/toggle")]
        public async Task<IActionResult> ToggleActivity(int activityId)
        {
            Activity activity = await _Db.Activities.FindAsync(activityId);

            if(activity == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh the page and try again.", "Could not find activity in database"));

            activity.Active = !activity.Active;

            await _Db.SaveChangesAsync();

            return Ok(activity.Active);
        }

        // PATCH: /admin/app/tracks/{trackId:int}/activities/{activityId:int}/position
        [HttpPatch("{trackId:int}/activities/{activityId:int}/position")]
        public async Task<IActionResult> UpdateActivityPostion(int activityId, double lng, double lat)
        {
            if(lng == 0 || lat == 0) return BadRequest(new ResponseHelper("Something went wrong. Please refresh the page and try again", "Server requires lat and lng values"));

            Activity activity = await _Db.Activities.FindAsync(activityId);

            if (activity == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh the page and try again.", "Could not find activity in database"));

            activity.CoordX = lng;
            activity.CoordY = lat;

            await _Db.SaveChangesAsync();

            return Ok();
        }

        // PUT: /admin/app/tracks/{trackId:int}/activities/{activityId:int}
        [HttpPut("{trackId:int}/activities/{activityId:int}")]
        public async Task<IActionResult> UpdateActivity(int activityId, [FromBody]ActivityArgs activityArgs)
        {
            // Check validation status - see ActivityArgs class for validation logic
            if (!ModelState.IsValid) return new BadRequestObjectResult(ModelState);

            // Check that QR code is not in use elsewhere
            if (!(await IsValidQrCode(activityArgs.QrCode, activityId)))            
                return BadRequest(new ResponseHelper("QR code already in use."));            

            // Use a transaction to avoid losing data if an exception is thrown
            using(var transaction = await _Db.Database.BeginTransactionAsync())
            {
                // Retrieve existing activity - confirm its existence
                Activity oldActivity = await _Db.Activities.Include(a => a.ActivityImages).Where(a => a.Id == activityId).FirstOrDefaultAsync();
                if(oldActivity == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh the page and try again.", "Could not find activity in database"));
                               
                oldActivity.TrackId = oldActivity.TrackId;
                oldActivity.Title = activityArgs.Title;
                oldActivity.Active = oldActivity.Active;
                oldActivity.ActivityType = activityArgs.ActivityType;
                oldActivity.FactFileId = activityArgs.FactFileId;
                oldActivity.Description = activityArgs.Description;
                oldActivity.Task = activityArgs.Task;
                oldActivity.ImageId = activityArgs.ImageId;
                oldActivity.CoordX = activityArgs.CoordX;
                oldActivity.CoordY = activityArgs.CoordY;
                oldActivity.QrCode = activityArgs.QrCode;

                // Save new activity to generate ID
                _Db.Update(oldActivity);
                await _Db.SaveChangesAsync();

                // Remove old activity images
                _Db.RemoveRange(oldActivity.ActivityImages);

                // Add pivot table records for activity images
                _Db.AddRange(activityArgs.Images.Select(imageId => new ActivityImage
                {
                    ImageId = imageId,
                    ActivityId = oldActivity.Id
                }));

                // Save pivot table records
                await _Db.SaveChangesAsync();

                // All database queries complete, commit the transaction
                transaction.Commit();
            }

            return Ok();
        }

        // PATCH: /admin/app/tracks/{trackId:int}/toggle
        [HttpPatch("{trackId:int}/toggle")]
        public async Task<IActionResult> ToggleTrack(int trackId)
        {
            Track track = await _Db.Tracks.FindAsync(trackId);

            if(track == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh the page and try again.", "Could not find track in database"));

            track.Active = !track.Active;
            await _Db.SaveChangesAsync();

            return Ok(track.Active);
        }

        // DELETE: /admin/app/tracks/{trackId:int}
        [HttpDelete("{trackId:int}")]
        public async Task<IActionResult> DeleteTrack(int trackId)
        {
            Track track = await _Db.Tracks.Include(t => t.Activities).ThenInclude(a => a.ActivityImages).Where(t => t.Id == trackId).FirstOrDefaultAsync();

            if(track == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh the page and try again.", "Could not find track in database"));

            //using(var transaction = await _Db.Database.BeginTransactionAsync())
            //{
                foreach(Activity activity in track.Activities)
                {
                    _Db.RemoveRange(activity.ActivityImages);
                    _Db.Remove(activity);
                }

                _Db.Remove(track);
                await _Db.SaveChangesAsync();

            //    transaction.Commit();
            //}

            return Ok();
        }

        // DELETE: /admin/app/track/{trackId:int}/activities/{activityId:int}
        [HttpDelete("{trackId:int}/activities/{activityId:int}")]
        public async Task<IActionResult> DeleteActivity(int activityId)
        {
            Activity activity = await _Db.Activities.Include(a => a.ActivityImages).Where(a => a.Id == activityId).FirstOrDefaultAsync();

            if(activity == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh the page and try again.", "Could not find activity in database"));

            //using (var transaction = await _Db.Database.BeginTransactionAsync())
            //{
                _Db.RemoveRange(activity.ActivityImages);
                _Db.Remove(activity);

                await _Db.SaveChangesAsync();
                //transaction.Commit();
            //}

            return Ok();
        }

        private async Task<bool> IsValidQrCode(string code, int excludeId = 0)
        {
            return await _Db.Activities.Where(a => a.QrCode == code && a.Id != excludeId).CountAsync() == 0;
        }
    }
}
