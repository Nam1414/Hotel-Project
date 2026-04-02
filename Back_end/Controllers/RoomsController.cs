using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
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
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? roomTypeId, [FromQuery] int? floor, [FromQuery] string? roomNumber)
    {
        var result = await _roomService.GetAllRoomsAsync(roomTypeId, floor, roomNumber);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _roomService.GetRoomByIdAsync(id);
        if (result == null) return NotFound(new { message = "Phòng không t?n t?i" });
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
        if (result == null) return NotFound(new { message = "Phòng không t?n t?i" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _roomService.DeleteRoomAsync(id);
        if (!result) return NotFound(new { message = "Phòng không t?n t?i" });
        return Ok(new { message = "Ðã vô hi?u hóa phòng thành công" });
    }

    [HttpPost("{id}/clone-items")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> CloneItems(int id, [FromBody] CloneRoomItemsDto dto)
    {
        var targetRoom = await _context.Rooms.FindAsync(id);
        if (targetRoom == null) return NotFound(new { message = "Phòng m?c tiêu không t?n t?i" });

        var templateRoom = await _context.Rooms.FindAsync(dto.TemplateRoomId);
        if (templateRoom == null) return NotFound(new { message = "Phòng m?u không t?n t?i" });

        var templateInventories = await LoadTemplateInventoriesAsync(dto.TemplateRoomId);
        var oldInventories = await _context.RoomInventories
            .Where(ri => ri.RoomId == id)
            .ToListAsync();

        var affectedEquipmentIds = oldInventories.Select(ri => ri.EquipmentId).ToHashSet();
        foreach (var inventory in templateInventories)
            affectedEquipmentIds.Add(inventory.EquipmentId);

        _context.RoomInventories.RemoveRange(oldInventories);
        _context.RoomInventories.AddRange(templateInventories.Select(item => new RoomInventory
        {
            RoomId = id,
            EquipmentId = item.EquipmentId,
            Quantity = item.Quantity,
            PriceIfLost = item.PriceIfLost,
            Note = item.Note,
            IsActive = item.IsActive,
            ItemType = item.ItemType
        }));

        await _context.SaveChangesAsync();
        await RecalculateEquipmentUsageAsync(affectedEquipmentIds);

        return Ok(new
        {
            message = $"Ðã copy thành công {templateInventories.Count} v?t tu t? phòng {templateRoom.RoomNumber} sang phòng {targetRoom.RoomNumber}"
        });
    }

    [HttpPost("{id}/sync-items")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> SyncItems(int id)
    {
        var templateRoom = await _context.Rooms.FindAsync(id);
        if (templateRoom == null) return NotFound(new { message = "Phòng m?u không t?n t?i" });

        var targetRooms = await _context.Rooms
            .Where(r => r.RoomTypeId == templateRoom.RoomTypeId && r.Id != id && r.IsActive)
            .ToListAsync();

        if (!targetRooms.Any())
            return Ok(new { message = "Không có phòng nào cùng h?ng d? d?ng b?" });

        var templateItems = await LoadTemplateInventoriesAsync(id);
        var targetRoomIds = targetRooms.Select(r => r.Id).ToList();

        var oldItems = await _context.RoomInventories
            .Where(ri => ri.RoomId.HasValue && targetRoomIds.Contains(ri.RoomId.Value))
            .ToListAsync();

        var affectedEquipmentIds = oldItems.Select(ri => ri.EquipmentId).ToHashSet();
        foreach (var item in templateItems)
            affectedEquipmentIds.Add(item.EquipmentId);

        _context.RoomInventories.RemoveRange(oldItems);

        var newItems = new List<RoomInventory>();
        foreach (var room in targetRooms)
        {
            newItems.AddRange(templateItems.Select(item => new RoomInventory
            {
                RoomId = room.Id,
                EquipmentId = item.EquipmentId,
                Quantity = item.Quantity,
                PriceIfLost = item.PriceIfLost,
                Note = item.Note,
                IsActive = item.IsActive,
                ItemType = item.ItemType
            }));
        }

        _context.RoomInventories.AddRange(newItems);
        await _context.SaveChangesAsync();
        await RecalculateEquipmentUsageAsync(affectedEquipmentIds);

        return Ok(new
        {
            message = $"Ðã d?ng b? {templateItems.Count} v?t tu t? phòng {templateRoom.RoomNumber} sang {targetRooms.Count} phòng cùng h?ng."
        });
    }

    [HttpPost("bulk-create")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> BulkCreate([FromBody] BulkCreateRoomsRequestDto dto)
    {
        var roomTypeExists = await _context.RoomTypes
            .AnyAsync(rt => rt.Id == dto.RoomTypeId && rt.IsActive);

        if (!roomTypeExists)
            return BadRequest(new { message = "H?ng phòng không t?n t?i" });

        if (dto.Count <= 0 || dto.Count > 50)
            return BadRequest(new { message = "S? lu?ng phòng ph?i t? 1 d?n 50" });

        var templateInventories = new List<RoomInventory>();
        if (dto.TemplateRoomId.HasValue)
        {
            var templateRoomExists = await _context.Rooms.AnyAsync(r => r.Id == dto.TemplateRoomId.Value);
            if (!templateRoomExists)
                return BadRequest(new { message = "Phòng m?u không t?n t?i" });

            templateInventories = await LoadTemplateInventoriesAsync(dto.TemplateRoomId.Value);
        }

        var createdRooms = new List<object>();
        var errors = new List<string>();
        var affectedEquipmentIds = templateInventories.Select(ri => ri.EquipmentId).ToHashSet();

        for (int i = 0; i < dto.Count; i++)
        {
            var roomNumber = BuildRoomNumber(dto.Floor, dto.StartNumber + i);

            if (await _context.Rooms.AnyAsync(r => r.RoomNumber == roomNumber))
            {
                errors.Add($"Phòng {roomNumber} dã t?n t?i, b? qua");
                continue;
            }

            var room = new Room
            {
                RoomTypeId = dto.RoomTypeId,
                RoomNumber = roomNumber,
                Floor = dto.Floor,
                Status = "Available",
                CleaningStatus = "Clean",
                IsActive = true
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            if (dto.TemplateRoomId.HasValue)
            {
                _context.RoomInventories.AddRange(templateInventories.Select(item => new RoomInventory
                {
                    RoomId = room.Id,
                    EquipmentId = item.EquipmentId,
                    Quantity = item.Quantity,
                    PriceIfLost = item.PriceIfLost,
                    Note = item.Note,
                    IsActive = item.IsActive,
                    ItemType = item.ItemType
                }));
            }

            createdRooms.Add(new
            {
                room.Id,
                room.RoomNumber,
                room.Status,
                clonedFrom = dto.TemplateRoomId
            });
        }

        await _context.SaveChangesAsync();
        await RecalculateEquipmentUsageAsync(affectedEquipmentIds);

        return Ok(new
        {
            message = $"Ðã t?o {createdRooms.Count} phòng thành công",
            created = createdRooms,
            skipped = errors
        });
    }

    private async Task<List<RoomInventory>> LoadTemplateInventoriesAsync(int templateRoomId)
    {
        var roomInventories = await _context.RoomInventories
            .Where(ri => ri.RoomId == templateRoomId)
            .AsNoTracking()
            .ToListAsync();

        if (roomInventories.Count > 0)
            return roomInventories;

        var legacyItems = await _context.RoomItems
            .Where(ri => ri.RoomId == templateRoomId)
            .AsNoTracking()
            .ToListAsync();

        if (legacyItems.Count == 0)
            return new List<RoomInventory>();

        var equipmentByName = await _context.Equipments
            .Where(e => e.IsActive)
            .ToDictionaryAsync(e => e.Name.Trim().ToLower());

        var converted = new List<RoomInventory>();
        foreach (var item in legacyItems)
        {
            if (!equipmentByName.TryGetValue(item.ItemName.Trim().ToLower(), out var equipment))
                continue;

            converted.Add(new RoomInventory
            {
                EquipmentId = equipment.Id,
                Quantity = item.Quantity,
                PriceIfLost = item.PriceIfLost,
                Note = "Migrated from legacy Room_Items",
                IsActive = true,
                ItemType = "Asset"
            });
        }

        return converted;
    }

    private static string BuildRoomNumber(int floor, int sequenceNumber)
    {
        if (sequenceNumber >= 100)
            return sequenceNumber.ToString();

        return $"{floor}{sequenceNumber:D2}";
    }

    private async Task RecalculateEquipmentUsageAsync(IEnumerable<int> equipmentIds)
    {
        var distinctEquipmentIds = equipmentIds.Distinct().ToList();
        if (distinctEquipmentIds.Count == 0) return;

        var usageByEquipment = await _context.RoomInventories
            .Where(ri => distinctEquipmentIds.Contains(ri.EquipmentId) && (ri.IsActive ?? true))
            .GroupBy(ri => ri.EquipmentId)
            .Select(g => new { EquipmentId = g.Key, Quantity = g.Sum(x => x.Quantity ?? 0) })
            .ToDictionaryAsync(x => x.EquipmentId, x => x.Quantity);

        var equipments = await _context.Equipments
            .Where(e => distinctEquipmentIds.Contains(e.Id))
            .ToListAsync();

        foreach (var equipment in equipments)
            equipment.InUseQuantity = usageByEquipment.TryGetValue(equipment.Id, out var quantity) ? quantity : 0;

        await _context.SaveChangesAsync();
    }
}
