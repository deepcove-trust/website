using Deepcove_Trust_Website.DiscoverDeepCove;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace deepcove_dotnet.Data.SeedClasses
{
    public class QuestionSeeder
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int? CorrectAnswerId { get; set; }
        public bool? TrueFalseAnswer { get; set; }
        public int? ImageId { get; set; }
        public List<QuizAnswer> Answers { get; set; }

        public QuizQuestion ToQuestion(int quizId, bool includeCorrectAnswers)
        {
            return new QuizQuestion
            {
                Id = Id,
                QuizId = quizId,
                Text = Text,
                CorrectAnswerId = includeCorrectAnswers ? CorrectAnswerId : null,
                ImageId = ImageId,
                TrueFalseAnswer = TrueFalseAnswer
            };
                
        }

        public List<QuizAnswer> GetAnswers() => Answers;
    }
}
