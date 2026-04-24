using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HotelManagementAPI.Services;

public class UserManagementService : IUserManagementService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IAuditLogService _auditLogService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserManagementService(
        AppDbContext context,
        INotificationService notificationService,
        IAuditLogService auditLogService,           // ← THÊM
        IHttpContextAccessor httpContextAccessor)   // ← THÊM
    {
        _context = context;
        _notificationService = notificationService;
        _auditLogService = auditLogService;
        _httpContextAccessor = httpContextAccessor;
    }

    // ← THÊM: Helper lấy tên người dùng đang thao tác
    private string GetCurrentUserName()
    {
        return _httpContextAccessor.HttpContext?.User
            .FindFirst(ClaimTypes.Name)?.Value ?? "System";
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
            FullName     = dto.FullName,
            Email        = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone        = dto.Phone,
            RoleId       = dto.RoleId,
            Status       = true,
            CreatedAt    = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        await _context.Entry(user).Reference(u => u.Role).LoadAsync();

        // ← THÊM: Ghi audit log — dùng đúng signature (userName, action, recordId, tableName, ...)
        await _auditLogService.LogAsync(
            GetCurrentUserName(),
            "CREATE_USER",
            user.Id,
            "Users",
            null,
            user.Id,
            System.Text.Json.JsonSerializer.Serialize(new { user.Email, user.FullName, user.RoleId }),
            $"Tạo user mới: {user.Email}"
        );

        return MapToDto(user);
    }

    public async Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        bool wasActive = user.Status;

        // ← THÊM: Snapshot cũ
        var oldSnapshot = System.Text.Json.JsonSerializer.Serialize(new
        {
            user.FullName, user.Phone, user.Status
        });

        user.FullName = dto.FullName;
        user.Phone    = dto.Phone;
        user.Status   = dto.Status;

        await _context.SaveChangesAsync();

        // ← THÊM: Ghi audit log
        await _auditLogService.LogAsync(
            GetCurrentUserName(),
            "UPDATE_USER",
            id,
            "Users",
            oldSnapshot,
            id,
            System.Text.Json.JsonSerializer.Serialize(new { dto.FullName, dto.Phone, dto.Status }),
            $"Cập nhật user ID={id}"
        );

        if (wasActive && !dto.Status)
        {
            await _notificationService.SendNotificationAsync(
                user.Id,
                "Tài khoản của bạn đã bị khóa bởi Admin.",
                "Security"
            );
        }
        else if (!wasActive && dto.Status)
        {
            await _notificationService.SendNotificationAsync(
                user.Id,
                "Tài khoản của bạn đã được kích hoạt trở lại.",
                "Account"
            );
        }

        await _context.Entry(user).Reference(u => u.Role).LoadAsync();
        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        // Snapshot trước khi xóa (giữ nguyên như cũ)
        var oldSnapshot = System.Text.Json.JsonSerializer.Serialize(new
        {
            user.Email, user.FullName
        });

        // ← THÊM: Null hóa user_id trong Audit_Logs để giữ lịch sử
        var auditLogs = await _context.AuditLogs
            .Where(a => a.UserId == id)
            .ToListAsync();

        foreach (var log in auditLogs)
            log.UserId = null;

        // Xóa user
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        // Ghi audit log (giữ nguyên như cũ)
        await _auditLogService.LogAsync(
            GetCurrentUserName(),
            "DELETE_USER",
            id,
            "Users",
            oldSnapshot,
            null,
            null,
            $"Xóa user ID={id}, Email={user.Email}"
        );

        return true;
    }

    public async Task<bool> ChangeUserRoleAsync(int userId, int roleId)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return false;

        var roleExists = await _context.Roles.AnyAsync(r => r.Id == roleId);
        if (!roleExists) return false;

        var oldRoleName = user.Role?.Name ?? "N/A";
        var newRole     = await _context.Roles.FindAsync(roleId);

        var oldSnapshot = System.Text.Json.JsonSerializer.Serialize(new
        {
            RoleId = user.RoleId, RoleName = oldRoleName
        });

        user.RoleId = roleId;
        await _context.SaveChangesAsync();

        // ← THÊM: Ghi audit log
        await _auditLogService.LogAsync(
            GetCurrentUserName(),
            "CHANGE_ROLE",
            userId,
            "Users",
            oldSnapshot,
            userId,
            System.Text.Json.JsonSerializer.Serialize(new { RoleId = roleId, RoleName = newRole?.Name }),
            $"Đổi role user ID={userId}: {oldRoleName} → {newRole?.Name}"
        );

        await _notificationService.SendNotificationAsync(
            userId,
            $"Quyền của bạn đã được thay đổi từ [{oldRoleName}] sang [{newRole?.Name}].",
            "PermissionUpdate"
        );

        return true;
    }

    // ← THÊM: Đổi mật khẩu — dùng ChangePasswordDto từ AuthDtos.cs (đã có sẵn)
    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        if (!string.IsNullOrWhiteSpace(dto.OldPassword))
        {
            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Mật khẩu cũ không đúng");
        }

        if (dto.NewPassword.Length < 6)
            throw new ArgumentException("Mật khẩu mới phải có ít nhất 6 ký tự");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            GetCurrentUserName(),
            "CHANGE_PASSWORD",
            userId,
            "Users",
            null,
            userId,
            null,
            $"Đổi mật khẩu user ID={userId}"
        );

        return true;
    }

    // ← THÊM: Toggle status — tái dùng UpdateUserAsync
    public async Task<UserResponseDto?> ToggleStatusAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        // UpdateUserDto(string FullName, string? Phone, bool Status) — đúng với record thực
        return await UpdateUserAsync(id, new UpdateUserDto(user.FullName, user.Phone, !user.Status));
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
        u.Id, u.FullName, u.Email, u.Phone,
        u.Role?.Name, u.RoleId, u.Status, u.AvatarUrl, u.CreatedAt
    );
}