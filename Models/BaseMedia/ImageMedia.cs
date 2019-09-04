using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class ImageMedia : BaseMedia
    {
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("alt")]
        public string Alt { get; set; }
        [JsonProperty("height")]
        public double Height { get; set; }
        [JsonProperty("width")]
        public double Width { get; set; }
        [JsonProperty("filenames")]
        public Dictionary<string, string> Filenames { get; set; }
    }
}
