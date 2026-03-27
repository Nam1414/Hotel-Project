using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Enums;
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
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            throw new InvalidOperationException("Email đã tồn tại trong hệ thống");

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
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();

        return MapToDto(user);
    }

    public async Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        bool wasActive = user.Status;

        user.FullName = dto.FullName;
        user.Phone = dto.Phone;
        user.Status = dto.Status;

        await _context.SaveChangesAsync();

        // Gửi thông báo nếu tài khoản bị khóa
        if (wasActive && !dto.Status)
        {
            await _notificationService.SendNotificationAsync(
                user.Id,
                "Tài khoản bị khóa",
                "Tài khoản của bạn đã bị khóa bởi Admin. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
                NotificationType.Security
            );
        }
        // Gửi thông báo nếu tài khoản được mở khóa
        else if (!wasActive && dto.Status)
        {
            await _notificationService.SendNotificationAsync(
                user.Id,
                "Tài khoản đã kích hoạt",
                "Tài khoản của bạn đã được kích hoạt trở lại. Bây giờ bạn có thể đăng nhập vào hệ thống.",
                NotificationType.Account
            );
        }

        await _context.Entry(user).Reference(u => u.Role).LoadAsync();
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

    public async Task<bool> ChangeUserRoleAsync(int userId, int roleId)
    {
        var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        var roleExists = await _context.Roles.AnyAsync(r => r.Id == roleId);
        if (!roleExists) return false;

        var oldRoleName = user.Role?.Name ?? "N/A";
        var newRole = await _context.Roles.FindAsync(roleId);

        user.RoleId = roleId;
        await _context.SaveChangesAsync();

        // Thông báo khi quyền thay đổi
        await _notificationService.SendNotificationAsync(
            userId,
            "Cập nhật quyền hạn",
            $"Quyền của bạn đã được thay đổi từ [{oldRoleName}] sang [{newRole?.Name}].",
            NotificationType.PermissionUpdate
        );

        return true;
    }

    public async Task<IEnumerable<UserResponseDto>> FilterUsersAsync(
        string? phone, string? email, bool? status)
    {
        var query = _context.Users.Include(u => u.Role).AsQueryable();

        if (!string.IsNullOrWhiteSpace(phone))
            query = query.Where(u => u.Phone != null && u.Phone.Contains(phone));

        if (!string.IsNullOrWhiteSpace(email))
            query = query.Where(u => u.Email.Contains(email));

        if (status.HasValue)
            query = query.Where(u => u.Status == status.Value);

        return await query
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => MapToDto(u))
            .ToListAsync();
    }

    public async Task<(IEnumerable<UserResponseDto> Data, int Total)> FilterUsersPagedAsync(
        string? phone, string? email, bool? status, int page, int pageSize)
    {
        var query = _context.Users.Include(u => u.Role).AsQueryable();

        if (!string.IsNullOrWhiteSpace(phone))
            query = query.Where(u => u.Phone != null && u.Phone.Contains(phone));

        if (!string.IsNullOrWhiteSpace(email))
            query = query.Where(u => u.Email.Contains(email));

        if (status.HasValue)
            query = query.Where(u => u.Status == status.Value);

        var total = await query.CountAsync();

        var data = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => MapToDto(u))
            .ToListAsync();

        return (data, total);
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