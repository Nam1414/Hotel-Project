using HotelManagementAPI.DTOs;

namespace HotelManagementAPI.Services;

public interface IRoomService
{
    // Room Types
    Task<IEnumerable<RoomTypeResponseDto>> GetAllRoomTypesAsync();
    Task<RoomTypeResponseDto?> GetRoomTypeByIdAsync(int id);
    Task<RoomTypeResponseDto> CreateRoomTypeAsync(CreateRoomTypeDto dto);
    Task<RoomTypeResponseDto?> UpdateRoomTypeAsync(int id, UpdateRoomTypeDto dto);
    Task<bool> DeleteRoomTypeAsync(int id);

    // Rooms
    Task<IEnumerable<RoomResponseDto>> GetAllRoomsAsync(int? roomTypeId = null);
    Task<RoomResponseDto?> GetRoomByIdAsync(int id);
    Task<RoomResponseDto> CreateRoomAsync(CreateRoomDto dto);
    Task<RoomResponseDto?> UpdateRoomAsync(int id, UpdateRoomDto dto);
    Task<bool> DeleteRoomAsync(int id);
}

public interface IInventoryService
{
    Task<IEnumerable<InventoryResponseDto>> GetInventoryAsync(DateTime startDate, DateTime endDate, int? roomTypeId = null);
    Task<InventoryResponseDto?> GetByIdAsync(int id);
    Task<InventoryResponseDto?> UpdateByIdAsync(int id, InventoryUpdateDto dto);
    Task<bool> DeleteByIdAsync(int id);
    Task<InventoryResponseDto?> CloneAsync(int id);
}
