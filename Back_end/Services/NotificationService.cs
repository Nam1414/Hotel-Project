using HotelManagementAPI.Data;
using HotelManagementAPI.Hubs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(AppDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(int userId, string message, string type = "General")
    {
        // 1. Lưu vào Database
        var notification = new Notification
        {
            UserId = userId,
            Title = message, // Có thể dùng type làm title tạm thời
            Content = message, //message sẽ được lưu vào content
            Type = type,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // 2. Gửi realtime qua SignalR (đến User ID cụ thể)
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", new
        {
            notification.Id,
            notification.Title,
            notification.Content,
            notification.Type,
            notification.IsRead,
            notification.CreatedAt
        });
    }

    public async Task SendToRoleAsync(int roleId, string message, string type = "General")
    {
        var users = await _context.Users
            .Where(u => u.RoleId == roleId)
            .Select(u => u.Id)
            .ToListAsync();

        foreach (var userId in users)
        {
            await SendNotificationAsync(userId, message, type);
        }
    }

    // Thêm method mới — gửi theo tên Role (không cần biết roleId)
    public async Task SendToRoleByNameAsync(
        string roleName, string message, string type = "General")
    {
        var roleId = await _context.Roles
            .Where(r => r.Name == roleName)
            .Select(r => r.Id)
            .FirstOrDefaultAsync();

        if (roleId == 0) return; // Role không tồn tại → bỏ qua

        await SendToRoleAsync(roleId, message, type);
    }
}
