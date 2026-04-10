using System.Collections.Generic;
using System.Threading.Tasks;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;

namespace HotelManagementAPI.Services
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingResponseDto>> GetAllBookingsAsync();
        Task<BookingResponseDto?> GetBookingByIdAsync(int id);
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto requestDto);
        Task<BookingResponseDto?> UpdateBookingStatusAsync(int id, BookingStatus newStatus);
    }
}
