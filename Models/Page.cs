using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum Section { main, education }

    public class Page : BaseEntity
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Public { get; set; }
        [Required]
        public Section Section { get; set; }

        // Navigation Properties
        public Template Template { get; set; }
        public List<PageRevision> PageRevisions { get; set; }
        // End Navigation Properties
    }
}
