using HotelManagementAPI.DTOs;

namespace HotelManagementAPI.Services;

public interface IInventoryService
{
    Task<IEnumerable<InventoryResponseDto>> GetInventoryAsync(
        DateTime startDate, DateTime endDate, int? roomTypeId = null);

    Task<InventoryResponseDto?> GetByIdAsync(int id);

    Task<InventoryResponseDto?> UpsertInventoryAsync(InventoryUpdateDto dto);

    Task<InventoryResponseDto?> UpdateByIdAsync(int id, InventoryUpdateDto dto);

    Task<bool> DeleteByIdAsync(int id);

    Task<InventoryResponseDto?> CloneAsync(int id);

    Task<bool> BulkUpdatePriceAsync(BulkUpdatePriceDto dto);
}