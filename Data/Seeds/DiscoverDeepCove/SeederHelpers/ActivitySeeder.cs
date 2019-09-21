using deepcove_dotnet.Models.DataModels;
using deepcove_dotnet.Models.DataModels.Activities;
using deepcove_dotnet.Models.DataModels.JunctionModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace deepcove_dotnet.Data.SeedClasses
{
    public class ActivitySeeder
    {
        public int Id { get; set; }
        public bool Activated { get; set; }
        public int? ImageId { get; set; }
        public ActivityType ActivityType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Task { get; set; }
        public string QrCode { get; set; }
        public double XCoord { get; set; }
        public double YCoord { get; set; }
        public List<int> ImageOptions { get; set; }

        public Activity ToActivity(int trackId)
        {
            return new Activity
            {
                Id = Id,
                TrackId = trackId,
                Activated = Activated,
                ImageId = ImageId,
                ActivityType = ActivityType,
                Title = Title,
                Description = Description,
                Task = Task,
                QrCode = QrCode,
                XCoord = XCoord,
                YCoord = YCoord
            };
        }        

        public List<ActivityImage> GetJunctionRecords()
        {
            return ImageOptions?.Select(s => new ActivityImage
            {
                ActivityId = Id,
                ImageId = s
            }).ToList();
        }
    }
}
