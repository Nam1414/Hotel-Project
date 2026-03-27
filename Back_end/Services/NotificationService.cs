using HotelManagementAPI.Data;
using HotelManagementAPI.Hubs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Enums;
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

    public async Task SendNotificationAsync(int? userId, string title, string content, NotificationType type = NotificationType.Info, string? referenceLink = null)
    {
        // 1. Lưu vào Database
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Content = content,
            Type = type,
            ReferenceLink = referenceLink,
            CreatedAt = DateTime.Now,
            IsRead = false
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // 2. Gửi realtime qua SignalR
        var messageData = new
        {
            notification.Id,
            notification.Title,
            notification.Content,
            Type = notification.Type.ToString(), // Chuyển sang string cho client
            notification.ReferenceLink,
            notification.CreatedAt,
            notification.IsRead
        };

        if (userId.HasValue)
        {
            // Gửi đến User cụ thể
            await _hubContext.Clients.User(userId.Value.ToString()).SendAsync("ReceiveNotification", messageData);
        }
        else
        {
            // Gửi toàn hệ thống (Broadcast)
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", messageData);
        }
    }

    public async Task SendToRoleAsync(int roleId, string title, string content, NotificationType type = NotificationType.Info, string? referenceLink = null)
    {
        var users = await _context.Users
            .Where(u => u.RoleId == roleId)
            .Select(u => u.Id)
            .ToListAsync();

        foreach (var userId in users)
        {
            await SendNotificationAsync(userId, title, content, type, referenceLink);
        }
    }
}
