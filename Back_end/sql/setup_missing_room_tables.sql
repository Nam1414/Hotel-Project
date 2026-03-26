USE [HotelManagementDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- 1. CẬP NHẬT BẢNG RoomTypes
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RoomTypes]') AND type in (N'U'))
BEGIN
    -- Thêm max_capacity nếu thiếu
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RoomTypes]') AND name = 'max_capacity')
        ALTER TABLE [dbo].[RoomTypes] ADD [max_capacity] INT NOT NULL DEFAULT (2);

    -- Thêm is_active nếu thiếu
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RoomTypes]') AND name = 'is_active')
        ALTER TABLE [dbo].[RoomTypes] ADD [is_active] BIT NOT NULL DEFAULT (1);

    -- Thêm created_at nếu thiếu
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RoomTypes]') AND name = 'created_at')
        ALTER TABLE [dbo].[RoomTypes] ADD [created_at] DATETIME2 NOT NULL DEFAULT (GETUTCDATE());

    -- Thêm updated_at nếu thiếu
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RoomTypes]') AND name = 'updated_at')
        ALTER TABLE [dbo].[RoomTypes] ADD [updated_at] DATETIME2 NOT NULL DEFAULT (GETUTCDATE());
    
    PRINT 'Da kiem tra va cap nhat cot cho bang RoomTypes.';
END
GO

-- =============================================
-- 2. CẬP NHẬT BẢNG Rooms
-- =============================================
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND type in (N'U'))
BEGIN
    -- Thêm created_at nếu thiếu
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND name = 'created_at')
        ALTER TABLE [dbo].[Rooms] ADD [created_at] DATETIME2 NOT NULL DEFAULT (GETUTCDATE());

    -- Thêm updated_at nếu thiếu
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND name = 'updated_at')
        ALTER TABLE [dbo].[Rooms] ADD [updated_at] DATETIME2 NOT NULL DEFAULT (GETUTCDATE());
    
    PRINT 'Da kiem tra va cap nhat cot cho bang Rooms.';
END
GO

-- =============================================
-- 3. XỬ LÝ BẢNG Room_Images
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Room_Images]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Room_Images](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [room_type_id] [int] NOT NULL,
        [image_url] [nvarchar](max) NOT NULL,
        [public_id] [nvarchar](max) NULL,
        [is_primary] [bit] NOT NULL DEFAULT (0),
     CONSTRAINT [PK_Room_Images] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [FK_Room_Images_RoomTypes_room_type_id] FOREIGN KEY([room_type_id]) REFERENCES [dbo].[RoomTypes] ([id]) ON DELETE CASCADE
    )
    PRINT 'Da tao bang Room_Images.';
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Room_Images]') AND name = 'public_id')
        ALTER TABLE [dbo].[Room_Images] ADD [public_id] [nvarchar](max) NULL;
    
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Room_Images]') AND name = 'is_primary')
        ALTER TABLE [dbo].[Room_Images] ADD [is_primary] [bit] NOT NULL DEFAULT (0);
    
    PRINT 'Da kiem tra va cap nhat cot cho bang Room_Images.';
END
GO

-- =============================================
-- 4. TẠO BẢNG Amenities VÀ RoomType_Amenities
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Amenities]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Amenities](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [name] [nvarchar](255) NOT NULL,
        [icon_url] [nvarchar](max) NULL,
     CONSTRAINT [PK_Amenities] PRIMARY KEY CLUSTERED ([id] ASC)
    )
    PRINT 'Da tao bang Amenities.';
END

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RoomType_Amenities]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RoomType_Amenities](
        [room_type_id] [int] NOT NULL,
        [amenity_id] [int] NOT NULL,
     CONSTRAINT [PK_RoomType_Amenities] PRIMARY KEY CLUSTERED ([room_type_id] ASC, [amenity_id] ASC),
     CONSTRAINT [FK_RoomType_Amenities_RoomTypes] FOREIGN KEY([room_type_id]) REFERENCES [dbo].[RoomTypes] ([id]) ON DELETE CASCADE,
     CONSTRAINT [FK_RoomType_Amenities_Amenities] FOREIGN KEY([amenity_id]) REFERENCES [dbo].[Amenities] ([id]) ON DELETE CASCADE
    )
    PRINT 'Da tao bang RoomType_Amenities.';
END
GO

-- =============================================
-- 5. XỬ LÝ BẢNG Room_Items
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Room_Items]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Room_Items](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [room_id] [int] NULL,
        [item_name] [nvarchar](255) NOT NULL,
        [quantity] [int] NOT NULL DEFAULT (1),
        [price_if_lost] [decimal](18, 2) NOT NULL DEFAULT (0),
     CONSTRAINT [PK_Room_Items] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [FK_Room_Items_Rooms_room_id] FOREIGN KEY([room_id]) REFERENCES [dbo].[Rooms] ([id]) ON DELETE SET NULL
    )
    PRINT 'Da tao bang Room_Items.';
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Room_Items]') AND name = 'price_if_lost')
        ALTER TABLE [dbo].[Room_Items] ADD [price_if_lost] [decimal](18, 2) NOT NULL DEFAULT (0);
    
    PRINT 'Da kiem tra va cap nhat cot cho bang Room_Items.';
END
GO

-- Nạp dữ liệu mẫu cho Amenities
IF NOT EXISTS (SELECT * FROM Amenities)
BEGIN
    INSERT INTO Amenities (name, icon_url) VALUES 
    (N'Wifi Miễn Phí', N'wifi.png'),
    (N'Smart TV', N'tv.png'),
    (N'Điều Hòa', N'ac.png'),
    (N'Minibar', N'minibar.png'),
    (N'Ban Công', N'balcony.png'),
    (N'Két Sắt', N'safe.png'),
    (N'Máy Sấy Tóc', N'hairdryer.png');
    PRINT 'Da nap du lieu mau vao bang Amenities.';
END
GO

PRINT 'Da hoan tat TOAN BO setup va fix cho Room Module!';
GO
