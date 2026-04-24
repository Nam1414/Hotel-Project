
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

public record UpdateCompensationDto(
    decimal DefaultPriceIfLost
);

public record SyncInventoryDto(
    int DamagedQuantity
);

