using Deepcove_Trust_Website.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Data
{
    public class DbInitializer
    {
        public static void Initialize(WebsiteDataContext context)
        {
            char separator = Path.DirectorySeparatorChar;            

            // Page Templates
            List<PageTemplate> templatesSeed = JsonConvert.DeserializeObject<List<PageTemplate>>(File.ReadAllText($"Data{separator}Seeds{separator}templates.json"));

            foreach(PageTemplate template in templatesSeed)
            {
                if(context.PageTemplates.Where(c => c.Name == template.Name).FirstOrDefault() == null)
                {
                    context.PageTemplates.Add(template);
                }
            }
            // End Page Templates
            context.SaveChanges();

            // Notification Channels
            List<NotificationChannel> channelsSeed = JsonConvert.DeserializeObject<List<NotificationChannel>>(File.ReadAllText($"Data{separator}Seeds{separator}notificationChannels.json"));
            
            foreach(NotificationChannel channel in channelsSeed)
            {
                if(context.NotificationChannels.Where(c => c.Name == channel.Name).FirstOrDefault() == null)
                {
                    context.NotificationChannels.Add(channel);
                }
            }
            // End Notification Channels
            context.SaveChanges();

            // System Settings - Only runs once
            if (!context.SystemSettings.Any())
            {
                SystemSettings settings = JsonConvert.DeserializeObject<SystemSettings>(File.ReadAllText($"Data{separator}Seeds{separator}SystemSettings.json"));
                context.Add(settings);
            }
            // End System Settings
            context.SaveChanges();
        }
    }
}
