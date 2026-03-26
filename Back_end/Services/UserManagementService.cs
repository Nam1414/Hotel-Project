using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services;

public class UserManagementService : IUserManagementService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public UserManagementService(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.Role)
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => MapToDto(u))
            .ToListAsync();
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int id)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id);
            
        return user == null ? null : MapToDto(user);
    }

    public async Task<UserResponseDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone = dto.Phone,
            RoleId = dto.RoleId,
            Status = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Load Role for the response
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();

        return MapToDto(user);
    }

    public async Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id);
            
        if (user == null) return null;

        user.FullName = dto.FullName;
        user.Phone = dto.Phone;
        
        if (user.Status != dto.Status)
        {
            user.Status = dto.Status;
            var message = dto.Status ? "Tài khoản của bạn đã được mở khóa." : "Tài khoản của bạn đã bị khóa bởi Quản trị viên.";
            await _notificationService.SendNotificationAsync(user.Id, message, "AccountStatus");
        }

        await _context.SaveChangesAsync();
        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ChangeUserRoleAsync(int id, int roleId)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        var roleExists = await _context.Roles.AnyAsync(r => r.Id == roleId);
        if (!roleExists) return false;

        user.RoleId = roleId;
        await _context.SaveChangesAsync();

        // Load Role Name for message
        var roleName = await _context.Roles
            .Where(r => r.Id == roleId)
            .Select(r => r.Name)
            .FirstOrDefaultAsync();

        await _notificationService.SendNotificationAsync(user.Id, $"Quyền truy cập của bạn đã được thay đổi thành: {roleName}", "PermissionChange");
        
        return true;
    }

    private static UserResponseDto MapToDto(User u) => new(
        u.Id,
        u.FullName,
        u.Email,
        u.Phone,
        u.Role?.Name,
        u.RoleId,
        u.Status,
        u.AvatarUrl,
        u.CreatedAt
    );
}
