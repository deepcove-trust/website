using MimeKit;

namespace Deepcove_Trust_Website.Features.Emails
{
    public interface IEmailConfiguration
    {
        Sender Sender { get; set; }
        TestMail MailTrap { get; set; }
        Mailgun Mailgun { get; set; }
    }

    public class EmailConfiguration : IEmailConfiguration
    {
        public Sender Sender { get; set; }
        public TestMail MailTrap { get; set; }
        public Mailgun Mailgun { get; set; }
        
    }

    public class Sender
    {
        public string Address { get; set; }
        public string Name { get; set; }
        public string ReplyTo { get; set; }

        public EmailContact ToEmailContact()
        {
            return new EmailContact
            {
                Name = Name,
                Address = Address
            };
        }

        public MailboxAddress ToMailboxAddress()
        {
            return new MailboxAddress(Name, Address);
        }
    }

    /// <summary>
    /// Mailtrap testing credentials - use SMTP - credentials found in your mailbox settings
    /// </summary>
    public class TestMail
    {
        public string Server { get; set; }
        public int ServerPort { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class Mailgun
    {
        /// <summary>
        /// Mailgun API Key. See <a href="https://app.mailgun.com/app/account/security/api_keys">API Key Page</a>
        /// </summary>
        public string ApiKey { get; set; }
        /// <summary>
        /// Mailgun API Base Url. See <a href="https://documentation.mailgun.com/en/latest/api-intro.html#base-url">Developer Docs</a>
        /// </summary>
        public string ApiBaseUrl { get; set; }
        /// <summary>
        /// The domain that you set on your Mailgun Account used for anti-spam validation. 
        /// See <a href="https://app.mailgun.com/app/sending/domains">Domain Page</a>
        /// </summary>
        public string YourDomain { get; set; }
    }
}