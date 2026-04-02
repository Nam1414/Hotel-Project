-- ============================================================
-- PATCH: Thêm các cột vào bảng Attractions
-- Hiện tại DB thiếu các cột mở rộng gây lỗi SQL Exception
-- ============================================================
USE [HotelManagementDB];
GO

-- 1. Thêm cột category
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Attractions]') AND name = 'category'
)
BEGIN
    ALTER TABLE [dbo].[Attractions]
        ADD [category] NVARCHAR(100) NULL;
    PRINT 'Đã thêm cột category vào bảng Attractions';
END
GO

-- 2. Thêm cột image_url
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Attractions]') AND name = 'image_url'
)
BEGIN
    ALTER TABLE [dbo].[Attractions]
        ADD [image_url] NVARCHAR(500) NULL;
    PRINT 'Đã thêm cột image_url vào bảng Attractions';
END
GO

-- 3. Thêm cột created_at
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Attractions]') AND name = 'created_at'
)
BEGIN
    ALTER TABLE [dbo].[Attractions]
        ADD [created_at] DATETIME NULL DEFAULT GETDATE();
    PRINT 'Đã thêm cột created_at vào bảng Attractions';
END
GO

-- 4. Thêm cột updated_at
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Attractions]') AND name = 'updated_at'
)
BEGIN
    ALTER TABLE [dbo].[Attractions]
        ADD [updated_at] DATETIME NULL;
    PRINT 'Đã thêm cột updated_at vào bảng Attractions';
END
GO
