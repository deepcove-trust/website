using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Features.RazorRender;
using Deepcove_Trust_Website.Views.Emails.Models;
using Microsoft.AspNetCore.Http;
using MimeKit;
using MailKit.Net.Smtp;
using Mailgun.Service;
using Mailgun.Messages;

namespace Deepcove_Trust_Website.Features.Emails
{
    public class EmailService : IEmailService
    {
        private readonly IViewRenderer _ViewRender;
        private readonly IEmailConfiguration _EmailConfig;
        private readonly IHostingEnvironment _env;
        private readonly ILogger<EmailService> _Logger;
        private readonly WebsiteDataContext _Db;

        public EmailService(IViewRenderer viewRenderer, IEmailConfiguration emailConfig, IHostingEnvironment env, ILogger<EmailService> logger, WebsiteDataContext db)
        {
            _ViewRender = viewRenderer;
            _EmailConfig = emailConfig;
            _Logger = logger;
            _Db = db;
            _env = env;
        }
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
        public async Task SendEmailAsync(EmailContact sender, EmailContact recipient, string subject, string message)
        {
            // IF: A sender is not specified then use the configuration value
            sender = sender ?? _EmailConfig.Sender.ToEmailContact();

            if (_env.IsDevelopment())
            {
                await SendViaSmtp(sender.ToMailboxAddress(), recipient.ToMailboxAddress(), subject, message);
            } 
            else
            {
                await SendViaApi(sender, recipient, subject, message);
            }
        }

        private async Task SendViaApi(EmailContact sender, EmailContact recipient, string subject, string message)
        {
            try
            {
                MessageService MailGun = new MessageService(_EmailConfig.Mailgun.ApiKey);
                var Email = new MessageBuilder()
                    .AddToRecipient(new Recipient
                    {
                        Email = recipient.Address,
                        DisplayName = recipient.Name
                    })
                    .SetFromAddress(new Recipient
                    {
                        Email = sender.Address,
                        DisplayName = sender.Name
                    })
                    .SetReplyToAddress(new Recipient
                    {
                        Email = _EmailConfig.Sender.ReplyTo ?? _EmailConfig.Sender.Address
                    })
                    .SetSubject(subject)
                    .SetHtmlBody(message);

                var MailResult = await MailGun.SendMessageAsync(_EmailConfig.Mailgun.YourDomain, Email.GetMessage());
                _Logger.LogDebug("Email sent - Subject: {0} | Recipient: {1}<{2}>", subject, recipient.Name, recipient.Address);

                if (!MailResult.IsSuccessStatusCode)
                {
                    throw new Exception(MailResult.ReasonPhrase);
                }
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error sending email - Subject: {0} | Recipient: {1}<{2}>: {3}", subject, recipient.Name, recipient.Address, ex.Message);
                throw ex;
            }
        }

