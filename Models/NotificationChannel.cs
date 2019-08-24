using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class NotificationChannel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        // Nav properties        
        public ICollection<ChannelMembership> ChannelMemberships { get; set; }
        // End of nav properties
    }
}
