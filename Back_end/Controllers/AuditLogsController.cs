using HotelManagementAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]  // Chỉ Admin mới xem được
public class AuditLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuditLogsController(AppDbContext context)
    {
        _context = context;
    }

    // ─── GET /api/AuditLogs ─── Xem danh sách log
    // Filter theo bảng, hành động, user, ngày
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? tableName,
        [FromQuery] string? action,
        [FromQuery] int? userId,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (!string.IsNullOrEmpty(tableName))
            query = query.Where(l => l.TableName == tableName);

        if (!string.IsNullOrEmpty(action))
            query = query.Where(l => l.Action == action);

        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId);

        if (from.HasValue)
            query = query.Where(l => l.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(l => l.CreatedAt <= to.Value);

        var total = await query.CountAsync();
        var logs  = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, data = logs });
    }

    // ─── GET /api/AuditLogs/{id} ─── Xem chi tiết 1 log
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var log = await _context.AuditLogs.FindAsync(id);
        if (log == null) return NotFound();
        return Ok(log);
    }

    // GET /api/AuditLogs/stats — Thống kê nhanh cho demo
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;

        var stats = new
        {
            totalLogs       = await _context.AuditLogs.CountAsync(),
            todayLogs       = await _context.AuditLogs
                                .CountAsync(l => l.CreatedAt >= today),
            byAction        = await _context.AuditLogs
                                .GroupBy(l => l.Action)
                                .Select(g => new { action = g.Key, count = g.Count() })
                                .ToListAsync(),
            byTable         = await _context.AuditLogs
                                .GroupBy(l => l.TableName)
                                .Select(g => new { table = g.Key, count = g.Count() })
                                .OrderByDescending(x => x.count)
                                .Take(10)
                                .ToListAsync(),
            oldestLog       = await _context.AuditLogs
                                .OrderBy(l => l.CreatedAt)
                                .Select(l => l.CreatedAt)
                                .FirstOrDefaultAsync(),
            retentionPolicy = "90 ngày (tối thiểu 30 ngày)"
        };

        return Ok(stats);
    }

    // ❌ KHÔNG CÓ DELETE endpoint — Audit log không được xóa thủ công
}