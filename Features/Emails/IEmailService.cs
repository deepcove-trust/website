using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;

namespace Deepcove_Trust_Website.Features.Emails
{
    public interface IEmailService
    {
        // Required to send all emails
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

        // Account Emails
        Task SendAccountStatusAsync(
            bool accountActive,
            EmailContact Recipient,
            Uri Url
        );

        Task SendNewAccountEmailAsync(
            PasswordReset token,
            ClaimsPrincipal adminAccount,
            Uri baseUrl
        );

        Task SendPasswordResetEmailAsync(
            PasswordReset token,
            Uri baseUrl
        );
        // End Account Emails

        // Inquiry Emails
        Task SendBookingInquiryAsync(
            EmailContact Sender,
            string subject,
            object vars
        );

        Task SendGeneralInquiryAsync(
            EmailContact Sender,
            string subject,
            object vars
        );
        // End Inquiry Emails

        // Developer emails
        Task SendExceptionEmailAsync(
            Exception ex,
            HttpContext context,
            string requestId
        );
    }
}