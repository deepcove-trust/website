using System;
using System.Collections.Generic;

namespace Deepcove_Trust_Website.Models
{
    public class PageRevision : BaseEntity
    {
        public int Id { get; set; }
        public string Reason { get; set; }

        // Navigation Properties
        public Account CreatedBy { get; set; }
        public Page Page { get; set; }
        public PageTemplate Template { get; set; }
        public List<RevisionTextComponent> RevisionTextComponents { get; set; }
        public List<RevisionMediaComponent> RevisionMediaComponents { get; set; }
        // End Navigation Properties

        public object Created
        {
            get
            {
                return new
                {
                    At = CreatedAt.ToShortDateString(),
                    By = CreatedBy?.Name
                };
            }
        }
    }
}
