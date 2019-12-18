using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
    }
}