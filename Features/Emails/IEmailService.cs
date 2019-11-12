using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Models;
using Microsoft.AspNetCore.Http;

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

        Task SendPasswordResetEmailAsync(
            PasswordReset token,
            Uri baseUrl
        );

        Task SendNewAccountEmailAsync(
            PasswordReset token,
            ClaimsPrincipal adminAccount,
            Uri baseUrl
        );

        Task SendGeneralInquiryAsync(
            EmailContact Sender,
            string subject,
            object vars
        );

        Task SendBookingInquiryAsync(
            EmailContact Sender,
            string subject,
            object vars
        );

        Task SendExceptionEmailAsync(
            Exception ex,
            HttpContext context
        );
    }
}