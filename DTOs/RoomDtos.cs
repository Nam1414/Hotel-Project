namespace HotelManagementAPI.DTOs;

// RoomTypes
public record CreateRoomTypeDto(
    string Name,
    string? Description,
    decimal BasePrice,
    int MaxCapacity
);

public record UpdateRoomTypeDto(
    string Name,
    string? Description,
    decimal BasePrice,
    int MaxCapacity,
    bool IsActive
);

public record RoomTypeResponseDto(
    int Id,
    string Name,
    string? Description,
    decimal BasePrice,
    int MaxCapacity,
    bool IsActive,
    List<RoomImageResponseDto>? Images = null
);

public record RoomImageResponseDto(
    int Id,
    string ImageUrl,
    bool IsPrimary
);

// Rooms
public record CreateRoomDto(
    string RoomNumber,
    int RoomTypeId,
    string Status
);

public record UpdateRoomDto(
    string RoomNumber,
    int RoomTypeId,
    string Status,
    bool IsActive
);

public record RoomResponseDto(
    int Id,
    string RoomNumber,
    string RoomTypeName,
    int RoomTypeId,
    string Status,
    bool IsActive
);

// Inventory
public record InventoryUpdateDto(
    int RoomTypeId,
    DateTime InventoryDate,
    int TotalRooms,
    int AvailableRooms,
    decimal? PriceOverride
);

public record InventoryResponseDto(
    int Id,
    int RoomTypeId,
    string RoomTypeName,
    DateTime InventoryDate,
    int TotalRooms,
    int AvailableRooms,
    decimal? PriceOverride
);
