using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Data;

public static class DatabaseSchemaInitializer
{
    public static async Task EnsureEquipmentDamageSchemaAsync(IServiceProvider services)
    {
        await using var scope = services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await dbContext.Database.ExecuteSqlRawAsync(
            """
            IF OBJECT_ID(N'[dbo].[Loss_And_Damages]', N'U') IS NOT NULL
            BEGIN
                IF COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'image_url') IS NULL
                   AND COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'ImageUrl') IS NOT NULL
                BEGIN
                    EXEC sp_rename 'dbo.Loss_And_Damages.ImageUrl', 'image_url', 'COLUMN';
                END

                IF COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'image_url') IS NULL
                BEGIN
                    ALTER TABLE [dbo].[Loss_And_Damages]
                        ADD [image_url] NVARCHAR(MAX) NULL;
                END

                IF COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'equipment_id') IS NULL
                BEGIN
                    ALTER TABLE [dbo].[Loss_And_Damages]
                        ADD [equipment_id] INT NULL;
                END

                IF COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'status') IS NULL
                BEGIN
                    ALTER TABLE [dbo].[Loss_And_Damages]
                        ADD [status] NVARCHAR(20) NULL;
                END
            END
            """
        );

        await dbContext.Database.ExecuteSqlRawAsync(
            """
            IF OBJECT_ID(N'[dbo].[Loss_And_Damages]', N'U') IS NOT NULL
               AND COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'equipment_id') IS NOT NULL
               AND OBJECT_ID(N'[dbo].[Room_Inventory]', N'U') IS NOT NULL
               AND COL_LENGTH(N'[dbo].[Room_Inventory]', 'EquipmentId') IS NOT NULL
            BEGIN
                UPDATE ld
                SET ld.[equipment_id] = ri.[EquipmentId]
                FROM [dbo].[Loss_And_Damages] AS ld
                INNER JOIN [dbo].[Room_Inventory] AS ri
                    ON ri.[id] = ld.[room_inventory_id]
                WHERE ld.[equipment_id] IS NULL;
            END
            """
        );

        await dbContext.Database.ExecuteSqlRawAsync(
            """
            IF OBJECT_ID(N'[dbo].[Loss_And_Damages]', N'U') IS NOT NULL
               AND COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'status') IS NOT NULL
            BEGIN
                UPDATE [dbo].[Loss_And_Damages]
                SET [status] = 'pending'
                WHERE [status] IS NULL OR LTRIM(RTRIM([status])) = '';
            END
            """
        );

        await dbContext.Database.ExecuteSqlRawAsync(
            """
            IF OBJECT_ID(N'[dbo].[Loss_And_Damages]', N'U') IS NOT NULL
               AND COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'equipment_id') IS NOT NULL
               AND OBJECT_ID(N'[dbo].[Equipments]', N'U') IS NOT NULL
               AND NOT EXISTS (
                   SELECT 1
                   FROM sys.foreign_keys
                   WHERE name = 'FK_LossAndDamages_Equipment'
               )
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.foreign_keys
                    WHERE name = 'FK_LossAndDamages_Equipment'
                )
                BEGIN
                    ALTER TABLE [dbo].[Loss_And_Damages] WITH CHECK
                        ADD CONSTRAINT [FK_LossAndDamages_Equipment]
                        FOREIGN KEY ([equipment_id]) REFERENCES [dbo].[Equipments]([id]);
                END
            END
            """
        );

        await dbContext.Database.ExecuteSqlRawAsync(
            """
            IF OBJECT_ID(N'[dbo].[Loss_And_Damages]', N'U') IS NOT NULL
               AND COL_LENGTH(N'[dbo].[Loss_And_Damages]', 'status') IS NOT NULL
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM sys.check_constraints
                    WHERE name = 'CK_LossAndDamages_Status'
                )
                BEGIN
                    ALTER TABLE [dbo].[Loss_And_Damages] WITH NOCHECK
                        ADD CONSTRAINT [CK_LossAndDamages_Status]
                        CHECK ([status] IN ('pending', 'confirmed', 'cancelled'));
                END

                IF EXISTS (
                    SELECT 1
                    FROM sys.columns
                    WHERE object_id = OBJECT_ID(N'[dbo].[Loss_And_Damages]')
                      AND name = 'status'
                      AND is_nullable = 1
                )
                BEGIN
                    ALTER TABLE [dbo].[Loss_And_Damages]
                        ALTER COLUMN [status] NVARCHAR(20) NOT NULL;
                END
            END
            """
        );
    }
}
