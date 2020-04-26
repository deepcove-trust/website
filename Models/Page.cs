using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Models
{
    public enum Section { main, education }
    public enum QuickLinkSection { None, A, B}

    public class Page : BaseEntity
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Public { get; set; }
        [Required]
        public Section Section { get; set; }
        public QuickLinkSection QuickLink { get; set; }

        // Navigation Properties        
        public List<PageRevision> PageRevisions { get; set; }
        public List<NavItem> NavItems { get; set; }
        public List<NavItemPage> NavItemPages { get; set; }
        // End Navigation Properties

        /// <summary>
        /// Returns the latest page revision.
        /// </summary>
        /// <see cref="PageRevision"/>
        public PageRevision Latest
        {
            get
            {
                if (PageRevisions == null)
                    return null;

                return PageRevisions.OrderByDescending(e => e.Id).FirstOrDefault();
            }
        }

        /// <summary>
        /// Returns the revision that has the ID provided. If no ID is provided the most recent revision is provided.
        /// </summary>
        /// <param name="id">Revision ID</param>
        /// <returns>Page revision or null</returns>
        /// <see cref="PageRevision"/>
        public PageRevision GetRevision(int? id = null)
        {
            if (id == null)
            {
                return Latest;
            }
            else
            {
                return PageRevisions.Where(c => c.Id == (int)id).FirstOrDefault();
            }
        }

        public string AbsoluteUrl
        {
            get
            {
                string pageNameUrl = Name.ToLower().Replace(' ', '-');
                return Section == Section.main ? $"/{pageNameUrl}" : $"/education/{pageNameUrl}";
            }
        }
    }
}
