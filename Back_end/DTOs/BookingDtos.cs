// ← [MỚI] Toàn bộ file này là mới
namespace HotelManagementAPI.DTOs;

public record CreateBookingDto(
    int? UserId,
    string GuestName,
    string GuestPhone,
    string GuestEmail,
    int? VoucherId,
    List<BookingDetailDto> Details
);

public record BookingDetailDto(
    int RoomId,
    DateTime CheckInDate,
    DateTime CheckOutDate
);

public record UpdateBookingStatusDto(string Status);