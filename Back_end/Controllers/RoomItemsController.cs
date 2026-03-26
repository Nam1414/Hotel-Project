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
        var items = await _context.RoomItems.Include(ri => ri.Room).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.RoomItems.Include(ri => ri.Room).FirstOrDefaultAsync(ri => ri.Id == id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateRoomItemDto dto)
    {
        var item = new RoomItem
        {
            RoomId = dto.RoomId,
            ItemName = dto.ItemName,
            Quantity = dto.Quantity,
            PriceIfLost = dto.PriceIfLost
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
        if (item == null) return NotFound();

        item.ItemName = dto.ItemName;
        item.Quantity = dto.Quantity;
        item.PriceIfLost = dto.PriceIfLost;

        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.RoomItems.FindAsync(id);
        if (item == null) return NotFound();

        _context.RoomItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa vật tư thành công" });
    }
}
