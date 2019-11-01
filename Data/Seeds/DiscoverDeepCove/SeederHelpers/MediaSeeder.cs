using Deepcove_Trust_Website.Helpers;
using Deepcove_Trust_Website.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Data.Seeds.DiscoverDeepCove.SeederHelpers
{
    public class MediaSeeder
    {
        public int Id { get; set; }
        public int FileType { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public string Source { get; set; }
        public bool ShowCopyright { get; set; }
        public MediaType MediaType { get => (MediaType)FileType; }
        public List<ImageVersion> Versions { get; set; }

        public BaseMedia ToBaseMedia()
        {
            switch (MediaType.Category)
            {
                case MediaCategory.Image:
                    return new ImageMedia
                    {
                        Id = Id,
                        Name = Name,
                        MediaType = MediaType,
                        FilePath = Path,
                        IsPublic = true,
                        Source = Source,
                        ShowCopyright = ShowCopyright,
                        Versions = Versions,
                        Title = Name,
                        Alt = Name,
                        Height = 0,
                        Width = 0,
                        Size = 0,
                    };
                case MediaCategory.Audio:
                    return new AudioMedia
                    {
                        Id = Id,
                        Name = Name,
                        MediaType = MediaType,
                        FilePath = Path,
                        IsPublic = true,
                        Duration = 0
                    };
                default:
                    // Cannot have general files in the mobile app
                    throw new InvalidOperationException
                        ("Media type must be image or audio for mobile application");                    
            }
        }

    }    
}
