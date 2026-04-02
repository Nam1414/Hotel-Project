-- ============================================================
-- PATCH: Thêm cột public_id vào bảng Room_Images
-- Cần cho tính năng xóa ảnh cũ trên Cloudinary
-- ============================================================
USE [HotelManagementDB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Room_Images]') AND name = 'public_id'
)
BEGIN
    ALTER TABLE [dbo].[Room_Images]
        ADD [public_id] NVARCHAR(500) NULL;
    PRINT 'Đã thêm cột public_id vào bảng Room_Images';
END
ELSE
    PRINT 'Cột public_id đã tồn tại';
GO
