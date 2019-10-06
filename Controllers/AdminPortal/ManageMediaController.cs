using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NAudio.Wave;

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
                media.Filename,
                Alt = media is ImageMedia ? ((ImageMedia)media).Alt : null
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
                        showCopyright = mediaFile.ShowCopyright,
                        info = mediaFile.Source
                    },
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

                string fileType = request.Str("fileType");

                // Determine what type of file has been uploaded and act accordingly (may want to refactor these)

                // FOR IMAGES
                if (MediaType.MimesForCategory(MediaCategory.Image).Contains(fileType))
                {
                    string filepath = Path.Combine("Storage", "Media", "Images", filename);

                    // Save image and all associated versions of it.
                    var filedata = ImageUtils.SaveImage(request.Str("file")
                        .Split(',')[1], filepath , cropData);

                    // Create database record to track images
                    ImageMedia dbImageMedia = new ImageMedia {
                        Name = Path.GetFileNameWithoutExtension(uploadedName),
                        MediaType =  MediaType.FromString(fileType),
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

                // FOR AUDIO
                else if(MediaType.MimesForCategory(MediaCategory.Audio).Contains(fileType))
                {
                    string filepath = Path.Combine("Storage", "Media", "Audio", filename);

                    // Save the audio file
                    byte[] bytes = request.Str("file").Split(',')[1].DecodeBase64Bytes();
                    System.IO.File.WriteAllBytes(filepath, bytes);

                    // Read the audio file to determine its duration - it will either be mp3(mpeg) or wav

                    WaveStream audioReader;

                    if (fileType == MediaType.Wav.Mime)
                        audioReader = new WaveFileReader(filepath);                    
                    else                    
                        audioReader = new Mp3FileReader(filepath);

                    // Create the media database record
                    AudioMedia audioMedia = new AudioMedia
                    {
                        Name = Path.GetFileNameWithoutExtension(uploadedName),
                        MediaType = MediaType.FromString(fileType),
                        FilePath = filepath,
                        Size = new FileInfo(filepath).Length,
                        Duration = Math.Round(audioReader.TotalTime.TotalSeconds)
                    };

                    await _Db.AddAsync(audioMedia);
                }

                // FOR GENERAL
                else if (MediaType.MimesForCategory(MediaCategory.General).Contains(fileType))
                {
                    string filepath = Path.Combine("Storage", "Media", "Documents", filename);

                    // Save the file
                    byte[] bytes = request.Str("file").Split(',')[1].DecodeBase64Bytes();
                    System.IO.File.WriteAllBytes(filepath, bytes);

                    // Create the media database record
                    GeneralMedia generalMedia = new GeneralMedia
                    {
                        Name = Path.GetFileNameWithoutExtension(uploadedName),
                        MediaType = MediaType.FromString(fileType),
                        FilePath = filepath,
                        Size = new FileInfo(filepath).Length,                        
                    };

                    await _Db.AddAsync(generalMedia);
                }

                else
                {
                    return new UnsupportedMediaTypeResult();
                }

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
                media.Source = request.Str("source");
                media.ShowCopyright = request.Bool("showCopyright");

                // If file is an image, we can also set the title and alt-text                
                if (media is ImageMedia)
                {
                    (media as ImageMedia).Title = request.Str("title");
                    (media as ImageMedia).Alt = request.Str("alt");
                }

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
                Dictionary<string, HashSet<int>> usages = media.GetUsages(_Db);

                // If the usages dictionary has keys, file is used
                if(usages.Count > 0)
                {
                    return new StatusCodeResult(406);   // Not Acceptable Status Code                 
                }

                // Otherwise, we can go ahead and delete

                if (media is ImageMedia)
                {
                    // Delete the directory containing image versions
                    string dirPath = Path.Combine("Storage", "Media", "Images", Path.GetFileNameWithoutExtension(media.Filename));
                    try
                    {
                        Directory.Delete(dirPath, recursive: true);
                    }
                    catch(DirectoryNotFoundException)
                    {
                        _Logger.LogWarning("While deleting image {0}: Version directory not found. Continuing.", id);
                    }
                }

                // Finally, delete the media file itself
                System.IO.File.Delete(media.FilePath);

                // And remove its record in the database
                _Db.Remove(media);
                await _Db.SaveChangesAsync();

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