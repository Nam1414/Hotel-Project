-- ============================================================
-- PATCH: Thêm các cột vào bảng Rooms
-- Cần vì C# model Room dùng is_active để soft delete
-- Bảng DB hiện tại chưa có cột này
-- ============================================================
USE [HotelManagementDB];
GO

-- 1. Thêm cột is_active (Soft Delete - ẩn phòng đã xóa)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND name = 'is_active'
)
BEGIN
    ALTER TABLE [dbo].[Rooms]
        ADD [is_active] BIT NOT NULL DEFAULT (1);
    PRINT 'Đã thêm cột is_active vào bảng Rooms';
END
ELSE
    PRINT 'Cột is_active đã tồn tại';
GO
