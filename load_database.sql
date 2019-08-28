SET IDENTITY_INSERT [dbo].[Accounts] ON
INSERT INTO [dbo].[Accounts] ([Id], [CreatedAt], [UpdatedAt], [DeletedAt], [Name], [Email], [PhoneNumber], [Password], [ForcePasswordReset], [Active], [LastLogin]) VALUES (1, N'2019-07-11 02:16:34', N'2019-08-15 09:42:00', NULL, N'SamJ', N'samj@example.com', N'123456789', N'AQAAAAEAACcQAAAAEELX7eYATG4l4EUAknv/4jALp14T1mahhGMKpZb7wX+c2cuLZ6WuG7gsDOGvAMzfhg==', 0, 1, N'2019-08-15 09:42:00')
INSERT INTO [dbo].[Accounts] ([Id], [CreatedAt], [UpdatedAt], [DeletedAt], [Name], [Email], [PhoneNumber], [Password], [ForcePasswordReset], [Active], [LastLogin]) VALUES (2, N'2019-08-15 04:48:36', N'2019-08-16 09:53:57', NULL, N'That would be "Webslave SIR"', N'samueljegrant@outlook.com', N'027 914 8936', N'AQAAAAEAACcQAAAAEHew5+aHa+9m1ZUOa0anB9gQSC7sPP40HFDdqIQ3dDDGBdgo49bcMq87z8GlK+DPdg==', 0, 1, N'2019-08-16 09:53:57')
SET IDENTITY_INSERT [dbo].[Accounts] OFF

SET IDENTITY_INSERT [dbo].[PageTemplates] ON
INSERT INTO [dbo].[PageTemplates] ([Id], [CreatedAt], [UpdatedAt], [DeletedAt], [Name], [Description], [TextAreas], [MediaAreas]) VALUES (1, N'2019-08-16 09:19:05', N'2019-08-16 09:19:05', NULL, N'Contact Us', N'A contact us layout that features three text areas, an email form and Google Maps integration.', 3, 0)
SET IDENTITY_INSERT [dbo].[PageTemplates] OFF

SET IDENTITY_INSERT [dbo].[Pages] ON
INSERT INTO [dbo].[Pages] ([Id], [CreatedAt], [UpdatedAt], [DeletedAt], [Name], [Description], [Public], [Section], [QuickLink], [TemplateId]) VALUES (1, N'2019-08-16 09:19:05', N'2019-08-16 09:19:05', NULL, N'Contact Us', N'Contact Us page', 1, 0, 0, 1)
SET IDENTITY_INSERT [dbo].[Pages] OFF

SET IDENTITY_INSERT [dbo].[CmsLink] ON
INSERT INTO [dbo].[CmsLink] ([Id], [Text], [Href], [IsButton], [Color], [Align]) VALUES (1, N'This is a link', N'https://google.co.nz', 1, 3, 0)
SET IDENTITY_INSERT [dbo].[CmsLink] OFF

SET IDENTITY_INSERT [dbo].[TextField] ON
INSERT INTO [dbo].[TextField] ([Id], [SlotNo], [Heading], [Text], [LinkId]) VALUES (1, 1, N'Slot 1 Heading', N'Slot one content.', NULL)
INSERT INTO [dbo].[TextField] ([Id], [SlotNo], [Heading], [Text], [LinkId]) VALUES (2, 2, N'Slot 2 Heading', N'Slot two content.', 1)
INSERT INTO [dbo].[TextField] ([Id], [SlotNo], [Heading], [Text], [LinkId]) VALUES (3, 3, N'Slot 3 Heading', N'Slot three content.', NULL)
SET IDENTITY_INSERT [dbo].[TextField] OFF

SET IDENTITY_INSERT [dbo].[PageRevisions] ON
INSERT INTO [dbo].[PageRevisions] ([Id], [CreatedAt], [UpdatedAt], [DeletedAt], [CreatedById], [PageId]) VALUES (1, N'2019-08-16 09:19:05', N'2019-08-16 09:19:05', NULL, 1, 1)
SET IDENTITY_INSERT [dbo].[PageRevisions] OFF

INSERT INTO [dbo].[RevisionTextField] ([PageRevisionId], [TextFieldId]) VALUES (1, 1)
INSERT INTO [dbo].[RevisionTextField] ([PageRevisionId], [TextFieldId]) VALUES (1, 2)
INSERT INTO [dbo].[RevisionTextField] ([PageRevisionId], [TextFieldId]) VALUES (1, 3)