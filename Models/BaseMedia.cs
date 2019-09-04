using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum MediaType
    {
        Jpg,
        Png,
        Gif,
        Bmp,
        Wav,
        Mp3,
        Doc,
        DocX,
        Pdf,
        Xls,
        XlsX
    }

    abstract public class BaseMedia : BaseEntity
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("mediaType")]
        public MediaType MediaType { get; set; }
        [JsonProperty("fileName")]
        [JsonConverter(typeof(StringEnumConverter))]
        public string Filename { get; set; }
        [JsonProperty("isPublic")]
        public bool IsPublic { get; set; }
        [JsonProperty("size")]
        public int Size { get; set; }
    }
}
