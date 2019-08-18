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
            List<Template> templatesSeed = JsonConvert.DeserializeObject<List<Template>>(File.ReadAllText($"Data{separator}Seeds{separator}templates.json"));

            foreach(Template template in templatesSeed)
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
        }
    }
}
