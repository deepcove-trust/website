using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;

using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

using Deepcove_Trust_Website.DiscoverDeepCove;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.Data.Seeds.DiscoverDeepCove.SeederHelpers
{
    public static class DiscoverDeepCoveSeeder
    {
        static string basePath = Path.Combine("Data", "Seeds", "DiscoverDeepCove");

        public static void Seed(WebsiteDataContext context)
        {
            // Check whether database has already got data in it.
            Config cfg = context.Config.Find(1);
            if (cfg != null) return;

            //------------------------------------------------------------------            

            StreamReader mediaJson = new StreamReader(Path.Combine(basePath, "media.json"));
            List<MediaSeeder> media = JsonConvert.DeserializeObject<List<MediaSeeder>>(mediaJson.ReadToEnd());
            mediaJson.Close();

            List<ImageMedia> images = media.Where(m => m.MediaType.Category == MediaCategory.Image).Select(m => (ImageMedia)m.ToBaseMedia()).ToList();
            List<AudioMedia> audios = media.Where(m => m.MediaType.Category == MediaCategory.Audio).Select(m => (AudioMedia)m.ToBaseMedia()).ToList();

            context.AddRangeWithIdentityInsert(images, "Media");
            context.AddRangeWithIdentityInsert(audios, "Media");

            //------------------------------------------------------------------

            StreamReader categoriesJson = new StreamReader(Path.Combine(basePath, "categories.json"));
            List<FactFileCategory> categories = JsonConvert.DeserializeObject<List<FactFileCategory>>(categoriesJson.ReadToEnd());
            categoriesJson.Close();

            context.AddRangeWithIdentityInsert(categories, "FactFileCategories");

            //-----------------------------------------------------------------
            
            StreamReader entriesJson = new StreamReader(Path.Combine(basePath, "entries.json"));
            List<EntrySeeder> entries = JsonConvert.DeserializeObject<List<EntrySeeder>>(entriesJson.ReadToEnd());
            entriesJson.Close();

            context.AddRangeWithIdentityInsert(entries.Select(e => e.ToFactFileEntry()), "FactFileEntries");
            context.AddRange(entries.Select(e => e.GetFactFileEntryImages())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));
            context.AddRange(entries.Select(e => e.GetFactFileNuggets())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));

            //------------------------------------------------------------------

            StreamReader tracksJson = new StreamReader(Path.Combine(basePath, "tracks.json"));
            List<TrackSeeder> tracks = JsonConvert.DeserializeObject<List<TrackSeeder>>(tracksJson.ReadToEnd());
            tracksJson.Close();


            context.AddRangeWithIdentityInsert(tracks.Select(t => t.ToTrack()), "Tracks");
            context.AddRangeWithIdentityInsert(tracks.Select(t => t.GetActivities())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1), "Activities");
            context.AddRange(tracks.Select(t => t.GetActivityImages())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1));
            

            //-------------------------------------------------------------------

            StreamReader quizzesJson = new StreamReader(Path.Combine(basePath, "quizzes.json"));
            List<QuizSeeder> quizzes = JsonConvert.DeserializeObject<List<QuizSeeder>>(quizzesJson.ReadToEnd());
            quizzesJson.Close();

            context.AddRangeWithIdentityInsert(quizzes.Select(q => q.ToQuiz()), "Quizzes");
            // Intially we cannot save correct answer IDs due to foreign key constraint. Will save without and add later.
            context.AddRangeWithIdentityInsert(quizzes.Select(q => q.GetQuestions(includeCorrectAnswers: false))?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1), "QuizQuestions");
            context.AddRangeWithIdentityInsert(quizzes.Select(q => q.GetAnswers())?.Aggregate((l1, l2) => l2 != null ? l1.Concat(l2).ToList() : l1), "QuizAnswers");

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
