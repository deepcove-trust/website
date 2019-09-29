using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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
        [HttpGet("data")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _Db.Media.Select(media => new
            {
                media.Id,
                media.MediaType,
                media.Name,
                media.Filename
            }).ToListAsync());
        }

        [HttpGet("data/{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            try
            {
                BaseMedia mediaFile = await _Db.Media.FindAsync(id);
                ImageMedia imageFile = mediaFile as ImageMedia;
                AudioMedia audioFile = mediaFile as AudioMedia;
                if (mediaFile == null) return NotFound("No file exists for the supplied ID");

                return Ok(new
                {
                    mediaFile.Id,
                    mediaFile.Name,
                    mediaFile.FilePath,
                    mediaFile.Size,
                    mediaFile.MediaType,
                    Source = new {
                        mediaFile.ShowCopyright,
                        info = mediaFile.Source
                    },
                    mediaFile.ShowCopyright,
                    height = imageFile?.Height,
                    width = imageFile?.Width,
                    versions = imageFile?.Versions,
                    title = imageFile?.Title,
                    alt = imageFile?.Alt,
                    duration = audioFile?.Duration,
                    tags = mediaFile.Tags()
                });

            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving file data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }

        }

        /// <summary>
        /// Saves the uploaded file, records its presence in the database, and 
        /// saves smaller copies if the file is an image.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection request)
        {
            try
            {
                // Create required directories if not existing
                EnsureInit();

                // Deserialize cropping data if applicable
                CropData cropData = null;
                if (request.Str("cropData") != null)
                    cropData = JsonConvert.DeserializeObject<CropData>(request.Str("cropData"));


                // Original filename
                string uploadedName = request.Str("filename");

                // Generate a backend filename for the uploaded file - same extension as uploaded file.
                string filename = Guid.NewGuid().ToString() + Path.GetExtension(uploadedName);
                string filepath = Path.Combine("Storage", "Media", "Images", filename);             

                string fileType = request.Str("fileType");

                // Determine what type of file has been uploaded and act accordingly (may want to refactor these)

                if (new[] { "image/jpg", "image/jpeg", "image/png" }.Contains(fileType))
                {
                    // Save image and all associated versions of it.
                    var filedata = ImageUtils.SaveImage(request.Str("file")
                        .Split(',')[1], filepath , cropData);

                    // Create database record to track images
                    ImageMedia dbImageMedia = new ImageMedia {
                        Name = Path.GetFileNameWithoutExtension(uploadedName),
                        MediaType =  MediaType.FromString(request.Str("fileType")),
                        FilePath = filepath,
                        Size = filedata["size"],
                        Title = request.Str("title"),
                        Alt = request.Str("alt"),
                        Width = filedata["width"],
                        Height = filedata["height"],
                        Versions = filedata["versions"]
                    };

                    await _Db.AddAsync(dbImageMedia);                    


                }

                // Todo: Implement saves for non images


                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error uploading file: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
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

                    // Now delete
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
        public async Task<IActionResult> Crop(int id, CropData args)
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

                // Generate new GUID
                string filename = Guid.NewGuid().ToString() + Path.GetExtension(oldImage.Filename);

                // Save the file again, passing in crop data                
                ImageUtils.SaveImage(await System.IO.File.ReadAllBytesAsync(oldImage.FilePath), Path.Combine("Storage", "Media", "Images", filename), args);

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

        /// <summary>
        /// Ensure that the directories required for media storage exist.
        /// </summary>
        private void EnsureInit()
        {
            List<string> folders = new List<string> { "Images", "Audio", "Documents" };

            foreach (string folder in folders)
                Directory.CreateDirectory(Path.Join("Storage", "Media", folder));
        }
    }
}