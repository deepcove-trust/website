using Newtonsoft.Json;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class FactFileNugget
    {
        public int Id { get; set; }
        public int? ImageId { get; set; }
        public int FactFileEntryId { get; set; }

        [JsonProperty("order_index")]
        public int OrderIndex { get; set; }

        public string Name { get; set; }

        public string Text { get; set; }

        // Navigation Properties
        public ImageMedia Image { get; set; }
        public FactFileEntry FactFileEntry { get; set; }
        // End Navigation Properties
    }
}
