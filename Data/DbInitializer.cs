using Deepcove_Trust_Website.Data.Seeds.DiscoverDeepCove.SeederHelpers;
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
            string basePath = Path.Combine("Data", "Seeds");

            // Page Templates
            List<PageTemplate> templatesSeed = JsonConvert.DeserializeObject<List<PageTemplate>>(File.ReadAllText(Path.Combine(basePath, "templates.json")));

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
            List<NotificationChannel> channelsSeed = JsonConvert.DeserializeObject<List<NotificationChannel>>(File.ReadAllText(Path.Combine(basePath, "notificationChannels.json")));
            
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
                SystemSettings settings = JsonConvert.DeserializeObject<SystemSettings>(File.ReadAllText(Path.Combine(basePath, "SystemSettings.json")));
                context.Add(settings);
            }
            // End System Settings
            context.SaveChanges();

            // Seed Discover Deep Cove data
            DiscoverDeepCoveSeeder.Seed(context);
        }
    }
}
