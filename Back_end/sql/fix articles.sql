USE [HotelManagementDB]
GO

-- 1. Bổ sung cột thumbnail_public_id (dùng cho Cloudinary)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Articles') AND name = 'thumbnail_public_id')
BEGIN
    ALTER TABLE Articles ADD thumbnail_public_id NVARCHAR(MAX) NULL;
    PRINT 'Da bo sung cot thumbnail_public_id.';
END

-- 2. Bổ sung cột updated_at (dùng de quan ly thoi gian cap nhat)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Articles') AND name = 'updated_at')
BEGIN
    ALTER TABLE Articles ADD updated_at DATETIME2 NULL;
    PRINT 'Da bo sung cot updated_at.';
END

-- 3. (Tuy chon) Bo sung is_active neu chua co
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Articles') AND name = 'is_active')
BEGIN
    ALTER TABLE Articles ADD is_active BIT NOT NULL DEFAULT(1);
    PRINT 'Da bo sung cot is_active.';
END
