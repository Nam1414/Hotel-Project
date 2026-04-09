using HotelManagementAPI.DTOs;

namespace HotelManagementAPI.Services
{
    public interface IVoucherService
    {
        Task<IEnumerable<VoucherResponseDto>> GetAllAsync();
        Task<VoucherResponseDto?> GetByIdAsync(int id);
        Task<VoucherResponseDto> CreateAsync(CreateVoucherDto dto);
        Task<VoucherResponseDto?> UpdateAsync(int id, UpdateVoucherDto dto);
        Task<bool> DeleteAsync(int id);
        Task<VoucherResponseDto?> ValidateForBookingAsync(int id, decimal bookingAmount);
    }
}
