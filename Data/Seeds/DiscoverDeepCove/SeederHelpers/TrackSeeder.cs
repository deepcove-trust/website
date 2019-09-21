using deepcove_dotnet.Models.DataModels.Activities;
using deepcove_dotnet.Models.DataModels.JunctionModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace deepcove_dotnet.Data.SeedClasses
{
    public class TrackSeeder
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Activated { get; set; }        
        public List<ActivitySeeder> Activities { get; set; }

        public Track ToTrack()
        {
            return new Track
            {
                Id = Id,
                Name = Name,
                Activated = Activated
            };
        }

        public List<Activity> GetActivities()
        {
            return Activities?.Select(a => a.ToActivity(Id)).ToList();
        }

        public List<ActivityImage> GetActivityImages()
        {
            if (Activities == null) return null;

            List<ActivityImage> activityImages = new List<ActivityImage>();

            foreach (ActivitySeeder aSeeder in Activities)
            {
                List<ActivityImage> aImages = aSeeder.GetJunctionRecords();

                if(aImages != null)
                   activityImages = activityImages.Concat(aImages).ToList();

            }
            return activityImages;
        }
    }
}
