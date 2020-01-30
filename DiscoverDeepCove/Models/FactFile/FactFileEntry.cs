using System;
using System.Collections.Generic;
using Deepcove_Trust_Website.Models;
using Newtonsoft.Json;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class FactFileEntry : BaseEntity
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int MainImageId { get; set; }
        public int? ListenAudioId { get; set; }
        public int? PronounceAudioId { get; set; }

        [JsonProperty("primary_name")]
        public string PrimaryName { get; set; }

        [JsonProperty("alt_name")]
        public string AltName { get; set; }

        [JsonProperty("body_text")]
        public string BodyText { get; set; }

        public bool Active { get; set; }

        // Navigation Properties
        public FactFileCategory Category { get; set; }
        public ImageMedia MainImage { get; set; }
        public AudioMedia ListenAudio { get; set; }
        public AudioMedia PronounceAudio { get; set; }
        public List<FactFileEntryImage> FactFileEntryImages { get; set; }
        public List<FactFileNugget> FactFileNuggets { get; set; }
        public List<Activity> Activities { get; set; }
        // End Navigation Properties
    }
}
