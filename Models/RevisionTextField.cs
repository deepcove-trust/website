using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class RevisionTextField
    {
        public int PageRevisionId { get; set; }
        public PageRevision PageRevision { get; set; }
        public int TextFieldId { get; set; }
        public TextField TextField { get; set; }
    }
}
