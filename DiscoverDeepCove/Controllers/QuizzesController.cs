using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Deepcove_Trust_Website.Data;
using Microsoft.Extensions.Logging;

namespace Deepcove_Trust_Website.DiscoverDeepCove
{
    [Route("/api/app/quizzes")]
    public class QuizzesController : Controller
    {
        private WebsiteDataContext _Db;
        private ILogger<QuizzesController> _Logger;

        public QuizzesController(WebsiteDataContext db, ILogger<QuizzesController> logger)
        {
            _Db = db;
            _Logger = logger;
        }


        public IActionResult Index()
        {
            try
            {
                var Quizzes = _Db.Quizzes.Where(c => c.Active)
                    .Select(s => new
                    {
                        s.Id,
                        s.Title,
                        updated_at = s.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                    }).ToList();

                return Ok(Quizzes);
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving quiz list: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }

        [HttpGet("{id:int}")]
        public IActionResult Quiz(int id)
        {
            try
            {
                var Quiz = _Db.Quizzes                    
                    .Where(c => c.Id == id)                    
                    .Select(s => new
                    {
                        s.Id,
                        s.Title,
                        Shuffle = s.Shuffle ? 1 : 0,
                        image_id = s.Image.Id,
                        unlock_code = s.UnlockCode,
                        updated_at = s.UpdatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                        questions = s.Questions.Select(question => new
                        {
                            question.Id,
                            audio_id = question.AudioId,
                            image_id = question.ImageId,
                            quiz_id = question.QuizId,
                            question.Text,
                            true_false_answer = question.TrueFalseAnswer,
                            answers = question.Answers != null ? question.Answers.Select(answer => new
                            {
                                answer.Id,
                                quiz_question_id = answer.QuizQuestionId,
                                image_id = answer.ImageId,
                                answer.Text
                            }).ToList() : null,
                            correct_answer_id = question.CorrectAnswerId
                        }).ToList(),                        
                    }).FirstOrDefault();

                if (Quiz == null) return NotFound();

                return Ok(Quiz);
            } 
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving quiz data: {0}", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest("Something went wrong, please try again later.");
            }
        }
    }
}