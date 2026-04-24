using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;   // ← đảm bảo dùng Room từ đây
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagementAPI.Data;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly AppDbContext _context;

    public RoomsController(IRoomService roomService, AppDbContext context)
    {
        _roomService = roomService;
        _context     = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? roomTypeId)
    {
        var result = await _roomService.GetAllRoomsAsync(roomTypeId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _roomService.GetRoomByIdAsync(id);
        if (result == null) return NotFound(new { message = "Phòng không tồn tại" });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateRoomDto dto)
    {
        var result = await _roomService.CreateRoomAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomDto dto)
    {
        var result = await _roomService.UpdateRoomAsync(id, dto);
        if (result == null) return NotFound(new { message = "Phòng không tồn tại" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _roomService.DeleteRoomAsync(id);
        if (!result) return NotFound(new { message = "Phòng không tồn tại" });
        return Ok(new { message = "Đã vô hiệu hóa phòng thành công" });
    }

    // ─── POST /api/Rooms/bulk-create ────────────────────────────────
    [HttpPost("bulk-create")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> BulkCreate([FromBody] BulkCreateRoomDto dto)
    {
        // ← [SỬA] RoomType dùng IsDeleted — KHÔNG có IsActive
        var roomTypeExists = await _context.RoomTypes
            .AnyAsync(rt => rt.Id == dto.RoomTypeId && rt.IsActive);

        if (!roomTypeExists)
            return BadRequest(new { message = "Hạng phòng không tồn tại" });

        if (dto.Count <= 0 || dto.Count > 50)
            return BadRequest(new { message = "Số lượng phòng phải từ 1 đến 50" });

        var createdRooms = new List<object>();
        var errors       = new List<string>();

        for (int i = 0; i < dto.Count; i++)
        {
            var roomNumber = $"{dto.StartNumber + i}";

            if (await _context.Rooms.AnyAsync(r => r.RoomNumber == roomNumber))
            {
                errors.Add($"Phòng {roomNumber} đã tồn tại, bỏ qua");
                continue;
            }

            // ← [SỬA] Khởi tạo đúng theo Room model thực:
            //   Room có: Id, RoomTypeId, RoomNumber, Floor(int?), Status, CreatedAt, IsDeleted
            //   KHÔNG có: IsActive, UpdatedAt
            var room = new HotelManagementAPI.Models.Room
            {
                RoomTypeId = dto.RoomTypeId,
                RoomNumber = roomNumber,
                Floor      = dto.Floor,    // ← int? — có trong model
                Status     = "Available",
                // IsDeleted  = false,         // ← bool — có trong model
                // CreatedAt  = DateTime.UtcNow
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            if (dto.TemplateRoomId.HasValue && dto.TemplateRoomId.Value > 0)
            {
                var templateItems = await _context.RoomItems
                    .Where(ri => ri.RoomId == dto.TemplateRoomId.Value)
                    .ToListAsync();

                foreach (var item in templateItems)
                {
                    _context.RoomItems.Add(new RoomItem
                    {
                        RoomId = room.Id,
                        EquipmentId = item.EquipmentId,
                        Quantity = item.Quantity,
                        PriceIfLost = item.PriceIfLost,
                        Note = item.Note,
                        ItemType = item.ItemType,
                        IsActive = true

                    });
                }
                await _context.SaveChangesAsync();
            }

            createdRooms.Add(new
            {
                room.Id,
                room.RoomNumber,
                room.Floor,
                room.Status,
                clonedFrom = dto.TemplateRoomId
            });
        }

        return Ok(new
        {
            message  = $"Đã tạo {createdRooms.Count} phòng thành công",
            created  = createdRooms,
            skipped  = errors
        });
    }
}