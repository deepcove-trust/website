using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class MediaComponent : IEquatable<MediaComponent>
    {
        public int Id { get; set; }
        public int SlotNo { get; set; }
        public int ImageMediaId { get; set; }

        // Navigation properties
        public List<RevisionMediaComponent> RevisionMediaComponents { get; set; }
        public ImageMedia ImageMedia { get; set; }

        // ---------------------

        // Todo: Complete the rest of the MediaComponent class 
        // Add reference to the media file model when created
        // Add image metadata (alt, title, etc)

        public bool Equals(MediaComponent other)
        {
            throw new NotImplementedException(); // Todo: Implement MediaComponent.Equals()
        }
    }
}
