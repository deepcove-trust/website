using Deepcove_Trust_Website.Helpers;
using System;
using System.ComponentModel.DataAnnotations;

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

        public PasswordReset(Account account, DateTime expiresAt)
        {
            Account = account;
            Token = Utils.RandomString(20);
            ExpiresAt = expiresAt;
        }

        public PasswordReset() { }
    }
}
