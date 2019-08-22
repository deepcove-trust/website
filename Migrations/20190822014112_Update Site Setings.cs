using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class UpdateSiteSetings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WebsiteSettings");

            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EmailBookings = table.Column<string>(nullable: true),
                    EmailGeneral = table.Column<string>(nullable: true),
                    UrlFacebook = table.Column<string>(nullable: true),
                    UrlGooglePlay = table.Column<string>(nullable: true),
                    UrlGoogleMaps = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    LinkTitleA = table.Column<string>(nullable: true),
                    LinkTitleB = table.Column<string>(nullable: true),
                    FooterText = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "EmailBookings", "EmailGeneral", "FooterText", "LinkTitleA", "LinkTitleB", "Phone", "UrlFacebook", "UrlGoogleMaps", "UrlGooglePlay" },
                values: new object[] { 1, null, "bookings@deepcovehostel.co.nz", "", "", "", "(03) 928 5262", "https://www.facebook.com/deepcoveoutdooreducationtrust/", null, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.CreateTable(
                name: "WebsiteSettings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Email = table.Column<string>(nullable: true),
                    FacebookUrl = table.Column<string>(nullable: true),
                    FooterText = table.Column<string>(nullable: true),
                    LinkTitleA = table.Column<string>(nullable: true),
                    LinkTitleB = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebsiteSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "WebsiteSettings",
                columns: new[] { "Id", "Email", "FacebookUrl", "FooterText", "LinkTitleA", "LinkTitleB", "Phone" },
                values: new object[] { 1, "bookings@deepcovehostel.co.nz", "https://www.facebook.com/deepcoveoutdooreducationtrust/", "", "", "", "(03) 928 5262" });
        }
    }
}
