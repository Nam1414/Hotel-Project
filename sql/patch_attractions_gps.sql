USE [HotelManagementDB]
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Attractions')
BEGIN
    CREATE TABLE [dbo].[Attractions](
        [id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [name] [nvarchar](255) NOT NULL,
        [distance_km] [decimal](5, 2) NULL,
        [description] [nvarchar](max) NULL,
        [map_embed_link] [nvarchar](max) NULL,
        [latitude] [decimal](18, 10) NULL,
        [longitude] [decimal](18, 10) NULL,
        [created_at] [datetime2] NOT NULL DEFAULT (GETUTCDATE()),
        [updated_at] [datetime2] NOT NULL DEFAULT (GETUTCDATE())
    );
    PRINT 'Da tao moi bang Attractions voi toa do GPS.';
END
ELSE
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'latitude')
    BEGIN
        ALTER TABLE Attractions ADD latitude decimal(18, 10) NULL;
        PRINT 'Da bo sung cot latitude.';
    END
    
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'longitude')
    BEGIN
        ALTER TABLE Attractions ADD longitude decimal(18, 10) NULL;
        PRINT 'Da bo sung cot longitude.';
    END

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'created_at')
        ALTER TABLE Attractions ADD created_at datetime2 NOT NULL DEFAULT (GETUTCDATE());

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Attractions') AND name = 'updated_at')
        ALTER TABLE Attractions ADD updated_at datetime2 NOT NULL DEFAULT (GETUTCDATE());
END
GO
