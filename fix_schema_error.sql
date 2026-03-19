-- SCRIPT ĐỒNG BỘ SCHEMA CHO TOÀN BỘ PROJECT
-- Chạy script này trong SQL Server Management Studio (SSMS) trên database HotelManagementDB

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Đảm bảo bảng RoomTypes có đủ cột
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RoomTypes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RoomTypes](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [name] [nvarchar](max) NOT NULL,
        [description] [nvarchar](max) NULL,
        [base_price] [decimal](18, 2) NOT NULL,
        [max_capacity] [int] NOT NULL,
        [is_active] [bit] NOT NULL DEFAULT (1),
        [created_at] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
        [updated_at] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
        CONSTRAINT [PK_RoomTypes] PRIMARY KEY CLUSTERED ([id] ASC)
    )
END
ELSE
BEGIN
    -- Kiểm tra và bổ sung cột nếu bảng đã tồn tại nhưng thiếu (đề phòng)
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[RoomTypes]') AND name = 'is_active')
        ALTER TABLE [dbo].[RoomTypes] ADD [is_active] [bit] NOT NULL DEFAULT (1);
END
GO

-- 2. Đảm bảo bảng Rooms có đủ cột
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Rooms](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [room_number] [nvarchar](max) NOT NULL,
        [room_type_id] [int] NOT NULL,
        [status] [nvarchar](max) NOT NULL DEFAULT ('Available'),
        [is_active] [bit] NOT NULL DEFAULT (1),
        [created_at] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
        [updated_at] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
        CONSTRAINT [PK_Rooms] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_Rooms_RoomTypes_room_type_id] FOREIGN KEY([room_type_id]) REFERENCES [dbo].[RoomTypes] ([id]) ON DELETE CASCADE
    )
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Rooms]') AND name = 'is_active')
        ALTER TABLE [dbo].[Rooms] ADD [is_active] [bit] NOT NULL DEFAULT (1);
END
GO

-- 3. Đảm bảo bảng RoomInventory
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RoomInventory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RoomInventory](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [room_type_id] [int] NOT NULL,
        [inventory_date] [datetime2](7) NOT NULL,
        [total_rooms] [int] NOT NULL,
        [available_rooms] [int] NOT NULL,
        [price_override] [decimal](18, 2) NULL,
        CONSTRAINT [PK_RoomInventory] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_RoomInventory_RoomTypes_room_type_id] FOREIGN KEY([room_type_id]) REFERENCES [dbo].[RoomTypes] ([id]) ON DELETE CASCADE
    )
END
GO

-- 4. Bổ sung cột is_active cho các bảng cũ nếu thiếu
-- Bảng Articles
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND type in (N'U'))
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Articles]') AND name = 'is_active')
        ALTER TABLE [dbo].[Articles] ADD [is_active] [bit] NOT NULL DEFAULT (1);
END
GO

-- Bảng Article_Categories
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Article_Categories]') AND type in (N'U'))
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Article_Categories]') AND name = 'is_active')
        ALTER TABLE [dbo].[Article_Categories] ADD [is_active] [bit] NOT NULL DEFAULT (1);
END
GO
