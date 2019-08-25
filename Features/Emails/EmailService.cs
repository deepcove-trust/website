using System;
using MimeKit;
using MailKit.Net.Smtp;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Features.RazorRender;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Deepcove_Trust_Website.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Deepcove_Trust_Website.Features.Emails
{
    public class EmailService : IEmailService
    {
        private readonly IViewRenderer _ViewRender;
        private readonly IEmailConfiguration _EmailConfiguration;
        private readonly ILogger<EmailService> _Logger;
        private readonly WebsiteDataContext _Db;

        public EmailService(IViewRenderer viewRenderer, IEmailConfiguration emailConfiguration, ILogger<EmailService> logger, WebsiteDataContext db)
        {
            _ViewRender = viewRenderer;
            _EmailConfiguration = emailConfiguration;
            _Logger = logger;
            _Db = db;
        }

        public async Task SendEmailAsync(EmailContact sender, EmailContact recipient, string subject, string message)
        {
            try
            {
                var email = new MimeMessage();

                // IF: A sender is not specified then use the configuration value
                if (sender == null)
                {
                    email.From.Add(new MailboxAddress(_EmailConfiguration.SenderName, _EmailConfiguration.SenderEmail));
                }
                else
                {
                    email.From.Add(new MailboxAddress(sender.Name, sender.Address));
                }

                email.To.Add(new MailboxAddress(recipient.Name, recipient.Address));
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

                    _Logger.LogDebug("Email sent - Subject: {0} | Recipient: {1}<{2}>", email.Subject, recipient.Name, recipient.Address);                    
                }
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error sending email - Subject: {0} | Recipient: {1}<{2}>: {3}", subject, recipient.Name, recipient.Address, ex.Message);
                throw ex;
            }
        }

        public async Task SendRazorEmailAsync(EmailContact sender, EmailContact recipient, string subject, string viewName, object vars)
        {
            var message = await _ViewRender.RenderAsync(viewName, vars);
            await SendEmailAsync(sender, recipient, subject, message);
        }

        public async Task SendContactUsEmailAsync(EmailContact Sender, List<EmailContact> CcRecipients, string subject, object vars)
        {
            EmailContact trust = await _Db.SystemSettings.OrderByDescending(o => o.Id)
                .Select(s => new EmailContact { Name = "Office", Address = s.EmailGeneral }).FirstOrDefaultAsync();


            var message = await _ViewRender.RenderAsync("EmailRecieved", vars);
            await SendEmailAsync(Sender, trust, subject, message);

            if(CcRecipients != null)
            {
                foreach (EmailContact recipient in CcRecipients)
                    SendEmailAsync(Sender, recipient, $"FWD: {subject}", message);
            }
        }
    }
}
