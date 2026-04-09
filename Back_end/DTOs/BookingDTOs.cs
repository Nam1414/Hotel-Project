using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using HotelManagementAPI.Enums;

namespace HotelManagementAPI.DTOs
{
    public class BookingResponseDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? GuestName { get; set; }
        public string? GuestPhone { get; set; }
        public string? GuestEmail { get; set; }
        public string? BookingCode { get; set; }
        public int? VoucherId { get; set; }
        public string? VoucherCode { get; set; }
        // Trả về tên enum dưới dạng string ("Pending", "Confirmed", ...)
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public BookingStatus Status { get; set; }
        public List<BookingDetailResponseDto> Details { get; set; } = new List<BookingDetailResponseDto>();
        public int? InvoiceId { get; set; }
    }

    public class BookingDetailResponseDto
    {
        public int Id { get; set; }
        public int? RoomId { get; set; }
        public int? RoomTypeId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal PricePerNight { get; set; }
    }

    public class CreateBookingRequestDto
    {
        public int? UserId { get; set; }
        public string? GuestName { get; set; }
        public string? GuestPhone { get; set; }
        public string? GuestEmail { get; set; }
        public int? VoucherId { get; set; }
        public List<CreateBookingDetailDto> Details { get; set; } = new List<CreateBookingDetailDto>();
    }

    public class CreateBookingDetailDto
    {
        public int? RoomId { get; set; }
        public int? RoomTypeId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal PricePerNight { get; set; }
    }

    public class UpdateBookingStatusDto
    {
        // Nhận số nguyên index (0=Pending, 1=Confirmed, 2=CheckedIn, 3=CheckedOut, 4=Cancelled)
        public BookingStatus Status { get; set; }
    }
}
