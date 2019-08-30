using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Security.Principal;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Http;

namespace Deepcove_Trust_Website.Views.Emails.Models
{
    public class ErrorOccured : _EmailLayout
    {
        public ErrorOccured(Exception ex, HttpContext context)
        {
            // EXCEPTION INFORMATION
            var trace = new StackTrace(ex, true);
            Frames = trace.GetFrames();
            InnerException = ex.InnerException?.Message ?? string.Empty;
            Message = ex.Message;

            // REQUESTOR INFORMATION            
            User = context.User.Identity;
            UserIP = context.Request.HttpContext?.Connection?.RemoteIpAddress?.ToString();

            // RESOURCE INFORMATION
            Time = DateTime.UtcNow;
            RequestUrl = $"{context.Request.Scheme}://{context.Request.Host}{context.Request.Path}{context.Request.QueryString}";
            Method = context.Request.Method;

            Headers = new Dictionary<string, string>();
            foreach(var header in context.Request.Headers)
            {
                Headers.Add(header.Key, header.Value);
            }
        }

        // EXCEPTION INFORMATION
        public StackFrame[] Frames { get; set; }
        public string InnerException { get; set; }
        public string Message { get; }

        // REQUESTOR INFORMATION
        public string UserIP { get; }
        private readonly IIdentity User;
        
        // RESOURCE INFORMATION
        private readonly DateTime Time;
        private readonly string Method;
        public string RequestUrl { get; }
        public Dictionary<string, string> Headers;
        
        public string UserAgent
        {
            get => Headers.ContainsKey("User-Agent") ? Headers["User-Agent"] : "No User Agent Reported";
        }

        public string UserName
        {
            get => User.IsAuthenticated ? User.Name : string.Empty;
        }

        public string EventTime
        {
            get
            {
                TimeZoneInfo NZST;
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    NZST = TimeZoneInfo.FindSystemTimeZoneById("New Zealand Standard Time");
                }
                else
                {
                    NZST = TimeZoneInfo.FindSystemTimeZoneById("Pacific/Auckland");
                }

                DateTime t = TimeZoneInfo.ConvertTimeFromUtc(Time, NZST);
                return string.Format("{0} at {1}:{2}.{3} {4}", t.ToShortDateString(), t.Hour, t.Minute, t.Second, t.IsDaylightSavingTime() ? "NZDT" : "NZST");
            }
        }

        public string RequestMethod
        {
            get => Method.ToUpper();
        }
    }
}