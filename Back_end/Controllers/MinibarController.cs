using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
public class MinibarController : ControllerBase
{
    private readonly AppDbContext _context;

    public MinibarController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/Minibar/items — Danh mục đồ uống/snack minibar từ bảng Equipments
    [HttpGet("items")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllItems()
    {
        var items = await _context.Equipments
            .Where(e => e.Category == "Minibar" && e.IsActive)
            .OrderBy(e => e.Name)
            .Select(e => new
            {
                e.Id,
                e.ItemCode,
                e.Name,
                e.Unit,
                e.BasePrice,
                e.DefaultPriceIfLost,
                InStock = e.TotalQuantity - e.InUseQuantity - e.DamagedQuantity - e.LiquidatedQuantity,
                e.ImageUrl,
                e.IsActive
            })
            .ToListAsync();

        return Ok(items);
    }
    
    // POST /api/Minibar/items — Tạo mới mặt hàng minibar (thêm vào Equipments với Category="Minibar")
    [HttpPost("items")]
    public async Task<IActionResult> CreateItem([FromBody] CreateMinibarItemDto dto)
    {
        // Kiểm tra trùng tên
        var exists = await _context.Equipments
            .AnyAsync(e => e.Name == dto.Name && e.Category == "Minibar");
        if (exists)
            return Conflict(new { message = "Mặt hàng minibar này đã tồn tại" });

        var item = new HotelManagementAPI.Models.Equipment
        {
            ItemCode           = $"MB-{Guid.NewGuid().ToString()[..6].ToUpper()}",  // tự sinh mã
            Name               = dto.Name,
            Category           = "Minibar",     // ← cố định là Minibar
            Unit               = dto.Unit ?? "Cái",
            TotalQuantity      = dto.TotalQuantity,
            InUseQuantity      = 0,
            DamagedQuantity    = 0,
            LiquidatedQuantity = 0,
            BasePrice          = dto.Price,
            DefaultPriceIfLost = dto.Price,
            IsActive           = true,
            CreatedAt          = DateTime.UtcNow
        };

        _context.Equipments.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllItems), new { id = item.Id }, new
        {
            item.Id,
            item.ItemCode,
            item.Name,
            item.Unit,
            item.BasePrice,
            item.TotalQuantity,
            item.IsActive
        });
    }

    // PUT /api/Minibar/items/{id} — Cập nhật giá minibar item
    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] UpdateMinibarItemDto dto)
    {
        var item = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == id && e.Category == "Minibar");

        if (item == null)
            return NotFound(new { message = "Không tìm thấy mặt hàng minibar" });

        item.Name      = dto.Name;
        item.BasePrice = dto.Price;
        item.IsActive  = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(new { item.Id, item.Name, item.BasePrice, item.IsActive });
    }

    // GET /api/Minibar/stock/{roomId} — Xem minibar trong phòng cụ thể
    [HttpGet("stock/{roomId}")]
    public async Task<IActionResult> GetRoomStock(int roomId)
    {
        var roomExists = await _context.Rooms.AnyAsync(r => r.Id == roomId);
        if (!roomExists)
            return NotFound(new { message = "Không tìm thấy phòng" });

        var stock = await _context.RoomItems
            .Include(ri => ri.Equipment)
            .Where(ri => ri.RoomId == roomId
                      && ri.Equipment != null
                      && ri.Equipment.Category == "Minibar"
                      && ri.IsActive)
            .Select(ri => new
            {
                ri.Id,
                ri.RoomId,
                EquipmentId   = ri.EquipmentId,
                ItemName      = ri.Equipment!.Name,
                Unit          = ri.Equipment.Unit,
                Price         = ri.Equipment.BasePrice,
                ri.Quantity,
                ri.PriceIfLost,
                ri.Note
            })
            .ToListAsync();

        return Ok(stock);
    }

    // POST /api/Minibar/stock — Thêm/cập nhật số lượng minibar trong phòng (upsert)
    [HttpPost("stock")]
    public async Task<IActionResult> UpdateStock([FromBody] UpdateMinibarStockDto dto)
    {
        // Kiểm tra Equipment là minibar
        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == dto.MinibarItemId && e.Category == "Minibar");

        if (equipment == null)
            return NotFound(new { message = "Không tìm thấy mặt hàng minibar" });

        // Upsert vào RoomInventory (RoomItems)
        var stock = await _context.RoomItems
            .FirstOrDefaultAsync(ri => ri.RoomId == dto.RoomId
                                    && ri.EquipmentId == dto.MinibarItemId);

        if (stock == null)
        {
            stock = new RoomItem
            {
                RoomId      = dto.RoomId,
                EquipmentId = dto.MinibarItemId,
                Quantity    = dto.Quantity,
                PriceIfLost = equipment.DefaultPriceIfLost,
                Note        = "Trong Minibar",
                ItemType    = "Asset",
                IsActive    = true
            };
            _context.RoomItems.Add(stock);
        }
        else
        {
            stock.Quantity = dto.Quantity;
            stock.IsActive = true;
        }

        await _context.SaveChangesAsync();
        return Ok(new { stock.Id, stock.RoomId, stock.EquipmentId, stock.Quantity, ItemName = equipment.Name });
    }
}