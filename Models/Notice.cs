﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum Noticeboard { all, app, web }

    public class Notice : BaseEntity
    {
        public int Id { get; set; }
        public Noticeboard Noticeboard { get; set; }
        public bool Active { get; set; }
        public int Urgent { get; set; }
        [JsonProperty("image_id")]
        public int? ImageId { get; set; }
        public string Title { get; set; }
        [NotMapped]
        [JsonProperty("short_desc")]
        public string ShortDesc {
            get
            {
                string Val = LongDesc;
                if (string.IsNullOrEmpty(Val)) return "";
                return (Val.Length < 100) ? Val : Val.Substring(0, 100) + "...";
            }
        }
        [JsonProperty("long_desc")]
        public string LongDesc { get; set; }

        // Nav properties
        [JsonIgnore]
        public ImageMedia Image { get; set; }

        // End nav properties

    }
}
