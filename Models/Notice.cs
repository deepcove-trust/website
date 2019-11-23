using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum Noticeboard { all, mobile, web }

    public class Notice : BaseEntity
    {
        public int Id { get; set; }
        public Noticeboard Noticeboard { get; set; }
        public bool Urgent { get; set; }
        public int ImageId { get; set; }
        public string Title { get; set; }
        public string ShortDesc { get; set; }
        public string LongDesc { get; set; }

        // Nav properties

        public ImageMedia Image { get; set; }

        // End nav properties

    }
}
