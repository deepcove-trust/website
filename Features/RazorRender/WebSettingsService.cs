using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public string FacebookUrl
        {
            get => Settings.UrlFacebook;
        }

        public string GooglePlayUrl
        {
            get => Settings.UrlGooglePlay;
        }

        public string PhoneNumber
        {
            get => Settings.Phone;
        }

        public string Email
        {
            get => Settings.EmailGeneral;
        }

        public string MissionStatment
        {
            get => Settings.FooterText;
        }

        public QuickLinks GetQuickLinks()
        {
            return new QuickLinks
            {
                A = new Section {
                    Title = Settings.LinkTitleA,
                    Pages = new List<string>()
                },
                B = new Section
                {
                    Title = Settings.LinkTitleB,
                    Pages = new List<string>()
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
        public List<string> Pages;
    }
}
