using Deepcove_Trust_Website.Helpers;
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

        // --------------------------

        /// <summary>
        /// Return the path of the most appropriate image for displaying 
        /// at a given width (in pixels)
        /// 
        /// Returns largest image size if no width provided.
        /// </summary>
        public string GetImagePath(int width = 0)
        {
            // Return largest option if width is not supplied / 0
            if(width == 0) { }

            ImageVersion bestVersion = GetBestFit(width);

            return Filenames[bestVersion.Code];
        }

        /// <summary>
        /// Returns the ImageVersion that is most suitable to display at a certain 
        /// width (in pixels)
        /// </summary>
        private ImageVersion GetBestFit(int width)
        {
            // Get sizing data for available versions.
            List<ImageVersion> versions = ImageVersion.All
                .Where(v => Filenames.ContainsKey(v.Code))
                .OrderBy(v => v.Width)
                .ToList();

            // Reference for the following
            //https://tiny.cc/4dbfcz

            int index = versions.BinarySearch(ImageVersion.CustomVersion(width));

            // Width is below smallest option, return smallest option
            if (width <= versions[0].Width)
                return versions[0];

            // Required width matches a version perfectly
            if (0 < index)
                return versions[index];

            // Otherwise we find close above and closest below

            ImageVersion above, below;
            index = ~index; //bitwise complement - don't ask
            below = versions[index - 1];
            above = versions[index];

            // Now return below if the supplied width above by less than 10 percent
            // of the difference between the above and below versions.

            return (width - below.Width < (above.Width - below.Width) * 0.1) ? below : above;

        }
    }
}
