using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.DiscoverDeepCove;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.App
{
    [Authorize]
    [Area("admin-portal,app")]
    [Route("/api/admin/app/quizzes")]
    public class ManageQuizzesController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<ManageQuizzesController> _Logger;

        public ManageQuizzesController(WebsiteDataContext db, ILogger<ManageQuizzesController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        // Get quiz list
        // Get quiz details

        // Add new quiz
        // Update quiz (active, unlock, title)
        // Delete quiz

        // Add new question
        // Update question
        // Delete question        

        // GET: /admin/app/quizzes
        public async Task<IActionResult> GetQuizzes()
        {
            try
            {
                return Ok(await _Db.Quizzes.Include(q => q.Questions).Include(q => q.Image).Select(q => new
                {
                    q.Id,
                    q.Title,
                    q.UpdatedAt,
                    q.Active,
                    q.UnlockCode,
                    questionCount = q.Questions.Count,
                    image = q.Image != null ? new
                    {
                        id = q.Image.Id,
                        filename = q.Image.Filename
                    } : null
                }).ToListAsync());
            }
            catch(Exception ex)
            {
                _Logger.LogError("Error retrieving quizzes", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }

        // GET: /admin/app/quizzes/{id:int}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetQuiz(int id)
        {
            try
            {
                Quiz quiz = await _Db.Quizzes
                    .Include(q => q.Image)
                    .Include(q => q.Questions)
                        .ThenInclude(quest => quest.Image)
                    .Include(q => q.Questions)
                        .ThenInclude(quest => quest.Audio)
                    .Include(q => q.Questions)
                        .ThenInclude(quest => quest.Answers)
                            .ThenInclude(ans => ans.Image)
                    .Where(q => q.Id == id)
                    .FirstOrDefaultAsync();

                if (quiz == null) return NotFound(new ResponseHelper("Something went wrong, please contact a developer if the problem persists", "Quiz not found in database"));

                return Ok(new { 
                    quiz.Id,
                    quiz.Title,
                    quiz.UnlockCode,
                    quiz.Active,
                    image = new
                    {
                        quiz.Image.Id,
                        quiz.Image.Filename                        
                    },
                    questions = quiz.Questions.OrderBy(q => q.OrderIndex).Select(q => new { 
                        q.Id,
                        questionType = q.GetQuestionType(),
                        q.TrueFalseAnswer,
                        image = q.Image != null ? new
                        {
                            q.Image.Id,
                            q.Image.Filename
                        } : null,
                        audio = q.Audio != null ? new
                        {
                            q.Audio.Id,
                            q.Audio.Filename
                        } : null,
                        q.Text,
                        answers = q.Answers.Select(a => new { 
                            a.Id,
                            a.Text,
                            image = a.Image != null ? new { 
                                a.Image.Id,
                                a.Image.Filename
                            } : null
                        })
                    })
                });
            }
            catch (Exception ex)
            {
                _Logger.LogError("Error retrieving quiz data", ex.Message);
                _Logger.LogError(ex.StackTrace);
                return BadRequest(new ResponseHelper("Something went wrong, please try again in a few minutes.", ex.Message));
            }
        }
    }
}
