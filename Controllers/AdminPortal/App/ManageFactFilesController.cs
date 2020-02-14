using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.DiscoverDeepCove;
using Deepcove_Trust_Website.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers
{
    [Authorize, Area("admin"), Route("/admin/app/factfiles")]
    public class ManageFactFilesController : Controller
    {

        private readonly ILogger<ManageFactFilesController> _Logger;
        private readonly WebsiteDataContext _Db;

        public ManageFactFilesController(ILogger<ManageFactFilesController> logger, WebsiteDataContext db)
        {
            _Logger = logger;
            _Db = db;
        }
        
        [HttpGet]
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/App/FactFiles.cshtml");
        }

        // GET: /admin/app/factfiles/categories
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categoryData = await _Db.FactFileCategories.OrderBy(category => category.Name).Select(category => new
                {
                    category.Id,
                    category.Name,
                    entryCount = category.FactFileEntries.Count,
                    activeCount = category.FactFileEntries.Count(e => e.Active)
                }).ToListAsync();

                return Ok(categoryData);
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving fact file categories", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        // POST: /admin/app/factfiles/categories
        [HttpPost("categories")]
        public async Task<IActionResult> AddCategory(IFormCollection form)
        {
            try
            {
                string categoryName = form.Str("categoryName");

                // Check for existing record by this name
                if (await _Db.FactFileCategories.Where(cat => cat.Name == categoryName).FirstOrDefaultAsync() != null)
                    return BadRequest(new ResponseHelper("A category with this name already exists!"));               

                // Add new record and save
                await _Db.FactFileCategories.AddAsync(new FactFileCategory
                {
                    Name = categoryName,
                    Active = true
                });
                await _Db.SaveChangesAsync();

                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving fact file categories", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        [HttpPatch("categories/{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, IFormCollection form)
        {
            try
            {
                FactFileCategory category = await _Db.FactFileCategories.FindAsync(id);

                if (category == null) return NotFound(new ResponseHelper("Something went wrong. If the problem persists, please contact the developers."));

                string newName = form.Str("name");

                if (string.IsNullOrEmpty(newName)) return BadRequest(new ResponseHelper("The category name must not be null"));

                category.Name = newName;
                await _Db.SaveChangesAsync();

                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating entry name", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        [HttpPatch("entries/toggle/{id:int}")]
        public async Task<IActionResult> ToggleEntry(int id)
        {
            try
            {
                FactFileEntry factFileEntry = await _Db.FactFileEntries.Include(entry => entry.Activities).Where(entry => entry.Id == id).FirstOrDefaultAsync();

                if (factFileEntry == null) return NotFound(new ResponseHelper("Something went wrong. If the problem persists, please contact the developers"));

                if (factFileEntry.Activities.Count > 0)
                {
                    StringBuilder message = new StringBuilder(); ;
                    message.AppendLine("This entry cannot be disabled while it is \n linked to the following guided walk activities:\n");
                    foreach(string title in factFileEntry.Activities.Select(a => a.Title).ToList())
                    {
                        message.AppendLine(title + ", ");
                    }
                    return BadRequest(new ResponseHelper(message.ToString()));
                } 

                factFileEntry.Active = !factFileEntry.Active;
                await _Db.SaveChangesAsync();
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error toggling entry", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }


        }

        [HttpDelete("categories/{id:int}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                FactFileCategory category = await _Db.FactFileCategories
                    .Include(cat => cat.FactFileEntries)
                        .ThenInclude(entry => entry.Activities)
                    .Include(cat => cat.FactFileEntries)
                        .ThenInclude(entry => entry.FactFileEntryImages)
                    .Include(cat => cat.FactFileEntries)
                        .ThenInclude(entry => entry.FactFileNuggets)
                    .Where(cat => cat.Id == id)
                    .FirstOrDefaultAsync();

                if (category == null) return NotFound(new ResponseHelper("Something went wrong. If the problem persists, please contact the developers"));

                if(category.FactFileEntries.Any(entry => entry.Activities.Count > 0))
                {
                    StringBuilder message = new StringBuilder("Unable to delete the category as the following entries are linked to guided walk actvities:\n");
                    foreach(FactFileEntry entry in category.FactFileEntries)
                    {
                        if(entry.Activities.Count > 0)
                        {
                            message.AppendLine(entry.PrimaryName + ", ");
                        }
                    }
                    return BadRequest(new ResponseHelper(message.ToString()));
                }

                // Delete all fact file entry images and nuggets first (can't use cascade delete due to EF Core)
                foreach(FactFileEntry entry in category.FactFileEntries)
                {
                    _Db.RemoveRange(entry.FactFileEntryImages);
                    _Db.RemoveRange(entry.FactFileNuggets);
                }

                _Db.Remove(category);
                await _Db.SaveChangesAsync();

                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error deleting category", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        // GET: /admin/app/factfiles/categories/{categoryId}
        [HttpGet("categories/{id:int}")]
        public async Task<IActionResult> GetCategoryDetails(int id)
        {
            try
            {
                FactFileCategory category = await _Db.FactFileCategories
                    .Include(cat => cat.FactFileEntries)
                        .ThenInclude(entry => entry.MainImage)
                        .Where(cat => cat.Id == id)
                        .FirstOrDefaultAsync();

                if (category == null) return NotFound(new ResponseHelper("Something went wrong, please contact the developers"));

                return Ok(new
                {
                    category.Active,
                    category.Id,
                    category.Name,
                    Entries = category.FactFileEntries.OrderBy(entry => entry.PrimaryName).Select(entry => new
                    {
                        entry.Id,
                        entry.PrimaryName,
                        entry.MainImage.Filename,
                        entry.Active
                    })
                });

            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving category details", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        // GET: /admin/app/factfiles/entries/all;
        [HttpGet("entries/all")]
        public async Task<IActionResult> GetAllEntries()
        {
            List<FactFileEntry> entries = await _Db.FactFileEntries.Where(e => e.Active).ToListAsync();

            return Ok(entries.Select(e => new
            {
                e.Id,
                e.PrimaryName
            }));
        } 

        // GET /admin/app/factfiles/entries/{entryId}
        [HttpGet("entries/{id:int}")]
        public async Task<IActionResult> GetEntryDetails(int id)
        {
            try
            {
                FactFileEntry entry = await _Db.FactFileEntries
                    .Include(e => e.ListenAudio)
                    .Include(e => e.PronounceAudio)
                    .Include(e => e.FactFileEntryImages)
                        .ThenInclude(ei => ei.MediaFile)
                    .Include(e => e.FactFileNuggets)
                        .ThenInclude(n => n.Image)
                    .Where(e => e.Id == id).FirstOrDefaultAsync();

                if (entry == null) return NotFound(new ResponseHelper("Something went wrong, please contact the developers if the problem persists."));

                return Ok(new
                {
                    entry.Active,
                    entry.PrimaryName,
                    entry.AltName,
                    entry.MainImageId,
                    Images = entry.FactFileEntryImages.Select(image => new
                    {
                        image.MediaFile.Id,
                        image.MediaFile.Filename,
                        image.MediaFile.Name,                        
                        isSquare = image.MediaFile.Height == image.MediaFile.Width,
                    }),
                    ListenAudio = entry.ListenAudio != null ? new
                    {
                        entry.ListenAudio.Id,
                        entry.ListenAudio.Name,
                        entry.ListenAudio.Filename,
                        entry.ListenAudio.MediaType
                    } : null,
                    PronounceAudio = entry.PronounceAudio != null ? new
                    {
                        entry.PronounceAudio.Id,
                        entry.PronounceAudio.Name,
                        entry.PronounceAudio.Filename,
                        entry.PronounceAudio.MediaType
                    } : null,
                    Nuggets = entry.FactFileNuggets.OrderBy(nugget => nugget.OrderIndex).Select(nugget => new
                    {
                        nugget.Id,
                        nugget.OrderIndex,
                        nugget.Name,
                        nugget.Text,
                        Image = new
                        {
                            nugget.Image?.Id,
                            nugget.Image?.Filename,
                            nugget.Image?.Name,
                            isSquare = nugget.Image?.Height == nugget.Image?.Width
                        }
                    }),
                    entry.BodyText
                });
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving entry details", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        // PUT: /admin/app/factfiles/entries/{id:int}
        [HttpPut("entries/{id:int}")]
        public async Task<IActionResult> UpdateEntry(int id, IFormCollection form)
        {
            try
            {
                FactFileEntry entryToUpdate = await _Db.FactFileEntries
                    .Include(entry => entry.FactFileEntryImages)
                    .Include(entry => entry.FactFileNuggets)
                    .Where(entry => entry.Id == id)
                    .FirstOrDefaultAsync();

                if (entryToUpdate == null)
                    return NotFound(new ResponseHelper("Something went wrong, please contact the developers if the problem persists."));

                // Validate inputs first
                //
                //
                //

                entryToUpdate.Active = form.Bool("active");

                // Update text fields
                entryToUpdate.PrimaryName = form.Str("primaryName");
                entryToUpdate.AltName = form.Str("altName");
                entryToUpdate.BodyText = form.Str("bodyText");

                // Update media fields
                entryToUpdate.ListenAudioId = form.Int("listenAudioId");
                entryToUpdate.PronounceAudioId = form.Int("pronounceAudioId");

                if (entryToUpdate.ListenAudioId == 0) entryToUpdate.ListenAudioId = null;
                if (entryToUpdate.PronounceAudioId == 0) entryToUpdate.PronounceAudioId = null;

                entryToUpdate.MainImageId = form.Int("mainImageId");

                // Remove and rebuild fact file entry image records
                int[] imageArray = JsonConvert.DeserializeObject<int[]>(form.Str("images"));
                _Db.RemoveRange(entryToUpdate.FactFileEntryImages);
                foreach (int imageId in imageArray)
                {
                    entryToUpdate.FactFileEntryImages.Add(new FactFileEntryImage
                    {
                        FactFileEntryId = entryToUpdate.Id,
                        MediaFileId = imageId
                    });

                }

                // Remove and rebuild fact file nugget records
                FactFileNugget[] updatedNuggets = JsonConvert.DeserializeObject<FactFileNugget[]>(form.Str("nuggets"));
                _Db.RemoveRange(entryToUpdate.FactFileNuggets);
                for (int i = 0; i < updatedNuggets.Length; i++)
                {
                    updatedNuggets[i].OrderIndex = i;
                    entryToUpdate.FactFileNuggets.Add(updatedNuggets[i]);
                }

                await _Db.SaveChangesAsync();

                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error updating entry", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        // POST: /admin/app/factfiles/entries/{id:int}
        [HttpPost("entries/{categoryId:int}")]
        public async Task<IActionResult> AddEntry(int categoryId, IFormCollection form)
        {
            try
            {
                FactFileEntry entryToSave = new FactFileEntry();

                // Validate inputs first
                //
                //
                //

                entryToSave.Active = form.Bool("active");
                entryToSave.CategoryId = categoryId;

                // Update text fields
                entryToSave.PrimaryName = form.Str("primaryName");
                entryToSave.AltName = form.Str("altName");
                entryToSave.BodyText = form.Str("bodyText");

                // Update media fields
                entryToSave.ListenAudioId = form.Int("listenAudioId");
                entryToSave.PronounceAudioId = form.Int("pronounceAudioId");

                if (entryToSave.ListenAudioId == 0) entryToSave.ListenAudioId = null;
                if (entryToSave.PronounceAudioId == 0) entryToSave.PronounceAudioId = null;

                entryToSave.MainImageId = form.Int("mainImageId");

                await _Db.AddAsync(entryToSave);
                await _Db.SaveChangesAsync(); // to generate id

                // Remove and rebuild fact file entry image records
                int[] imageArray = JsonConvert.DeserializeObject<int[]>(form.Str("images"));
                entryToSave.FactFileEntryImages = new List<FactFileEntryImage>();
                foreach (int imageId in imageArray)
                {
                    entryToSave.FactFileEntryImages.Add(new FactFileEntryImage
                    {
                        FactFileEntryId = entryToSave.Id,
                        MediaFileId = imageId
                    });

                }

                // Remove and rebuild fact file nugget records
                FactFileNugget[] updatedNuggets = JsonConvert.DeserializeObject<FactFileNugget[]>(form.Str("nuggets"));
                entryToSave.FactFileNuggets = new List<FactFileNugget>();
                for (int i = 0; i < updatedNuggets.Length; i++)
                {
                    updatedNuggets[i].OrderIndex = i;
                    entryToSave.FactFileNuggets.Add(updatedNuggets[i]);
                }
                
                await _Db.SaveChangesAsync();

                return Ok(entryToSave.Id);
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error saving new entry", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        [HttpDelete("entries/{id:int}")]
        public async Task<IActionResult> DeleteEntry(int id)
        {
            try
            {
                FactFileEntry factFileEntry = await _Db.FactFileEntries.Include(entry => entry.Activities)
                    .Include(entry => entry.FactFileEntryImages)
                    .Include(entry => entry.FactFileNuggets)
                    .Where(entry => entry.Id == id)
                    .FirstOrDefaultAsync();

                if(factFileEntry == null) return NotFound(new ResponseHelper("Something went wrong, please contact the developers if the problem persists."));

                if (factFileEntry.Activities.Count > 0)
                {
                    StringBuilder message = new StringBuilder(); ;
                    message.AppendLine("This entry cannot be deleted while it is \n linked to the following guided walk activities:\n");
                    foreach (string title in factFileEntry.Activities.Select(a => a.Title).ToList())
                    {
                        message.AppendLine(title + ", ");
                    }
                    return BadRequest(new ResponseHelper(message.ToString()));
                }

                _Db.RemoveRange(factFileEntry.FactFileEntryImages);
                _Db.RemoveRange(factFileEntry.FactFileNuggets);
                _Db.Remove(factFileEntry);
                await _Db.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error deleting entry", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }
    }    
}
