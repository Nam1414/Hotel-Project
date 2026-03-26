USE [HotelManagementDB]
GO

-- =============================================
-- SEED DATA CHO ROOM MODULE (Dữ liệu từ DBHotel.sql)
-- =============================================

-- 1. Nạp dữ liệu loại phòng (RoomTypes)
IF (SELECT COUNT(*) FROM [dbo].[RoomTypes]) = 0
BEGIN
    SET IDENTITY_INSERT [dbo].[RoomTypes] ON 
    INSERT [dbo].[RoomTypes] ([id], [name], [base_price], [max_capacity], [is_active], [description]) VALUES 
    (1, N'Standard Single', 400000.00, 1, 1, N'Phòng tiêu chuẩn 1 giường đơn'),
    (2, N'Standard Double', 500000.00, 3, 1, N'Phòng tiêu chuẩn 1 giường đôi'), -- 2 người lớn + 1 trẻ em
    (3, N'Superior City View', 700000.00, 3, 1, N'Phòng cao cấp hướng phố'), -- 2 người lớn + 1 trẻ em
    (4, N'Deluxe Ocean View', 900000.00, 4, 1, N'Phòng Deluxe hướng biển'), -- 2 người lớn + 2 trẻ em
    (5, N'Premium Deluxe', 1200000.00, 4, 1, N'Phòng Premium tiện nghi cao cấp'), -- 2 người lớn + 2 trẻ em
    (6, N'Family Suite', 1500000.00, 6, 1, N'Phòng Suite cho gia đình'), -- 4 người lớn + 2 trẻ em
    (7, N'Junior Suite', 1800000.00, 4, 1, N'Phòng Suite nhỏ nhắn sang trọng'), -- 2 người lớn + 2 trẻ em
    (8, N'Executive Suite', 2500000.00, 4, 1, N'Phòng Suite cho doanh nhân'), -- 2 người lớn + 2 trẻ em
    (9, N'Presidential Suite', 5000000.00, 6, 1, N'Phòng Tổng thống'), -- 4 người lớn + 2 trẻ em
    (10, N'Royal Villa', 8000000.00, 10, 1, N'Biệt thự hoàng gia nguyên căn'); -- 6 người lớn + 4 trẻ em
    SET IDENTITY_INSERT [dbo].[RoomTypes] OFF
    PRINT 'Da nap du lieu vao bang RoomTypes.';
END
GO

-- 2. Nạp dữ liệu phòng (Rooms)
IF (SELECT COUNT(*) FROM [dbo].[Rooms]) = 0
BEGIN
    SET IDENTITY_INSERT [dbo].[Rooms] ON 
    INSERT [dbo].[Rooms] ([id], [room_type_id], [room_number], [status], [is_active]) VALUES 
    (1, 1, N'101', N'Available', 1),
    (2, 2, N'102', N'Occupied', 1),
    (3, 3, N'201', N'Cleaning', 1),
    (4, 4, N'202', N'Maintenance', 1),
    (5, 5, N'301', N'Available', 1),
    (6, 6, N'302', N'Occupied', 1),
    (7, 7, N'401', N'Available', 1),
    (8, 8, N'402', N'Available', 1),
    (9, 9, N'501', N'Available', 1),
    (10, 10, N'VILLA-1', N'Available', 1);
    SET IDENTITY_INSERT [dbo].[Rooms] OFF
    PRINT 'Da nap du lieu vao bang Rooms.';
END
GO

-- 3. Nạp dữ liệu hình ảnh (Room_Images)
IF (SELECT COUNT(*) FROM [dbo].[Room_Images]) = 0
BEGIN
    SET IDENTITY_INSERT [dbo].[Room_Images] ON 
    INSERT [dbo].[Room_Images] ([id], [room_type_id], [image_url], [is_primary]) VALUES 
    (1, 1, N'type1_img.jpg', 1),
    (2, 2, N'type2_img.jpg', 1),
    (3, 3, N'type3_img.jpg', 1),
    (4, 4, N'type4_img.jpg', 1),
    (5, 5, N'type5_img.jpg', 1),
    (6, 6, N'type6_img.jpg', 1),
    (7, 7, N'type7_img.jpg', 1),
    (8, 8, N'type8_img.jpg', 1),
    (9, 9, N'type9_img.jpg', 1),
    (10, 10, N'type10_img.jpg', 1);
    SET IDENTITY_INSERT [dbo].[Room_Images] OFF
    PRINT 'Da nap du lieu vao bang Room_Images.';
END
GO

-- 4. Gán tiện nghi cho loại phòng (RoomType_Amenities)
IF (SELECT COUNT(*) FROM [dbo].[RoomType_Amenities]) = 0
BEGIN
    INSERT [dbo].[RoomType_Amenities] ([room_type_id], [amenity_id]) VALUES 
    (1, 1), (1, 2), (1, 3),
    (2, 1), (2, 2),
    (3, 4), (3, 5),
    (4, 6), (4, 7),
    (5, 8);
    PRINT 'Da nap du lieu vao bang RoomType_Amenities.';
END
GO

-- 5. Nạp dữ liệu đồ đạc (Room_Items từ Room_Inventory của DBHotel.sql)
IF (SELECT COUNT(*) FROM [dbo].[Room_Items]) = 0
BEGIN
    SET IDENTITY_INSERT [dbo].[Room_Items] ON 
    INSERT [dbo].[Room_Items] ([id], [room_id], [item_name], [quantity], [price_if_lost]) VALUES 
    (1, 1, N'Tivi Samsung 40 inch', 1, 5000000.00),
    (2, 1, N'Điều Khiển Tivi', 1, 300000.00),
    (3, 2, N'Khăn Tắm Lớn', 2, 200000.00),
    (4, 2, N'Cốc Thủy Tinh', 2, 50000.00),
    (5, 3, N'Bình Đun Siêu Tốc', 1, 400000.00),
    (6, 3, N'Máy Sấy Tóc', 1, 350000.00),
    (7, 4, N'Gối Nằm', 4, 250000.00),
    (8, 4, N'Móc Treo Quần Áo', 10, 20000.00),
    (9, 5, N'Áo Choàng Tắm', 2, 450000.00),
    (10, 5, N'Thảm Lau Chân', 1, 100000.00);
    SET IDENTITY_INSERT [dbo].[Room_Items] OFF
    PRINT 'Da nap du lieu vao bang Room_Items.';
END
GO

-- 6. Nạp dữ liệu tồn kho phòng / Tình trạng trống (RoomInventory)
IF (SELECT COUNT(*) FROM [dbo].[RoomInventory]) = 0
BEGIN
    -- Nạp cho 7 ngày tới cho tất cả loại phòng
    DECLARE @StartDate DATE = CAST(GETDATE() AS DATE);
    DECLARE @Count INT = 0;

    WHILE @Count < 7
    BEGIN
        INSERT INTO [dbo].[RoomInventory] (room_type_id, inventory_date, total_rooms, available_rooms, price_override)
        SELECT 
            id as room_type_id, 
            DATEADD(day, @Count, @StartDate), 
            1, -- Mặc định giả định mỗi loại có 1-2 phòng mẫu
            1, 
            NULL 
        FROM [dbo].[RoomTypes];
        
        SET @Count = @Count + 1;
    END
    PRINT 'Da nap du lieu RoomInventory (trang thai phong trong) cho 7 ngay toi.';
END
GO

PRINT 'Da hoan tat nap du lieu mau tu DBHotel.sql cho Room Module!';
GO
