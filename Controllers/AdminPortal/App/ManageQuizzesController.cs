//using Deepcove_Trust_Website.Data;
//using Deepcove_Trust_Website.DiscoverDeepCove;
//using Deepcove_Trust_Website.Helpers;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Logging;
//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.Linq;
//using System.Threading.Tasks;
//using static Deepcove_Trust_Website.Helpers.Utils;

//namespace Deepcove_Trust_Website.Controllers.AdminPortal.App
//{
//    // Validation classes
//    class QuizUpdateArgs
//    {
//        public int Id { get; set; }
//        public bool Active { get; set; }
//        public bool Shuffle { get; set; }
//        public int? ImageId { get; set; }

//        [Required]
//        public string Title { get; set; }
//        public string UnlockCode { get; set; }
//    }

//    [Authorize]
//    [Area("admin-portal,app")]
//    [Route("/api/admin/app/quizzes")]
//    public class ManageQuizzesController : Controller
//    {
//        private readonly WebsiteDataContext _Db;
//        private readonly ILogger<ManageQuizzesController> _Logger;

//        public ManageQuizzesController(WebsiteDataContext db, ILogger<ManageQuizzesController> logger)
//        {
//            _Db = db;
//            _Logger = logger;
//        }

//        // Get quiz list
//        // Get quiz details

//        // Add new quiz
//        // Update quiz (active, unlock, title)
//        // Delete quiz

//        // Add new question
//        // Update question
//        // Delete question        

//        // GET: /api/admin/app/quizzes
//        public async Task<IActionResult> GetQuizzes()
//        {
//            return Ok(await _Db.Quizzes.Include(q => q.Questions).Include(q => q.Image).Select(q => new
//            {
//                q.Id,
//                q.Title,
//                q.UpdatedAt,
//                q.Active,
//                q.UnlockCode,
//                questionCount = q.Questions.Count,
//                image = q.Image != null ? new
//                {
//                    id = q.Image.Id,
//                    filename = q.Image.Filename
//                } : null
//            }).ToListAsync());
//        }

//        // GET: /api/admin/app/quizzes/{id:int}
//        [HttpGet("{id:int}")]
//        public async Task<IActionResult> GetQuiz(int id)
//        {
//            Quiz quiz = await _Db.Quizzes
//                    .Include(q => q.Image)
//                    .Include(q => q.Questions)
//                        .ThenInclude(quest => quest.Image)
//                    .Include(q => q.Questions)
//                        .ThenInclude(quest => quest.Audio)
//                    .Include(q => q.Questions)
//                        .ThenInclude(quest => quest.Answers)
//                            .ThenInclude(ans => ans.Image)
//                    .Where(q => q.Id == id)
//                    .FirstOrDefaultAsync();

//            if (quiz == null) return NotFound(new ResponseHelper("Something went wrong, please contact a developer if the problem persists", "Quiz not found in database"));

//            return Ok(new
//            {
//                quiz.Id,
//                quiz.Title,
//                quiz.UnlockCode,
//                quiz.Active,
//                quiz.Shuffle,
//                image = new
//                {
//                    quiz.Image.Id,
//                    quiz.Image.Filename
//                },
//                questions = quiz.Questions.OrderBy(q => q.OrderIndex).Select(q => new {
//                    q.Id,
//                    questionType = q.GetQuestionType(),
//                    q.TrueFalseAnswer,
//                    image = q.Image != null ? new
//                    {
//                        q.Image.Id,
//                        q.Image.Filename
//                    } : null,
//                    audio = q.Audio != null ? new
//                    {
//                        q.Audio.Id,
//                        q.Audio.Filename
//                    } : null,
//                    q.Text,
//                    answers = q.Answers.Select(a => new {
//                        a.Id,
//                        a.Text,
//                        image = a.Image != null ? new
//                        {
//                            a.Image.Id,
//                            a.Image.Filename
//                        } : null
//                    })
//                })
//            });
//        }

//        // POST: /api/admin/app/quizzes
//        [HttpPost]
//        public async Task<IActionResult> AddQuiz(IFormCollection data)
//        {
//            string unlockCode = data.Str("unlockCode");
//            string title = data.Str("title");
//            int imageId = data.Int("imageId");

//            // Crude validation - 422 is the correct code to return here
//            string failedFields = "";
//            if (imageId == 0) failedFields += "Image | ";
//            if (string.IsNullOrEmpty(title)) failedFields += "Title | ";

//            if (!string.IsNullOrEmpty(failedFields)) return UnprocessableEntity(new ResponseHelper("You must provide the following fields: " + failedFields));

//            Quiz newQuiz = new Quiz
//            {
//                Title = title,
//                ImageId = imageId,
//                UnlockCode = unlockCode
//            };

//            await _Db.AddAsync(newQuiz);

//            await _Db.SaveChangesAsync();

//            return Ok(newQuiz.Id);
//        }

//        // PATCH /api/admin/app/quizzes/{id:int}
//        [HttpPatch("{id:int}")]
//        public async Task<IActionResult> UpdateQuiz(int id, IFormCollection data)
//        {
//            bool active = data.Bool("active");
//            string title = data.Str("title");
//            string unlockCode = data.Str("unlockCode");
//            int imageId = data.Int("imageId");

//            // Validation
//            string failedFields = "";
//            if (string.IsNullOrEmpty(title)) failedFields += "Title | ";
//            if (imageId == 0) failedFields += "Image | ";
//            if (!string.IsNullOrEmpty(failedFields)) return UnprocessableEntity(new ResponseHelper("You must provide the following fields: " + failedFields));

//            // Find quiz record
//            Quiz quiz = await _Db.Quizzes.FindAsync(id);
//            if (quiz == null) return NotFound(new ResponseHelper("Something went wrong. If the problem persists, please contact the developer.", "Quiz not found in database."));

//            // Update fields
//            quiz.Active = active;
//            quiz.Title = title;
//            if (!string.IsNullOrEmpty(unlockCode)) quiz.UnlockCode = unlockCode;
//            if (imageId != 0) quiz.ImageId = imageId;

//            // Save changes
//            await _Db.SaveChangesAsync();

//            return Ok();
//        }

//        // POST: /api/admin/app/quizzes/questions
//        //[HttpPost("{questionId:int}/questions")]
//        //public async Task<IActionResult> AddQuestion(int questionId, IFormCollection data)
//        //{
            
//        //}
//    }
//}
