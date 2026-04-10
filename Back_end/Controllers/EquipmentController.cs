using HotelManagementAPI.Services;
using HotelManagementAPI.Data;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HotelManagementAPI.Controllers;


public record CreateEquipmentDto(
    string ItemCode,
    string Name,
    string Category,
    string Unit,
    int TotalQuantity,
    decimal BasePrice,
    decimal DefaultPriceIfLost,
    string? Supplier,
    string? ImageUrl
);

public record UpdateEquipmentDto(
    string Name,
    string Category,
    string Unit,
    int TotalQuantity,
    decimal BasePrice,
    decimal DefaultPriceIfLost,
    string? Supplier,
    string? ImageUrl,
    bool IsActive
);

public record ReportDamageDto(
    int EquipmentId,
    int Quantity,
    decimal PenaltyAmount,
    string? Description,
    string? ImageUrl,
    int? BookingDetailId,
    int? RoomInventoryId
);

public record UpdateDamageStatusDto(string Status); // "confirmed" | "cancelled"


[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]          // â† Check quyá»n: fail â†’ 401
public class EquipmentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IInvoiceService _invoiceService;

    public EquipmentController(AppDbContext context, ICloudinaryService cloudinaryService, IInvoiceService invoiceService)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
        _invoiceService = invoiceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] bool? isActive)
    {
        var query = _context.Equipments.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim().ToLower();
            query = query.Where(e =>
                e.Name.ToLower().Contains(q) ||
                e.ItemCode.ToLower().Contains(q) ||
                (e.Supplier != null && e.Supplier.ToLower().Contains(q)));
        }

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(e => e.Category == category);

        if (isActive.HasValue)
            query = query.Where(e => e.IsActive == isActive.Value);

        var result = await query
            .OrderBy(e => e.Name)
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
                InStockQuantity = e.TotalQuantity - e.InUseQuantity - e.DamagedQuantity - e.LiquidatedQuantity,
                e.BasePrice,
                e.DefaultPriceIfLost,
                e.Supplier,
                e.IsActive,
                e.ImageUrl,
                e.CreatedAt,
                e.UpdatedAt,
            })
            .ToListAsync();

        return Ok(result);
    }

    // GET /api/Equipment/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var e = await _context.Equipments.FindAsync(id);
        if (e == null) return NotFound(new { message = "Váº­t tÆ° khÃ´ng tá»“n táº¡i" });
        return Ok(e);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateEquipmentDto dto)
    {
        if (await _context.Equipments.AnyAsync(e => e.ItemCode == dto.ItemCode))
            return BadRequest(new { message = "MÃ£ váº­t tÆ° Ä‘Ã£ tá»“n táº¡i" });

        var equipment = new Equipment
        {
            ItemCode          = dto.ItemCode,
            Name              = dto.Name,
            Category          = dto.Category,
            Unit              = dto.Unit,
            TotalQuantity     = dto.TotalQuantity,
            InUseQuantity     = 0,
            DamagedQuantity   = 0,
            LiquidatedQuantity = 0,
            BasePrice         = dto.BasePrice,
            DefaultPriceIfLost = dto.DefaultPriceIfLost,
            Supplier          = dto.Supplier,
            ImageUrl          = dto.ImageUrl,
            IsActive          = true,
            CreatedAt         = DateTime.UtcNow,
        };

        _context.Equipments.Add(equipment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = equipment.Id }, equipment);
    }

    // PUT /api/Equipment/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEquipmentDto dto)
    {
        var e = await _context.Equipments.FindAsync(id);
        if (e == null) return NotFound(new { message = "Váº­t tÆ° khÃ´ng tá»“n táº¡i" });

        e.Name               = dto.Name;
        e.Category           = dto.Category;
        e.Unit               = dto.Unit;
        e.TotalQuantity      = dto.TotalQuantity;
        e.BasePrice          = dto.BasePrice;
        e.DefaultPriceIfLost = dto.DefaultPriceIfLost;
        e.Supplier           = dto.Supplier;
        e.ImageUrl           = dto.ImageUrl;
        e.IsActive           = dto.IsActive;
        e.UpdatedAt          = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(e);
    }

    // DELETE /api/Equipment/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var e = await _context.Equipments.FindAsync(id);
        if (e == null) return NotFound(new { message = "Váº­t tÆ° khÃ´ng tá»“n táº¡i" });

        e.IsActive  = false;
        e.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "ÄÃ£ ngá»«ng sá»­ dá»¥ng váº­t tÆ°" });
    }

    [HttpPost("report-damage")]
    public async Task<IActionResult> ReportDamage([FromBody] ReportDamageDto dto)
    {
        var equipment = await _context.Equipments.FindAsync(dto.EquipmentId);
        if (equipment == null)
            return NotFound(new { message = "Váº­t tÆ° khÃ´ng tá»“n táº¡i" });

        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Sá»‘ lÆ°á»£ng há»ng pháº£i lá»›n hÆ¡n 0" });

        var inStock = equipment.TotalQuantity
                    - equipment.InUseQuantity
                    - equipment.DamagedQuantity
                    - equipment.LiquidatedQuantity;

        if (dto.Quantity > inStock + equipment.InUseQuantity)
            return BadRequest(new { message = "Sá»‘ lÆ°á»£ng ghi nháº­n vÆ°á»£t quÃ¡ tá»•ng váº­t tÆ° hiá»‡n cÃ³" });

        var penalty = dto.PenaltyAmount > 0
            ? dto.PenaltyAmount
            : equipment.DefaultPriceIfLost * dto.Quantity;

        var bookingDetailId = dto.BookingDetailId;
        string? bookingCode = null;

        // Tự động tìm khách đang ở trong phòng nếu chưa có BookingDetailId
        if (!bookingDetailId.HasValue && dto.RoomInventoryId.HasValue)
        {
            var inv = await _context.RoomInventories.FindAsync(dto.RoomInventoryId.Value);
            if (inv != null && inv.RoomId.HasValue)
            {
                var activeBookingDetail = await _context.BookingDetails
                    .Include(bd => bd.Booking)
                        .ThenInclude(b => b.Invoice)
                    .Where(bd => bd.RoomId == inv.RoomId.Value && bd.Booking != null)
                    .OrderByDescending(bd => bd.CheckInDate)
                    .FirstOrDefaultAsync();

                if (activeBookingDetail != null)
                {
                    var b = activeBookingDetail.Booking;
                    bool shouldCharge = false;
                    
                    // Logic: Đang ở (Stay) HOẶC đã về nhưng chưa thanh toán xong (Invoice status != Paid)
                    if (b.StatusString == "CheckedIn") 
                    {
                        shouldCharge = true;
                    }
                    else if (b.StatusString == "CheckedOut" && (b.Invoice == null || b.Invoice.StatusString != "Paid"))
                    {
                        shouldCharge = true;
                    }

                    if (shouldCharge)
                    {
                        bookingDetailId = activeBookingDetail.Id;
                        bookingCode = b.BookingCode;
                    }
                }
            }
        }

        var record = new LossAndDamage
        {
            EquipmentId     = dto.EquipmentId,
            BookingDetailId = bookingDetailId,
            RoomInventoryId = dto.RoomInventoryId,
            Quantity        = dto.Quantity,
            PenaltyAmount   = penalty,
            Description     = dto.Description,
            ImageUrl        = dto.ImageUrl,
            Status          = "pending",
            CreatedAt       = DateTime.UtcNow,
        };

        _context.LossAndDamages.Add(record);

        equipment.DamagedQuantity += dto.Quantity;
        equipment.UpdatedAt        = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Tự động tính lại tiền hóa đơn nếu hỏng hóc này gắn với một booking
        if (bookingDetailId.HasValue)
        {
            var bookingDetail = await _context.BookingDetails.FindAsync(bookingDetailId.Value);
            if (bookingDetail != null && bookingDetail.BookingId.HasValue)
            {
                await _invoiceService.RecalculateInvoiceAsync(bookingDetail.BookingId.Value);
            }
        }

        if (dto.RoomInventoryId.HasValue)
        {
            await SyncRoomInventoryAsync(dto.RoomInventoryId.Value, dto.Quantity);
        }

        return Ok(new
        {
            message        = "Ghi nhận hỏng thành công - Kho đã đồng bộ",
            damageId       = record.Id,
            penaltyAmount  = penalty,
            isLinkedToBooking = bookingDetailId.HasValue,
            bookingCode    = bookingCode,
            newDamaged     = equipment.DamagedQuantity,
            inStock        = equipment.TotalQuantity
                            - equipment.InUseQuantity
                            - equipment.DamagedQuantity
                            - equipment.LiquidatedQuantity,
        });
    }

   
   [HttpPut("damage/{id}/status")]
    public async Task<IActionResult> UpdateDamageStatus(int id, [FromBody] UpdateDamageStatusDto dto)
    {
        var allowed = new[] { "confirmed", "cancelled" };
        if (!allowed.Contains(dto.Status))
            return BadRequest(new { message = "Status khÃ´ng há»£p lá»‡. DÃ¹ng: confirmed | cancelled" });

        var record = await _context.LossAndDamages
            .Include(d => d.Equipment)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (record == null) return NotFound(new { message = "Báº£n ghi khÃ´ng tá»“n táº¡i" });
        if (record.Status != "pending")
            return BadRequest(new { message = $"KhÃ´ng thá»ƒ thay Ä‘á»•i báº£n ghi Ä‘Ã£ á»Ÿ tráº¡ng thÃ¡i '{record.Status}'" });

        record.Status = dto.Status;

        if (dto.Status == "cancelled" && record.Equipment != null)
        {
            record.Equipment.DamagedQuantity = Math.Max(0,
                record.Equipment.DamagedQuantity - record.Quantity);
            record.Equipment.UpdatedAt = DateTime.UtcNow;

            // HoÃ n láº¡i Room_Inventory náº¿u cÃ³
            if (record.RoomInventoryId.HasValue)
                await RestoreRoomInventoryAsync(record.RoomInventoryId.Value, record.Quantity);
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = dto.Status == "confirmed" ? "ÄÃ£ xÃ¡c nháº­n ghi nháº­n há»ng" : "ÄÃ£ huá»· â€“ tráº¡ng thÃ¡i kho Ä‘Æ°á»£c hoÃ n láº¡i",
            record.Status,
        });
    }

    // GET /api/Equipment/damages 
    [HttpGet("damages")]
    public async Task<IActionResult> GetDamages(
        [FromQuery] string? status,
        [FromQuery] int? equipmentId)
    {
        var query = _context.LossAndDamages
            .Include(d => d.Equipment)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(d => d.Status == status);

        if (equipmentId.HasValue)
            query = query.Where(d => d.EquipmentId == equipmentId.Value);

        var result = await query
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new
            {
                d.Id,
                d.EquipmentId,
                EquipmentName = d.Equipment != null ? d.Equipment.Name : null,
                EquipmentCode = d.Equipment != null ? d.Equipment.ItemCode : null,
                d.Quantity,
                d.PenaltyAmount,
                d.Description,
                d.ImageUrl,
                d.Status,
                d.BookingDetailId,
                d.RoomInventoryId,
                RoomNumber = d.RoomInventory != null && d.RoomInventory.Room != null ? d.RoomInventory.Room.RoomNumber : null,
                d.CreatedAt,
            })
            .ToListAsync();

        return Ok(result);
    }

    
    [HttpPost("import")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ImportBatch([FromBody] List<CreateEquipmentDto> items)
    {
        if (items == null || items.Count == 0)
            return BadRequest(new { message = "Danh sÃ¡ch trá»‘ng" });

        var created = new List<Equipment>();
        var skipped = new List<string>();

        foreach (var dto in items)
        {
            if (await _context.Equipments.AnyAsync(e => e.ItemCode == dto.ItemCode))
            {
                skipped.Add(dto.ItemCode);
                continue;
            }

            var e = new Equipment
            {
                ItemCode           = dto.ItemCode,
                Name               = dto.Name,
                Category           = dto.Category,
                Unit               = dto.Unit,
                TotalQuantity      = dto.TotalQuantity,
                InUseQuantity      = 0,
                DamagedQuantity    = 0,
                LiquidatedQuantity = 0,
                BasePrice          = dto.BasePrice,
                DefaultPriceIfLost = dto.DefaultPriceIfLost,
                Supplier           = dto.Supplier,
                ImageUrl           = dto.ImageUrl,
                IsActive           = true,
                CreatedAt          = DateTime.UtcNow,
            };
            _context.Equipments.Add(e);
            created.Add(e);
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message  = $"Import xong: {created.Count} thÃªm má»›i, {skipped.Count} bá» qua (trÃ¹ng mÃ£)",
            imported = created.Count,
            skipped,
        });
    }
    // 
    // Thống kê
    // GET /api/Equipment/stats
    // 
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var list = await _context.Equipments.Where(e => e.IsActive).ToListAsync();
        return Ok(new
        {
            totalTypes  = list.Count,
            totalUnits  = list.Sum(e => e.TotalQuantity),
            inStock     = list.Sum(e => e.TotalQuantity - e.InUseQuantity - e.DamagedQuantity - e.LiquidatedQuantity),
            inUse       = list.Sum(e => e.InUseQuantity),
            damaged     = list.Sum(e => e.DamagedQuantity),
            liquidated  = list.Sum(e => e.LiquidatedQuantity),
            totalValue  = list.Sum(e => e.BasePrice * e.TotalQuantity),
            lowStockItems = list
                .Where(e => e.TotalQuantity > 0 &&
                    (double)(e.TotalQuantity - e.InUseQuantity - e.DamagedQuantity - e.LiquidatedQuantity) / e.TotalQuantity < 0.2)
                .Select(e => new { e.Id, e.ItemCode, e.Name,
                    InStock = e.TotalQuantity - e.InUseQuantity - e.DamagedQuantity - e.LiquidatedQuantity })
                .ToList(),
        });
    }

    // 
    // Upload ảnh vật tư
    // POST /api/Equipment/{id}/image
    // 
    [HttpPost("{id}/image")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        var equipment = await _context.Equipments.FindAsync(id);
        if (equipment == null) return NotFound(new { message = "Vật tư không tồn tại" });
        if (file == null || file.Length == 0) return BadRequest(new { message = "File không hợp lệ" });

        var (url, _) = await _cloudinaryService.UploadImageAsync(file, $"HotelManagement/Equipment/{id}");
        equipment.ImageUrl  = url;
        equipment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Upload ảnh thành công", imageUrl = url });
    }

    // 
    // Upload ảnh hỏng
    // POST /api/Equipment/damage/{id}/image
    // 
    [HttpPost("damage/{id}/image")]
    public async Task<IActionResult> UploadDamageImage(int id, IFormFile file)
    {
        var record = await _context.LossAndDamages.FindAsync(id);
        if (record == null) return NotFound(new { message = "Bản ghi không tồn tại" });
        if (file == null || file.Length == 0) return BadRequest(new { message = "File không hợp lệ" });

        var (url, _) = await _cloudinaryService.UploadImageAsync(file, $"HotelManagement/Damages/{id}");
        record.ImageUrl = url;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Upload ảnh hỏng thành công", imageUrl = url });
    }

    
    private async Task SyncRoomInventoryAsync(int roomInventoryId, int damagedQty)
    {
        var inv = await _context.RoomInventories.FindAsync(roomInventoryId);
        if (inv == null) return;

        inv.Quantity = Math.Max(0, (inv.Quantity ?? 0) - damagedQty);
    
    }

    private async Task RestoreRoomInventoryAsync(int roomInventoryId, int qty)
    {
        var inv = await _context.RoomInventories.FindAsync(roomInventoryId);
        if (inv == null) return;

        inv.Quantity = (inv.Quantity ?? 0) + qty;
    }
}







