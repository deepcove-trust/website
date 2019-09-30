using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class AlterBaseMedia : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsPublic",
                table: "Media",
                newName: "ShowCopyright");

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Media",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Source",
                table: "Media");

            migrationBuilder.RenameColumn(
                name: "ShowCopyright",
                table: "Media",
                newName: "IsPublic");
        }
    }
}
