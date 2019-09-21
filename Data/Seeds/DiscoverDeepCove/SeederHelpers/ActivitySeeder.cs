using Deepcove_Trust_Website.DiscoverDeepCove;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Data.Seeds.DiscoverDeepCove.SeederHelpers
{
    public class ActivitySeeder
    {
        public int Id { get; set; }
        public bool Active { get; set; }
        public int? ImageId { get; set; }
        public int? FactFileId { get; set; }
        public ActivityType ActivityType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Task { get; set; }
        public string QrCode { get; set; }
        public double CoordX { get; set; }
        public double CoordY { get; set; }
        public List<int> ImageOptions { get; set; }

        public Activity ToActivity(int trackId)
        {
            return new Activity
            {
                Id = Id,
                TrackId = trackId,
                FactFileId = FactFileId,
                Active = Active,
                ImageId = ImageId,
                ActivityType = ActivityType,
                Title = Title,
                Description = Description,
                Task = Task,
                QrCode = QrCode,
                CoordX = CoordX,
                CoordY = CoordX
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
