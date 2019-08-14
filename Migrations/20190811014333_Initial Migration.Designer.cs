﻿// <auto-generated />
using System;
using Deepcove_Trust_Website.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Deepcove_Trust_Website.Migrations
{
    [DbContext(typeof(WebsiteDataContext))]
    [Migration("20190811014333_Initial Migration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.2-servicing-10034")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Deepcove_Trust_Website.Models.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("Active");

                    b.Property<DateTime>("CreatedAt");

                    b.Property<DateTime?>("DeletedAt");

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<bool>("ForcePasswordReset");

                    b.Property<DateTime?>("LastLogin");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Password")
                        .IsRequired();

                    b.Property<string>("PhoneNumber");

                    b.Property<DateTime>("UpdatedAt");

                    b.HasKey("Id");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.Link", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Align");

                    b.Property<int>("Color");

                    b.Property<string>("Href")
                        .IsRequired();

                    b.Property<bool>("IsButton");

                    b.Property<string>("Text")
                        .IsRequired();

                    b.HasKey("Id");

                    b.ToTable("CmsLink");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.Page", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedAt");

                    b.Property<DateTime?>("DeletedAt");

                    b.Property<string>("Description");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<bool>("Public");

                    b.Property<int>("QuickLink");

                    b.Property<int>("Section");

                    b.Property<int?>("TemplateId");

                    b.Property<DateTime>("UpdatedAt");

                    b.HasKey("Id");

                    b.HasIndex("TemplateId");

                    b.ToTable("Pages");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.PageRevision", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedAt");

                    b.Property<int?>("CreatedById");

                    b.Property<DateTime?>("DeletedAt");

                    b.Property<int?>("PageId");

                    b.Property<DateTime>("UpdatedAt");

                    b.HasKey("Id");

                    b.HasIndex("CreatedById");

                    b.HasIndex("PageId");

                    b.ToTable("PageRevisions");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.PasswordReset", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AccountId");

                    b.Property<DateTime>("ExpiresAt");

                    b.Property<string>("Token")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("AccountId");

                    b.ToTable("PasswordResets");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.Template", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedAt");

                    b.Property<DateTime?>("DeletedAt");

                    b.Property<string>("Description");

                    b.Property<int>("MediaAreas");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int>("TextAreas");

                    b.Property<DateTime>("UpdatedAt");

                    b.HasKey("Id");

                    b.ToTable("PageTemplates");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.TextField", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Heading");

                    b.Property<int?>("PageRevisionId");

                    b.Property<int>("SlotNo");

                    b.Property<string>("Text");

                    b.Property<int?>("linkId");

                    b.HasKey("Id");

                    b.HasIndex("PageRevisionId");

                    b.HasIndex("linkId");

                    b.ToTable("TextField");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.WebsiteSettings", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Email");

                    b.Property<string>("FacebookUrl");

                    b.Property<string>("FooterText");

                    b.Property<string>("LinkTitleA");

                    b.Property<string>("LinkTitleB");

                    b.Property<string>("Phone");

                    b.HasKey("Id");

                    b.ToTable("WebsiteSettings");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Email = "bookings@deepcovehostel.co.nz",
                            FacebookUrl = "https://www.facebook.com/deepcoveoutdooreducationtrust/",
                            FooterText = "",
                            LinkTitleA = "",
                            LinkTitleB = "",
                            Phone = "(03) 928 5262"
                        });
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.Page", b =>
                {
                    b.HasOne("Deepcove_Trust_Website.Models.Template", "Template")
                        .WithMany("Pages")
                        .HasForeignKey("TemplateId");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.PageRevision", b =>
                {
                    b.HasOne("Deepcove_Trust_Website.Models.Account", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById");

                    b.HasOne("Deepcove_Trust_Website.Models.Page", "Page")
                        .WithMany("PageRevisions")
                        .HasForeignKey("PageId");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.PasswordReset", b =>
                {
                    b.HasOne("Deepcove_Trust_Website.Models.Account", "Account")
                        .WithMany()
                        .HasForeignKey("AccountId");
                });

            modelBuilder.Entity("Deepcove_Trust_Website.Models.TextField", b =>
                {
                    b.HasOne("Deepcove_Trust_Website.Models.PageRevision")
                        .WithMany("TextFields")
                        .HasForeignKey("PageRevisionId");

                    b.HasOne("Deepcove_Trust_Website.Models.Link", "link")
                        .WithMany("TextFields")
                        .HasForeignKey("linkId");
                });
#pragma warning restore 612, 618
        }
    }
}