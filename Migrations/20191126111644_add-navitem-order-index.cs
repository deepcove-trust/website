using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class addnavitemorderindex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderIndex",
                table: "NavItems",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderIndex",
                table: "NavItems");
        }
    }
}
