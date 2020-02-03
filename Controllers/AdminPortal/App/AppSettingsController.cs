using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Deepcove_Trust_Website.Controllers
{
    [Authorize, Area("admin"), Route("admin/app/settings")]
    public class AppSettingsController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/App/Settings.cshtml");
        }
    }
}
