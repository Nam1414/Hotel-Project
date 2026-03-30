
namespace HotelManagementAPI.DTOs;

public record CreateEquipmentDto(
    string ItemCode,
    string Name,
    string Category,
    string Unit,
    int TotalQuantity,
    decimal BasePrice,
    decimal DefaultPriceIfLost,
    string? Supplier
);

public record UpdateEquipmentDto(
    string Name,
    string Category,
    string Unit,
    int TotalQuantity,
    string? Supplier
);

public record UpdatePriceDto(
    decimal BasePrice,
    decimal DefaultPriceIfLost
);

public record BulkCreateRoomDto(
    int RoomTypeId,
    int Floor,
    int StartNumber,   // Số phòng bắt đầu, VD: 101
    int Count,         // Tạo bao nhiêu phòng
    int? TemplateRoomId // Clone vật tư từ phòng mẫu nào (optional)
);

public record UpdateCompensationDto(
    decimal DefaultPriceIfLost
);

public record SyncInventoryDto(
    int DamagedQuantity
);