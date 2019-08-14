using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class ChannelMembership
    {
        [ForeignKey("Account")]
        public int AccountId { get; set; }        
        [ForeignKey("NotificationChannel")]
        public int NotificationChannelId { get; set; }
        public Account Account { get; set; }
        public NotificationChannel NotificationChannel { get; set; }
    }
}
