-- ============================================================
-- CREATE: Bảng Room_Items
-- Dùng để lưu danh sách vật tư đơn giản trong phòng
-- (Clone vật tư từ phòng mẫu, đồng bộ theo hạng phòng)
-- Khác với Room_Inventory vốn liên kết với bảng Equipments
-- ============================================================
USE [HotelManagementDB];
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Room_Items' AND type = 'U')
BEGIN
    CREATE TABLE [dbo].[Room_Items] (
        [id]            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [room_id]       INT NULL,
        [item_name]     NVARCHAR(255) NOT NULL,
        [quantity]      INT NOT NULL DEFAULT 1,
        [price_if_lost] DECIMAL(18,2) NOT NULL DEFAULT 0,
        [created_at]    DATETIME NULL DEFAULT GETDATE(),

        CONSTRAINT [FK_RoomItems_Rooms] FOREIGN KEY ([room_id]) REFERENCES [dbo].[Rooms]([id])
    );

    PRINT 'Đã tạo bảng Room_Items';

    -- Index để query nhanh theo room_id
    CREATE NONCLUSTERED INDEX [IX_Room_Items_RoomId]
        ON [dbo].[Room_Items]([room_id] ASC);
    PRINT 'Đã tạo index IX_Room_Items_RoomId';
END
ELSE
    PRINT 'Bảng Room_Items đã tồn tại';
GO
