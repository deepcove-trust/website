using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;

namespace Deepcove_Trust_Website.Models
{
    public enum MediaCategory
    {
        Image, Audio, General
    }

    public class MediaType
    {
        public int Index { get; private set; }
        public string Value { get; private set; }
        public string Mime { get; set; }
        public MediaCategory Category { get; private set; }

        public static MediaType[] All => new[] { Jpg, Png, Wav, Mp3, Doc, Docx, Pdf, Xls, Xlsx, Jpeg, Mpeg };

        public static MediaType Jpg = new MediaType { Index = 0, Value = "Jpg", Mime = "image/jpg", Category = MediaCategory.Image };
        public static MediaType Png = new MediaType { Index = 1, Value = "Png", Mime = "image/png", Category = MediaCategory.Image };
        public static MediaType Wav = new MediaType { Index = 2, Value = "Wav", Mime = "audio/wav", Category = MediaCategory.Audio };
        public static MediaType Mp3 = new MediaType { Index = 3, Value = "Mp3", Mime = "audio/mp3", Category = MediaCategory.Audio }; // Chrome uses audio/mp3
        public static MediaType Doc = new MediaType { Index = 4, Value = "Doc", Mime = "application/msword", Category = MediaCategory.General };
        public static MediaType Docx = new MediaType { Index = 5, Value = "Docx", Mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document", Category = MediaCategory.General };
        public static MediaType Pdf = new MediaType { Index = 6, Value = "Pdf", Mime = "application/pdf", Category = MediaCategory.General };
        public static MediaType Xls = new MediaType { Index = 7, Value = "Xls", Mime = "application/vnd.ms-excel", Category = MediaCategory.General };
        public static MediaType Xlsx = new MediaType { Index = 8, Value = "Xlsx", Mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Category = MediaCategory.General };
        public static MediaType Jpeg = new MediaType { Index = 9, Value = "Jpeg", Mime = "image/jpeg", Category = MediaCategory.Image };
        public static MediaType Mpeg = new MediaType { Index = 3, Value = "Mp3", Mime = "audio/mpeg", Category = MediaCategory.Audio }; // Non-chrome browsers use audio/mpeg

        public static explicit operator MediaType(int i) => All[i];

        /// <summary>
        /// Returns a list of the mime type strings for the selected category
        /// </summary>
        public static List<string> MimesForCategory(MediaCategory category) => All.Where(t => t.Category == category).Select(t => t.Mime).ToList();

        public static MediaType FromString(string s) => All.Where(w => w.Mime.EqualsIgnoreCase(s)).FirstOrDefault();
    }

    abstract public class BaseMedia : BaseEntity
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("mediaType")]
        [JsonConverter(typeof(StringEnumConverter))]
        public MediaType MediaType { get; set; }
        [JsonProperty("path")]
        public string FilePath { get; set; }
        [JsonProperty("source")]
        public string Source { get; set; }
        [JsonProperty("showCopyright")]
        public bool ShowCopyright { get; set; }
        [JsonProperty("isPublic")]
        public bool IsPublic { get; set; }
        [JsonProperty("size")]
        public long Size { get; set; }

        [NotMapped]
        [JsonProperty("filename")]
        public string Filename { get => System.IO.Path.GetFileName(FilePath); }

        public List<string> Tags()
        {
            return new List<string>(); // Todo
            // ["Website", "Education", "Fact Files", "App Activities", "App Quiz"]
        }

        public MediaCategory GetCategory() => MediaType.Category;

        public long GetFileSize(int imageWidth = 0)
        {
            // If not an image, return the uploaded file size
            if (MediaType.Category != MediaCategory.Image)
                return Size;

            // Otherwise, return size of appropriate version
            string bestImagePath = ((ImageMedia)this).GetImagePath(imageWidth);
            return new FileInfo(bestImagePath).Length;
        }

        public Dictionary<String, HashSet<string>> GetUsages(WebsiteDataContext db)
        {
            Dictionary<String, HashSet<string>> usages = new Dictionary<string, HashSet<string>>();

            // Mobile App Checks ---------------------------------------------------

            // Activities
            HashSet<string> activities = db.Activities.Where(a => a.ImageId == Id).Select(a => a.Title).ToHashSet();
            activities = activities.Concat(db.ActivityImages.Include(ai => ai.Activity).Where(ai => ai.ImageId == Id).Select(ai => ai.Activity.Title)).ToHashSet();
            if(activities.Count > 0)
                usages.Add("Activities", activities);

            // Fact Files
            HashSet<string> factfiles = db.FactFileEntries.Where(e => e.MainImageId == Id || e.PronounceAudioId == Id || e.ListenAudioId == Id).Select(e => e.PrimaryName).ToHashSet();
            factfiles = factfiles.Concat(db.FactFileEntryImages.Include(ei => ei.FactFileEntry).Where(ei => ei.MediaFileId == Id).Select(ei => ei.FactFileEntry.PrimaryName)).ToHashSet();
            factfiles = factfiles.Concat(db.FactFileNuggets.Include(n => n.FactFileEntry).Where(n => n.ImageId == Id).Select(n => n.FactFileEntry.PrimaryName)).ToHashSet();
            if (factfiles.Count > 0)
                usages.Add("FactFileEntries", factfiles);

            // Quizzes
            HashSet<string> quizzes = db.Quizzes.Where(q => q.ImageId == Id).Select(q => q.Title).ToHashSet();
            quizzes = quizzes.Concat(db.QuizQuestions.Include(qq => qq.Quiz).Where(qq => qq.ImageId == Id || qq.AudioId == Id).Select(qq => qq.Quiz.Title)).ToHashSet();
            quizzes = quizzes.Concat(db.QuizAnswers.Include(qa => qa.QuizQuestion).ThenInclude(qq => qq.Quiz).Where(qa => qa.ImageId == Id).Select(qa => qa.QuizQuestion.Quiz.Title)).ToHashSet();
            if (quizzes.Count > 0)
                usages.Add("Quizzes", quizzes);

            // End Mobile App Checks -----------------------------------------------

            // Media components - we only care about the latest revisions
            List<PageRevision> currentRevisions = db.Pages.Include(p => p.PageRevisions).ThenInclude(r => r.RevisionMediaComponents)
                .ThenInclude(rmc => rmc.MediaComponent).ThenInclude(mc => mc.ImageMedia).Select(p => p.GetRevision(null)).ToList();
            HashSet<string> pages = currentRevisions.Where(r => r.RevisionMediaComponents.Any(mc => mc.MediaComponent.ImageMediaId == Id)).Select(r => r.Page.Name).ToHashSet();
            if (pages.Count > 0)
                usages.Add("Pages", pages);

            // Button links
            // Todo: Also a bit tricky since these aren't linked in the database, only via HREF properties

            return usages;
        }

        /// <summary>
        /// A response header that will download the file rather than view it in the browser. Usage: 
        /// </summary>
        /// <returns><see cref="KeyValuePair{String, StringValues}"/></returns>
        public KeyValuePair<string, StringValues> DownloadHeader()
        {
            string fileName = $"{Name}.{MediaType.Value.ToLower()}";
            return new KeyValuePair<string, StringValues>("Content-Disposition", $"attachment; filename={fileName}");
        }
    }
}
