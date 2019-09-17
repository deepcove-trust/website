using Newtonsoft.Json;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class Config
    {
        public int Id { get; set; }
                
        [JsonProperty("master_unlock_code")]
        public string MasterUnlockCode { get; set; }
    }
}