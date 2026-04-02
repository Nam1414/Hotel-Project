using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.IO.Compression;
using System.Xml.Linq;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public EquipmentsController(
        AppDbContext context,
        INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    // ─── GET /api/Equipments ─── Danh sách vật tư
    // Ví dụ: GET /api/Equipments?search=TV&includeInactive=true "XEM VẬT TƯ ẨN"
    [HttpGet]
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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

    [HttpPost("import-excel")]
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
    public async Task<IActionResult> ImportExcel([FromForm] ImportEquipmentsExcelDto request)
    {
        var file = request.File;

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "File import không hợp lệ" });

        if (!Path.GetExtension(file.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Chỉ hỗ trợ file Excel .xlsx" });

        var created = 0;
        var updated = 0;
        var skipped = new List<object>();
        var rows = await ReadExcelRowsAsync(file);

        for (var row = 2; row <= rows.Count; row++)
        {
            var cells = rows[row - 1];
            var itemCode = GetCell(cells, 0);
            var name = GetCell(cells, 1);
            var category = GetCell(cells, 2);
            var unit = GetCell(cells, 3);
            var totalQuantityText = GetCell(cells, 4);
            var basePriceText = GetCell(cells, 5);
            var compensationText = GetCell(cells, 6);
            var supplier = GetCell(cells, 7);

            if (string.IsNullOrWhiteSpace(itemCode) || string.IsNullOrWhiteSpace(name))
            {
                skipped.Add(new { row, reason = "Thiếu item code hoặc tên vật tư" });
                continue;
            }

            if (!TryParseInt(totalQuantityText, out var totalQuantity))
            {
                skipped.Add(new { row, reason = "TotalQuantity không hợp lệ" });
                continue;
            }

            if (!TryParseDecimal(basePriceText, out var basePrice))
            {
                skipped.Add(new { row, reason = "BasePrice không hợp lệ" });
                continue;
            }

            if (!TryParseDecimal(compensationText, out var defaultPriceIfLost))
            {
                skipped.Add(new { row, reason = "DefaultPriceIfLost không hợp lệ" });
                continue;
            }

            var equipment = await _context.Equipments.FirstOrDefaultAsync(e => e.ItemCode == itemCode);
            if (equipment == null)
            {
                _context.Equipments.Add(new Equipment
                {
                    ItemCode = itemCode,
                    Name = name,
                    Category = category,
                    Unit = unit,
                    TotalQuantity = totalQuantity,
                    InUseQuantity = 0,
                    DamagedQuantity = 0,
                    LiquidatedQuantity = 0,
                    BasePrice = basePrice,
                    DefaultPriceIfLost = defaultPriceIfLost,
                    Supplier = string.IsNullOrWhiteSpace(supplier) ? null : supplier,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
                created++;
                continue;
            }

            equipment.Name = name;
            equipment.Category = category;
            equipment.Unit = unit;
            equipment.TotalQuantity = totalQuantity;
            equipment.BasePrice = basePrice;
            equipment.DefaultPriceIfLost = defaultPriceIfLost;
            equipment.Supplier = string.IsNullOrWhiteSpace(supplier) ? null : supplier;
            equipment.IsActive = true;
            equipment.UpdatedAt = DateTime.UtcNow;
            updated++;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Import Excel thành công",
            created,
            updated,
            skipped
        });
    }

    // ─── PUT /api/Equipments/{id} ─── Cập nhật vật tư
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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

    // ─── DELETE /api/Equipments/{id} ─── Soft Delete
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,HR,Nhân sự")]
    public async Task<IActionResult> Delete(int id)
    {
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.IsActive);

        if (equipment == null)
            return NotFound(new { message = "Vật tư không tồn tại" });

        equipment.IsActive  = false;
        equipment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa vật tư thành công" });
    }

    // ─── GET /api/Equipments/stock-summary ───
    [HttpGet("stock-summary")]
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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
    [Authorize(Roles = "Admin,HR,Nhân sự")]
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
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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
    [Authorize(Roles = "Admin,HR,Nhân sự")]
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
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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
    [Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
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
    private static bool TryParseInt(string value, out int result)
    {
        return int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out result)
            || int.TryParse(value, NumberStyles.Integer, new CultureInfo("vi-VN"), out result);
    }

    private static bool TryParseDecimal(string value, out decimal result)
    {
        return decimal.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture, out result)
            || decimal.TryParse(value, NumberStyles.Number, new CultureInfo("vi-VN"), out result);
    }

    private static string GetCell(IReadOnlyList<string> cells, int index)
    {
        return index < cells.Count ? cells[index].Trim() : string.Empty;
    }

    private static async Task<List<List<string>>> ReadExcelRowsAsync(IFormFile file)
    {
        await using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        memoryStream.Position = 0;

        using var archive = new ZipArchive(memoryStream, ZipArchiveMode.Read, leaveOpen: false);
        var sharedStrings = ReadSharedStrings(archive);
        var sheetEntry = archive.GetEntry("xl/worksheets/sheet1.xml")
            ?? throw new InvalidOperationException("Không tìm thấy sheet dữ liệu trong file Excel");

        using var sheetStream = sheetEntry.Open();
        var document = XDocument.Load(sheetStream);
        XNamespace ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";

        return document.Descendants(ns + "row")
            .Select(row => ReadRow(row, ns, sharedStrings))
            .ToList();
    }

    private static List<string> ReadSharedStrings(ZipArchive archive)
    {
        var sharedStringsEntry = archive.GetEntry("xl/sharedStrings.xml");
        if (sharedStringsEntry == null)
            return new List<string>();

        using var stream = sharedStringsEntry.Open();
        var document = XDocument.Load(stream);
        XNamespace ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";

        return document.Descendants(ns + "si")
            .Select(si => string.Concat(si.Descendants(ns + "t").Select(t => t.Value)))
            .ToList();
    }

    private static List<string> ReadRow(XElement row, XNamespace ns, IReadOnlyList<string> sharedStrings)
    {
        var result = new List<string>();

        foreach (var cell in row.Elements(ns + "c"))
        {
            var reference = cell.Attribute("r")?.Value ?? string.Empty;
            var columnIndex = GetColumnIndex(reference);
            while (result.Count <= columnIndex)
                result.Add(string.Empty);

            result[columnIndex] = ReadCellValue(cell, ns, sharedStrings);
        }

        return result;
    }

    private static int GetColumnIndex(string cellReference)
    {
        var letters = new string(cellReference.TakeWhile(char.IsLetter).ToArray());
        var index = 0;

        foreach (var ch in letters)
            index = (index * 26) + (char.ToUpperInvariant(ch) - 'A' + 1);

        return Math.Max(0, index - 1);
    }

    private static string ReadCellValue(XElement cell, XNamespace ns, IReadOnlyList<string> sharedStrings)
    {
        var type = cell.Attribute("t")?.Value;

        if (type == "inlineStr")
            return string.Concat(cell.Descendants(ns + "t").Select(t => t.Value));

        var rawValue = cell.Element(ns + "v")?.Value ?? string.Empty;
        if (type == "s" && int.TryParse(rawValue, out var sharedIndex) && sharedIndex >= 0 && sharedIndex < sharedStrings.Count)
            return sharedStrings[sharedIndex];

        return rawValue;
    }
}
