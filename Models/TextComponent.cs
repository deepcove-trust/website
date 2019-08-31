using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class TextComponent
    {
        public int Id { get; set; }
        [Required]
        public int SlotNo { get; set; }
        
        public string Heading { get; set; }
        
        public string Text { get; set; }


        // Navigation Properties
        List<RevisionTextComponent> RevisionTextComponents { get; set; }
        public CmsButton CmsButton { get; set; }
        // End Navigation Properties
    }
}
