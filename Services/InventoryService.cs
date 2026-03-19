using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _context;

    public InventoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InventoryResponseDto>> GetInventoryAsync(DateTime startDate, DateTime endDate, int? roomTypeId = null)
    {
        var query = _context.RoomInventories.Include(ri => ri.RoomType)
            .Where(ri => ri.InventoryDate >= startDate && ri.InventoryDate <= endDate);

        if (roomTypeId.HasValue)
        {
            query = query.Where(ri => ri.RoomTypeId == roomTypeId.Value);
        }

        return await query.OrderBy(ri => ri.InventoryDate)
            .Select(ri => new InventoryResponseDto(
                ri.Id, ri.RoomTypeId, ri.RoomType!.Name, ri.InventoryDate, ri.TotalRooms, ri.AvailableRooms, ri.PriceOverride))
            .ToListAsync();
    }

    public async Task<InventoryResponseDto> UpdateInventoryAsync(InventoryUpdateDto dto)
    {
        var inventory = await _context.RoomInventories
            .FirstOrDefaultAsync(ri => ri.RoomTypeId == dto.RoomTypeId && ri.InventoryDate.Date == dto.InventoryDate.Date);

        if (inventory == null)
        {
            inventory = new RoomInventory
            {
                RoomTypeId = dto.RoomTypeId,
                InventoryDate = dto.InventoryDate.Date,
                TotalRooms = dto.TotalRooms,
                AvailableRooms = dto.AvailableRooms,
                PriceOverride = dto.PriceOverride
            };
            _context.RoomInventories.Add(inventory);
        }
        else
        {
            inventory.TotalRooms = dto.TotalRooms;
            inventory.AvailableRooms = dto.AvailableRooms;
            inventory.PriceOverride = dto.PriceOverride;
        }

        await _context.SaveChangesAsync();
        await _context.Entry(inventory).Reference(x => x.RoomType).LoadAsync();

        return new InventoryResponseDto(
            inventory.Id, inventory.RoomTypeId, inventory.RoomType!.Name, inventory.InventoryDate, inventory.TotalRooms, inventory.AvailableRooms, inventory.PriceOverride);
    }

    public async Task<bool> InitializeInventoryAsync(int roomTypeId, DateTime startDate, DateTime endDate)
    {
        var roomType = await _context.RoomTypes.FindAsync(roomTypeId);
        if (roomType == null) return false;

        var totalRooms = await _context.Rooms.CountAsync(r => r.RoomTypeId == roomTypeId && r.IsActive);

        for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
        {
            var exists = await _context.RoomInventories.AnyAsync(ri => ri.RoomTypeId == roomTypeId && ri.InventoryDate == date);
            if (!exists)
            {
                _context.RoomInventories.Add(new RoomInventory
                {
                    RoomTypeId = roomTypeId,
                    InventoryDate = date,
                    TotalRooms = totalRooms,
                    AvailableRooms = totalRooms
                });
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
