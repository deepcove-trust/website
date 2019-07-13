using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class Account : BaseEntity
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        [JsonIgnore]
        public string Password { get; set; }
        
        public bool ForcePasswordReset { get; set; }

        public bool Active { get; set; }

        public DateTime? LastLogin { get; set; }
    }
}
