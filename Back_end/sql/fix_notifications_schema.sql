USE [HotelManagementDB]
GO

-- 1. Thêm cột title nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'title')
BEGIN
    ALTER TABLE [dbo].[Notifications] ADD [title] [nvarchar](255) NULL;
END
GO

-- 2. Thêm cột content nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'content')
BEGIN
    ALTER TABLE [dbo].[Notifications] ADD [content] [nvarchar](max) NULL;
END
GO

-- 3. Cập nhật các hàng cũ (nếu có) để các cột NOT NULL có thể được áp dụng sau này
UPDATE [dbo].[Notifications] SET [title] = 'System Notification' WHERE [title] IS NULL;
UPDATE [dbo].[Notifications] SET [content] = '' WHERE [content] IS NULL;
GO

-- 4. Chuyển sang NOT NULL
ALTER TABLE [dbo].[Notifications] ALTER COLUMN [title] [nvarchar](255) NOT NULL;
ALTER TABLE [dbo].[Notifications] ALTER COLUMN [content] [nvarchar](max) NOT NULL;
GO

-- 5. Thêm các cột khác
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'type')
BEGIN
    ALTER TABLE [dbo].[Notifications] ADD [type] [varchar](50) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'reference_link')
BEGIN
    ALTER TABLE [dbo].[Notifications] ADD [reference_link] [varchar](255) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'is_read')
BEGIN
    ALTER TABLE [dbo].[Notifications] ADD [is_read] [bit] NOT NULL DEFAULT (0);
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'created_at')
BEGIN
    ALTER TABLE [dbo].[Notifications] ADD [created_at] [datetime] NOT NULL DEFAULT (GETDATE());
END
GO
USE [HotelManagementDB]
GO
ALTER TABLE [dbo].[Notifications] DROP COLUMN [message];
GO
USE [HotelManagementDB]
GO
ALTER TABLE [dbo].[Notifications] ALTER COLUMN [user_id] INT NULL;
GO
