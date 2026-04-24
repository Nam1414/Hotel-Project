namespace HotelManagementAPI.Services;

public interface IAuditLogService
{
    Task LogAsync(
        string tableName,
        string action,
        int? recordId,
        string? oldValues,
        string? newValues,
        int? userId,
        string? userName,
        string? ipAddress = null);

    //Xóa log cũ hơn 90 ngày (chạy scheduled job)
    Task CleanupOldLogsAsync(int keepDays = 90);
}