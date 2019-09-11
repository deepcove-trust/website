using System;
using System.Collections.Generic;
using Deepcove_Trust_Website.Models;
using Newtonsoft.Json;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class FactFileEntry : BaseEntity
    {
        public int Id { get; set; }

        [JsonProperty("primary_name")]
        public string PrimaryName { get; set; }

        [JsonProperty("alt_name")]
        public string AltName { get; set; }

        [JsonProperty("body_text")]
        public string BodyText { get; set; }

        // Navigation Properties
        public FactFileCategory Category { get; set; }
        public ImageMedia MainImage { get; set; }
        public AudioMedia ListenAudio { get; set; }
        public AudioMedia PronounceAudio { get; set; }
        public List<FactFileEntryImage> FactFileEntryImages { get; set; }
        // End Navigation Properties
    }
}
