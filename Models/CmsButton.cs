using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum Color {
        [EnumMember(Value = "dark")]
        Dark,
        [EnumMember(Value = "danger")]
        Danger,
        [EnumMember(Value = "info")]
        Info,
        [EnumMember(Value = "primary")]
        Primary,
        [EnumMember(Value = "success")]
        Success,
        [EnumMember(Value = "warning")]
        Warning 
    }

    public enum Align {
        [EnumMember(Value = "")]
        Default,
        [EnumMember(Value = "center")]
        Center,
        [EnumMember(Value = "block")] 
        Block,
        [EnumMember(Value = "left")]
        Left,
        [EnumMember(Value = "right")] 
        Right 
    }

    public class CmsButton : IEquatable<CmsButton>
    {
        public int Id { get; set; }
        [Required]
        public string Text { get; set; }
        [Required]
        public string Href { get; set; }

        [Required]
        [JsonConverter(typeof(Color))]
        public Color Color { get; set; }
        [Required]
        [JsonConverter(typeof(Align))]
        public Align Align { get; set; }


        // Navigation Properties
        public List<TextComponent> TextFields { get; set; }
        // End Navigation Properties

        public bool Equals(CmsButton other)
        {
            return Text == other.Text
                && Href == other.Href
                && Color == other.Color
                && Align == other.Align;
        }
    }
}
