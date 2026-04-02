using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Hubs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services;

public class PersistedNotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public PersistedNotificationService(AppDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(
        int? userId,
        string title,
        string content,
        NotificationType type = NotificationType.Info,
        string? referenceLink = null)
    {
        try
        {
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

            if (userId.HasValue)
            {
                await _hubContext.Clients.User(userId.Value.ToString())
                    .SendAsync("ReceiveNotification", ToPayload(notification));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[PersistedNotificationService Error]: {ex.Message}");
        }
    }

    public async Task SendToRoleAsync(
        int roleId,
        string title,
        string content,
        NotificationType type = NotificationType.Info,
        string? referenceLink = null)
    {
        var userIds = await _context.Users
            .Where(u => u.RoleId == roleId)
            .Select(u => u.Id)
            .ToListAsync();

        if (userIds.Count == 0)
        {
            return;
        }

        await CreateAndSendPerUserAsync(userIds, title, content, type, referenceLink);
    }

    public async Task SendToRolesAndUserAsync(
        List<string> roles,
        int? targetUserId,
        NotificationAction action,
        NotificationType type,
        string actorName,
        string? referenceLink = null)
    {
        try
        {
            var (title, content) = GenerateMessage(action, actorName);

            var normalizedRoles = roles
                .Where(role => !string.IsNullOrWhiteSpace(role))
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            var recipientIds = await _context.Users
                .Where(u => u.Role != null && normalizedRoles.Contains(u.Role.Name))
                .Select(u => u.Id)
                .Distinct()
                .ToListAsync();

            if (targetUserId.HasValue && !recipientIds.Contains(targetUserId.Value))
            {
                recipientIds.Add(targetUserId.Value);
            }

            if (recipientIds.Count == 0)
            {
                return;
            }

            await CreateAndSendPerUserAsync(recipientIds, title, content, type, referenceLink);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[PersistedNotificationService Error]: {ex.Message}");
        }
    }

    public async Task SendToRoleByNameAsync(
        string roleName,
        string title,
        string content,
        NotificationType type = NotificationType.Info,
        string? referenceLink = null)
    {
        var roleId = await _context.Roles
            .Where(r => r.Name == roleName)
            .Select(r => r.Id)
            .FirstOrDefaultAsync();

        if (roleId == 0)
        {
            return;
        }

        await SendToRoleAsync(roleId, title, content, type, referenceLink);
    }

    private async Task CreateAndSendPerUserAsync(
        IEnumerable<int> userIds,
        string title,
        string content,
        NotificationType type,
        string? referenceLink)
    {
        var notifications = userIds
            .Distinct()
            .Select(userId => new Notification
            {
                UserId = userId,
                Title = title,
                Content = content,
                Type = type,
                ReferenceLink = referenceLink,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            })
            .ToList();

        _context.Notifications.AddRange(notifications);
        await _context.SaveChangesAsync();

        foreach (var notification in notifications)
        {
            await _hubContext.Clients.User(notification.UserId!.Value.ToString())
                .SendAsync("ReceiveNotification", ToPayload(notification));
        }
    }

    private static object ToPayload(Notification notification) => new
    {
        notification.Id,
        notification.Title,
        notification.Content,
        Type = notification.Type.ToString(),
        notification.ReferenceLink,
        notification.CreatedAt,
        notification.IsRead
    };

    private static (string Title, string Content) GenerateMessage(NotificationAction action, string actorName)
    {
        return action switch
        {
            NotificationAction.CreateAccount => ("Tai khoan moi", $"Tai khoan {actorName} da duoc them vao he thong"),
            NotificationAction.LockAccount => ("Tai khoan bi khoa", $"Tai khoan {actorName} da bi vo hieu hoa"),
            NotificationAction.ChangeRole => ("Cap nhat quyen han", $"Quyen cua {actorName} da duoc thay doi"),
            NotificationAction.UnlockAccount => ("Tai khoan da kich hoat", $"Tai khoan {actorName} da duoc kich hoat tro lai"),
            NotificationAction.ResetPassword => ("Cap nhat mat khau", $"Mat khau cua {actorName} da duoc dat lai"),
            NotificationAction.CheckIn => ("Check-in phong", $"Khach hang {actorName} da check-in thanh cong"),
            NotificationAction.CheckOut => ("Check-out phong", $"Khach hang {actorName} da check-out thanh cong"),
            NotificationAction.UpdateRolePermissions => ("Cap nhat quyen he thong", $"Quyen han cua nhom '{actorName}' vua duoc thay doi"),
            _ => ("Thong bao", $"Co cap nhat moi lien quan den {actorName}")
        };
    }
}
