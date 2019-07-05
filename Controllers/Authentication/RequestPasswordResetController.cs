using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Route("/reset-password")]
    public class RequestPasswordResetController : Controller
    {
        private readonly Data.WebsiteDataContext _Db;
        private readonly IConfiguration _Configuration;

        public RequestPasswordResetController(Data.WebsiteDataContext db, IConfiguration configuration)
        {
            _Db = db;
            _Configuration = configuration;
        }

        [HttpGet]
        public IActionResult Index()
        {
            // Redirect authenticated users
            // to the dashboard
            if (User.Identity.IsAuthenticated)
                return Redirect("/admin-portal");

            return View(viewName: "~/Views/Authentication/RequestPasswordReset.cshtml");
        }

        public async Task<IActionResult> Index(IFormCollection request)
        {
            try
            {
                Account account = await _Db.Accounts.Where(c => c.Email == request.Str("email")).FirstOrDefaultAsync();
                if (account != null)
                {
                    PasswordReset reset = new PasswordReset
                    {
                        Account = account,
                        Token = Utils.RandomString(20),
                        ExpiresAt = DateTime.UtcNow.AddMinutes(_Configuration.GetValue<int>("PasswordRestTokenLength"))
                    };

                    await _Db.AddAsync(reset);
                    await _Db.SaveChangesAsync();

                    // Fire Email Async without await
                    //make use of reset.Token
                }

                return Ok();
            }
            catch (Exception ex)
            {
                // Log ex
                Console.WriteLine(ex.Message);
                return BadRequest("Something went wrong, please try again later");
            }
        }
    }
}