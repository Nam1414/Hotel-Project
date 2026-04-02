-- ============================================================
-- PATCH: Đổi tên các cột trong bảng Equipments (SỬA LỖI COMPUTED COLUMN)
-- Xử lý: Xóa Cột tính toán -> Xóa Constraints -> Đổi tên -> Tạo lại
-- ============================================================
USE [HotelManagementDB];
GO

-- ─── 1. XÓA CÁC ĐỐI TƯỢNG PHỤ THUỘC (DEPENDENCIES) ───────────────────────────

-- Xóa cột tính toán InStockQuantity (Nó vướng TotalQuantity, InUseQuantity...)
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'InStockQuantity')
BEGIN
    ALTER TABLE [dbo].[Equipments] DROP COLUMN [InStockQuantity];
    PRINT 'Đã xóa cột tính toán InStockQuantity';
END

-- Tìm và xóa tất cả Default Constraints của bảng Equipments
DECLARE @sql NVARCHAR(MAX) = N'';
SELECT @sql += N'ALTER TABLE [dbo].[Equipments] DROP CONSTRAINT [' + name + '];' + CHAR(13)
FROM sys.default_constraints
WHERE parent_object_id = OBJECT_ID(N'[dbo].[Equipments]');

IF @sql <> N''
BEGIN
    EXEC sp_executesql @sql;
    PRINT 'Đã xóa các Default Constraints của bảng Equipments';
END

-- Tìm và xóa Unique Index trên cột ItemCode
DECLARE @indexName NVARCHAR(255);
SELECT TOP 1 @indexName = name 
FROM sys.indexes 
WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') 
  AND is_unique = 1 
  AND (name LIKE 'UQ__Equipmen%' OR name = 'UQ_Equipments_item_code');

IF @indexName IS NOT NULL
BEGIN
    -- Cần kiểm tra xem nó là CONSTRAINT hay INDEX
    IF EXISTS (SELECT 1 FROM sys.objects WHERE name = @indexName AND type = 'UQ')
        SET @sql = N'ALTER TABLE [dbo].[Equipments] DROP CONSTRAINT [' + @indexName + '];';
    ELSE
        SET @sql = N'DROP INDEX [' + @indexName + '] ON [dbo].[Equipments];';
    
    EXEC sp_executesql @sql;
    PRINT 'Đã xóa Unique Index/Constraint: ' + @indexName;
END
GO

-- ─── 2. ĐỔI TÊN CÁC CỘT SANG SNAKE_CASE ──────────────────────────────────────

-- Helper để đổi tên nếu cột tồn tại
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'ItemCode')
    EXEC sp_rename 'dbo.Equipments.ItemCode', 'item_code', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'Name')
    EXEC sp_rename 'dbo.Equipments.Name', 'name', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'Category')
    EXEC sp_rename 'dbo.Equipments.Category', 'category', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'Unit')
    EXEC sp_rename 'dbo.Equipments.Unit', 'unit', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'TotalQuantity')
    EXEC sp_rename 'dbo.Equipments.TotalQuantity', 'total_quantity', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'InUseQuantity')
    EXEC sp_rename 'dbo.Equipments.InUseQuantity', 'in_use_quantity', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'DamagedQuantity')
    EXEC sp_rename 'dbo.Equipments.DamagedQuantity', 'damaged_quantity', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'LiquidatedQuantity')
    EXEC sp_rename 'dbo.Equipments.LiquidatedQuantity', 'liquidated_quantity', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'BasePrice')
    EXEC sp_rename 'dbo.Equipments.BasePrice', 'base_price', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'DefaultPriceIfLost')
    EXEC sp_rename 'dbo.Equipments.DefaultPriceIfLost', 'default_price_if_lost', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'Supplier')
    EXEC sp_rename 'dbo.Equipments.Supplier', 'supplier', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'ImageUrl')
    EXEC sp_rename 'dbo.Equipments.ImageUrl', 'image_url', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'IsActive')
    EXEC sp_rename 'dbo.Equipments.IsActive', 'is_active', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'CreatedAt')
    EXEC sp_rename 'dbo.Equipments.CreatedAt', 'created_at', 'COLUMN';

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'UpdatedAt')
    EXEC sp_rename 'dbo.Equipments.UpdatedAt', 'updated_at', 'COLUMN';
GO

-- ─── 3. TẠO LẠI CÁC ĐỐI TƯỢNG (RESTORE) ──────────────────────────────────────

-- Tạo lại cột tính toán in_stock_quantity (Dùng tên cột mới)
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Equipments]') AND name = 'in_stock_quantity')
BEGIN
    ALTER TABLE [dbo].[Equipments] 
        ADD [in_stock_quantity] AS ((([total_quantity]-[in_use_quantity])-[damaged_quantity])-[liquidated_quantity]);
    PRINT 'Đã tạo lại cột tính toán in_stock_quantity';
END

-- Tạo lại các Default Constraints
IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = 'DF_Equipments_total_quantity')
    ALTER TABLE [dbo].[Equipments] ADD CONSTRAINT [DF_Equipments_total_quantity] DEFAULT ((0)) FOR [total_quantity];

IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = 'DF_Equipments_in_use_quantity')
    ALTER TABLE [dbo].[Equipments] ADD CONSTRAINT [DF_Equipments_in_use_quantity] DEFAULT ((0)) FOR [in_use_quantity];

IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = 'DF_Equipments_is_active')
    ALTER TABLE [dbo].[Equipments] ADD CONSTRAINT [DF_Equipments_is_active] DEFAULT ((1)) FOR [is_active];

IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = 'DF_Equipments_created_at')
    ALTER TABLE [dbo].[Equipments] ADD CONSTRAINT [DF_Equipments_created_at] DEFAULT (GETUTCDATE()) FOR [created_at];

-- Tạo lại Unique Index
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_Equipments_item_code' AND object_id = OBJECT_ID(N'[dbo].[Equipments]'))
    ALTER TABLE [dbo].[Equipments] ADD CONSTRAINT [UQ_Equipments_item_code] UNIQUE (item_code);

PRINT 'Đã hoàn thành đồng bộ bảng Equipments sang snake_case (Lần 2).';
GO
