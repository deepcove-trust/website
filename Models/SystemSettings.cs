using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class SystemSettings
    {
        public int Id { get; set; }
        // Emails
        [EmailAddress]
        public string EmailBookings { get; set; }
        [EmailAddress]
        public string EmailGeneral { get; set; }
        // End Emails

        // URLs
        [Url]
        public string UrlFacebook { get; set; }
        [Url]
        public string UrlGooglePlay { get; set; }
        [Url]
        public string UrlGoogleMaps { get; set; }
        // End URLs

        public string Phone { get; set; }

        // Footer Content
        public string LinkTitleA { get; set; }
        public string LinkTitleB { get; set;}
        public string FooterText { get; set; }
        // End Footer Content
    }
}
