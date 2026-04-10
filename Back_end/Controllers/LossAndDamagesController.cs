using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager,HR,Nhân sự,Staff,Housekeeping,Receptionist,Lễ tân,Dọn phòng,Nhân viên")]
public class LossAndDamagesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly HotelManagementAPI.Services.IInvoiceService _invoiceService;

    public LossAndDamagesController(AppDbContext context, HotelManagementAPI.Services.IInvoiceService invoiceService)
    {
        _context = context;
        _invoiceService = invoiceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? roomId, [FromQuery] int? equipmentId, [FromQuery] int? bookingDetailId)
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

        if (bookingDetailId.HasValue)
            query = query.Where(ld => ld.BookingDetailId == bookingDetailId.Value);

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
            .Include(ld => ld.Equipment)
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
            return BadRequest(new { message = "Vật tư trong phòng không tồn tại" });

        int finalEquipmentId = 0;
        if (roomInventory != null)
        {
            finalEquipmentId = roomInventory.EquipmentId;
        }
        else if (dto.EquipmentId.HasValue && dto.EquipmentId.Value > 0)
        {
            finalEquipmentId = dto.EquipmentId.Value;
        }
        else
        {
            // Fallback for check-out ad-hoc penalties where no equipment is selected
            var firstEq = await _context.Equipments.FirstOrDefaultAsync();
            if (firstEq != null)
            {
                finalEquipmentId = firstEq.Id;
            }
            else
            {
                return BadRequest(new { message = "Cần thẻ vật tư hoặc thiết bị để báo hỏng" });
            }
        }

        var entity = new LossAndDamage
        {
            EquipmentId     = finalEquipmentId,
            BookingDetailId = dto.BookingDetailId,
            RoomInventoryId = dto.RoomInventoryId,
            Quantity        = dto.Quantity,
            PenaltyAmount   = dto.PenaltyAmount,
            Description     = dto.Description,
            ImageUrl        = dto.ImageUrl,
            CreatedAt       = DateTime.UtcNow,
            Status          = "pending"
        };

        _context.LossAndDamages.Add(entity);

        if (roomInventory != null)
            ApplyInventoryImpact(roomInventory, dto.Quantity);

        await _context.SaveChangesAsync();

        if (entity.BookingDetailId.HasValue)
        {
            var bookingDetail = await _context.BookingDetails.FindAsync(entity.BookingDetailId.Value);
            if (bookingDetail?.BookingId != null)
            {
                await _invoiceService.RecalculateInvoiceAsync(bookingDetail.BookingId.Value);
            }
        }

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

        entity.Quantity = dto.Quantity;
        entity.PenaltyAmount = dto.PenaltyAmount;
        entity.Description = dto.Description;
        entity.ImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();

        if (entity.BookingDetailId.HasValue)
        {
            var bookingDetail = await _context.BookingDetails.FindAsync(entity.BookingDetailId.Value);
            if (bookingDetail?.BookingId != null)
            {
                await _invoiceService.RecalculateInvoiceAsync(bookingDetail.BookingId.Value);
            }
        }

        return Ok(await BuildResponseAsync(entity.Id));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _context.LossAndDamages.FindAsync(id);
        if (entity == null)
            return NotFound(new { message = "Không tìm thấy bản ghi hỏng/mất" });

        var roomInventory = await LoadRoomInventoryAsync(entity.RoomInventoryId);
        if (roomInventory != null)
            RevertInventoryImpact(roomInventory, entity.Quantity);

        var bookingDetailId = entity.BookingDetailId;
        _context.LossAndDamages.Remove(entity);
        await _context.SaveChangesAsync();

        if (bookingDetailId.HasValue)
        {
            var bookingDetail = await _context.BookingDetails.FindAsync(bookingDetailId.Value);
            if (bookingDetail?.BookingId != null)
            {
                await _invoiceService.RecalculateInvoiceAsync(bookingDetail.BookingId.Value);
            }
        }
        return Ok(new { message = "Đã xóa bản ghi hỏng/mất" });
    }

    private async Task<LossDamageResponseDto> BuildResponseAsync(int id)
    {
        var entity = await _context.LossAndDamages
            .Include(ld => ld.Equipment)
            .Include(ld => ld.RoomInventory)
                .ThenInclude(ri => ri!.Room)
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
        item.Equipment?.Name ?? item.RoomInventory?.Equipment?.Name ?? "Vật tư"
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
