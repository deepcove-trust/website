using Deepcove_Trust_Website.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class Track
    {
        public int Id { get; set; }

        public bool Active { get; set; }

        public string Name { get; set; }

        // Nav properties
        public List<Activity> Activities { get; set; }

        // Get bounding box for this track, for map display in the CMS
        public double[,] GetBoundingBox(WebsiteDataContext ctx)
        {
            ctx.Entry(this).Collection(t => t.Activities).Load();

            if (Activities.Count <= 0) return null;

            double[] xVals = Activities.Select(a => a.CoordX).ToArray();
            double[] yVals = Activities.Select(a => a.CoordY).ToArray();

            return new double[,] {{ xVals.Min(), yVals.Max() }, { xVals.Max(), yVals.Min() } };
        }
    }
}
