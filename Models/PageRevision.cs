using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class PageRevision : BaseEntity
    {
        public int Id { get; set; }


        // Navigation Properties
        public Account CreatedBy { get; set; }
        public Page Page { get; set; }
        // End Navigation Properties
    }
}
