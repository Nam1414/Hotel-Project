-- ============================================================
-- PATCH: Thêm các cột vào bảng Users
-- Cần cho: Refresh Token (JWT), Cloudinary avatar public_id
-- ============================================================
USE [HotelManagementDB];
GO

-- 1. refresh_token (lưu chuỗi token khi cấp lại JWT)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'refresh_token'
)
BEGIN
    ALTER TABLE [dbo].[Users]
        ADD [refresh_token] NVARCHAR(1000) NULL;
    PRINT 'Đã thêm cột refresh_token vào bảng Users';
END
ELSE
    PRINT 'Cột refresh_token đã tồn tại';
GO

-- 2. refresh_token_expiry (thời gian hết hạn của refresh token)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'refresh_token_expiry'
)
BEGIN
    ALTER TABLE [dbo].[Users]
        ADD [refresh_token_expiry] DATETIME NULL;
    PRINT 'Đã thêm cột refresh_token_expiry vào bảng Users';
END
ELSE
    PRINT 'Cột refresh_token_expiry đã tồn tại';
GO

-- 3. avatar_public_id (Cloudinary public_id để xóa ảnh đại diện cũ)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'avatar_public_id'
)
BEGIN
    ALTER TABLE [dbo].[Users]
        ADD [avatar_public_id] NVARCHAR(500) NULL;
    PRINT 'Đã thêm cột avatar_public_id vào bảng Users';
END
ELSE  
    PRINT 'Cột avatar_public_id đã tồn tại';
GO
