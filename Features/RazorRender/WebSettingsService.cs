using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Deepcove_Trust_Website.Data;

namespace Deepcove_Trust_Website.Features.RazorRender
{
    public class WebSettingsService
    {
        WebsiteDataContext _Db;
        public Models.WebsiteSettings Settings { get; set; }

        public WebSettingsService(WebsiteDataContext db)
        {
            _Db = db;
            Settings = _Db.WebsiteSettings.FirstOrDefault();
        }

        public string FacebookUrl
        {
            get => Settings.FacebookUrl;
        }

        public string PhoneNumber
        {
            get => Settings.ContactPhone;
        }

        public string Email
        {
            get => Settings.ContactEmail;
        }

        public string MissionStatment
        {
            get => Settings.MissionStatment;
        }

        public QuickLinks GetQuickLinks()
        {
            return new QuickLinks
            {
                A = new Section {
                    Title = Settings.QLinksTitleA,
                    Pages = new List<string>()
                },
                B = new Section
                {
                    Title = Settings.QLinksTitleB,
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
