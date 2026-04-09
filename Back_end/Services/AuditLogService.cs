using HotelManagementAPI.Data;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services;

/// <summary>
/// Ghi lại toàn bộ hành động thay đổi dữ liệu.
/// Audit log KHÔNG được xóa thủ công — chỉ tự động sau 30 ngày.
/// </summary>
public class AuditLogService : IAuditLogService
{
    private readonly AppDbContext _context;

    public AuditLogService(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Ghi 1 dòng audit log vào DB.
    /// Gọi hàm này sau mỗi thao tác CREATE/UPDATE/DELETE.
    /// </summary>
    public async Task LogAsync(
        string tableName,
        string action,
        int? recordId,
        string? oldValues,
        string? newValues,
        int? userId,
        string? userName,
        string? ipAddress = null)
    {
        var log = new AuditLog
        {
            TableName  = tableName,
            Action     = action,          // "CREATE" | "UPDATE" | "DELETE"
            RecordId   = recordId,
            OldValues  = oldValues,       // JSON của dữ liệu trước khi sửa
            NewValues  = newValues,       // JSON của dữ liệu sau khi sửa
            UserId     = userId,
            CreatedAt  = DateTime.UtcNow
        };

        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Tự động xóa log cũ hơn 30 ngày.
    /// Gọi từ Background Service — KHÔNG expose endpoint xóa ra ngoài.
    /// </summary>
    public async Task CleanupOldLogsAsync(int keepDays = 90)
    {
        var cutoff = DateTime.UtcNow.AddDays(-keepDays);
        
        await _context.AuditLogs
            .Where(l => l.CreatedAt < cutoff)
            .ExecuteDeleteAsync();
    }
}