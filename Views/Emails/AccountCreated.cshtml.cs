using Deepcove_Trust_Website.Features.Emails;

namespace Deepcove_Trust_Website.Views.Emails.Models
{
    public class AccountCreated : _EmailLayout
    {
        public EmailContact Recipient { get; set; }
        public EmailContact CreatedBy { get; set; }
        public string Token { get; set; }
    }
}
