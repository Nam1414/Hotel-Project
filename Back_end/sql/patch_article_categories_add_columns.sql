-- ============================================================
-- PATCH: Thêm các cột vào bảng Article_Categories
-- Model ArticleCategory có description, created_at, updated_at
-- nhưng DB hiện tại chưa có
-- ============================================================
USE [HotelManagementDB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Article_Categories]') AND name = 'description'
)
BEGIN
    ALTER TABLE [dbo].[Article_Categories]
        ADD [description] NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm cột description vào bảng Article_Categories';
END
ELSE
    PRINT 'Cột description đã tồn tại';
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Article_Categories]') AND name = 'created_at'
)
BEGIN
    ALTER TABLE [dbo].[Article_Categories]
        ADD [created_at] DATETIME NULL DEFAULT GETDATE();
    PRINT 'Đã thêm cột created_at vào bảng Article_Categories';
END
ELSE
    PRINT 'Cột created_at đã tồn tại';
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Article_Categories]') AND name = 'updated_at'
)
BEGIN
    ALTER TABLE [dbo].[Article_Categories]
        ADD [updated_at] DATETIME NULL;
    PRINT 'Đã thêm cột updated_at vào bảng Article_Categories';
END
ELSE
    PRINT 'Cột updated_at đã tồn tại';
GO
