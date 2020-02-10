using Deepcove_Trust_Website.Data;
using Deepcove_Trust_Website.DiscoverDeepCove;
using Deepcove_Trust_Website.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using static Deepcove_Trust_Website.Helpers.Utils;

namespace Deepcove_Trust_Website.Controllers.AdminPortal.App
{
    // Validation classes
    public class QuizArgs
    {
        public int Id { get; set; }        
        [Required]
        public bool? Active { get; set; }
        [Required]
        public bool Shuffle { get; set; }
        [Required(ErrorMessage = "You must select an image")]
        public int? ImageId { get; set; }
        [Required(ErrorMessage = "You must provide a quiz title")]
        public string Title { get; set; }
        public string UnlockCode { get; set; }
        
    }

    public class QuestionArgs : IValidatableObject
    {
        public int? CorrectAnswerIndex { get; set; }
        public int? TrueFalseAnswer { get; set; }
        public MediaArgs Image { get; set; }
        public MediaArgs Audio { get; set; }
        [Required]
        public string Text { get; set; }
        [Required]
        public int OrderIndex { get; set; }
        public List<AnswerArgs> Answers { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            // If no correct answer has been specified
            if (CorrectAnswerIndex == null && TrueFalseAnswer == null)
                yield return new ValidationResult("You must select a correct answer", new string[] { "CorrectAnswerId" });

            if (TrueFalseAnswer == null)
            {
                // There are a mix of answers with and without images - not allowed!
                if (Answers.Any(a => a.Image?.Id != null) && Answers.Any(a => a.Image?.Id == null))
                    yield return new ValidationResult("All answers must have images", new string[] { "Answers" });

                if (Answers.Any(a => a.Image?.Id == null && string.IsNullOrEmpty(a.Text)))
                    yield return new ValidationResult("At least one answer does not have an image or text", new string[] { "Answers" });
            }
        }
    }

    public class AnswerArgs
    {
        public MediaArgs Image { get; set; }
        public string Text { get; set; }
    }

    public class MediaArgs
    {
        public int? Id { get; set; }        
    }

    // -- End validation classes

    [Authorize, Area("admin"), Route("/admin/app/quizzes")]
    public class ManageQuizzesController : Controller
    {
        private readonly WebsiteDataContext _Db;
        private readonly ILogger<ManageQuizzesController> _Logger;

        public ManageQuizzesController(WebsiteDataContext db, ILogger<ManageQuizzesController> logger)
        {
            _Db = db;
            _Logger = logger;
        }

        // GET: /admin/app/quizzes
        public IActionResult Index()
        {
            return View(viewName: "~/Views/AdminPortal/App/Quizzes.cshtml");
        }

