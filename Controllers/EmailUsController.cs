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
using reCAPTCHA.AspNetCore;

namespace Deepcove_Trust_Website.Controllers
{
    [Route("/api")]
    public class EmailUsController : Controller
    {
        private readonly ILogger<EmailUsController> _Logger;
        private readonly IEmailService _SMTP;
        private WebsiteDataContext _Db;
        private IRecaptchaService _Recaptcha;

        public EmailUsController(ILogger<EmailUsController> logger, IEmailService smtp, WebsiteDataContext db, IRecaptchaService reCAPTCHA)
        {
            _Logger = logger;
            _SMTP = smtp;
            _Db = db;
            _Recaptcha = reCAPTCHA;
        }

        [HttpPost("sendmail")]
        public async Task<IActionResult> SendEmail(IFormCollection request)
        {
            try
            {
                var reCAPTCHA = await _Recaptcha.Validate(request.Str("code"));
                if (!reCAPTCHA.success)
                {
                    _Logger.LogWarning($"{request.Str("name")}'s captcha validation failed.");
                    return Conflict("Please complete the reCAPTCHA");
                }
                    

                var messageArgs = new EmailRecieved(request, this.Request.BaseUrl());
                EmailContact Sender = new EmailContact
                {
                    Name = messageArgs.Name,
                    Address = messageArgs.SendersEmail
                };

                if (request.Bool("SendToBookings"))
                    // Sends a master email to the "BOOKINGS" email address in system settings, then sends a copy to each person on the mailing list.
                    await _SMTP.SendBookingInquiryAsync(Sender, messageArgs.Subject, messageArgs);
                else
                    // Sends a master email to the "GENERAL" email address in system settings, then sends a copy to each person on the mailing list.
                    await _SMTP.SendGeneralInquiryAsync(Sender, messageArgs.Subject, messageArgs);

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