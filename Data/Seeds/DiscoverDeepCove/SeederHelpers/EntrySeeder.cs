using deepcove_dotnet.Models.DataModels.FactFile;
using deepcove_dotnet.Models.DataModels.JunctionModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace deepcove_dotnet.Data.SeedClasses
{
    public class EntrySeeder
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string PrimaryName { get; set; }
        public string AltName { get; set; }
        public string BodyText { get; set; }
        public int? ListenAudioId { get; set; }
        public int? PronounceAudioId { get; set; }
        public int MainImageId { get; set; }
        public List<int> GalleryImages { get; set; }
        public List<NuggetSeeder> Nuggets { get; set; }

        public FactFileEntry ToFactFileEntry()
        {
            return new FactFileEntry
            {
                Id = Id,
                CategoryId = CategoryId,
                PrimaryName = PrimaryName,
                AltName = AltName,
                BodyText = BodyText,
                ListenAudioId = ListenAudioId,
                PronounceAudioId = PronounceAudioId,
                MainImageId = MainImageId
            };
        }

        public List<FactFileNugget> GetFactFileNuggets()
        {
            return Nuggets?.Select(n => n.ToFactFileNugget(Id)).ToList();
        }

        public List<FactFileEntryImage> GetFactFileEntryImages()
        {
            return GalleryImages?.Select(s => new FactFileEntryImage
            {
                FactFileEntryId = Id,
                MediaFileId = s
            }).ToList();
        }
    }
}
