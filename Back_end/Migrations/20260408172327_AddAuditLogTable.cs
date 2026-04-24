using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagementAPI.Migrations
{
    public partial class AddAuditLogTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ══ 1. Drop FK động ══════════════════════════════════════════════
            migrationBuilder.Sql(@"
                DECLARE @fkName NVARCHAR(256);
                SELECT @fkName = fk.name
                FROM sys.foreign_keys fk
                INNER JOIN sys.foreign_key_columns fkc
                    ON fk.object_id = fkc.constraint_object_id
                WHERE fk.parent_object_id = OBJECT_ID('Notifications')
                  AND COL_NAME(fkc.parent_object_id, fkc.parent_column_id) = 'userid';
                IF @fkName IS NOT NULL
                    EXEC('ALTER TABLE [Notifications] DROP CONSTRAINT [' + @fkName + ']');
            ");

            // ══ 2. Drop tất cả non-clustered index trên Notifications ════════
            migrationBuilder.Sql(@"
                DECLARE @sql NVARCHAR(MAX) = '';
                SELECT @sql = @sql +
                    'DROP INDEX [' + i.name + '] ON [dbo].[Notifications];' + CHAR(10)
                FROM sys.indexes i
                WHERE i.object_id = OBJECT_ID('dbo.Notifications')
                  AND i.type > 0
                  AND i.is_primary_key       = 0
                  AND i.is_unique_constraint = 0;
                IF LEN(@sql) > 0 EXEC sp_executesql @sql;
            ");

            // ══ 3. Rename cột Notifications ══════════════════════════════════
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Notifications') AND name = 'Id')        EXEC sp_rename N'[dbo].[Notifications].[Id]',        N'id',         'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Notifications') AND name = 'UserId')    EXEC sp_rename N'[dbo].[Notifications].[UserId]',    N'user_id',    'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Notifications') AND name = 'Message')   EXEC sp_rename N'[dbo].[Notifications].[Message]',   N'content',    'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Notifications') AND name = 'IsRead')    EXEC sp_rename N'[dbo].[Notifications].[IsRead]',    N'is_read',    'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Notifications') AND name = 'CreatedAt') EXEC sp_rename N'[dbo].[Notifications].[CreatedAt]', N'created_at', 'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Notifications') AND name = 'Type')      EXEC sp_rename N'[dbo].[Notifications].[Type]',      N'type',       'COLUMN';", suppressTransaction: true);

            // ══ 4. Tạo lại index Notifications ═══════════════════════════════
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM sys.indexes
                               WHERE name = 'IX_Notifications_user_id'
                                 AND object_id = OBJECT_ID('Notifications'))
                    CREATE NONCLUSTERED INDEX [IX_Notifications_user_id]
                    ON [dbo].[Notifications] ([user_id] ASC);
            ");

            // ══ 5. Rename cột Equipments ═════════════════════════════════════
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'unit')                  EXEC sp_rename N'[dbo].[Equipments].[unit]',                  N'Unit',               'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'supplier')              EXEC sp_rename N'[dbo].[Equipments].[supplier]',              N'Supplier',           'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'name')                  EXEC sp_rename N'[dbo].[Equipments].[name]',                  N'Name',               'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'category')              EXEC sp_rename N'[dbo].[Equipments].[category]',              N'Category',           'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'id')                    EXEC sp_rename N'[dbo].[Equipments].[id]',                    N'Id',                 'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'updated_at')            EXEC sp_rename N'[dbo].[Equipments].[updated_at]',            N'UpdatedAt',          'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'total_quantity')        EXEC sp_rename N'[dbo].[Equipments].[total_quantity]',        N'TotalQuantity',      'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'liquidated_quantity')   EXEC sp_rename N'[dbo].[Equipments].[liquidated_quantity]',   N'LiquidatedQuantity', 'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'item_code')             EXEC sp_rename N'[dbo].[Equipments].[item_code]',             N'ItemCode',           'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'is_active')             EXEC sp_rename N'[dbo].[Equipments].[is_active]',             N'IsActive',           'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'in_use_quantity')       EXEC sp_rename N'[dbo].[Equipments].[in_use_quantity]',       N'InUseQuantity',      'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'image_url')             EXEC sp_rename N'[dbo].[Equipments].[image_url]',             N'ImageUrl',           'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'default_price_if_lost') EXEC sp_rename N'[dbo].[Equipments].[default_price_if_lost]', N'DefaultPriceIfLost', 'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'damaged_quantity')      EXEC sp_rename N'[dbo].[Equipments].[damaged_quantity]',      N'DamagedQuantity',    'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'created_at')            EXEC sp_rename N'[dbo].[Equipments].[created_at]',            N'CreatedAt',          'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Equipments') AND name = 'base_price')            EXEC sp_rename N'[dbo].[Equipments].[base_price]',            N'BasePrice',          'COLUMN';", suppressTransaction: true);

            // ══ 6. AlterColumn Notifications ═════════════════════════════════
            migrationBuilder.AlterColumn<string>(
                name: "title", table: "Notifications",
                type: "nvarchar(255)", maxLength: 255, nullable: false,
                oldClrType: typeof(string), oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "type", table: "Notifications",
                type: "nvarchar(50)", maxLength: 50, nullable: false,
                oldClrType: typeof(string), oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "created_at", table: "Notifications",
                type: "datetime2", nullable: true,
                oldClrType: typeof(DateTime), oldType: "datetime2");

            // ══ 7. AlterColumn Equipments ════════════════════════════════════
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt", table: "Equipments",
                type: "datetime2", nullable: true,
                oldClrType: typeof(DateTime), oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt", table: "Equipments",
                type: "datetime2", nullable: true,
                oldClrType: typeof(DateTime), oldType: "datetime2");

            // ══ 8. CreateTable — bọc IF NOT EXISTS để idempotent ════════════
            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'[AuditLogs]', N'U') IS NULL
                CREATE TABLE [AuditLogs] (
                    [Id]        int            NOT NULL IDENTITY,
                    [TableName] nvarchar(100)  NOT NULL,
                    [Action]    nvarchar(20)   NOT NULL,
                    [RecordId]  int            NULL,
                    [OldValues] nvarchar(max)  NULL,
                    [NewValues] nvarchar(max)  NULL,
                    [UserId]    int            NULL,
                    [UserName]  nvarchar(200)  NULL,
                    [CreatedAt] datetime2      NOT NULL,
                    [IpAddress] nvarchar(50)   NULL,
                    CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id])
                );
            ");

            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'[Vouchers]', N'U') IS NULL
                CREATE TABLE [Vouchers] (
                    [Id]              int            NOT NULL IDENTITY,
                    [Code]            nvarchar(max)  NOT NULL,
                    [DiscountType]    nvarchar(max)  NOT NULL,
                    [DiscountValue]   decimal(18,2)  NOT NULL,
                    [MinBookingValue] decimal(18,2)  NULL,
                    [ValidFrom]       datetime2      NULL,
                    [ValidTo]         datetime2      NULL,
                    [UsageLimit]      int            NULL,
                    CONSTRAINT [PK_Vouchers] PRIMARY KEY ([Id])
                );
            ");

            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'[Bookings]', N'U') IS NULL
                CREATE TABLE [Bookings] (
                    [id]          int            NOT NULL IDENTITY,
                    [userid]      int            NULL,
                    [guestname]   nvarchar(max)  NULL,
                    [guestphone]  nvarchar(max)  NULL,
                    [guestemail]  nvarchar(max)  NULL,
                    [bookingcode] nvarchar(max)  NOT NULL,
                    [voucherid]   int            NULL,
                    [status]      nvarchar(max)  NULL,
                    [CreatedAt]   datetime2      NOT NULL,
                    [RoomId]      int            NULL,
                    CONSTRAINT [PK_Bookings] PRIMARY KEY ([id]),
                    CONSTRAINT [FK_Bookings_Users_userid]
                        FOREIGN KEY ([userid]) REFERENCES [Users]([id]),
                    CONSTRAINT [FK_Bookings_Vouchers_voucherid]
                        FOREIGN KEY ([voucherid]) REFERENCES [Vouchers]([Id])
                );
            ");

            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'[BookingDetails]', N'U') IS NULL
                CREATE TABLE [BookingDetails] (
                    [Id]            int           NOT NULL IDENTITY,
                    [BookingId]     int           NOT NULL,
                    [RoomId]        int           NULL,
                    [RoomTypeId]    int           NOT NULL,
                    [CheckInDate]   datetime2     NOT NULL,
                    [CheckOutDate]  datetime2     NOT NULL,
                    [PricePerNight] decimal(18,2) NOT NULL,
                    CONSTRAINT [PK_BookingDetails] PRIMARY KEY ([Id]),
                    CONSTRAINT [FK_BookingDetails_Bookings_BookingId]
                        FOREIGN KEY ([BookingId]) REFERENCES [Bookings]([id]) ON DELETE CASCADE,
                    CONSTRAINT [FK_BookingDetails_Room_Types_RoomTypeId]
                        FOREIGN KEY ([RoomTypeId]) REFERENCES [Room_Types]([id]) ON DELETE CASCADE,
                    CONSTRAINT [FK_BookingDetails_Rooms_RoomId]
                        FOREIGN KEY ([RoomId]) REFERENCES [Rooms]([id])
                );
            ");

            migrationBuilder.Sql(@"
                IF OBJECT_ID(N'[Invoices]', N'U') IS NULL
                CREATE TABLE [Invoices] (
                    [id]                 int           NOT NULL IDENTITY,
                    [bookingid]          int           NOT NULL,
                    [totalroomamount]    decimal(18,2) NOT NULL,
                    [totalserviceamount] decimal(18,2) NOT NULL,
                    [discountamount]     decimal(18,2) NOT NULL,
                    [taxamount]          decimal(18,2) NOT NULL,
                    [finaltotal]         decimal(18,2) NOT NULL,
                    [status]             nvarchar(max) NULL,
                    CONSTRAINT [PK_Invoices] PRIMARY KEY ([id]),
                    CONSTRAINT [FK_Invoices_Bookings_bookingid]
                        FOREIGN KEY ([bookingid]) REFERENCES [Bookings]([id]) ON DELETE CASCADE
                );
            ");

            // ══ 9. CreateIndex — IF NOT EXISTS ════════════════════════════════
            // Index BookingDetails — giữ nguyên (bảng do migration tạo, cột đúng tên)
            migrationBuilder.Sql(@"IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_BookingDetails_BookingId'  AND object_id=OBJECT_ID('BookingDetails')) CREATE INDEX [IX_BookingDetails_BookingId]  ON [BookingDetails]([BookingId]);");
            migrationBuilder.Sql(@"IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_BookingDetails_RoomId'     AND object_id=OBJECT_ID('BookingDetails')) CREATE INDEX [IX_BookingDetails_RoomId]     ON [BookingDetails]([RoomId]);");
            migrationBuilder.Sql(@"IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_BookingDetails_RoomTypeId' AND object_id=OBJECT_ID('BookingDetails')) CREATE INDEX [IX_BookingDetails_RoomTypeId] ON [BookingDetails]([RoomTypeId]);");

            // ✅ FIX: Bookings từ dump — cột có thể là 'userid' HOẶC 'user_id' → kiểm tra trước
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Bookings_userid' AND object_id=OBJECT_ID('Bookings'))
                BEGIN
                    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Bookings') AND name='userid')
                        EXEC('CREATE INDEX [IX_Bookings_userid] ON [Bookings]([userid])');
                    ELSE IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Bookings') AND name='user_id')
                        EXEC('CREATE INDEX [IX_Bookings_userid] ON [Bookings]([user_id])');
                END
            ");

            // ✅ FIX: tương tự cho voucherid
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Bookings_voucherid' AND object_id=OBJECT_ID('Bookings'))
                BEGIN
                    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Bookings') AND name='voucherid')
                        EXEC('CREATE INDEX [IX_Bookings_voucherid] ON [Bookings]([voucherid])');
                    ELSE IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Bookings') AND name='voucher_id')
                        EXEC('CREATE INDEX [IX_Bookings_voucherid] ON [Bookings]([voucher_id])');
                END
            ");

            // ✅ FIX: tương tự cho Invoices.bookingid
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Invoices_bookingid' AND object_id=OBJECT_ID('Invoices'))
                BEGIN
                    IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Invoices') AND name='bookingid')
                        EXEC('CREATE UNIQUE INDEX [IX_Invoices_bookingid] ON [Invoices]([bookingid])');
                    ELSE IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Invoices') AND name='booking_id')
                        EXEC('CREATE UNIQUE INDEX [IX_Invoices_bookingid] ON [Invoices]([booking_id])');
                END
            ");
            // ══ 10. AddForeignKey Notifications (IF NOT EXISTS) ═══════════════
            migrationBuilder.Sql(@"
                IF NOT EXISTS (
                    SELECT 1 FROM sys.foreign_keys
                    WHERE name = 'FK_Notifications_Users_user_id'
                      AND parent_object_id = OBJECT_ID('Notifications'))
                ALTER TABLE [Notifications]
                    ADD CONSTRAINT [FK_Notifications_Users_user_id]
                    FOREIGN KEY ([user_id]) REFERENCES [Users]([id]) ON DELETE CASCADE;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT 1 FROM sys.foreign_keys
                           WHERE name = 'FK_Notifications_Users_user_id'
                             AND parent_object_id = OBJECT_ID('Notifications'))
                ALTER TABLE [Notifications] DROP CONSTRAINT [FK_Notifications_Users_user_id];
            ");

            migrationBuilder.Sql(@"IF OBJECT_ID(N'[AuditLogs]',     N'U') IS NOT NULL DROP TABLE [AuditLogs];");
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[BookingDetails]', N'U') IS NOT NULL DROP TABLE [BookingDetails];");
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[Invoices]',       N'U') IS NOT NULL DROP TABLE [Invoices];");
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[Bookings]',       N'U') IS NOT NULL DROP TABLE [Bookings];");
            migrationBuilder.Sql(@"IF OBJECT_ID(N'[Vouchers]',       N'U') IS NOT NULL DROP TABLE [Vouchers];");

            // Drop index mới, rename Notifications về tên cũ
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Notifications_user_id' AND object_id=OBJECT_ID('Notifications')) DROP INDEX [IX_Notifications_user_id] ON [dbo].[Notifications];");

            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Notifications') AND name='id')         EXEC sp_rename N'[dbo].[Notifications].[id]',         N'Id',       'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Notifications') AND name='user_id')    EXEC sp_rename N'[dbo].[Notifications].[user_id]',    N'UserId',   'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Notifications') AND name='content')    EXEC sp_rename N'[dbo].[Notifications].[content]',    N'Message',  'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Notifications') AND name='is_read')    EXEC sp_rename N'[dbo].[Notifications].[is_read]',    N'IsRead',   'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Notifications') AND name='created_at') EXEC sp_rename N'[dbo].[Notifications].[created_at]', N'CreatedAt','COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Notifications') AND name='type')       EXEC sp_rename N'[dbo].[Notifications].[type]',       N'Type',     'COLUMN';", suppressTransaction: true);

            migrationBuilder.Sql(@"IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Notifications_UserId' AND object_id=OBJECT_ID('Notifications')) CREATE NONCLUSTERED INDEX [IX_Notifications_UserId] ON [dbo].[Notifications]([UserId] ASC);");

            // Rename Equipments về tên cũ
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='Unit')               EXEC sp_rename N'[dbo].[Equipments].[Unit]',               N'unit',                  'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='Supplier')           EXEC sp_rename N'[dbo].[Equipments].[Supplier]',           N'supplier',              'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='Name')               EXEC sp_rename N'[dbo].[Equipments].[Name]',               N'name',                  'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='Category')           EXEC sp_rename N'[dbo].[Equipments].[Category]',           N'category',              'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='Id')                 EXEC sp_rename N'[dbo].[Equipments].[Id]',                 N'id',                    'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='UpdatedAt')          EXEC sp_rename N'[dbo].[Equipments].[UpdatedAt]',          N'updated_at',            'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='TotalQuantity')      EXEC sp_rename N'[dbo].[Equipments].[TotalQuantity]',      N'total_quantity',        'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='LiquidatedQuantity') EXEC sp_rename N'[dbo].[Equipments].[LiquidatedQuantity]', N'liquidated_quantity',   'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='ItemCode')           EXEC sp_rename N'[dbo].[Equipments].[ItemCode]',           N'item_code',             'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='IsActive')           EXEC sp_rename N'[dbo].[Equipments].[IsActive]',           N'is_active',             'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='InUseQuantity')      EXEC sp_rename N'[dbo].[Equipments].[InUseQuantity]',      N'in_use_quantity',       'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='ImageUrl')           EXEC sp_rename N'[dbo].[Equipments].[ImageUrl]',           N'image_url',             'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='DefaultPriceIfLost') EXEC sp_rename N'[dbo].[Equipments].[DefaultPriceIfLost]', N'default_price_if_lost', 'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='DamagedQuantity')    EXEC sp_rename N'[dbo].[Equipments].[DamagedQuantity]',    N'damaged_quantity',      'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='CreatedAt')          EXEC sp_rename N'[dbo].[Equipments].[CreatedAt]',          N'created_at',            'COLUMN';", suppressTransaction: true);
            migrationBuilder.Sql(@"IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id=OBJECT_ID('Equipments') AND name='BasePrice')          EXEC sp_rename N'[dbo].[Equipments].[BasePrice]',          N'base_price',            'COLUMN';", suppressTransaction: true);

            migrationBuilder.AlterColumn<string>(name: "Type",  table: "Notifications", type: "nvarchar(max)", nullable: false, oldClrType: typeof(string),   oldType: "nvarchar(50)", oldMaxLength: 50);
            migrationBuilder.AlterColumn<string>(name: "title", table: "Notifications", type: "nvarchar(max)", nullable: false, oldClrType: typeof(string),   oldType: "nvarchar(255)", oldMaxLength: 255);
            migrationBuilder.AlterColumn<DateTime>(name: "CreatedAt", table: "Notifications", type: "datetime2", nullable: false, defaultValue: new DateTime(1,1,1,0,0,0,0,DateTimeKind.Unspecified), oldClrType: typeof(DateTime), oldType: "datetime2", oldNullable: true);
            migrationBuilder.AlterColumn<DateTime>(name: "updated_at", table: "Equipments", type: "datetime2", nullable: false, defaultValue: new DateTime(1,1,1,0,0,0,0,DateTimeKind.Unspecified), oldClrType: typeof(DateTime), oldType: "datetime2", oldNullable: true);
            migrationBuilder.AlterColumn<DateTime>(name: "created_at", table: "Equipments", type: "datetime2", nullable: false, defaultValue: new DateTime(1,1,1,0,0,0,0,DateTimeKind.Unspecified), oldClrType: typeof(DateTime), oldType: "datetime2", oldNullable: true);

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys
                               WHERE name = 'FKNotificationsUsers'
                                 AND parent_object_id = OBJECT_ID('Notifications'))
                ALTER TABLE [Notifications]
                    ADD CONSTRAINT [FKNotificationsUsers]
                    FOREIGN KEY ([UserId]) REFERENCES [Users]([id]) ON DELETE CASCADE;
            ");
        }
    }
}