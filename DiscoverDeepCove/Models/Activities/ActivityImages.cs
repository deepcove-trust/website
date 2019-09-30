using Newtonsoft.Json;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{    
    public class ActivityImage
    {        
        [JsonProperty("activity_id")]        
        public int ActivityId { get; set; }
        
        public Activity Activity { get; set; }
        
        [JsonProperty("image_id")]        
        public int ImageId { get; set; }

        
        public ImageMedia Image { get; set; }
    }
}
