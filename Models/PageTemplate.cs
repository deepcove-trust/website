using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class PageTemplate : BaseEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public  int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public int TextAreas { get; set; }
        public int MediaAreas { get; set; }

        // Navigation Properties
        public List<PageRevision> PageRevisions { get; set; }
        // End Navigation Properties
    }
}
