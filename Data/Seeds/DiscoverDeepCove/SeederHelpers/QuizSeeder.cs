using Deepcove_Trust_Website.DiscoverDeepCove;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace deepcove_dotnet.Data.SeedClasses
{
    public class QuizSeeder
    {
        public int Id { get; set; }
        public int ImageId { get; set; }
        public string UnlockCode { get; set; }
        public bool Active { get; set; }
        public string Title { get; set; }
        public List<QuestionSeeder> Questions { get; set; }

        public Quiz ToQuiz()
        {
            return new Quiz
            {
                Id = Id,
                Title = Title,
                ImageId = ImageId,
                UnlockCode = UnlockCode,
                Active = Active
            };
        }

        public List<QuizQuestion> GetQuestions(bool includeCorrectAnswers)
        {
            return Questions?.Select(q => q.ToQuestion(Id, includeCorrectAnswers)).ToList();
        }

        public List<QuizAnswer> GetAnswers()
        {
            if (Questions == null) return null;

            List<QuizAnswer> answers = new List<QuizAnswer>();

            foreach(QuestionSeeder qSeeder in Questions)
            {
                List<QuizAnswer> qAns = qSeeder.GetAnswers();

                if(qAns != null)
                   answers = answers.Concat(qAns).ToList();
            }

            return answers;
        }
    }
}
