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
            Message = message,
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
            notification.Message,
            notification.Type,
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
}
