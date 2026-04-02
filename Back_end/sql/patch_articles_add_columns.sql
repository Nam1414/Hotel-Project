-- ============================================================
-- PATCH: Thêm các cột vào bảng Articles
-- Chạy script này nếu DB đang tồn tại (không chạy lại toàn bộ 00_MASTER_INSTALL.sql)
-- ============================================================
USE [HotelManagementDB];
GO

-- 1. Thêm cột thumbnail_public_id (Cloudinary public ID để xóa ảnh cũ)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'thumbnail_public_id'
)
BEGIN
    ALTER TABLE [dbo].[Articles]
        ADD [thumbnail_public_id] NVARCHAR(500) NULL;
    PRINT 'Đã thêm cột thumbnail_public_id vào bảng Articles';
END
ELSE
    PRINT 'Cột thumbnail_public_id đã tồn tại';
GO

-- 2. Thêm cột updated_at (theo dõi lần cập nhật cuối)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'updated_at'
)
BEGIN
    ALTER TABLE [dbo].[Articles]
        ADD [updated_at] DATETIME NULL DEFAULT GETDATE();
    PRINT 'Đã thêm cột updated_at vào bảng Articles';
END
ELSE
    PRINT 'Cột updated_at đã tồn tại';
GO

-- Ghi chú:
-- Cột thumbnail_url đã có trong DB (published_at đã có sẵn, C# property CreatedAt map vào đó)
-- Backend dùng: ImageUrl property → column thumbnail_url (đúng)
--               CreatedAt property → column published_at (đúng)
--               ThumbnailPublicId property → column thumbnail_public_id (mới thêm)
--               UpdatedAt property → column updated_at (mới thêm)
