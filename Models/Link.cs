using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum Color { Default, Dark, Danger, Info, Primary, Warning }
    public enum Align { Default, Center, Block, Left, Right }

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
        public Color Color { get; set; }
        [Required]
        public Align Align { get; set; }


        // Navigation Properties
        public List<TextField> TextFields { get; set; }
        // End Navigation Properties
    }
}
