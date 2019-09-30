using Newtonsoft.Json;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class FactFileEntryImage
    {        
        [JsonProperty(PropertyName = "fact_file_entry_id")]
        public int FactFileEntryId { get; set; }        

        public FactFileEntry FactFileEntry { get; set; }
        
        [JsonProperty(PropertyName = "media_file_id")]
        public int MediaFileId { get; set; }
        
        public ImageMedia MediaFile { get; set; }
    }
}
