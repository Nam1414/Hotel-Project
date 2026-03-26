USE [HotelManagementDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Tạo bảng Notifications
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Notifications](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [user_id] [int] NOT NULL,
        [message] [nvarchar](max) NOT NULL,
        [type] [nvarchar](50) NOT NULL DEFAULT (N'General'),
        [is_read] [bit] NOT NULL DEFAULT (0),
        [created_at] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
     CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [FK_Notifications_Users_user_id] FOREIGN KEY([user_id]) REFERENCES [dbo].[Users] ([id]) ON DELETE CASCADE
    )
    PRINT 'Da tao bang Notifications.';
END
GO
