using HotelManagementAPI.Data;
using HotelManagementAPI.Hubs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Enums;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

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
        try
        {
            // 1. Lưu vào Database
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Content = content,
                Type = type,
                ReferenceLink = referenceLink,
                CreatedAt = DateTime.UtcNow,
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
                Type = notification.Type.ToString(),
                notification.ReferenceLink,
                notification.CreatedAt,
                notification.IsRead
            };

            if (userId.HasValue)
            {
                await _hubContext.Clients.User(userId.Value.ToString()).SendAsync("ReceiveNotification", messageData);
            }
        }
        catch (Exception ex)
        {
            // Log lỗi nhưng không làm crash luồng chính
            Console.WriteLine($"[NotificationService Error]: {ex.Message}");
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

    // Sinh nội dung tự động từ Action
    private (string Title, string Content) GenerateMessage(NotificationAction action, string actorName)
    {
        return action switch {
            NotificationAction.CreateAccount => ("Tài khoản mới", $"Tài khoản {actorName} đã được thêm vào hệ thống"),
            NotificationAction.LockAccount => ("Tài khoản bị khóa", $"Tài khoản {actorName} đã bị vô hiệu hóa"),
            NotificationAction.ChangeRole => ("Cập nhật quyền hạn", $"Quyền của {actorName} đã được thay đổi"),
            NotificationAction.UnlockAccount => ("Tài khoản đã kích hoạt", $"Tài khoản {actorName} đã được kích hoạt trở lại"),
            NotificationAction.ResetPassword => ("Cập nhật mật khẩu", $"Mật khẩu của {actorName} đã được đặt lại"),
            NotificationAction.CheckIn => ("Check-in phòng", $"Khách hàng {actorName} đã check-in thành công"),
            NotificationAction.CheckOut => ("Check-out phòng", $"Khách hàng {actorName} đã check-out thành công"),
            NotificationAction.UpdateRolePermissions => ("Cập nhật quyền hệ thống", $"Quyền hạn của nhóm '{actorName}' vừa được thay đổi"),
            _ => ("Thông báo", $"Có cập nhật mới liên quan đến {actorName}")
        };
    }

    public async Task SendToRolesAndUserAsync(List<string> roles, int? targetUserId, NotificationAction action, NotificationType type, string actorName, string? referenceLink = null)
    {
        try
        {
            var (title, content) = GenerateMessage(action, actorName);

            // 1. Lưu thông báo vào Database (Lưu cho target user nếu có)
            var notification = new Notification
            {
                UserId = targetUserId,
                Title = title,
                Content = content,
                Type = type,
                ReferenceLink = referenceLink,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // 2. Phát tín hiệu đến các Group (Role)
            var messageData = new
            {
                notification.Id,
                notification.Title,
                notification.Content,
                Type = notification.Type.ToString(),
                notification.ReferenceLink,
                notification.CreatedAt,
                notification.IsRead
            };

            foreach (var role in roles)
            {
                await _hubContext.Clients.Group(role).SendAsync("ReceiveNotification", messageData);
            }

            // Phát tín hiệu đến Target User (nếu cần gửi trực tiếp)
            if (targetUserId.HasValue)
            {
                await _hubContext.Clients.User(targetUserId.Value.ToString()).SendAsync("ReceiveNotification", messageData);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService Error]: {ex.Message}");
        }
    }

    public async Task SendToRoleByNameAsync(
        string roleName, string title, string content, NotificationType type = NotificationType.Info, string? referenceLink = null)
    {
        var roleId = await _context.Roles
            .Where(r => r.Name == roleName)
            .Select(r => r.Id)
            .FirstOrDefaultAsync();

        if (roleId == 0) return; // Role không tồn tại → bỏ qua

        await SendToRoleAsync(roleId, title, content, type, referenceLink);
    }
}
