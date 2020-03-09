using System;
using System.Collections.Generic;

namespace Deepcove_Trust_Website.Models
{
    public class MediaComponent : IEquatable<MediaComponent>
    {
        public int Id { get; set; }
        public int SlotNo { get; set; }
        public string YouTubeEmbed { get; set; }
        public int? ImageMediaId { get; set; }

        // Navigation properties
        public List<RevisionMediaComponent> RevisionMediaComponents { get; set; }
        public ImageMedia ImageMedia { get; set; }

        // ---------------------
        
        public bool Equals(MediaComponent other)
        {
            return Id == other.Id && SlotNo == other.SlotNo && ImageMediaId == other.ImageMediaId;
        }
    }
}
