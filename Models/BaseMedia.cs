using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum MediaCategory
    {
        Image, Audio, General
    }

    public class MediaType
    {
        public int Index { get; private set; }
        public string Value { get; private set; }
        public string Mime { get; set; }
        public MediaCategory Category { get; private set; }

        public static MediaType[] All => new[] { Jpg, Png, Wav, Mp3, Doc, Docx, Pdf, Xls, Xlsx };

        public static MediaType Jpg = new MediaType { Index = 0, Value = "Jpg", Mime = "image/jpg", Category = MediaCategory.Image };
        public static MediaType Png = new MediaType { Index = 1, Value = "Png", Mime = "image/png", Category = MediaCategory.Image };
        public static MediaType Wav = new MediaType { Index = 2, Value = "Wav", Mime = "audio/wav", Category = MediaCategory.Audio };
        public static MediaType Mp3 = new MediaType { Index = 3, Value = "Mp3", Mime = "audio/mp3", Category = MediaCategory.Audio };
        public static MediaType Doc = new MediaType { Index = 4, Value = "Doc", Mime = "", Category = MediaCategory.General };
        public static MediaType Docx = new MediaType { Index = 5, Value = "Docx", Mime = "", Category = MediaCategory.General };
        public static MediaType Pdf = new MediaType { Index = 6, Value = "Pdf", Mime = "", Category = MediaCategory.General };
        public static MediaType Xls = new MediaType { Index = 7, Value = "Xls", Mime = "", Category = MediaCategory.General };
        public static MediaType Xlsx = new MediaType { Index = 8, Value = "Xlsx", Mime = "", Category = MediaCategory.General };

        public static explicit operator MediaType(int i) => All[i];
    }

    abstract public class BaseMedia : BaseEntity
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("mediaType")]
        [JsonConverter(typeof(StringEnumConverter))]
        public MediaType MediaType { get; set; }
        [JsonProperty("path")]
        public string Path { get; set; }
        [JsonProperty("isPublic")]
        public bool IsPublic { get; set; }
        [JsonProperty("size")]
        public int Size { get; set; }

        [NotMapped]
        [JsonProperty("filename")]
        public string Filename { get => System.IO.Path.GetFileName(Path); }

        public List<string> Tags()
        {
            return new List<string>(); // Todo
            // ["Website", "Education", "Fact Files", "App Activities", "App Quiz"]
        }

        public MediaCategory GetCategory() => MediaType.Category;
    }
}
