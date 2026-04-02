-- ============================================================
-- CREATE: Bảng MinibarItems và RoomMinibarStock
-- Dùng cho module minibar (quản lý đồ uống/snack trong tủ lạnh phòng)
-- Chạy script này để tạo 2 bảng mới chưa có trong DB
-- ============================================================
USE [HotelManagementDB];
GO

-- ─── 1. MinibarItems: danh mục các mặt hàng minibar ────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'MinibarItems' AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[MinibarItems] (
        [id]         INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [name]       NVARCHAR(255) NOT NULL,
        [price]      DECIMAL(18,2) NOT NULL DEFAULT 0,
        [is_active]  BIT NOT NULL DEFAULT 1,
        [created_at] DATETIME NULL DEFAULT GETDATE()
    );

    PRINT 'Đã tạo bảng MinibarItems';

    -- Seed dữ liệu mẫu
    INSERT INTO [dbo].[MinibarItems] ([name], [price], [is_active]) VALUES
        (N'Nước khoáng Aquafina (500ml)', 15000, 1),
        (N'Bia Heineken (330ml)', 35000, 1),
        (N'Nước ngọt Coca Cola (330ml)', 20000, 1),
        (N'Snack Lay''s (khoai tây chiên)', 30000, 1),
        (N'Chocolate Kitkat', 25000, 1),
        (N'Cà phê hòa tan G7', 20000, 1),
        (N'Nước ép cam (200ml)', 30000, 1),
        (N'Whiskey mini (50ml)', 80000, 1);
    PRINT 'Đã seed 8 mặt hàng minibar mẫu';
END
ELSE
    PRINT 'Bảng MinibarItems đã tồn tại';
GO

-- ─── 2. RoomMinibarStock: tồn kho minibar theo phòng ───────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'RoomMinibarStock' AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[RoomMinibarStock] (
        [id]              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [room_id]         INT NOT NULL,
        [minibar_item_id] INT NOT NULL,
        [quantity]        INT NOT NULL DEFAULT 1,
        [is_active]       BIT NOT NULL DEFAULT 1,
        [created_at]      DATETIME NULL DEFAULT GETDATE(),

        CONSTRAINT [FK_RoomMinibarStock_Rooms]       FOREIGN KEY ([room_id])         REFERENCES [dbo].[Rooms]([id]),
        CONSTRAINT [FK_RoomMinibarStock_MinibarItems] FOREIGN KEY ([minibar_item_id]) REFERENCES [dbo].[MinibarItems]([id])
    );

    PRINT 'Đã tạo bảng RoomMinibarStock';
END
ELSE
    PRINT 'Bảng RoomMinibarStock đã tồn tại';
GO
