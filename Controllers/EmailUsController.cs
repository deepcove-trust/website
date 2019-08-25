using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Features.Emails;
using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Views.Emails.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.Controllers
{
    [Route("/api")]
    public class EmailUsController : Controller
    {
        private readonly ILogger<EmailUsController> _Logger;
        private readonly IEmailService _SMTP;
        private WebsiteDataContext _Db;

        public EmailUsController(ILogger<EmailUsController> logger, IEmailService smtp, WebsiteDataContext db)
        {
            _Logger = logger;
            _SMTP = smtp;
            _Db = db;
        }

        [HttpPost("sendmail")]
        public async Task<IActionResult> SendEmail(IFormCollection request)
        {
            try
            {
                List<EmailContact> CcedRecipients = await _Db.NotificationChannels.Where(c => c.Name == "cc: Email Enquiries")
                .Select(s => s.ChannelMemberships
                    .Select(s1 => new EmailContact
                    {
                        Name = s1.Account.Name,
                        Address = s1.Account.Email
                    }).ToList()
                ).FirstOrDefaultAsync();

                var messageArgs = new EmailRecieved(request, this.Request.BaseUrl());

                // Sends the master email to the General Emails specified in system settings, and then sends a copy to each person on the mailing list.
                await _SMTP.SendContactUsEmailAsync(new EmailContact { Name = messageArgs.SendersName, Address = messageArgs.SendersEmail },
                    CcedRecipients,
                    messageArgs.Subject,
                    messageArgs
                );

                _Logger.LogInformation("Sucsefully sent {0}'s email", messageArgs.SendersName);
                return Ok();
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error sending {0}'s email: {1}", request.Str("name"), ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong and we could not send your email. Please try again later.");
            }   
        }
    }
}