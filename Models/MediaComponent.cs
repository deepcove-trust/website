using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class MediaComponent
    {
        public int Id { get; set; }
        public int SlotNo { get; set; }

        // Navigation properties
        public List<RevisionMediaComponent> RevisionMediaComponents { get; set; }
        // ---------------------

        // Todo: Complete the rest of this class 
        // Add reference to the media file model when created
        // Add image metadata (alt, title, etc)
    }
}
