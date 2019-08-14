using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class Initial_Migration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: false),
                    PhoneNumber = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: false),
                    ForcePasswordReset = table.Column<bool>(nullable: false),
                    Active = table.Column<bool>(nullable: false),
                    LastLogin = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CmsLink",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Text = table.Column<string>(nullable: false),
                    Href = table.Column<string>(nullable: false),
                    IsButton = table.Column<bool>(nullable: false),
                    Color = table.Column<int>(nullable: false),
                    Align = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CmsLink", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NotificationChannels",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationChannels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PageTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    TextAreas = table.Column<int>(nullable: false),
                    MediaAreas = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WebsiteSettings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FacebookUrl = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true),
                    Phone = table.Column<string>(nullable: true),
                    LinkTitleA = table.Column<string>(nullable: true),
                    LinkTitleB = table.Column<string>(nullable: true),
                    FooterText = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebsiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PasswordResets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Token = table.Column<string>(nullable: false),
                    ExpiresAt = table.Column<DateTime>(nullable: false),
                    AccountId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PasswordResets_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChannelMembership",
                columns: table => new
                {
                    AccountId = table.Column<int>(nullable: false),
                    NotificationChannelId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelMembership", x => new { x.AccountId, x.NotificationChannelId });
                    table.ForeignKey(
                        name: "FK_ChannelMembership_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChannelMembership_NotificationChannels_NotificationChannelId",
                        column: x => x.NotificationChannelId,
                        principalTable: "NotificationChannels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Public = table.Column<bool>(nullable: false),
                    Section = table.Column<int>(nullable: false),
                    QuickLink = table.Column<int>(nullable: false),
                    TemplateId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pages_PageTemplates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "PageTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PageRevisions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    CreatedById = table.Column<int>(nullable: true),
                    PageId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageRevisions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PageRevisions_Accounts_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PageRevisions_Pages_PageId",
                        column: x => x.PageId,
                        principalTable: "Pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TextField",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SlotNo = table.Column<int>(nullable: false),
                    Heading = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true),
                    linkId = table.Column<int>(nullable: true),
                    PageRevisionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextField", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TextField_PageRevisions_PageRevisionId",
                        column: x => x.PageRevisionId,
                        principalTable: "PageRevisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TextField_CmsLink_linkId",
                        column: x => x.linkId,
                        principalTable: "CmsLink",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "WebsiteSettings",
                columns: new[] { "Id", "Email", "FacebookUrl", "FooterText", "LinkTitleA", "LinkTitleB", "Phone" },
                values: new object[] { 1, "bookings@deepcovehostel.co.nz", "https://www.facebook.com/deepcoveoutdooreducationtrust/", "", "", "", "(03) 928 5262" });

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMembership_NotificationChannelId",
                table: "ChannelMembership",
                column: "NotificationChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_PageRevisions_CreatedById",
                table: "PageRevisions",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PageRevisions_PageId",
                table: "PageRevisions",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_TemplateId",
                table: "Pages",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResets_AccountId",
                table: "PasswordResets",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_TextField_PageRevisionId",
                table: "TextField",
                column: "PageRevisionId");

            migrationBuilder.CreateIndex(
                name: "IX_TextField_linkId",
                table: "TextField",
                column: "linkId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChannelMembership");

            migrationBuilder.DropTable(
                name: "PasswordResets");

            migrationBuilder.DropTable(
                name: "TextField");

            migrationBuilder.DropTable(
                name: "WebsiteSettings");

            migrationBuilder.DropTable(
                name: "NotificationChannels");

            migrationBuilder.DropTable(
                name: "PageRevisions");

            migrationBuilder.DropTable(
                name: "CmsLink");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Pages");

            migrationBuilder.DropTable(
                name: "PageTemplates");
        }
    }
}
