using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Deepcove_Trust_Website.Migrations
{
    public partial class Initial : Migration
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
                name: "CmsButtons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Text = table.Column<string>(nullable: false),
                    Href = table.Column<string>(nullable: false),
                    Color = table.Column<int>(nullable: false),
                    Align = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CmsButtons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MasterUnlockCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Config", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FactFileCategories",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactFileCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Media",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    MediaType = table.Column<string>(nullable: true),
                    FilePath = table.Column<string>(nullable: true),
                    IsPublic = table.Column<bool>(nullable: false),
                    Size = table.Column<long>(nullable: false),
                    Discriminator = table.Column<string>(nullable: false),
                    Duration = table.Column<double>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    Alt = table.Column<string>(nullable: true),
                    Height = table.Column<double>(nullable: true),
                    Width = table.Column<double>(nullable: true),
                    Versions = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Media", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MediaComponent",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SlotNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaComponent", x => x.Id);
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
                    QuickLink = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PageTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
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

            migrationBuilder.CreateTable(
                name: "Tracks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Active = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tracks", x => x.Id);
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
                name: "TextComponents",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SlotNo = table.Column<int>(nullable: false),
                    Heading = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true),
                    CmsButtonId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextComponents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TextComponents_CmsButtons_CmsButtonId",
                        column: x => x.CmsButtonId,
                        principalTable: "CmsButtons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FactFileEntries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    CategoryId = table.Column<int>(nullable: false),
                    MainImageId = table.Column<int>(nullable: false),
                    ListenAudioId = table.Column<int>(nullable: true),
                    PronounceAudioId = table.Column<int>(nullable: true),
                    PrimaryName = table.Column<string>(nullable: true),
                    AltName = table.Column<string>(nullable: true),
                    BodyText = table.Column<string>(nullable: true),
                    Active = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactFileEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FactFileEntries_FactFileCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "FactFileCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactFileEntries_Media_ListenAudioId",
                        column: x => x.ListenAudioId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FactFileEntries_Media_MainImageId",
                        column: x => x.MainImageId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactFileEntries_Media_PronounceAudioId",
                        column: x => x.PronounceAudioId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Quizzes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    ImageId = table.Column<int>(nullable: false),
                    Active = table.Column<bool>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    UnlockCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quizzes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Quizzes_Media_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                name: "PageRevisions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    Reason = table.Column<string>(nullable: true),
                    CreatedById = table.Column<int>(nullable: true),
                    PageId = table.Column<int>(nullable: true),
                    TemplateId = table.Column<int>(nullable: true)
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
                    table.ForeignKey(
                        name: "FK_PageRevisions_PageTemplates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "PageTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: false),
                    DeletedAt = table.Column<DateTime>(nullable: true),
                    TrackId = table.Column<int>(nullable: false),
                    FactFileId = table.Column<int>(nullable: true),
                    ImageId = table.Column<int>(nullable: true),
                    ActivityType = table.Column<int>(nullable: false),
                    Active = table.Column<bool>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Task = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    QrCode = table.Column<string>(nullable: true),
                    CoordY = table.Column<double>(nullable: false),
                    CoordX = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Activities_FactFileEntries_FactFileId",
                        column: x => x.FactFileId,
                        principalTable: "FactFileEntries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Activities_Media_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Activities_Tracks_TrackId",
                        column: x => x.TrackId,
                        principalTable: "Tracks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FactFileEntryImages",
                columns: table => new
                {
                    FactFileEntryId = table.Column<int>(nullable: false),
                    MediaFileId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactFileEntryImages", x => new { x.FactFileEntryId, x.MediaFileId });
                    table.ForeignKey(
                        name: "FK_FactFileEntryImages_FactFileEntries_FactFileEntryId",
                        column: x => x.FactFileEntryId,
                        principalTable: "FactFileEntries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FactFileEntryImages_Media_MediaFileId",
                        column: x => x.MediaFileId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FactFileNuggets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ImageId = table.Column<int>(nullable: true),
                    FactFileEntryId = table.Column<int>(nullable: false),
                    OrderIndex = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Text = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactFileNuggets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FactFileNuggets_FactFileEntries_FactFileEntryId",
                        column: x => x.FactFileEntryId,
                        principalTable: "FactFileEntries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactFileNuggets_Media_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RevisionMediaComponent",
                columns: table => new
                {
                    PageRevisionId = table.Column<int>(nullable: false),
                    MediaComponentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RevisionMediaComponent", x => new { x.PageRevisionId, x.MediaComponentId });
                    table.ForeignKey(
                        name: "FK_RevisionMediaComponent_MediaComponent_MediaComponentId",
                        column: x => x.MediaComponentId,
                        principalTable: "MediaComponent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RevisionMediaComponent_PageRevisions_PageRevisionId",
                        column: x => x.PageRevisionId,
                        principalTable: "PageRevisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RevisionTextComponent",
                columns: table => new
                {
                    PageRevisionId = table.Column<int>(nullable: false),
                    TextComponentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RevisionTextComponent", x => new { x.PageRevisionId, x.TextComponentId });
                    table.ForeignKey(
                        name: "FK_RevisionTextComponent_PageRevisions_PageRevisionId",
                        column: x => x.PageRevisionId,
                        principalTable: "PageRevisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RevisionTextComponent_TextComponents_TextComponentId",
                        column: x => x.TextComponentId,
                        principalTable: "TextComponents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityImages",
                columns: table => new
                {
                    ActivityId = table.Column<int>(nullable: false),
                    ImageId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityImages", x => new { x.ActivityId, x.ImageId });
                    table.ForeignKey(
                        name: "FK_ActivityImages_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActivityImages_Media_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAnswers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    QuizQuestionId = table.Column<int>(nullable: false),
                    ImageId = table.Column<int>(nullable: true),
                    Text = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAnswers_Media_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuizQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CorrectAnswerId = table.Column<int>(nullable: true),
                    ImageId = table.Column<int>(nullable: true),
                    QuizId = table.Column<int>(nullable: false),
                    TrueFalseAnswer = table.Column<bool>(nullable: true),
                    Text = table.Column<string>(nullable: true),
                    AudioId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizQuestions_Media_AudioId",
                        column: x => x.AudioId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuizQuestions_QuizAnswers_CorrectAnswerId",
                        column: x => x.CorrectAnswerId,
                        principalTable: "QuizAnswers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuizQuestions_Media_ImageId",
                        column: x => x.ImageId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuizQuestions_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_FactFileId",
                table: "Activities",
                column: "FactFileId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_ImageId",
                table: "Activities",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_TrackId",
                table: "Activities",
                column: "TrackId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityImages_ImageId",
                table: "ActivityImages",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelMembership_NotificationChannelId",
                table: "ChannelMembership",
                column: "NotificationChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_FactFileEntries_CategoryId",
                table: "FactFileEntries",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_FactFileEntries_ListenAudioId",
                table: "FactFileEntries",
                column: "ListenAudioId");

            migrationBuilder.CreateIndex(
                name: "IX_FactFileEntries_MainImageId",
                table: "FactFileEntries",
                column: "MainImageId");

            migrationBuilder.CreateIndex(
                name: "IX_FactFileEntries_PronounceAudioId",
                table: "FactFileEntries",
                column: "PronounceAudioId");

            migrationBuilder.CreateIndex(
                name: "IX_FactFileEntryImages_MediaFileId",
                table: "FactFileEntryImages",
                column: "MediaFileId");

            migrationBuilder.CreateIndex(
                name: "IX_FactFileNuggets_FactFileEntryId",
                table: "FactFileNuggets",
                column: "FactFileEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_FactFileNuggets_ImageId",
                table: "FactFileNuggets",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_PageRevisions_CreatedById",
                table: "PageRevisions",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_PageRevisions_PageId",
                table: "PageRevisions",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_PageRevisions_TemplateId",
                table: "PageRevisions",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Pages_Name",
                table: "Pages",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PageTemplates_Name",
                table: "PageTemplates",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResets_AccountId",
                table: "PasswordResets",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAnswers_ImageId",
                table: "QuizAnswers",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAnswers_QuizQuestionId",
                table: "QuizAnswers",
                column: "QuizQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_AudioId",
                table: "QuizQuestions",
                column: "AudioId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_CorrectAnswerId",
                table: "QuizQuestions",
                column: "CorrectAnswerId",
                unique: true,
                filter: "[CorrectAnswerId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_ImageId",
                table: "QuizQuestions",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizQuestions_QuizId",
                table: "QuizQuestions",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_ImageId",
                table: "Quizzes",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_RevisionMediaComponent_MediaComponentId",
                table: "RevisionMediaComponent",
                column: "MediaComponentId");

            migrationBuilder.CreateIndex(
                name: "IX_RevisionTextComponent_TextComponentId",
                table: "RevisionTextComponent",
                column: "TextComponentId");

            migrationBuilder.CreateIndex(
                name: "IX_TextComponents_CmsButtonId",
                table: "TextComponents",
                column: "CmsButtonId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizAnswers_QuizQuestions_QuizQuestionId",
                table: "QuizAnswers",
                column: "QuizQuestionId",
                principalTable: "QuizQuestions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizAnswers_Media_ImageId",
                table: "QuizAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_QuizQuestions_Media_AudioId",
                table: "QuizQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_QuizQuestions_Media_ImageId",
                table: "QuizQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Media_ImageId",
                table: "Quizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_QuizAnswers_QuizQuestions_QuizQuestionId",
                table: "QuizAnswers");

            migrationBuilder.DropTable(
                name: "ActivityImages");

            migrationBuilder.DropTable(
                name: "ChannelMembership");

            migrationBuilder.DropTable(
                name: "Config");

            migrationBuilder.DropTable(
                name: "FactFileEntryImages");

            migrationBuilder.DropTable(
                name: "FactFileNuggets");

            migrationBuilder.DropTable(
                name: "PasswordResets");

            migrationBuilder.DropTable(
                name: "RevisionMediaComponent");

            migrationBuilder.DropTable(
                name: "RevisionTextComponent");

            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropTable(
                name: "NotificationChannels");

            migrationBuilder.DropTable(
                name: "MediaComponent");

            migrationBuilder.DropTable(
                name: "PageRevisions");

            migrationBuilder.DropTable(
                name: "TextComponents");

            migrationBuilder.DropTable(
                name: "FactFileEntries");

            migrationBuilder.DropTable(
                name: "Tracks");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Pages");

            migrationBuilder.DropTable(
                name: "PageTemplates");

            migrationBuilder.DropTable(
                name: "CmsButtons");

            migrationBuilder.DropTable(
                name: "FactFileCategories");

            migrationBuilder.DropTable(
                name: "Media");

            migrationBuilder.DropTable(
                name: "QuizQuestions");

            migrationBuilder.DropTable(
                name: "QuizAnswers");

            migrationBuilder.DropTable(
                name: "Quizzes");
        }
    }
}
