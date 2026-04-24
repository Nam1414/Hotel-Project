using HotelManagementAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagementAPI.Models;
using HotelManagementAPI.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomItemsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.RoomItems
            .Include(ri => ri.Room)
            .Include(ri => ri.Equipment)
            .Select(ri => new RoomItemResponseDto(
                ri.Id,
                ri.RoomId,
                ri.Room != null ? ri.Room.RoomNumber : null,
                ri.EquipmentId,
                ri.Equipment != null ? ri.Equipment.Name : null,
                ri.ItemType,
                ri.Quantity,
                ri.PriceIfLost,
                ri.Note,
                ri.IsActive))
            .ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ri = await _context.RoomItems
            .Include(ri => ri.Room)
            .Include(ri => ri.Equipment)
            .FirstOrDefaultAsync(ri => ri.Id == id);

        if (ri == null) return NotFound(new { message = "Không tìm thấy vật tư" });

        return Ok(new RoomItemResponseDto(
            ri.Id, ri.RoomId,
            ri.Room?.RoomNumber,
            ri.EquipmentId,
            ri.Equipment?.Name,
            ri.ItemType,
            ri.Quantity, ri.PriceIfLost, ri.Note, ri.IsActive));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateRoomItemDto dto)
    {
        // Validate bắt buộc có EquipmentId
        if (dto.EquipmentId == null)
            return BadRequest(new { message = "Vui lòng chọn thiết bị, dụng cụ, đồ dùng cần thiết từ kho (EquipmentId không được để trống)" });

        // Kiểm tra Equipment tồn tại
        var equipmentExists = await _context.Equipments.AnyAsync(e => e.Id == dto.EquipmentId);
        if (!equipmentExists)
            return NotFound(new { message = "Không tìm thấy thiết bị, dụng cụ, đồ dùng cần thiết này trong kho" });

        var item = new RoomItem
        {
            RoomId      = dto.RoomId,
            EquipmentId = dto.EquipmentId,
            Quantity    = dto.Quantity,
            PriceIfLost = dto.PriceIfLost,
            Note        = dto.Note,
            ItemType    = dto.ItemType,
            IsActive    = true
        };

        _context.RoomItems.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomItemDto dto)
    {
        var item = await _context.RoomItems.FindAsync(id);
        if (item == null) return NotFound(new { message = "Không tìm thấy vật tư" });

        item.EquipmentId = dto.EquipmentId;
        item.Quantity    = dto.Quantity;
        item.PriceIfLost = dto.PriceIfLost;
        item.Note        = dto.Note;
        item.ItemType = dto.ItemType;
        item.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.RoomItems.FindAsync(id);
        if (item == null) return NotFound(new { message = "Không tìm thấy vật tư" });

        item.IsActive = false; // Soft delete
        //_context.RoomItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa vật tư thành công" });
    }
}
