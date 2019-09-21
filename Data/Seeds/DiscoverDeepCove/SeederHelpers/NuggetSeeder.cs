using deepcove_dotnet.Models.DataModels.FactFile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace deepcove_dotnet.Data.SeedClasses
{
    public class NuggetSeeder
    {
        public int Id { get; set; }
        public int OrderIndex { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public int? ImageId { get; set; }

        public FactFileNugget ToFactFileNugget(int factFileId)
        {
            return new FactFileNugget
            {
                Id = Id,
                FactFileEntryId = factFileId,
                OrderIndex = OrderIndex,
                Name = Name,
                Text = Text,
                ImageId = ImageId
            };
        }

    }
}
