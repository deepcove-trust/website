using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Controllers.AdminPortal
{
    [Authorize, Area("admin"), Route("admin")]
    public class DashboardController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/Dashboard.cshtml");
        }
    }
}
