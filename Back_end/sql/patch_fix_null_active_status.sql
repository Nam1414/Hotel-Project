-- ============================================================
-- PATCH: Chuẩn hóa các cột Trạng thái (is_active)
-- Sửa lỗi: SqlNullValueException (Dữ liệu NULL không map được vào bool)
-- ============================================================
USE [HotelManagementDB];
GO

-- 1. Bảng Attractions
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Attractions]') AND name = 'is_active')
BEGIN
    -- Cập nhật giá trị NULL thành 1 (Active)
    UPDATE [dbo].[Attractions] SET [is_active] = 1 WHERE [is_active] IS NULL;
    
    -- Chuyển cột thành NOT NULL
    ALTER TABLE [dbo].[Attractions] ALTER COLUMN [is_active] BIT NOT NULL;
    PRINT 'Đã chuẩn hóa cột is_active trong bảng Attractions';
END
GO

-- 2. Bảng Amenities
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Amenities]') AND name = 'is_active')
BEGIN
    UPDATE [dbo].[Amenities] SET [is_active] = 1 WHERE [is_active] IS NULL;
    ALTER TABLE [dbo].[Amenities] ALTER COLUMN [is_active] BIT NOT NULL;
    PRINT 'Đã chuẩn hóa cột is_active trong bảng Amenities';
END
GO

-- 3. Bảng Articles
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'is_active')
BEGIN
    UPDATE [dbo].[Articles] SET [is_active] = 1 WHERE [is_active] IS NULL;
    ALTER TABLE [dbo].[Articles] ALTER COLUMN [is_active] BIT NOT NULL;
    PRINT 'Đã chuẩn hóa cột is_active trong bảng Articles';
END
GO

-- 4. Bảng Equipments
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'is_active')
BEGIN
    UPDATE [dbo].[Equipments] SET [is_active] = 1 WHERE [is_active] IS NULL;
    ALTER TABLE [dbo].[Equipments] ALTER COLUMN [is_active] BIT NOT NULL;
    PRINT 'Đã chuẩn hóa cột is_active trong bảng Equipments';
END
GO

-- 5. Bảng Rooms (Nếu đã chạy patch_rooms_add_is_active.sql thì đã là NOT NULL, nhưng check lại cho chắc)
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND name = 'is_active')
BEGIN
    UPDATE [dbo].[Rooms] SET [is_active] = 1 WHERE [is_active] IS NULL;
    ALTER TABLE [dbo].[Rooms] ALTER COLUMN [is_active] BIT NOT NULL;
    PRINT 'Đã chuẩn hóa cột is_active trong bảng Rooms';
END
GO

PRINT 'Đã hoàn tất chuẩn hóa các cột is_active sang NOT NULL.';
GO
