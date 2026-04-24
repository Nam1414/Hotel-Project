using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IAuditLogService _auditLogService;
    public EquipmentsController(
        AppDbContext context,
        INotificationService notificationService,
        IAuditLogService auditLogService)
    {
        _context = context;
        _notificationService = notificationService;
        _auditLogService = auditLogService;
    }

    // ─── GET /api/Equipments ─── Danh sách vật tư
    // Ví dụ: GET /api/Equipments?search=TV&includeInactive=true "XEM VẬT TƯ ẨN"
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] bool includeInactive = false)   // ← thêm param này
    {
        var query = _context.Equipments.AsQueryable();

        // Filter active/inactive
        if (!includeInactive)
            query = query.Where(e => e.IsActive);

        // Tìm kiếm theo tên
        if (!string.IsNullOrEmpty(search))
            query = query.Where(e => e.Name.Contains(search));

        var result = await query
            .OrderBy(e => e.Id)
            .Select(e => new
            {
                e.Id,
                e.ItemCode,
                e.Name,
                e.Category,
                e.Unit,
                e.TotalQuantity,
                e.InUseQuantity,
                e.DamagedQuantity,
                e.LiquidatedQuantity,
                e.InStockQuantity,
                e.BasePrice,
                e.DefaultPriceIfLost,
                e.Supplier,
                e.ImageUrl,
                e.IsActive,
                e.CreatedAt
            })
            .ToListAsync();

        return Ok(result);
    }

    // ─── GET /api/Equipments/{id} ───
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        return Ok(equipment);
    }

    // ─── POST /api/Equipments ─── Thêm vật tư mới
    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateEquipmentDto dto)
    {
        // Kiểm tra ItemCode trùng
        if (await _context.Equipments.AnyAsync(e => e.ItemCode == dto.ItemCode))
            return BadRequest(new { message = "Mã vật tư đã tồn tại" });

        var equipment = new Equipment
        {
            ItemCode          = dto.ItemCode,
            Name              = dto.Name,
            Category          = dto.Category,
            Unit              = dto.Unit,
            TotalQuantity     = dto.TotalQuantity,
            InUseQuantity     = 0,
            DamagedQuantity   = 0,
            LiquidatedQuantity= 0,
            BasePrice         = dto.BasePrice,
            DefaultPriceIfLost= dto.DefaultPriceIfLost,
            Supplier          = dto.Supplier,
            IsActive          = true,
            CreatedAt         = DateTime.UtcNow,
            UpdatedAt         = DateTime.UtcNow
        };

        _context.Equipments.Add(equipment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById),
            new { id = equipment.Id }, equipment);
    }

    // ─── PUT /api/Equipments/{id} ─── Cập nhật vật tư
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(
        int id, [FromBody] UpdateEquipmentDto dto)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        equipment.Name              = dto.Name;
        equipment.Category          = dto.Category;
        equipment.Unit              = dto.Unit;
        equipment.TotalQuantity     = dto.TotalQuantity;
        equipment.Supplier          = dto.Supplier;
        equipment.UpdatedAt         = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(equipment);
    }

    // ─── DELETE /api/Equipments/{id} ─── Soft Delete + Audit Log
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        // Lấy thông tin user từ token để ghi vào audit log
        // Lý do: AuditLog cần biết AI nào đã thực hiện hành động để ghi lại chính xác
        var userId   = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName   = User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown";

        // Ghi lại dữ liệu cũ trước khi xóa để phục vụ audit log 
        // Lý do: Sau SaveChanges, dữ liệu cũ sẽ bị ghi đè → phải chụp lại trước khi thay đổi
        var oldJson = System.Text.Json.JsonSerializer.Serialize(new
        {
            equipment.Id,
            equipment.Name,
            equipment.IsActive
        });

        equipment.IsActive  = false;
        equipment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
 
        // Ghi log vào AuditLogs sau khi đã xóa thành công
        // Lý do: Chỉ log khi thao tác thực sự thành công, tránh log rác khi vật tư không tồn tại hoặc đã bị ẩn trước đó
        await _auditLogService.LogAsync(
            tableName: "Equipments",
            action: "DELETE",
            recordId: equipment.Id,
            oldValues: oldJson,
            newValues: null,   // DELETE thì newValues = null
            userId: int.TryParse(userId, out var uid) ? uid : (int?)null,
            userName: userName,
            ipAddress: HttpContext.Connection.RemoteIpAddress?.ToString()
        );

        return Ok(new { message = "Đã xóa vật tư thành công" });
    }

    // ─── GET /api/Equipments/stock-summary ───
    [HttpGet("stock-summary")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetStockSummary()
    {
        var summary = await _context.Equipments
            .Where(e => e.IsActive)
            .GroupBy(e => e.Category) // Nhóm theo danh mục
            .Select(g => new
            {
                Category        = g.Key,
                TotalItems      = g.Count(),
                TotalQuantity   = g.Sum(e => e.TotalQuantity),
                InUseQuantity   = g.Sum(e => e.InUseQuantity),
                DamagedQuantity = g.Sum(e => e.DamagedQuantity),
                InStockQuantity = g.Sum(e =>
                    e.TotalQuantity - e.InUseQuantity
                    - e.DamagedQuantity - e.LiquidatedQuantity)
            })
            .ToListAsync();

        // Tổng toàn bộ
        var total = await _context.Equipments
            .Where(e => e.IsActive)
            .SumAsync(e => e.TotalQuantity);

        var inUse = await _context.Equipments
            .Where(e => e.IsActive)
            .SumAsync(e => e.InUseQuantity);

        var damaged = await _context.Equipments
            .Where(e => e.IsActive)
            .SumAsync(e => e.DamagedQuantity);

        return Ok(new
        {
            overall = new
            {
                total,
                inUse,
                damaged,
                inStock = total - inUse - damaged
            },
            byCategory = summary
        });
    }

    // ─── PUT /api/Equipments/{id}/price ───
    [HttpPut("{id}/price")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePrice(
        int id, [FromBody] UpdatePriceDto dto)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        var oldBasePrice    = equipment.BasePrice;
        var oldLostPrice    = equipment.DefaultPriceIfLost;

        equipment.BasePrice          = dto.BasePrice;
        equipment.DefaultPriceIfLost = dto.DefaultPriceIfLost;
        equipment.UpdatedAt          = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Gửi notification realtime cho Admin & Manager
        await _notificationService.SendToRoleByNameAsync("Admin",
            $"Giá vật tư [{equipment.Name}] đã cập nhật: " +
            $"{oldBasePrice:N0}đ → {dto.BasePrice:N0}đ",
            "PriceUpdate");

        return Ok(new
        {
            message  = "Cập nhật giá thành công",
            id       = equipment.Id,
            name     = equipment.Name,
            oldBasePrice,
            newBasePrice     = equipment.BasePrice,
            oldPriceIfLost   = oldLostPrice,
            newPriceIfLost   = equipment.DefaultPriceIfLost
        });
    }

    // ─── GET /api/Equipments/{id}/compensation ───
    // Xem giá đền bù mặc định
    [HttpGet("{id}/compensation")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> GetCompensation(int id)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        return Ok(new
        {
            equipment.Id,
            equipment.Name,
            equipment.BasePrice,
            equipment.DefaultPriceIfLost,
            // Gợi ý: giá đền bù thường = 150% giá gốc
            suggestedCompensation = equipment.BasePrice * 1.5m
        });
    }

    // ─── PUT /api/Equipments/{id}/compensation ───
    // Cập nhật giá đền bù riêng
    [HttpPut("{id}/compensation")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCompensation(
        int id, [FromBody] UpdateCompensationDto dto)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        equipment.DefaultPriceIfLost = dto.DefaultPriceIfLost;
        equipment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message            = "Cập nhật giá đền bù thành công",
            equipment.Id,
            equipment.Name,
            defaultPriceIfLost = equipment.DefaultPriceIfLost
        });
    }

    // ─── POST /api/Equipments/{id}/sync ───
    // Đồng bộ: khi vật tư bị hỏng → tự cập nhật số liệu kho
    [HttpPost("{id}/sync")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> SyncInventory(
        int id, [FromBody] SyncInventoryDto dto)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        // Validate: tổng không vượt quá TotalQuantity
        var newTotal = equipment.InUseQuantity
                    + dto.DamagedQuantity
                    + equipment.LiquidatedQuantity;

        if (newTotal > equipment.TotalQuantity)
            return BadRequest(new
            {
                message = "Số lượng hỏng vượt quá tổng vật tư"
            });

        var oldDamaged = equipment.DamagedQuantity;
        equipment.DamagedQuantity = dto.DamagedQuantity;
        equipment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Gửi SignalR notification nếu tăng số hỏng
        if (dto.DamagedQuantity > oldDamaged)
        {
            await _notificationService.SendToRoleByNameAsync("Admin",
                $"⚠️ Vật tư [{equipment.Name}] có thêm " +
                $"{dto.DamagedQuantity - oldDamaged} cái bị hỏng. " +
                $"Tổng hỏng: {dto.DamagedQuantity}/{equipment.TotalQuantity}",
                "InventoryDamage");
        }

        return Ok(new
        {
            message            = "Đồng bộ kho thành công",
            equipment.Id,
            equipment.Name,
            equipment.TotalQuantity,
            equipment.InUseQuantity,
            damagedQuantity    = equipment.DamagedQuantity,
            inStockQuantity    = equipment.InStockQuantity
        });
    }

    // POST /api/Equipments/{id}/restore "KHÔI PHỤC VẬT TƯ ẨN"
    [HttpPost("{id}/restore")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Restore(int id)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại hoặc đang active" });

        equipment.IsActive = true;
        equipment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _notificationService.SendToRoleByNameAsync(
            "Admin", $"Vật tư '{equipment.Name}' đã được khôi phục.", "info");

        return Ok(new { message = "Khôi phục vật tư thành công", equipment });
    }
}