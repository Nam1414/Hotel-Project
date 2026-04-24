namespace HotelManagementAPI.DTOs;

// RoomTypes
public record CreateRoomTypeDto(
    string Name,
    string? Description,
    decimal BasePrice,
    int? CapacityAdults,
    int? CapacityChildren,
    int? SizeSqm,
    string? BedType,
    string? ViewType,
    string? Slug,
    string? Content
);

public record UpdateRoomTypeDto(
    string Name,
    string? Description,
    decimal BasePrice,
    int? CapacityAdults,
    int? CapacityChildren,
    int? SizeSqm,
    string? BedType,
    string? ViewType,
    string? Slug,
    string? Content,
    bool IsActive
);

public record RoomTypeResponseDto(
    int Id,
    string Name,
    string? Description,
    decimal BasePrice,
    int? CapacityAdults,
    int? CapacityChildren,
    int? SizeSqm,
    string? BedType,
    string? ViewType,
    string? Slug,
    string? Content,
    bool IsActive,
    List<RoomImageResponseDto>? Images = null,
    List<AmenityDto>? Amenities = null
);

public record RoomImageResponseDto(
    int Id,
    string? PublicId,
    string? ImageUrl,
    bool IsPrimary
);

// Rooms
public record CreateRoomDto(
    string RoomNumber,
    int RoomTypeId,
    string Status,
    int? Floor,
    string? CleaningStatus
);

public record UpdateRoomDto(
    string RoomNumber,
    int RoomTypeId,
    string Status,
    int? Floor,
    string? CleaningStatus,
    string? ExtensionNumber,
    bool IsActive
);

public record RoomResponseDto(
    int Id,
    string RoomNumber,
    string RoomTypeName,
    int? RoomTypeId,
    int? Floor,
    string Status,
    string? CleaningStatus,
    string? ExtensionNumber,
    bool IsActive
);

// // Inventory
// public record InventoryUpdateDto(
//     int RoomTypeId,
//     DateTime InventoryDate,
//     int TotalRooms,
//     int AvailableRooms,
//     decimal? PriceOverride
// );

// public record InventoryResponseDto(
//     int Id,
//     int RoomTypeId,
//     string RoomTypeName,
//     DateTime InventoryDate,
//     int TotalRooms,
//     int AvailableRooms,
//     decimal? PriceOverride
// );

// public record BulkUpdatePriceDto(
//     int RoomTypeId,
//     DateTime StartDate,
//     DateTime EndDate,
//     decimal? PriceOverride
// );
public record BulkCreateRoomDto(
    int RoomTypeId,
    int Floor,           // dùng để ghép roomNumber: "201", "202"...
    int StartNumber,     // số bắt đầu
    int Count,           // số lượng phòng (1–50)
    int? TemplateRoomId  // (optional) clone vật tư từ phòng mẫu
);