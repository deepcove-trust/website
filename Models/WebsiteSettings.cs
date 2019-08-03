using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class WebsiteSettings
    {
        public int Id { get; set; }
        [Url]
        public string FacebookUrl { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string Phone { get; set; }
        public string LinkTitleA { get; set; }
        public string LinkTitleB { get; set;}

        public string FooterText { get; set; }
    }
}
