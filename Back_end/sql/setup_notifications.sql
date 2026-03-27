USE [HotelManagementDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Tạo bảng Notifications theo thiết kế mới
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Notifications](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [user_id] [int] NULL, -- Null = thông báo broadcast toàn hệ thống
        [title] [nvarchar](255) NOT NULL,
        [content] [nvarchar](max) NOT NULL,
        [type] [varchar](50) NULL, -- Info | Success | Warning | Error
        [reference_link] [varchar](255) NULL,
        [is_read] [bit] NOT NULL DEFAULT (0),
        [created_at] [datetime] NOT NULL DEFAULT (GETDATE()),
     CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([id] ASC),
     CONSTRAINT [FK_Notifications_Users_user_id] FOREIGN KEY([user_id]) REFERENCES [dbo].[Users] ([id]) ON DELETE CASCADE
    )
    PRINT 'Da tao bang Notifications voi cau truc moi.';
END
ELSE
BEGIN
    -- Nếu bảng đã tồn tại, bạn có thể chạy các lệnh ALTER để cập nhật (Tùy chọn)
    -- Ở đây tôi viết script tạo mới để đảm bảo đúng thiết kế ban đầu.
    PRINT 'Bang Notifications da ton tai. Vui long kiem tra cau truc thu cong.';
END
GO
