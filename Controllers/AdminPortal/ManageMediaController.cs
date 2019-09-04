using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Deepcove_Trust_Website.Models.ArgumentModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/admin/media")]
    public class ManageMediaController : Controller
    {
        private WebsiteDataContext _Db;
        private ILogger<ManageMediaController> _Logger;

        public ManageMediaController(WebsiteDataContext Db, ILogger<ManageMediaController> Logger)
        {
            _Db = Db;
            _Logger = Logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/ManageMedia.cshtml");
        }

        /// <summary>
        /// Returns data for all media files stored in the database.
        /// </summary>        
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _Db.Media.Select(media => new
            {
                media.Id,
                media.IsPublic,
                media.MediaType,
                media.Name,
                media.Size,
                media.CreatedAt,
                thumbnail = media.GetType() == typeof(ImageMedia) ?
                    ((ImageMedia)media).Filenames["thumbnail"]
                : null
            }).ToListAsync());
        }

        /// <summary>
        /// Saves the uploaded file, records its presence in the database, and 
        /// saves smaller copies if the file is an image.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file, IFormCollection request)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Updates non-calculated metadata for a given media file.
        /// </summary>
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> Update(int id, IFormCollection request)
        {
            try
            {
                BaseMedia media = await _Db.Media.FindAsync(id);

                if (media == null)
                    return NotFound("The requested media file does not exist.");

                // All types of media have a name, so we can update that
                media.Name = request.Str("name");

                // If file is an image, we can also set the title and alt-text
                ImageMedia image = media as ImageMedia;
                if (image != null)
                {
                    image.Title = request.Str("title");
                    image.Alt = request.Str("alt");
                    await _Db.AddAsync(image);
                }
                else await _Db.AddAsync(media);

                // Save changes
                await _Db.SaveChangesAsync();

                _Logger.LogDebug("Metadata updated for media file {0}", id);

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error updating metadata for media file {0}: {1}", id, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }

        }

        /// <summary> 
        /// Hard deletes a media file. If the file is an image, all versions of the image will
        /// also be deleted. The file cannot be deleted if it is in use in the website or the 
        /// mobile app.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                BaseMedia media = await _Db.Media.FindAsync(id);

                if (media == null)
                    return NotFound("The requested media file does not exist.");

                // Todo: Check whether the media file is being used in the website or app
                // and prevent deletion if so.

                if (media.GetType() == typeof(ImageMedia))
                {
                    ImageMedia image = (ImageMedia)media;

                    // Delete all versions of the image
                    foreach (KeyValuePair<string, string> version in image.Filenames)
                    {
                        // Delete the file with the filename 'version.value', if it exists                                            
                    }
                }

                // Finally, delete the media file itself


                // And remove its record in the database
                _Db.Remove(media);

                _Logger.LogDebug("Media file {0} deleted", id);

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error deleting media file {0}: {1}", id, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        [HttpPatch("{id:int}/crop")]
        public async Task<IActionResult> Crop(int id, CropArguments args)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid arguments provided to crop image.");

                BaseMedia media = await _Db.Media.FindAsync(id);
                if (media == null)
                    return NotFound("The requested media file does not exist.");

                ImageMedia oldImage = media as ImageMedia;
                if (oldImage == null)
                    return BadRequest("Unable to crop non-image media file.");


                // Call the code that crops the image

                ImageMedia newImage = new ImageMedia
                {
                    Title = oldImage.Title,
                    Alt = oldImage.Alt,
                    Name = oldImage.Name + "_cropped",
                    // other values provided by cropping code
                };

                await _Db.AddAsync(newImage);

                await _Db.SaveChangesAsync();                

                _Logger.LogDebug("Media file {0} cropped - new file ID is {1}", id, newImage.Id);

                return Ok(newImage.Id); // Todo: may want to pass back something else here
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error cropping media file {0}: {1}", id, ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }        
    }
}