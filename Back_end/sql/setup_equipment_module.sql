-- ============================================================
-- Migration: Tạo bảng Equipments + Loss_And_Damages
-- Chạy trên HotelManagementDB
-- Tác giả: Xuankieu Ngo
-- ============================================================

USE [HotelManagementDB]
GO

-- ── Bảng Equipments ───────────────────────────────────────────────────────
IF NOT EXISTS (
    SELECT * FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND type = N'U'
)
BEGIN
    CREATE TABLE [dbo].[Equipments] (
        [id]                    INT            IDENTITY(1,1) NOT NULL,
        [item_code]             NVARCHAR(50)   NOT NULL,
        [name]                  NVARCHAR(200)  NOT NULL,
        [category]              NVARCHAR(100)  NOT NULL DEFAULT '',
        [unit]                  NVARCHAR(50)   NOT NULL DEFAULT '',
        [total_quantity]        INT            NOT NULL DEFAULT 0,
        [in_use_quantity]       INT            NOT NULL DEFAULT 0,
        [damaged_quantity]      INT            NOT NULL DEFAULT 0,
        [liquidated_quantity]   INT            NOT NULL DEFAULT 0,
        [base_price]            DECIMAL(18,2)  NOT NULL DEFAULT 0,
        [default_price_if_lost] DECIMAL(18,2)  NOT NULL DEFAULT 0,
        [supplier]              NVARCHAR(200)  NULL,
        [image_url]             NVARCHAR(MAX)  NULL,
        [is_active]             BIT            NOT NULL DEFAULT 1,
        [created_at]            DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        [updated_at]            DATETIME2      NULL,

        CONSTRAINT [PK_Equipments] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_Equipments_ItemCode] UNIQUE ([item_code])
    )

    PRINT 'Created table Equipments'
END
ELSE
    PRINT 'Table Equipments already exists – skipped'
GO

-- ── Bảng Loss_And_Damages ────────────────────────────────────────────────
IF NOT EXISTS (
    SELECT * FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[dbo].[Loss_And_Damages]') AND type = N'U'
)
BEGIN
    CREATE TABLE [dbo].[Loss_And_Damages] (
        [id]                INT            IDENTITY(1,1) NOT NULL,
        [equipment_id]      INT            NOT NULL,
        [booking_detail_id] INT            NULL,
        [room_inventory_id] INT            NULL,
        [quantity]          INT            NOT NULL DEFAULT 1,
        [penalty_amount]    DECIMAL(18,2)  NOT NULL DEFAULT 0,
        [description]       NVARCHAR(MAX)  NULL,
        [image_url]         NVARCHAR(MAX)  NULL,
        [status]            NVARCHAR(20)   NOT NULL DEFAULT 'pending',  -- pending|confirmed|cancelled
        [created_at]        DATETIME2      NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT [PK_Loss_And_Damages] PRIMARY KEY CLUSTERED ([id] ASC),

        CONSTRAINT [FK_LossAndDamages_Equipment]
            FOREIGN KEY ([equipment_id])
            REFERENCES [dbo].[Equipments]([id]),

        CONSTRAINT [FK_LossAndDamages_BookingDetail]
            FOREIGN KEY ([booking_detail_id])
            REFERENCES [dbo].[Booking_Details]([id]),

        CONSTRAINT [FK_LossAndDamages_RoomInventory]
            FOREIGN KEY ([room_inventory_id])
            REFERENCES [dbo].[Room_Inventory]([id]),

        CONSTRAINT [CK_LossAndDamages_Status]
            CHECK ([status] IN ('pending', 'confirmed', 'cancelled'))
    )

    PRINT 'Created table Loss_And_Damages'
END
ELSE
    PRINT 'Table Loss_And_Damages already exists – skipped'
GO

-- ── Thêm cột equipment_id vào Loss_And_Damages nếu bảng đã tồn tại
--    nhưng chưa có cột (migration incremental)
IF EXISTS (
    SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Loss_And_Damages]')
)
BEGIN
    IF NOT EXISTS (
        SELECT * FROM sys.columns
        WHERE object_id = OBJECT_ID(N'[dbo].[Loss_And_Damages]')
          AND name = 'equipment_id'
    )
    BEGIN
        ALTER TABLE [dbo].[Loss_And_Damages]
            ADD [equipment_id] INT NULL;

        ALTER TABLE [dbo].[Loss_And_Damages]
            ADD CONSTRAINT [FK_LossAndDamages_Equipment]
            FOREIGN KEY ([equipment_id])
            REFERENCES [dbo].[Equipments]([id]);

        PRINT 'Added column equipment_id to Loss_And_Damages'
    END

    IF NOT EXISTS (
        SELECT * FROM sys.columns
        WHERE object_id = OBJECT_ID(N'[dbo].[Loss_And_Damages]')
          AND name = 'image_url'
    )
    BEGIN
        ALTER TABLE [dbo].[Loss_And_Damages]
            ADD [image_url] NVARCHAR(MAX) NULL;
        PRINT 'Added column image_url to Loss_And_Damages'
    END

    IF NOT EXISTS (
        SELECT * FROM sys.columns
        WHERE object_id = OBJECT_ID(N'[dbo].[Loss_And_Damages]')
          AND name = 'status'
    )
    BEGIN
        ALTER TABLE [dbo].[Loss_And_Damages]
            ADD [status] NVARCHAR(20) NOT NULL DEFAULT 'pending';

        ALTER TABLE [dbo].[Loss_And_Damages]
            ADD CONSTRAINT [CK_LossAndDamages_Status]
            CHECK ([status] IN ('pending', 'confirmed', 'cancelled'));

        PRINT 'Added column status to Loss_And_Damages'
    END
END
GO

-- ── Đăng ký DbSet vào AppDbContext (nhắc dev) ────────────────────────────
-- Thêm dòng này vào AppDbContext.cs:
--
--   public DbSet<Equipment>     Equipments     { get; set; }
--   public DbSet<LossAndDamage> LossAndDamages { get; set; }
--   public DbSet<RoomInventory> RoomInventories { get; set; }  // nếu chưa có
--
-- ─────────────────────────────────────────────────────────────────────────

PRINT '✅ Migration hoàn tất'
GO