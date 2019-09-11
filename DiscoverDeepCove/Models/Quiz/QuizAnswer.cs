using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class QuizAnswer
    {
        public int Id { get; set; }

        public QuizQuestion Question { get; set; }

        public string Text { get; set; }

        public ImageMedia Image { get; set; }
    }
}
