-- SCRIPT TẠO TÀI KHOẢN STAFF ĐỂ TEST
-- Chạy script này trong SQL Server Management Studio (SSMS) trên database HotelManagementDB

USE [HotelManagementDB]
GO

-- 1. Tạo Role Staff nếu chưa có
IF NOT EXISTS (SELECT * FROM [dbo].[Roles] WHERE [name] = 'Staff')
BEGIN
    INSERT INTO [dbo].[Roles] ([name], [description]) VALUES ('Staff', 'Nhân viên khách sạn')
    PRINT 'Da tao Role Staff.';
END
GO

-- 2. Tạo tài khoản Staff mặc định
-- Email: staff@hotel.com
-- Mật khẩu: Staff@123
-- Hash chuẩn cho 'Staff@123' (BCrypt - 60 ký tự): $2a$11$vI8AWBnW3fId.359T06i8OTl.3015.N263Oa78kpsOa.n7T7/XJ/e
DECLARE @StaffRoleId INT
SELECT @StaffRoleId = id FROM [dbo].[Roles] WHERE [name] = 'Staff'

IF NOT EXISTS (SELECT * FROM [dbo].[Users] WHERE [email] = 'staff@hotel.com')
BEGIN
    INSERT INTO [dbo].[Users] ([role_id], [full_name], [email], [password_hash], [status], [created_at])
    VALUES (@StaffRoleId, N'Nhân viên lễ tân', 'staff@hotel.com', '$2a$11$vI8AWBnW3fId.359T06i8OTl.3015.N263Oa78kpsOa.n7T7/XJ/e', 1, GETUTCDATE())
    PRINT 'Da tao tai khoan Staff: staff@hotel.com / Staff@123';
END
ELSE
BEGIN
    -- Cập nhật mật khẩu nếu tài khoản đã tồn tại
    UPDATE [dbo].[Users] 
    SET [password_hash] = '$2a$11$vI8AWBnW3fId.359T06i8OTl.3015.N263Oa78kpsOa.n7T7/XJ/e',
        [role_id] = @StaffRoleId
    WHERE [email] = 'staff@hotel.com'
    PRINT 'Da cap nhat tai khoan Staff.';
END
GO
