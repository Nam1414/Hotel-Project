USE [HotelManagementDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Bảng danh mục đồ Minibar
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MinibarItems]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[MinibarItems](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [name] [nvarchar](255) NOT NULL,
        [price] [decimal](18, 2) NOT NULL,
        [is_active] [bit] NOT NULL DEFAULT ((1)),
     CONSTRAINT [PK_MinibarItems] PRIMARY KEY CLUSTERED ([id] ASC)
    )
    PRINT 'Da tao bang MinibarItems.';
END
GO

-- 2. Bảng quản lý tồn kho Minibar trong từng phòng
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RoomMinibarStock]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[RoomMinibarStock](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [room_id] [int] NOT NULL,
        [minibar_item_id] [int] NOT NULL,
        [quantity] [int] NOT NULL DEFAULT ((0)),
     CONSTRAINT [PK_RoomMinibarStock] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [FK_RoomMinibarStock_Rooms_room_id] FOREIGN KEY([room_id]) REFERENCES [dbo].[Rooms] ([id]),
     CONSTRAINT [FK_RoomMinibarStock_MinibarItems_minibar_item_id] FOREIGN KEY([minibar_item_id]) REFERENCES [dbo].[MinibarItems] ([id])
    )
    PRINT 'Da tao bang RoomMinibarStock.';
END
GO

-- 3. Nạp dữ liệu mẫu cho Minibar
IF (SELECT COUNT(*) FROM [dbo].[MinibarItems]) = 0
BEGIN
    INSERT INTO [dbo].[MinibarItems] ([name], [price], [is_active]) VALUES 
    (N'Coca Cola 330ml', 25000.00, 1),
    (N'Pepsi 330ml', 25000.00, 1),
    (N'Nước suối Aquafina 500ml', 15000.00, 1),
    (N'Bia Heineken lon', 45000.00, 1),
    (N'Bia Tiger lon', 35000.00, 1),
    (N'Mì ly Modern', 20000.00, 1),
    (N'Snack Oishi', 15000.00, 1),
    (N'Sô cô la KitKat', 30000.00, 1);
    PRINT 'Da nap du lieu mau vao bang MinibarItems.';
END
GO
