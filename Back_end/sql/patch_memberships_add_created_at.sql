-- ============================================================
-- PATCH: Thêm cột created_at vào bảng Memberships
-- Giúp đồng bộ với C# model Membership
-- ============================================================
USE [HotelManagementDB];
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Memberships]') AND name = 'created_at'
)
BEGIN
    ALTER TABLE [dbo].[Memberships]
        ADD [created_at] DATETIME NULL DEFAULT GETDATE();
    PRINT 'Đã thêm cột created_at vào bảng Memberships';
END
GO
