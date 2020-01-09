using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.DiscoverDeepCove;
using Deepcove_Trust_Website.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.App
{
    [Authorize]
    [Area("admin-portal,app")]
    [Route("/admin/app/factfiles")]
    public class ManageFactFilesController : Controller
    {

        private readonly ILogger<ManageFactFilesController> _Logger;
        private readonly WebsiteDataContext _Db;

        public ManageFactFilesController(ILogger<ManageFactFilesController> logger, WebsiteDataContext db)
        {
            _Logger = logger;
            _Db = db;
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
                    entryCount = category.FactFileEntries.Count
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

        // GET: /admin/app/factfiles/categories/{categoryId}
        [HttpGet("categories/{id:int}")]
        public async Task<IActionResult> GetCategoryDetails(int id)
        {
            try
            {
                FactFileCategory category = await _Db.FactFileCategories.Include(cat => cat.FactFileEntries).Where(cat => cat.Id == id).FirstOrDefaultAsync();

                if (category == null) return NotFound(new ResponseHelper("Something went wrong, please contact the developers"));

                return Ok(new
                {
                    category.Id,
                    category.Name,
                    Entries = category.FactFileEntries.OrderBy(entry => entry.PrimaryName).Select(entry => new
                    {
                        entry.Id,
                        entry.PrimaryName,
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

        // GET /admin/app/factfiles/entries/{entryId}
        [HttpGet("entries/{id:int}")]
        public async Task<IActionResult> GetEntryDetails(int id)
        {
            FactFileEntry entry = await _Db.FactFileEntries
                .Include(e => e.ListenAudio)
                .Include(e => e.PronounceAudio)
                .Include(e => e.FactFileEntryImages)
                    .ThenInclude(ei => ei.MediaFile)
                .Include(e => e.FactFileNuggets)
                    .ThenInclude(n => n.Image)
                .Where(e => e.Id == id).FirstOrDefaultAsync();

            if(entry == null) return NotFound(new ResponseHelper("Something went wrong, please contact the developers"));

            return Ok(new
            {
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
                ListenAudio = new
                {
                    entry.ListenAudio?.Id,
                    entry.ListenAudio?.Name
                },
                PronounceAudio = new
                {
                    entry.PronounceAudio?.Id,
                    entry.PronounceAudio?.Name
                },
                Nuggets = entry.FactFileNuggets.Select(nugget => new
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
    }
}
