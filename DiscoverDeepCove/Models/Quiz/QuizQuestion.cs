using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Deepcove_Trust_Website.Models;
using Newtonsoft.Json;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class QuizQuestion
    {
        public int Id { get; set; }
        public int? CorrectAnswerId { get; set; }
        public int? ImageId { get; set; }
        public int? AudioId { get; set; }
        public int QuizId { get; set; } 

        [JsonProperty("true_false_answer")]
        public bool? TrueFalseAnswer { get; set; }

        public string Text { get; set; }

        // Navigation Properties
        public AudioMedia Audio { get; set; }
        [InverseProperty("QuizQuestion")]
        public List<QuizAnswer> Answers { get; set; }

        [JsonProperty("correct_answer")]
        [InverseProperty("CorrectForQuestion")]
        public QuizAnswer CorrectAnswer { get; set; }

        public ImageMedia Image { get; set; }

        public Quiz Quiz { get; set; }
        // End Navigation Properties
    }
}
