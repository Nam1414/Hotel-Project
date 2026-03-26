USE [HotelManagementDB]
GO

SET NOCOUNT ON;

-- 1. Nếu bảng Room_Inventory đang tồn tại, đổi tên nó thành Room_Items 
-- để lưu lại dữ liệu cũ (về đồ đạc trong phòng).
IF OBJECT_ID('Room_Inventory') IS NOT NULL AND OBJECT_ID('Room_Items') IS NULL
BEGIN
    EXEC sp_rename 'Room_Inventory', 'Room_Items';
    PRINT 'Da doi ten Room_Inventory thanh Room_Items.';
END
GO

-- 2. Tạo bảng RoomInventory mới (về kho phòng trống) cho code C#.
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
        CONSTRAINT [FK_RoomInventory_RoomTypes_room_type_id] FOREIGN KEY([room_type_id]) 
            REFERENCES [dbo].[RoomTypes] ([id]) ON DELETE CASCADE
    );
    PRINT 'Da tao moi bang RoomInventory.';
END
GO

PRINT 'Da hoan tat fix RoomInventory!';
GO
