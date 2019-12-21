using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class cascadepagedelete : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NavItemPages_Pages_PageId",
                table: "NavItemPages");

            migrationBuilder.DropForeignKey(
                name: "FK_NavItems_Pages_PageId",
                table: "NavItems");

            migrationBuilder.AddForeignKey(
                name: "FK_NavItemPages_Pages_PageId",
                table: "NavItemPages",
                column: "PageId",
                principalTable: "Pages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NavItems_Pages_PageId",
                table: "NavItems",
                column: "PageId",
                principalTable: "Pages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NavItemPages_Pages_PageId",
                table: "NavItemPages");

            migrationBuilder.DropForeignKey(
                name: "FK_NavItems_Pages_PageId",
                table: "NavItems");

            migrationBuilder.AddForeignKey(
                name: "FK_NavItemPages_Pages_PageId",
                table: "NavItemPages",
                column: "PageId",
                principalTable: "Pages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_NavItems_Pages_PageId",
                table: "NavItems",
                column: "PageId",
                principalTable: "Pages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
