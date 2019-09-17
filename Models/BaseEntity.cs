using Newtonsoft.Json;
using System;

namespace Deepcove_Trust_Website.Models
{
    /// <summary>
    /// Provides timestamps to a model
    /// </summary>
    public class BaseEntity
    {
        public DateTime CreatedAt { get; set; }
        [JsonProperty("updated_at")]
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