        // GET: /admin/app/quizzes/data
        [HttpGet("data")]
        public async Task<IActionResult> GetQuizzes()
        {
            return Ok(await _Db.Quizzes.OrderBy(q => q.Title).Include(q => q.Questions).Include(q => q.Image).Select(q => new
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

        // GET: /admin/app/quizzes/{id:int}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetQuiz(int id)
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

            return Ok(new
            {
                quiz.Id,
                quiz.Title,
                quiz.UnlockCode,
                quiz.Active,
                quiz.Shuffle,
                image = new
                {
                    quiz.Image.Id,
                    quiz.Image.Filename
                },
                questions = quiz.Questions.OrderBy(q => q.OrderIndex).Select(q => new {
                    q.Id,
                    questionType = q.GetQuestionType(),
                    q.TrueFalseAnswer,
                    q.CorrectAnswerId,
                    image = q.Image != null ? new
                    {
                        q.Image.Id,
                        q.Image.Filename
                    } : null,
                    audio = q.Audio != null ? new
                    {
                        q.Audio.Id,
                        q.Audio.Filename,
                        q.Audio.MediaType
                    } : null,
                    q.Text,
                    answers = q.Answers.Select(a => new {
                        a.Id,
                        a.Text,
                        image = a.Image != null ? new
                        {
                            a.Image.Id,
                            a.Image.Filename
                        } : null
                    })
                })
            });
        }

        // POST: /admin/app/quizzes
        [HttpPost]
        public async Task<IActionResult> AddQuiz(QuizArgs data)
        {
            if (!ModelState.IsValid) return new BadRequestObjectResult(ModelState);            

            Quiz newQuiz = new Quiz
            {
                Title = data.Title,
                ImageId = (int)data.ImageId,
                Shuffle = (bool)data.Shuffle,
                UnlockCode = data.UnlockCode
            };

            await _Db.AddAsync(newQuiz);

            await _Db.SaveChangesAsync();

            return Ok(newQuiz.Id);
        }

        // PATCH /api/admin/app/quizzes/{id:int}
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> UpdateQuiz(int id, QuizArgs data)
        {
            if (!ModelState.IsValid) return new BadRequestObjectResult(ModelState);

            // Find quiz record
            Quiz quiz = await _Db.Quizzes.FindAsync(id);
            
            if (quiz == null) 
                return NotFound(new ResponseHelper("Something went wrong. If the problem persists, please contact the developer.", "Quiz not found in database."));

            // Update fields
            quiz.Active = (bool)data.Active;
            quiz.Title = data.Title;
            quiz.UnlockCode = data.UnlockCode;
            quiz.ImageId = (int)data.ImageId;
            quiz.Shuffle = data.Shuffle;

            // Save changes
            await _Db.SaveChangesAsync();

            return Ok();
        }

        // POST: /admin/app/quizzes/{id:int}/questions
        [HttpPost("{quizId:int}/questions")]
        public async Task<IActionResult> AddQuestion(int quizId, [FromBody]QuestionArgs data)
        {
            if (!ModelState.IsValid) return new BadRequestObjectResult(ModelState);

            Quiz quiz = await _Db.Quizzes.Include(q => q.Questions).Where(q => q.Id == quizId).FirstOrDefaultAsync();

            if(quiz == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh your browser and try again.", "Unable to find quiz in database"));

            QuizQuestion question = new QuizQuestion
            {
                Quiz = quiz,
                TrueFalseAnswer = data.TrueFalseAnswer,
                ImageId = data.Image?.Id,
                AudioId = data.Audio?.Id,
                Text = data.Text,
                OrderIndex = quiz.Questions.Count,

            };            

            // Transaction rolls back all changes if a failure occurs halfway through
            using(var transaction = await _Db.Database.BeginTransactionAsync())
            {
                quiz.UpdatedAt = DateTime.UtcNow;

                // Generate question ID
                await _Db.AddAsync(question);
                await _Db.SaveChangesAsync();

                // Generate IDs for each question, update question correctAnswerId
                for(int i = 0; i < data.Answers?.Count; i++)
                {
                    QuizAnswer answer = new QuizAnswer
                    {
                        QuizQuestionId = question.Id,
                        Text = data.Answers[i].Text,
                        ImageId = data.Answers[i].Image?.Id
                    };

                    await _Db.AddAsync(answer);
                    await _Db.SaveChangesAsync();

                    if (i == data.CorrectAnswerIndex) question.CorrectAnswerId = answer.Id;
                }

                await _Db.SaveChangesAsync();

                transaction.Commit();
            }

            return Ok();
        }

        // PUT: /admin/app/quizzes/{quizId:int}/questions/{questionId:int}
        [HttpPut("{quizId:int}/questions/{questionId:int}")]
        public async Task<IActionResult> UpdateQuestion(int quizId, int questionId, [FromBody]QuestionArgs data)
        {
            if (!ModelState.IsValid) return new BadRequestObjectResult(ModelState);

            Quiz quiz = await _Db.Quizzes.FindAsync(quizId);

            QuizQuestion question = await _Db.QuizQuestions.Include(q => q.Answers).Where(q => q.Id == questionId).FirstOrDefaultAsync();

            if (quiz == null || question == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh your browser and try again.", "Unable to find question in database"));

            using (var transaction = await _Db.Database.BeginTransactionAsync())
            {
                question.CorrectAnswerId = null;

                await _Db.SaveChangesAsync();

                _Db.RemoveRange(question.Answers);

                await _Db.SaveChangesAsync();

                question.ImageId = data.Image?.Id;
                question.Text = data.Text;
                question.TrueFalseAnswer = data.TrueFalseAnswer;
                question.AudioId = data.Audio?.Id;

                if (data.Answers != null)
                {
                    foreach (AnswerArgs answerArgs in data.Answers)
                    {
                        QuizAnswer newAns = new QuizAnswer
                        {
                            QuizQuestionId = question.Id,
                            Text = answerArgs.Text,
                            ImageId = answerArgs.Image?.Id
                        };

                        await _Db.AddAsync(newAns);

                        await _Db.SaveChangesAsync();

                        if (data.Answers.IndexOf(answerArgs) == data.CorrectAnswerIndex)
                        {
                            question.CorrectAnswerId = newAns.Id;
                        }
                    }
                }

                quiz.UpdatedAt = DateTime.UtcNow;

                await _Db.SaveChangesAsync();

                transaction.Commit();
            }

            return Ok();

        }

        // DELETE: /admin/app/quizzes/{quizId:int}/questions/{questionId:int}
        [HttpDelete("{quizId:int}/questions/{questionId:int}")]
        public async Task<IActionResult> DeleteQuestion(int quizId, int questionId)
        {
            Quiz quiz = await _Db.Quizzes.FindAsync(quizId);

            QuizQuestion question = await _Db.QuizQuestions.FindAsync(questionId);

            if (question == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh your browser and try again.", "Unable to find question in database"));

            using (var transaction = await _Db.Database.BeginTransactionAsync())
            {
                quiz.UpdatedAt = DateTime.UtcNow;

                question.CorrectAnswerId = null;
                await _Db.SaveChangesAsync();

                _Db.Remove(question);
                await _Db.SaveChangesAsync();                                

                transaction.Commit();
            }

            return Ok();
        }     
        
        // PATCH: /admin/app/quizzes/{quizId:int}/questions/{questionId:int}
        [HttpPatch("{quizId:int}/questions/{questionId:int}")]
        public async Task<IActionResult> ShiftQuestion(int quizId, int questionId, [FromQuery]string shiftDirection)
        {
            if (!(shiftDirection.EqualsIgnoreCase("up") || shiftDirection.EqualsIgnoreCase("down")))
                return BadRequest(new ResponseHelper("Shift direction must be 'up' or 'down'"));
            
            bool shiftUp = shiftDirection.EqualsIgnoreCase("up");

            Quiz quiz = await _Db.Quizzes.Include(q => q.Questions).Where(q => q.Id == quizId).FirstOrDefaultAsync();
            quiz.UpdatedAt = DateTime.UtcNow;
            quiz.Questions = quiz.Questions.OrderBy(q => q.OrderIndex).ToList();

            int currentIndex = quiz.Questions.FindIndex(q => q.Id == questionId);

            if (currentIndex == 0 && shiftUp || currentIndex == quiz.Questions.Count - 1 && !shiftUp) 
                return UnprocessableEntity(new ResponseHelper("Question cannot be shifted further in this direction"));

            int swapIndex = shiftUp ? currentIndex - 1 : currentIndex + 1;
            var temp = quiz.Questions[swapIndex];
            quiz.Questions[swapIndex] = quiz.Questions[currentIndex];
            quiz.Questions[currentIndex] = temp;

            for (int i = 0; i < quiz.Questions.Count; i++) quiz.Questions[i].OrderIndex = i;

            await _Db.SaveChangesAsync();

            return Ok();
        }

        // DELETE: /admin/app/quizzes/{id:int}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            Quiz quiz = await _Db.Quizzes.FindAsync(id);

            if (quiz == null) return NotFound(new ResponseHelper("Something went wrong. Please refresh your browser and try again.", "Unable to find quiz in database"));

            _Db.Remove(quiz);

            await _Db.SaveChangesAsync();

            return Ok();
        }

        // GET: /admin/app/quizzes/master
        [HttpGet("master")]
        public async Task<IActionResult> GetMasterUnlockCode()
        {
            Config config = await _Db.Config.FindAsync(1);

            return Ok(config.MasterUnlockCode);
        }

        // PATCH: /admin/app/quizzes/master
        [HttpPatch("master")]
        public async Task<IActionResult> UpdateMasterUnlockCode(string newCode)
        {
            if (string.IsNullOrEmpty(newCode)) return BadRequest(new ResponseHelper("You need to provide a new code", "Null or empty string received"));

            Config config = await _Db.Config.FindAsync(1);

            config.MasterUnlockCode = newCode;

            await _Db.SaveChangesAsync();

            return Ok();
        }
    }
}
