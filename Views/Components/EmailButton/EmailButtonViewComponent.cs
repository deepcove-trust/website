using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Deepcove_Trust_Website.Views
{
    public class EmailButtonModel
    {
        public string Href { get; set; }
        public string LinkText { get; set; }
    }

    public class EmailButtonViewComponent : ViewComponent
    {
        public EmailButtonViewComponent()
        {

        }
        
        public IViewComponentResult Invoke(EmailButtonModel vars)
        {
            return View("Default", vars);
        }
    }
}
