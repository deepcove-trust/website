using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public class TextComponent : IEquatable<TextComponent>
    {
        public int Id { get; set; }
        [Required]
        public int SlotNo { get; set; }                
        public string Text { get; set; }


        // Navigation Properties
        public List<RevisionTextComponent> RevisionTextComponents { get; set; }
        [JsonProperty("button")]
        public CmsButton CmsButton { get; set; }
        // End Navigation Properties

        public bool Equals(TextComponent other)
        {
            return other != null
                && SlotNo == other.SlotNo
                && Text == other.Text
                && CmsButton == other.CmsButton;
        }
    }
}
