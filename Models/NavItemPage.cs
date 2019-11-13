using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class NavItemPage
    {
        public int Id { get; set; }
        public int NavItemId { get; set; }
        public string Text { get; set; }
        public string Url { get; set; }        
        public int? PageId { get; set; }

        // Navigation properties
        public NavItem NavItem { get; set; }
        public Page Page { get; set; }
        // ---------------------
    }
}
