using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class RevisionMediaComponent
    {
        public int PageRevisionId { get; set; }
        public PageRevision PageRevision { get; set; }
        public int MediaComponentId { get; set; }
        public MediaComponent MediaComponent { get; set; }
    }
}
