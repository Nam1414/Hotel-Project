USE [HotelManagementDB]
GO

-- 1. Xóa dữ liệu cũ trong RoomInventory (nếu có)
DELETE FROM RoomInventory;
GO

-- 2. Chèn dữ liệu mẫu cho 30 ngày tới (tính từ hôm nay)
DECLARE @StartDate DATE = GETDATE();
DECLARE @i INT = 0;

WHILE @i < 30
BEGIN
    DECLARE @CurrentDate DATE = DATEADD(day, @i, @StartDate);

    -- Chèn dữ liệu cho các loại phòng (RoomType ID từ 1 đến 5)
    INSERT INTO [dbo].[RoomInventory] (room_type_id, inventory_date, total_rooms, available_rooms, price_override)
    VALUES 
    (1, @CurrentDate, 10, 8, NULL),   -- Standard Single
    (2, @CurrentDate, 15, 12, NULL),  -- Standard Double
    (3, @CurrentDate, 20, 15, NULL),  -- Superior City View
    (4, @CurrentDate, 10, 5, NULL),   -- Deluxe Ocean View
    (5, @CurrentDate, 5, 2, 1300000); -- Premium Deluxe (có giá override)

    SET @i = @i + 1;
END
GO

PRINT 'Da nap du lieu mau 30 ngay vao bang RoomInventory.';
SELECT TOP 10 * FROM RoomInventory ORDER BY inventory_date ASC;
GO
