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
        [EnumMember(Value = "default")]
        Default,
        [EnumMember(Value = "dark")]
        Dark,
        [EnumMember(Value = "danger")]
        Danger,
        [EnumMember(Value = "info")]
        Info,
        [EnumMember(Value = "primary")]
        Primary,
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

    public class Link
    {
        public int Id { get; set; }
        [Required]
        public string Text { get; set; }
        [Required]
        public string Href { get; set; }
        [Required]
        public bool IsButton { get; set; }
        [Required]
        [JsonConverter(typeof(Color))]
        public Color Color { get; set; }
        [Required]
        [JsonConverter(typeof(Align))]
        public Align Align { get; set; }


        // Navigation Properties
        public List<TextField> TextFields { get; set; }
        // End Navigation Properties
    }
}
