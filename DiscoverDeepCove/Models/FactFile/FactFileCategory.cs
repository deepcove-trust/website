using System.Collections.Generic;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class FactFileCategory
    {
        public int Id { get; set; }

        public string Name { get; set; }

        // Navigation Properties
        public ICollection<FactFileEntry> FactFileEntries { get; set; }
        // End Navigation Properties
    }
}
