using Deepcove_Trust_Website.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    public class QuizAnswer
    {
        public int Id { get; set; }        
        public int QuizQuestionId { get; set; }
        public int? ImageId { get; set; }
        public string Text { get; set; }

        // Navigation properties -------------------
        [InverseProperty("Answers")]
        public QuizQuestion QuizQuestion { get; set; }
        [InverseProperty("CorrectAnswer")]
        public QuizQuestion CorrectForQuestion { get; set; }
        public ImageMedia Image { get; set; }
    }
}
