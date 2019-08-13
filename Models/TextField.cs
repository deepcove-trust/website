using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class TextField
    {
        public int Id { get; set; }
        [Required]
        public int SlotNo { get; set; }
        
        public string Heading { get; set; }
        
        public string Text { get; set; }


        // Navigation Properties
        PageRevision PageRevision { get; set; }
        public Link link { get; set; }
        // End Navigation Properties
    }
}
