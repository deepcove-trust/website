using Deepcove_Trust_Website.DiscoverDeepCove;
using System.Collections.Generic;
using System.Linq;

namespace Deepcove_Trust_Website.Data.Seeds.DiscoverDeepCove.SeederHelpers
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
