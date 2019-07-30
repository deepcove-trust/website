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
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string QLinksTitleA { get; set; }
        public string QLinksTitleB { get; set;}

        public string MissionStatment { get; set; }
    }
}
