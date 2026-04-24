namespace HotelManagementAPI.DTOs;

public record CreateMinibarItemDto(
    string Name,
    decimal Price,
    string? Unit,
    int TotalQuantity);
public record UpdateMinibarItemDto(
    string Name,
    decimal Price,
    bool IsActive);
public record UpdateMinibarStockDto(
    int RoomId,
    int MinibarItemId,
    int Quantity);

public record CreateRoomItemDto(
    int RoomId,
    int? EquipmentId,
    int Quantity,
    decimal? PriceIfLost,
    string? Note,
    string? ItemType
);
public record UpdateRoomItemDto(
    int? EquipmentId,
    int Quantity,
    decimal? PriceIfLost,
    string? Note,
    string? ItemType,
    bool IsActive
);

public record RoomItemResponseDto(
    int Id,
    int RoomId,
    string? RoomNumber,
    int? EquipmentId,
    string? EquipmentName,   // ← lấy từ Equipment navigation
    string? ItemType,
    int Quantity,
    decimal? PriceIfLost,
    string? Note,
    bool IsActive
);

// DTO cho filter response có pagination
public record FilterUsersResponseDto(
    IEnumerable<UserResponseDto> Data,
    int TotalCount,
    int Page,
    int PageSize
);

// DTO cho block/unblock user
public record ToggleUserStatusDto(bool Status, string? Reason);



