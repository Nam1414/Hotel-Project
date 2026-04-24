namespace HotelManagementAPI.DTOs;

public record InventoryResponseDto(
    int Id,
    int RoomTypeId,
    string RoomTypeName,
    DateTime InventoryDate,
    int TotalRooms,
    int AvailableRooms,
    decimal? PriceOverride
);

public record InventoryUpdateDto(
    int RoomTypeId,
    DateTime InventoryDate,
    int TotalRooms,
    int AvailableRooms,
    decimal? PriceOverride
);

public record BulkUpdatePriceDto(
    int RoomTypeId,
    DateTime StartDate,
    DateTime EndDate,
    decimal? PriceOverride
);