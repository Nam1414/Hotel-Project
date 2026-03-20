using HotelManagementAPI.DTOs;

namespace HotelManagementAPI.Services;

public interface IUserManagementService
{
    Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto?> GetUserByIdAsync(int id);
    Task<UserResponseDto> CreateUserAsync(CreateUserDto dto);
    Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto dto);
    Task<bool> DeleteUserAsync(int id);
    Task<bool> ChangeUserRoleAsync(int id, int roleId);
}
