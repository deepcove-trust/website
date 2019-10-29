using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class NavItem
    {
        public int Id { get; set; }
        public Section Section { get; set; }
        public int? PageId { get; set; }

        // Navigation properties
        public Page Page { get; set; }
        public List<NavItemPage> NavItemPages { get; set; }
    }
}
