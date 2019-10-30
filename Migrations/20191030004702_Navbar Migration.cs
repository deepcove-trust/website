using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class NavbarMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "NavItems",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Text",
                table: "NavItems");
        }
    }
}
