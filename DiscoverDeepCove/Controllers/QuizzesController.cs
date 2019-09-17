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
                        s.UpdatedAt
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
                var Quiz = _Db.Quizzes.Where(c => c.Id == id)
                    .Select(s => new
                    {
                        s.Id,
                        s.Title,
                        Cover_Image_Id = s.Image.Id,
                        Questions = s.Questions.Select(question => new
                        {
                            question.Id,
                            Audio_Id = question.Audio.Id,
                            Image_Id = question.Image.Id,
                            Quiz_Id = question.Quiz.Id,
                            question.Text,
                            TrueFalseAnswer = question.TrueFalseAnswer ?? null,
                            Answers = question.Answers.Select(answer => new
                            {
                                answer.Id,
                                Image_Id = answer.Image.Id,
                                answer.Text
                            }).ToList(),
                            Correct_Answer_Id = question.CorrectAnswer.Id
                        }).ToList(),
                        s.UnlockCode,
                        s.UpdatedAt
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