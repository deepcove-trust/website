using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Deepcove_Trust_Website.Features.Emails;
using Microsoft.EntityFrameworkCore;
using Deepcove_Trust_Website.Helpers;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize]
    [Area("admin-portal")]
    [Route("/admin-portal/users")]
    public class UsersController : Controller
    {
        private readonly Data.WebsiteDataContext _Db;
        private readonly IEmailService _Smtp;

        public UsersController(Data.WebsiteDataContext db, IEmailService smtp)
        {
            _Db = db;
            _Smtp = smtp;
        }

        [HttpGet]
        public IActionResult Index()
        {

            return View(viewName: "~/Views/AdminPortal/Users.cshtml");
        }

        [HttpGet("data")]
        public async Task<IActionResult> Data()
        {
            try
            {
                return Ok(
                await _Db.Accounts.OrderBy(o => o.Name).Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Email,
                    s.PhoneNumber,
                    s.Active,
                    timestamps = new { signup = Utils.PrettyDate(s.CreatedAt), lastLogin = Utils.DiffForHumans(s.LastLogin) }
                }).ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }
    }
}