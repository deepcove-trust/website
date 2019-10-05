using System;
using System.Collections.Generic;
using Deepcove_Trust_Website.Models;
using Newtonsoft.Json;


namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public enum ActivityType { informational, countActivity, photographActivity, pictureSelectActivity, pictureTapActivity, textAnswerActivity }

    public class Activity : BaseEntity
    {
        public int Id { get; set; }

        public int TrackId { get; set; }
        public int? FactFileId { get; set; }
        public int? ImageId { get; set; }

        [JsonProperty("activity_type")]
        public ActivityType ActivityType { get; set; }

        public bool Active { get; set; }

        public ImageMedia Image { get; set; }

        public string Description { get; set; }

        public string Task { get; set; }

        public string Title { get; set; }

        [JsonProperty("qr_code")]
        public string QrCode { get; set; }

        [JsonProperty("coord_y")]
        public double CoordY { get; set; }

        [JsonProperty("coord_x")]
        public double CoordX { get; set; }

        // Navigation Properties
        public Track Track { get; set; }

        [JsonProperty("fact_file")]
        public FactFileEntry FactFile { get; set; }
        
        public List<ActivityImage> ActivityImages { get; set; }
        // End Navigation Properties
    }
}