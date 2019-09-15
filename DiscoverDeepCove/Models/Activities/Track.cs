using System.Collections.Generic;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class Track
    {
        public int Id { get; set; }

        public bool Active { get; set; }

        public string Name { get; set; }

        public List<Activity> Activities { get; set; }
    }
}
