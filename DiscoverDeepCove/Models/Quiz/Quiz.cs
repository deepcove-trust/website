using System;
using System.Collections.Generic;
using Deepcove_Trust_Website.Models;
using Newtonsoft.Json;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class Quiz : BaseEntity
    {
        public int Id { get; set; }
        public int ImageId { get; set; }

        public bool Active { get; set; }

        public string Title { get; set; }
                
        [JsonProperty("unlock_code")]
        public string UnlockCode { get; set; }

        public bool Shuffle { get; set; }

        public ImageMedia Image { get; set; }

        // Navigation Properties
        public List<QuizQuestion> Questions { get; set; }
        // End Navigation Properties
    }
}
