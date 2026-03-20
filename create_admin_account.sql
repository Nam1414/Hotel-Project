-- SCRIPT KHẮC PHỤC LỖI SCHEMA VÀ TẠO TÀI KHOẢN ADMIN (BẢN CẬP NHẬT CHẮC CHẮN)
-- Hãy chọn Database 'HotelManagementDB' ở ô Dropdown phía trên bên trái SSMS trước khi chạy

USE [HotelManagement]
GO

PRINT '--- Bat dau qua trinh dong bo Database ---'

-- 1. Kiem tra bang Roles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE [dbo].[Roles](
        [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [name] [nvarchar](max) NOT NULL,
        [description] [nvarchar](max) NULL
    );
    PRINT 'Da tao bang Roles.';
END
GO

-- Them Role Admin
IF NOT EXISTS (SELECT * FROM [dbo].[Roles] WHERE [name] = 'Admin')
BEGIN
    INSERT INTO [dbo].[Roles] ([name], [description]) VALUES ('Admin', 'Quản trị viên')
    PRINT 'Da them Role Admin.';
END
GO

-- 2. Kiem tra va nang cap bang Users
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [dbo].[Users](
        [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [role_id] [int] NULL FOREIGN KEY REFERENCES Roles(id),
        [full_name] [nvarchar](max) NOT NULL,
        [email] [nvarchar](max) NOT NULL,
        [password_hash] [nvarchar](max) NOT NULL,
        [status] [bit] NOT NULL DEFAULT (1)
    );
    PRINT 'Da tao moi bang Users.';
END
GO

-- Bo sung tat ca cac cot con thieu vao bang Users
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'membership_id')
    ALTER TABLE Users ADD membership_id INT NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'phone')
    ALTER TABLE Users ADD phone NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'avatar_url')
    ALTER TABLE Users ADD avatar_url NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'status')
    ALTER TABLE Users ADD status BIT NOT NULL DEFAULT (1);
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'refresh_token')
    ALTER TABLE Users ADD refresh_token NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'refresh_token_expiry')
    ALTER TABLE Users ADD refresh_token_expiry DATETIME2 NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'created_at')
    ALTER TABLE Users ADD created_at DATETIME2 NULL DEFAULT (GETUTCDATE());

PRINT 'Da kiem tra va bo sung cac cot cho bang Users.';
GO

-- 3. Tao hoac Cap nhat tai khoan Admin
-- Email: admin@hotel.com | Password: Admin@123
DECLARE @AdminRoleId INT
SELECT @AdminRoleId = id FROM Roles WHERE name = 'Admin';

IF EXISTS (SELECT * FROM Users WHERE email = 'admin@hotel.com')
BEGIN
    -- Neu ton tai thi chi cap nhat Password Hash (để tránh lỗi Foreign Key)
    -- Hash mới tương thích: $2a$11$EgEtVgS6AeToUyYWP.DtBO3KTf6u1lLDx/deKHODpifz.kojxsZ3K
    UPDATE Users 
    SET password_hash = '$2a$11$EgEtVgS6AeToUyYWP.DtBO3KTf6u1lLDx/deKHODpifz.kojxsZ3K',
        role_id = @AdminRoleId,
        status = 1
    WHERE email = 'admin@hotel.com';
    PRINT 'Da cap nhat mat khau cho admin@hotel.com';
END
ELSE
BEGIN
    -- Neu chua co thi moi chen moi
    INSERT INTO Users (role_id, full_name, email, password_hash, status, created_at)
    VALUES (@AdminRoleId, N'Quản trị viên', 'admin@hotel.com', '$2a$11$EgEtVgS6AeToUyYWP.DtBO3KTf6u1lLDx/deKHODpifz.kojxsZ3K', 1, GETUTCDATE());
    PRINT 'Da tao moi tai khoan Admin: admin@hotel.com / Admin@123';
END
GO



PRINT '--- Qua trinh hoan tat. Hay thu chay lai dotnet run ---'
GO
