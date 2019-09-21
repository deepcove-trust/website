using deepcove_dotnet.Data.SeedClasses;
using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.DiscoverDeepCove;
using Deepcove_Trust_Website.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace deepcove_dotnet.Data
{    
    public static class DiscoverDeepCoveSeeder
    {
        public static void Seed(WebsiteDataContext context)
        {
            // Check whether database has already got data in it.
            Config cfg = context.Config.Find(1);
            if (cfg != null) return;

            //------------------------------------------------------------------

            StreamReader mediaJson = new StreamReader("Data/Json/media.json");
            List<BaseMedia> media = JsonConvert.DeserializeObject<List<BaseMedia>>(mediaJson.ReadToEnd());
            mediaJson.Close();

            context.AddRange(media);

            //------------------------------------------------------------------

            StreamReader tracksJson = new StreamReader("Data/Json/tracks.json");
            List<TrackSeeder> tracks = JsonConvert.DeserializeObject<List<TrackSeeder>>(tracksJson.ReadToEnd());
            tracksJson.Close();

            context.AddRange(tracks.Select(t => t.ToTrack()));
            context.AddRange(tracks.Select(t => t.GetActivities())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));
            context.AddRange(tracks.Select(t => t.GetActivityImages())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));

            //-----------------------------------------------------------------

            StreamReader categoriesJson = new StreamReader("Data/Json/categories.json");
            List<FactFileCategory> categories = JsonConvert.DeserializeObject<List<FactFileCategory>>(categoriesJson.ReadToEnd());
            categoriesJson.Close();

            context.AddRange(categories);

            //------------------------------------------------------------------

            StreamReader entriesJson = new StreamReader("Data/Json/entries.json");
            List<EntrySeeder> entries = JsonConvert.DeserializeObject<List<EntrySeeder>>(entriesJson.ReadToEnd());
            entriesJson.Close();

            context.AddRange(entries.Select(e => e.ToFactFileEntry()));
            context.AddRange(entries.Select(e => e.GetFactFileEntryImages())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));
            context.AddRange(entries.Select(e => e.GetFactFileNuggets())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));

            //-------------------------------------------------------------------

            StreamReader quizzesJson = new StreamReader("Data/Json/quizzes.json");
            List<QuizSeeder> quizzes = JsonConvert.DeserializeObject<List<QuizSeeder>>(quizzesJson.ReadToEnd());
            quizzesJson.Close();

            context.AddRange(quizzes.Select(q => q.ToQuiz()));
            // Intially we cannot save correct answer IDs due to foreign key constraint. Will save without and add later.
            context.AddRange(quizzes.Select(q => q.GetQuestions(includeCorrectAnswers: false))?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));
            context.AddRange(quizzes.Select(q => q.GetAnswers())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));

            //--------------------------------------------------------------------

            context.Add(new Config { MasterUnlockCode = "quizmaster" });

            context.SaveChanges();

            // Detach all entries from the tracker so that we can update questions with their correct answer IDs.
            List<EntityEntry> entityEntries = context.ChangeTracker.Entries().ToList();
            foreach (var entry in entityEntries)
                entry.State = EntityState.Detached;

            context.UpdateRange(quizzes.Select(q => q.GetQuestions(includeCorrectAnswers: true))?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));
            
            // Save the database with the added correct answer IDs.
            context.SaveChanges();
        }
    }
}
