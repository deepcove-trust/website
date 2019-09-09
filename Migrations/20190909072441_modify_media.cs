using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class modify_media : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Filename",
                table: "Media",
                newName: "Path");

            migrationBuilder.AlterColumn<string>(
                name: "MediaType",
                table: "Media",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Path",
                table: "Media",
                newName: "Filename");

            migrationBuilder.AlterColumn<int>(
                name: "MediaType",
                table: "Media",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
