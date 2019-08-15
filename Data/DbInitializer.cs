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

            //Make a list of objects from the json
            // foreach that list
                //If object is not in database, add 

            List<Template> templatesSeed = JsonConvert.DeserializeObject<List<Template>>(File.ReadAllText($"Data{separator}Seeds{separator}templates.json"));

            foreach(Template template in templatesSeed)
            {
                if(context.PageTemplates.Where(c => c.Name == template.Name).FirstOrDefault() == null)
                {
                    context.PageTemplates.Add(template);
                }
            }

            context.SaveChanges();
        }
    }
}
