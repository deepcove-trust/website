using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class NavItemPage
    {
        public int NavItemId { get; set; }
        public int PageId { get; set; }
        public NavItem NavItem { get; set; }
        public Page Page { get; set; }
    }
}
