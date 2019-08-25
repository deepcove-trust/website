using System;
using Deepcove_Trust_Website.Helpers;

namespace Deepcove_Trust_Website.Views.Emails.Models
{
    public class EmailRecieved : _EmailLayout
    {
        //public string Token { get; set; }
        public string SendersName { get; set; }
        public string SendersEmail { get; set; }
        public string SendersPhone { get; set; }
        public string SendersOrg { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }

        public EmailRecieved(Microsoft.AspNetCore.Http.IFormCollection request, Uri baseUrl)
        {
            SentAt = DateTime.UtcNow;
            SendersName = request.Str("name");
            SendersEmail = request.Str("email");
            SendersPhone = request.Str("phone");
            SendersOrg = request.Str("org");
            Subject = request.Str("subject");
            Message = request.Str("message");
            BaseUrl = baseUrl;
        }
    }
}
