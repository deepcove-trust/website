using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class AudioMedia : BaseMedia
    {
        [JsonProperty("duration")]
        public double Duration { get; set; }
    }
}
