using Deepcove_Trust_Website.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
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
        [JsonProperty("versions")]
        public List<ImageVersion> Versions { get; set; }

        // --------------------------

        /// <summary>
        /// Return the path of the most appropriate image for displaying 
        /// at a given width (in pixels)
        /// 
        /// Returns the thumbnail size if no width provided.
        /// </summary>
        public string GetImagePath(int width = 0, bool original = false)
        {
            // If the request is for the original, return it
            if (original) return FilePath;            

            // Otherwise, determine the appropriate size to return
            ImageVersion bestVersion;

            // Return thumbnail option if width is not supplied
            if (width == 0)
                bestVersion = Versions.Aggregate((l, r) => l.Width < r.Width ? l : r);
            else
                bestVersion = GetBestFit(width);

            return Path.Combine(
                Path.GetDirectoryName(FilePath),
                Path.GetFileNameWithoutExtension(FilePath),
                $"{bestVersion.Code}_{Filename}");

        }

        /// <summary>
        /// Returns the ImageVersion that is most suitable to display at a certain 
        /// width (in pixels)
        /// </summary>
        private ImageVersion GetBestFit(int width)
        {
            // Reference for the following
            //https://tiny.cc/4dbfcz

            int index = Versions.BinarySearch(ImageVersion.CustomVersion(width));

            // Width is below smallest option, return smallest option
            if (width <= Versions[0].Width)
                return Versions[0];

            // Required width matches a version perfectly
            if (0 < index)
                return Versions[index];

            // Get the bitwise complement of the value returned by the binary search
            index = ~index;

            // If the complement is equal to the list count, then the requested value 
            // was higher than what we have available, so return our biggest version
            if(index == Versions.Count)
                return Versions[index - 1];

            // Otherwise get the image version above and the version below
            ImageVersion above, below;            
            below = Versions[index - 1];
            above = Versions[index];

            // If the requested width is less than 10% larger than the smaller image, return the
            // smaller image, otherwise return the larger one.
            return (width - below.Width < (above.Width - below.Width) * 0.1) ? below : above;

        }
    }
}
