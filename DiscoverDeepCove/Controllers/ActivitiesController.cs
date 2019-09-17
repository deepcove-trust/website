using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    [Route("/api/app/activities")]
    public class ActivitiesController : Controller
    {
        private WebsiteDataContext _Db;
        private ILogger<ActivitiesController> _Logger;

        public ActivitiesController(WebsiteDataContext db,  ILogger<ActivitiesController> logger)
        {
            _Db = db;
            _Logger = logger;
        }


        public IActionResult Index()
        {
            try
            {
                return Ok(_Db.Activities.Where(c => c.Active)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.UpdatedAt
                }).ToList());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving fact file entries list: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        [HttpGet("{id:int}")]
        public IActionResult Activity(int id)
        {
            try
            {
                var Activity = _Db.Activities.Where(c => c.Id == id && c.Active)
                    .Select(s => new
                    {
                        s.Id,
                        s.Title,
                        s.Description,
                        s.ActivityType,
                        Image_Id = s.Image.Id,                        

                        s.CoordX,
                        s.CoordY,
                        s.QrCode,
                        Track = s.Track.Id,

                        s.Task,
                        Activity_Images_Id = s.ActivityImages.Select(s1 => s1.Image.Id).ToList(),
                        Fact_File_Id = s.FactFile.Id,
                        
                        s.UpdatedAt
                    }).FirstOrDefault();

                if (Activity == null) return NotFound();

                return Ok(Activity);
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving fact file entry data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}