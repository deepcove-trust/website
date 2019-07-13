using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Features.Emails
{
    public interface IEmailService
    {
        Task SendEmailAsync(
            EmailContact Sender,
            EmailContact Recipient,
            string subject,
            string message
        );

        Task SendRazorEmailAsync(
            EmailContact Sender,
            EmailContact Recipient,
            string subject,
            string viewName,
            object vars
        );
    }
}
