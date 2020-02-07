using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class updatequizanswercascade : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizQuestions_QuizAnswers_CorrectAnswerId",
                table: "QuizQuestions");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizQuestions_QuizAnswers_CorrectAnswerId",
                table: "QuizQuestions",
                column: "CorrectAnswerId",
                principalTable: "QuizAnswers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizQuestions_QuizAnswers_CorrectAnswerId",
                table: "QuizQuestions");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizQuestions_QuizAnswers_CorrectAnswerId",
                table: "QuizQuestions",
                column: "CorrectAnswerId",
                principalTable: "QuizAnswers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
