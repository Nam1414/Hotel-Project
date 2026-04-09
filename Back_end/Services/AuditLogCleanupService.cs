namespace HotelManagementAPI.Services;

/// <summary>
/// Chạy ngầm mỗi 24 giờ — tự xóa audit log cũ hơn 30 ngày.
/// Đăng ký trong Program.cs bằng AddHostedService.
/// </summary>
public class AuditLogCleanupService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AuditLogCleanupService> _logger;
    private const int  _retentionDays = 90;

    public AuditLogCleanupService(
        IServiceProvider serviceProvider,
        ILogger<AuditLogCleanupService> logger)
    {
        _serviceProvider  = serviceProvider;
        _logger           = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Chạy mỗi 24 giờ
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var auditService = scope.ServiceProvider
                    .GetRequiredService<IAuditLogService>();

                await auditService.CleanupOldLogsAsync(keepDays: 90);
                _logger.LogInformation(
                    "✅ Audit log cleanup completed at {time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Audit log cleanup failed");
            }
            var cutoff = DateTime.UtcNow.AddDays(-_retentionDays);
            // Chờ 24 giờ rồi chạy lại
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}