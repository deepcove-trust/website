using System.Collections.Generic;

namespace Deepcove_Trust_Website.Models
{
    public class NavItem
    {
        public int Id { get; set; }
        public Section Section { get; set; }
        public int? PageId { get; set; }
        public string Text { get; set; }
        public string Url { get; set; }

        // Navigation properties
        public Page Page { get; set; }
        public List<NavItemPage> NavItemPages { get; set; }
        // ---------------------
    }
}
