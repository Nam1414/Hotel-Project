USE [HotelManagementDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 1. CẬP NHẬT BẢNG Users (Bổ sung Avatar và Refresh Token)
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    -- avatar_url
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'avatar_url')
        ALTER TABLE [dbo].[Users] ADD [avatar_url] NVARCHAR(MAX) NULL;

    -- avatar_public_id (Dùng Cloudinary)
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'avatar_public_id')
        ALTER TABLE [dbo].[Users] ADD [avatar_public_id] NVARCHAR(MAX) NULL;

    -- refresh_token
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'refresh_token')
        ALTER TABLE [dbo].[Users] ADD [refresh_token] NVARCHAR(MAX) NULL;

    -- refresh_token_expiry
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'refresh_token_expiry')
        ALTER TABLE [dbo].[Users] ADD [refresh_token_expiry] DATETIME2 NULL;

    -- created_at
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'created_at')
        ALTER TABLE [dbo].[Users] ADD [created_at] DATETIME2 NOT NULL DEFAULT (GETUTCDATE());
    
    PRINT 'Da cap nhat cot cho bang Users.';
END
GO

-- =============================================
-- 2. CẬP NHẬT BẢNG Articles (Bổ sung Thumbnail và Auditing)
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND type in (N'U'))
BEGIN
    -- thumbnail_url
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'thumbnail_url')
        ALTER TABLE [dbo].[Articles] ADD [thumbnail_url] NVARCHAR(MAX) NULL;

    -- thumbnail_public_id
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'thumbnail_public_id')
        ALTER TABLE [dbo].[Articles] ADD [thumbnail_public_id] NVARCHAR(MAX) NULL;

    -- updated_at
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'updated_at')
        ALTER TABLE [dbo].[Articles] ADD [updated_at] DATETIME2 NULL;

    -- is_active
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'is_active')
        ALTER TABLE [dbo].[Articles] ADD [is_active] BIT NOT NULL DEFAULT (1);
    
    PRINT 'Da cap nhat cot cho bang Articles.';
END
GO

-- =============================================
-- 3. CẬP NHẬT BẢNG ArticleCategories (Bổ sung is_active)
-- =============================================
-- Lưu ý: Kiểm tra cả tên ArticleCategories và Article_Categories (đối chiếu DBHotel.sql)
IF EXISTS (SELECT * FROM sys.objects WHERE (object_id = OBJECT_ID(N'[dbo].[ArticleCategories]') OR object_id = OBJECT_ID(N'[dbo].[Article_Categories]')) AND type in (N'U'))
BEGIN
    DECLARE @TableName NVARCHAR(255) = (CASE WHEN OBJECT_ID(N'[dbo].[ArticleCategories]') IS NOT NULL THEN 'ArticleCategories' ELSE 'Article_Categories' END);
    
    DECLARE @Sql NVARCHAR(MAX) = 'IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(''' + @TableName + ''') AND name = ''is_active'')
                                   ALTER TABLE ' + @TableName + ' ADD is_active BIT NOT NULL DEFAULT (1);';
    EXEC sp_executesql @Sql;
    
    PRINT 'Da cap nhat cot is_active cho bang ' + @TableName + '.';
END
GO

PRINT 'Da hoan tat cap nhat Auth, Articles va Cloudinary schema!';
GO
