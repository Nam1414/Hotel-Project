USE [HotelManagementDB]
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Attractions')
BEGIN
    -- Kiểm tra và thêm cột image_url
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'image_url')
    BEGIN
        ALTER TABLE Attractions ADD [image_url] NVARCHAR(MAX) NULL;
        PRINT 'Đã thêm cột image_url';
    END

    -- Kiểm tra và thêm cột is_active
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'is_active')
    BEGIN
        ALTER TABLE Attractions ADD [is_active] BIT NOT NULL DEFAULT (1);
        PRINT 'Đã thêm cột is_active';
    END

    -- Kiểm tra và thêm latitude (để phòng hờ)
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'latitude')
    BEGIN
        ALTER TABLE Attractions ADD [latitude] decimal(18, 10) NULL;
        PRINT 'Đã thêm cột latitude';
    END

    -- Kiểm tra và thêm longitude (để phòng hờ)
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'longitude')
    BEGIN
        ALTER TABLE Attractions ADD [longitude] decimal(18, 10) NULL;
        PRINT 'Đã thêm cột longitude';
    END

    -- Kiểm tra và thêm created_at (để phòng hờ)
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'created_at')
    BEGIN
        ALTER TABLE Attractions ADD [created_at] datetime2 NOT NULL DEFAULT (GETUTCDATE());
        PRINT 'Đã thêm cột created_at';
    END

    -- Kiểm tra và thêm updated_at (để phòng hờ)
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'updated_at')
    BEGIN
        ALTER TABLE Attractions ADD [updated_at] datetime2 NOT NULL DEFAULT (GETUTCDATE());
        PRINT 'Đã thêm cột updated_at';
    END
END
ELSE
BEGIN
    PRINT 'Không tìm thấy bảng Attractions. Vui lòng kiểm tra lại tên database.';
END
GO
