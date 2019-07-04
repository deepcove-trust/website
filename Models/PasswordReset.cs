using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class PasswordReset
    {
        public int Id { get; set; }

        [Required]
        public string Token { get; set; }

        [Display(Name = "Expires At"), DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}")]
        public DateTime ExpiresAt { get; set; }

        // Navigation Properties
        public Account Account { get; set; }
        // End Navigation Properties
    }
}
