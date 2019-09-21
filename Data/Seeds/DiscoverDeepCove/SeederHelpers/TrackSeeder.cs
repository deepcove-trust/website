using Deepcove_Trust_Website.DiscoverDeepCove;
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
        public bool Active { get; set; }        
        public List<ActivitySeeder> Activities { get; set; }

        public Track ToTrack()
        {
            return new Track
            {
                Id = Id,
                Name = Name,
                Active = Active
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
