using System.Linq;
using System.Collections.Generic;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.Features.RazorRender
{
    public class WebSettingsService
    {
        WebsiteDataContext _Db;
        private SystemSettings Settings { get; set; }
        private List<Page> QuickLinkPages { get; set; }


        public WebSettingsService(WebsiteDataContext db)
        {
            _Db = db;
            Settings = _Db.SystemSettings.OrderByDescending(o => o.Id).FirstOrDefault();
            QuickLinkPages = _Db.Pages.Where(c => c.QuickLink != QuickLinkSection.None).ToList();
        }

        public string FacebookUrl => Settings.UrlFacebook;

        public string GooglePlayUrl => Settings.UrlGooglePlay;

        public string PhoneNumber => Settings.Phone;

        public string Email => Settings.EmailGeneral;

        public string MissionStatment => Settings.FooterText;

        public QuickLinks GetQuickLinks()
        {
            return new QuickLinks
            {
                A = new Section {
                    Title = Settings.LinkTitleA,
                    Pages = QuickLinkPages.Where(c => c.QuickLink == QuickLinkSection.A).OrderBy(o => o.Name).ToList()
                },
                B = new Section
                {
                    Title = Settings.LinkTitleB,
                    Pages = QuickLinkPages.Where(c => c.QuickLink == QuickLinkSection.B).OrderBy(o => o.Name).ToList()
                }
            };
        }
    }

    public struct QuickLinks
    {
        public Section A;
        public Section B;
    }

    public struct Section
    {
        public string Title;
        public List<Page> Pages;
    }
}
