namespace HotelManagementAPI.DTOs;

public record CreateLossDamageDto(
    int? BookingDetailId,
    int? RoomInventoryId,
    int Quantity,
    decimal PenaltyAmount,
    string? Description,
    string? ImageUrl
);

public record UpdateLossDamageDto(
    int? BookingDetailId,
    int? RoomInventoryId,
    int Quantity,
    decimal PenaltyAmount,
    string? Description,
    string? ImageUrl
);

public record LossDamageResponseDto(
    int Id,
    int? BookingDetailId,
    int? RoomInventoryId,
    int Quantity,
    decimal PenaltyAmount,
    string? Description,
    string? ImageUrl,
    DateTime? CreatedAt,
    string? RoomNumber,
    string? EquipmentName
);
