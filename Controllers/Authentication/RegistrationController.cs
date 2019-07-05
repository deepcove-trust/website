using System;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Deepcove_Trust_Website.Controllers.Authentication
{
    [Authorize]
    [Route("/register")]
    public class RegistrationController : Controller
    {
        private readonly Data.WebsiteDataContext _Db;
        private PasswordHasher<Account> _Hasher;

        public RegistrationController(Data.WebsiteDataContext db)
        {
            _Db = db;
            _Hasher = new PasswordHasher<Account>();
        }

        [HttpGet]
        public IActionResult Index()
        {
            // Redirect authenticated users
            // to the dashboard
            if (User.Identity.IsAuthenticated)
                return Redirect("/admin-portal");

            return View(viewName: "~/Views/Authentication/Register.cshtml");
        }

        [HttpPost]
        public async Task<IActionResult> Index(IFormCollection request)
        {
            Account account = await _Db.Accounts.Where(c => c.Email == request.Str("email")).FirstOrDefaultAsync();
            if(account != null)
                return BadRequest("An account with that email address already exists");

            try
            {
                account = new Account
                {
                    Email = request.Str("email"),
                    Name = request.Str("name"),
                    Active = true,
                };

                account.Password = _Hasher.HashPassword(account, Utils.RandomString(30));

                await _Db.AddAsync(account);
                await _Db.SaveChangesAsync();

                return Ok();
            } 
            catch(Exception ex)
            {
                //Todo log ex
                Console.WriteLine(ex.Message);
                return BadRequest("Something went wrong, please try again later");
            }
            
        }
    }
}