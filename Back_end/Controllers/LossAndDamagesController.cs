using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager,HR,Nhân sự")]
public class LossAndDamagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public LossAndDamagesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? roomId, [FromQuery] int? equipmentId)
    {
        var query = _context.LossAndDamages
            .Include(ld => ld.RoomInventory)
                .ThenInclude(ri => ri!.Room)
            .Include(ld => ld.RoomInventory)
                .ThenInclude(ri => ri!.Equipment)
            .AsQueryable();

        if (roomId.HasValue)
            query = query.Where(ld => ld.RoomInventory != null && ld.RoomInventory.RoomId == roomId.Value);

        if (equipmentId.HasValue)
            query = query.Where(ld => ld.RoomInventory != null && ld.RoomInventory.EquipmentId == equipmentId.Value);

        var result = await query
            .OrderByDescending(ld => ld.CreatedAt)
            .Select(ld => MapToDto(ld))
            .ToListAsync();

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.LossAndDamages
            .Include(ld => ld.RoomInventory)
                .ThenInclude(ri => ri!.Room)
            .Include(ld => ld.RoomInventory)
                .ThenInclude(ri => ri!.Equipment)
            .FirstOrDefaultAsync(ld => ld.Id == id);

        if (item == null)
            return NotFound(new { message = "Không tìm thấy bản ghi hỏng/mất" });

        return Ok(MapToDto(item));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLossDamageDto dto)
    {
        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Số lượng phải lớn hơn 0" });

        var roomInventory = await LoadRoomInventoryAsync(dto.RoomInventoryId);
        if (dto.RoomInventoryId.HasValue && roomInventory == null)
            return BadRequest(new { message = "Room inventory không tồn tại" });

        var entity = new LossAndDamage
        {
            BookingDetailId = dto.BookingDetailId,
            RoomInventoryId = dto.RoomInventoryId,
            Quantity = dto.Quantity,
            PenaltyAmount = dto.PenaltyAmount,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.LossAndDamages.Add(entity);

        if (roomInventory != null)
            ApplyInventoryImpact(roomInventory, dto.Quantity);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, await BuildResponseAsync(entity.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateLossDamageDto dto)
    {
        var entity = await _context.LossAndDamages.FindAsync(id);
        if (entity == null)
            return NotFound(new { message = "Không tìm thấy bản ghi hỏng/mất" });

        if (dto.Quantity <= 0)
            return BadRequest(new { message = "Số lượng phải lớn hơn 0" });

        var oldRoomInventory = await LoadRoomInventoryAsync(entity.RoomInventoryId);
        if (oldRoomInventory != null)
            RevertInventoryImpact(oldRoomInventory, entity.Quantity);

        var newRoomInventory = await LoadRoomInventoryAsync(dto.RoomInventoryId);
        if (dto.RoomInventoryId.HasValue && newRoomInventory == null)
            return BadRequest(new { message = "Room inventory không tồn tại" });

        entity.BookingDetailId = dto.BookingDetailId;
        entity.RoomInventoryId = dto.RoomInventoryId;
        entity.Quantity = dto.Quantity;
        entity.PenaltyAmount = dto.PenaltyAmount;
        entity.Description = dto.Description;
        entity.ImageUrl = dto.ImageUrl;

        if (newRoomInventory != null)
            ApplyInventoryImpact(newRoomInventory, dto.Quantity);

        await _context.SaveChangesAsync();
        return Ok(await BuildResponseAsync(entity.Id));
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,HR,Nhân sự")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.LossAndDamages.FindAsync(id);
        if (entity == null)
            return NotFound(new { message = "Không tìm thấy bản ghi hỏng/mất" });

        var roomInventory = await LoadRoomInventoryAsync(entity.RoomInventoryId);
        if (roomInventory != null)
            RevertInventoryImpact(roomInventory, entity.Quantity);

        _context.LossAndDamages.Remove(entity);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa bản ghi hỏng/mất" });
    }

    private async Task<LossDamageResponseDto> BuildResponseAsync(int id)
    {
        var entity = await _context.LossAndDamages
            .Include(ld => ld.RoomInventory)
                .ThenInclude(ri => ri!.Room)
            .Include(ld => ld.RoomInventory)
                .ThenInclude(ri => ri!.Equipment)
            .FirstAsync(ld => ld.Id == id);

        return MapToDto(entity);
    }

    private static LossDamageResponseDto MapToDto(LossAndDamage item) => new(
        item.Id,
        item.BookingDetailId,
        item.RoomInventoryId,
        item.Quantity,
        item.PenaltyAmount,
        item.Description,
        item.ImageUrl,
        item.CreatedAt,
        item.RoomInventory?.Room?.RoomNumber,
        item.RoomInventory?.Equipment?.Name
    );

    private async Task<RoomInventory?> LoadRoomInventoryAsync(int? roomInventoryId)
    {
        if (!roomInventoryId.HasValue) return null;

        return await _context.RoomInventories
            .Include(ri => ri.Equipment)
            .FirstOrDefaultAsync(ri => ri.Id == roomInventoryId.Value);
    }

    private static void ApplyInventoryImpact(RoomInventory roomInventory, int quantity)
    {
        roomInventory.Quantity = Math.Max(0, (roomInventory.Quantity ?? 0) - quantity);

        if (roomInventory.Equipment != null)
        {
            roomInventory.Equipment.DamagedQuantity += quantity;
            roomInventory.Equipment.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static void RevertInventoryImpact(RoomInventory roomInventory, int quantity)
    {
        roomInventory.Quantity = (roomInventory.Quantity ?? 0) + quantity;

        if (roomInventory.Equipment != null)
        {
            roomInventory.Equipment.DamagedQuantity = Math.Max(0, roomInventory.Equipment.DamagedQuantity - quantity);
            roomInventory.Equipment.UpdatedAt = DateTime.UtcNow;
        }
    }
}
