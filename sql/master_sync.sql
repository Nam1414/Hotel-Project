USE [HotelManagement]
GO

PRINT '--- Bat dau qua trinh dong bo hoa Force Master (v2) ---'

-- 1. Drop constraints if they exist
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_RoomInventory_RoomTypes_room_type_id')
    ALTER TABLE RoomInventory DROP CONSTRAINT FK_RoomInventory_RoomTypes_room_type_id;

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Rooms_RoomTypes_RoomTypeId')
    ALTER TABLE Rooms DROP CONSTRAINT FK_Rooms_RoomTypes_RoomTypeId;

-- 2. Drop empty target tables
IF OBJECT_ID('RoomTypes') IS NOT NULL AND (SELECT COUNT(*) FROM RoomTypes) = 0
    DROP TABLE RoomTypes;

IF OBJECT_ID('RoomInventory') IS NOT NULL AND (SELECT COUNT(*) FROM RoomInventory) = 0
    DROP TABLE RoomInventory;

-- 3. Rename data-holding tables
IF OBJECT_ID('Room_Types') IS NOT NULL AND OBJECT_ID('RoomTypes') IS NULL
BEGIN
    EXEC sp_rename 'Room_Types', 'RoomTypes';
    PRINT 'Da doi ten Room_Types thanh RoomTypes.';
END

IF OBJECT_ID('Room_Inventory') IS NOT NULL AND OBJECT_ID('Room_Items') IS NULL
BEGIN
    EXEC sp_rename 'Room_Inventory', 'Room_Items';
    PRINT 'Da doi ten Room_Inventory thanh Room_Items.';
END

-- 4. Align Columns in RoomTypes
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('RoomTypes') AND name = 'max_capacity')
    ALTER TABLE RoomTypes ADD max_capacity INT NULL;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('RoomTypes') AND name = 'capacity_adults')
    EXEC('UPDATE RoomTypes SET max_capacity = capacity_adults + ISNULL(capacity_children, 0) WHERE max_capacity IS NULL');

UPDATE RoomTypes SET max_capacity = 2 WHERE max_capacity IS NULL;

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('RoomTypes') AND name = 'max_capacity' AND is_nullable = 1)
    ALTER TABLE RoomTypes ALTER COLUMN max_capacity INT NOT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('RoomTypes') AND name = 'is_active')
    ALTER TABLE RoomTypes ADD is_active BIT NOT NULL DEFAULT (1);
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('RoomTypes') AND name = 'created_at')
    ALTER TABLE RoomTypes ADD created_at DATETIME2 NOT NULL DEFAULT (GETUTCDATE());
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('RoomTypes') AND name = 'updated_at')
    ALTER TABLE RoomTypes ADD updated_at DATETIME2 NOT NULL DEFAULT (GETUTCDATE());

-- 5. Align Columns in Rooms
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Rooms') AND name = 'created_at')
    ALTER TABLE Rooms ADD created_at DATETIME2 NOT NULL DEFAULT (GETUTCDATE());
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Rooms') AND name = 'updated_at')
    ALTER TABLE Rooms ADD updated_at DATETIME2 NOT NULL DEFAULT (GETUTCDATE());

-- 6. Restore Constraints (Optional but recommended)
-- We'll let EF Core Migrations restore them or add them manually if needed.
-- For now, the app should work.

-- 7. Authentication
DECLARE @AdminRoleId INT
SELECT @AdminRoleId = id FROM Roles WHERE name = 'Admin';
IF EXISTS (SELECT * FROM Users WHERE email = 'admin@hotel.com')
BEGIN
    UPDATE Users 
    SET password_hash = '$2a$11$EgEtVgS6AeToUyYWP.DtBO3KTf6u1lLDx/deKHODpifz.kojxsZ3K',
        role_id = @AdminRoleId,
        status = 1
    WHERE email = 'admin@hotel.com';
END

PRINT '--- Hoan tat dong bo hoa Force Master (v2) ---'
GO
