-- SCRIPT KHẮC PHỤC LỖI SCHEMA VÀ TẠO TÀI KHOẢN ADMIN (BẢN CẬP NHẬT CHẮC CHẮN)
-- Hãy chọn Database 'HotelManagementDB' ở ô Dropdown phía trên bên trái SSMS trước khi chạy

USE [HotelManagementDB]
GO

PRINT '--- Bat dau qua trinh dong bo Database ---'

-- 1. Kiem tra va bo sung bang Roles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    CREATE TABLE [dbo].[Roles](
        [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [name] [nvarchar](100) NOT NULL,
        [description] [nvarchar](max) NULL,
        [is_active] [bit] NULL DEFAULT (1),
        [created_at] [datetime] NULL DEFAULT (GETUTCDATE())
    );
    PRINT 'Da tao bang Roles.';
END
GO

-- Them cac cot thieu cho bang Roles (Neu can)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Roles') AND name = 'is_active')
    ALTER TABLE Roles ADD is_active BIT NULL DEFAULT (1);
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Roles') AND name = 'created_at')
    ALTER TABLE Roles ADD created_at DATETIME NULL;
GO

-- Them Role Admin
IF NOT EXISTS (SELECT * FROM [dbo].[Roles] WHERE [name] = 'Admin')
BEGIN
    INSERT INTO [dbo].[Roles] ([name], [description], [is_active]) VALUES ('Admin', N'Quản trị viên', 1)
    PRINT 'Da them Role Admin.';
END
GO

-- 2. Kiem tra va bo sung bang Users
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [dbo].[Users](
        [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [role_id] [int] NULL FOREIGN KEY REFERENCES Roles(id),
        [membership_id] [int] NULL,
        [full_name] [nvarchar](255) NOT NULL,
        [email] [nvarchar](255) NOT NULL,
        [phone] [nvarchar](50) NULL,
        [password_hash] [nvarchar](max) NOT NULL,
        [status] [bit] NULL DEFAULT (1),
        [avatar_url] [nvarchar](255) NULL,
        [created_at] [datetime] NULL DEFAULT (GETUTCDATE()),
        [date_of_birth] [date] NULL,
        [address] [nvarchar](500) NULL,
        [refresh_token] [nvarchar](max) NULL,
        [refresh_token_expiry] [datetime2] NULL,
        [avatar_public_id] [nvarchar](255) NULL
    );
    PRINT 'Da tao moi bang Users.';
END
GO

-- Bo sung cac cot thieu vao bang Users
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'membership_id')
    ALTER TABLE Users ADD membership_id INT NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'phone')
    ALTER TABLE Users ADD phone NVARCHAR(50) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'avatar_url')
    ALTER TABLE Users ADD avatar_url NVARCHAR(255) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'status')
    ALTER TABLE Users ADD status BIT NULL DEFAULT (1);
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'refresh_token')
    ALTER TABLE Users ADD refresh_token NVARCHAR(MAX) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'refresh_token_expiry')
    ALTER TABLE Users ADD refresh_token_expiry DATETIME2 NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'created_at')
    ALTER TABLE Users ADD created_at DATETIME NULL DEFAULT (GETUTCDATE());
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'date_of_birth')
    ALTER TABLE Users ADD date_of_birth DATE NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'address')
    ALTER TABLE Users ADD address NVARCHAR(500) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'avatar_public_id')
    ALTER TABLE Users ADD avatar_public_id NVARCHAR(255) NULL;

PRINT 'Da kiem tra va bo sung cac cot cho bang Users.';
GO

-- 3. Tao hoac Cap nhat tai khoan Admin
-- Email: admin@hotel.com | Password: Admin@123
DECLARE @AdminRoleId INT
SELECT @AdminRoleId = id FROM Roles WHERE name = 'Admin';

IF EXISTS (SELECT * FROM Users WHERE email = 'admin@hotel.com')
BEGIN
    UPDATE Users 
    SET password_hash = '$2a$11$EgEtVgS6AeToUyYWP.DtBO3KTf6u1lLDx/deKHODpifz.kojxsZ3K',
        role_id = @AdminRoleId,
        status = 1
    WHERE email = 'admin@hotel.com';
    PRINT 'Da cap nhat mat khau cho admin@hotel.com (Password: Admin@123)';
END
ELSE
BEGIN
    INSERT INTO Users (role_id, full_name, email, password_hash, status, created_at)
    VALUES (@AdminRoleId, N'Quản trị viên Hệ thống', 'admin@hotel.com', '$2a$11$EgEtVgS6AeToUyYWP.DtBO3KTf6u1lLDx/deKHODpifz.kojxsZ3K', 1, GETUTCDATE());
    PRINT 'Da tao moi tai khoan Admin: admin@hotel.com / Admin@123';
END
GO

PRINT '--- Qua trinh hoan tat. Hay tien hanh dang nhap bang tai khoan tren ---'
GO
