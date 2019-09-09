using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.Web
{
    [Route("/media")]
    public class ImageController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<ImageController> _Logger;

        public ImageController(WebsiteDataContext db, ILogger<ImageController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        /// <summary>
        /// Returns the requested file, if the file is public, or otherwise if the user is authenticated. 
        /// 
        /// If the file is an image, and a width is provided, the controller will return the 
        /// most appropriate image size for the width.
        /// 
        /// If no size is provided, the controller will return the largest available size.
        /// 
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Index(string filename, int width = 0)
        {
            try
            {
                if (string.IsNullOrEmpty(filename)) return NotFound("No filename provided");

                BaseMedia file = await _Db.Media
                    .Where(m => (User.Identity.IsAuthenticated || m.IsPublic) && m.Filename == filename)
                    .FirstOrDefaultAsync();

                if (file == null) return NotFound("No file exists for the supplied filename");

                // Return file if not image
                if (file.GetCategory() != MediaCategory.Image)
                {
                    return File(file.Path, file.MediaType.Mime);
                }
                else
                {
                    ImageMedia imageFile = (ImageMedia)file;
                    // Return the appropriate image 
                    return File(imageFile.GetImagePath(width), imageFile.MediaType.Mime);
                }
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving file: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}
