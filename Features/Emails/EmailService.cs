using System;
using MimeKit;
using MailKit.Net.Smtp;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Features.RazorRender;

namespace Deepcove_Trust_Website.Features.Emails
{
    public class EmailService : IEmailService
    {
        private readonly IViewRenderer _ViewRender;
        private readonly IEmailConfiguration _EmailConfiguration;

        public EmailService(IViewRenderer viewRenderer, IEmailConfiguration emailConfiguration)
        {
            _ViewRender = viewRenderer;
            _EmailConfiguration = emailConfiguration;
        }

        public async Task SendEmailAsync(EmailContact Sender, EmailContact Recipient, string subject, string message)
        {
            var email = new MimeMessage();

            // IF: A sender is not specified then use the configuration value
            if (Sender == null)
            {
                email.From.Add(new MailboxAddress(_EmailConfiguration.SenderName, _EmailConfiguration.SenderEmail));
            }
            else
            {
                email.From.Add(new MailboxAddress(Sender.Name, Sender.Address));
            }
                            
            email.To.Add(new MailboxAddress(Recipient.Name, Recipient.Address));
            email.Subject = subject;


            var body = new BodyBuilder
            {
                HtmlBody = message
            };

            email.Body = body.ToMessageBody();

            using (var client = new SmtpClient())
            {
                // Removes oauth as a protocole.
                client.AuthenticationMechanisms.Remove("XOAUTH2");

                // Connect
                await client.ConnectAsync(
                    _EmailConfiguration.SmtpServer, 
                    _EmailConfiguration.SmtpPort, 
                    false
                );

                await client.AuthenticateAsync(
                    _EmailConfiguration.SmtpUsername,
                    _EmailConfiguration.SmtpPassword
                );

                await client.SendAsync(email);

                // Disconnect
                await client.DisconnectAsync(true);
            }
        }

        public async Task SendRazorEmailAsync(EmailContact Sender, EmailContact Recipient, string subject, string viewName, object vars)
        {
            try
            {
                var message = await _ViewRender.RenderAsync(viewName, vars);
                await SendEmailAsync(Sender, Recipient, subject, message);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
            
        }
    }
}