        private async Task SendViaSmtp(MailboxAddress sender, MailboxAddress recipient, string subject, string message)
        {
            try
            {
                var email = new MimeMessage() {
                    Subject = subject
                };

                email.From.Add(sender);
                email.To.Add(recipient);
                email.ReplyTo.Add(_EmailConfig.Sender.ToMailboxAddress());

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
                        _EmailConfig.MailTrap.Server,
                        _EmailConfig.MailTrap.ServerPort,
                        false
                    );

                    await client.AuthenticateAsync(
                        _EmailConfig.MailTrap.Username,
                        _EmailConfig.MailTrap.Password
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

        public async Task SendPasswordResetEmailAsync(Models.PasswordReset token, Uri baseUrl)
        {
            var account = token.Account;

            await SendRazorEmailAsync(null,
                new EmailContact { Address = account.Email, Name = account.Name },
                "Password reset",
                "PasswordReset",
                new Views.Emails.Models.PasswordReset
                {
                    Name = account.Name,
                    Token = token.Token,
                    Email = account.Email,
                    BaseUrl = baseUrl
                }
            );
        }

        public async Task SendNewAccountEmailAsync(Models.PasswordReset token, ClaimsPrincipal adminAccount, Uri baseUrl)
        {
            var account = token.Account;
            var recipient = new EmailContact { Address = account.Email, Name = account.Name };
            await SendRazorEmailAsync(null,
                recipient,
                "Account Created",
                "AccountCreated",
                new AccountCreated
                {
                    Name = account.Name,
                    Recipient = recipient,
                    CreatedBy = new EmailContact
                    {
                        Name = adminAccount.AccountName(),
                        Address = adminAccount.AccountEmail()
                    },
                    Token = token.Token,
                    BaseUrl = baseUrl
                }
            );
        }

        public async Task SendGeneralInquiryAsync(EmailContact Sender, string subject, object vars)
        {
            EmailContact trust = await _Db.SystemSettings.OrderByDescending(o => o.Id)
                .Select(s => new EmailContact { Name = "Office", Address = s.EmailGeneral }).FirstOrDefaultAsync();


            var message = await _ViewRender.RenderAsync("EmailRecieved", vars);
            await SendEmailAsync(Sender, trust, subject, message);

            List<EmailContact> CcRecipients = await _Db.NotificationChannels.Where(c => c.Name == "cc: Email Enquiries")
                .Select(s => s.ChannelMemberships
                    .Select(s1 => new EmailContact
                    {
                        Name = s1.Account.Name,
                        Address = s1.Account.Email
                    }).ToList()
                ).FirstOrDefaultAsync();

            if (CcRecipients != null)
            {
                foreach (EmailContact recipient in CcRecipients)
                    SendEmailAsync(Sender, recipient, $"FWD: {subject}", message);
            }
        }

        public async Task SendBookingInquiryAsync(EmailContact Sender, string subject, object vars)
        {
            EmailContact trust = await _Db.SystemSettings.OrderByDescending(o => o.Id)
                .Select(s => new EmailContact { Name = "Office", Address = s.EmailBookings }).FirstOrDefaultAsync();


            var message = await _ViewRender.RenderAsync("EmailRecieved", vars);
            await SendEmailAsync(Sender, trust, subject, message);

            List<EmailContact> CcRecipients = await _Db.NotificationChannels.Where(c => c.Name == "cc: Booking Enquiries")
                .Select(s => s.ChannelMemberships
                    .Select(s1 => new EmailContact
                    {
                        Name = s1.Account.Name,
                        Address = s1.Account.Email
                    }).ToList()
                ).FirstOrDefaultAsync();

            if (CcRecipients != null)
            {
                foreach (EmailContact recipient in CcRecipients)
                    SendEmailAsync(Sender, recipient, $"FWD: {subject}", message);
            }
        }

        public async Task SendExceptionEmailAsync(Exception ex, HttpContext context, string requestId)
        {
            List<EmailContact> Developers = await _Db.NotificationChannels.Where(c => c.Name == "Developer Exceptions")
                .Select(s => s.ChannelMemberships
                    .Select(s1 => new EmailContact
                    {
                        Name = s1.Account.Name,
                        Address = s1.Account.Email
                    }).ToList()
                ).FirstOrDefaultAsync();

            if(Developers != null)
            {
                foreach (EmailContact dev in Developers)
                {
                    try
                    {
                        SendRazorEmailAsync(null, dev, "Woops, something went wrong!", "ErrorOccured", new ErrorOccured(ex, context, requestId));
                    }
                    catch (Exception ex1)
                    {
                        Console.WriteLine(ex1.Message);
                    }
                }    
            }
        }

        public async Task SendAccountStatusAsync(bool accountActive, EmailContact Recipient, Uri BaseUrl)
        {
            string razorViewName = accountActive ? "Account Activated" : "Account Suspended";

            await SendRazorEmailAsync(null, Recipient, razorViewName, razorViewName.Replace(" ", ""),
                new _EmailLayout { Name = Recipient.Name, BaseUrl = BaseUrl });

        }
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
    }
}