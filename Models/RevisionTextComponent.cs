using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class RevisionTextComponent
    {
        public int PageRevisionId { get; set; }
        public PageRevision PageRevision { get; set; }
        public int TextComponentId { get; set; }
        public TextComponent TextComponent { get; set; }
    }
}
