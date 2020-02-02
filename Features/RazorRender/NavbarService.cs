using System.Linq;
using System.Collections.Generic;
using Deepcove_Trust_Website.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Routing;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.Features.RazorRender
{
    public class NavbarService
    {
        readonly WebsiteDataContext _Db;
        readonly List<NavItem> navItems;

        public NavbarService(WebsiteDataContext db)
        {
            _Db = db;

            navItems = _Db.NavItems
                .Include(nav => nav.Page)
                .Include(nav => nav.NavItemPages)
                    .ThenInclude(nip => nip.Page).ToList();
        }

        public List<NavItem> MainSection
        {
            get
            {
                return navItems.Where(navItem => navItem.Section == Models.Section.main)
                    .OrderBy(o => o.OrderIndex).ToList();
            }
        }

        public List<NavItem> EducationSection
        {
            get
            {
                return navItems.Where(navItem => navItem.Section == Models.Section.education)
                    .OrderBy(o => o.OrderIndex).ToList();
            }
        }

        public List<NavItem> GetNavItemsBySection(Models.Section s)
        {
            return navItems.Where(navItem => navItem.Section == s)
                .OrderBy(o => o.OrderIndex).ToList();
        }

        public Models.Section GetWebsiteSection(string action)
        {
            return (string.IsNullOrEmpty(action) || action == "MainPage" || action == "HomePage") ? Models.Section.main : Models.Section.education;
        }
    }
}
