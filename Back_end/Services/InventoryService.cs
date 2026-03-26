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

    public async Task<InventoryResponseDto?> GetByIdAsync(int id)
    {
        var inv = await _context.RoomInventories.Include(ri => ri.RoomType)
            .FirstOrDefaultAsync(ri => ri.Id == id);
        return inv == null ? null : MapToDto(inv);
    }

    public async Task<InventoryResponseDto?> UpdateByIdAsync(int id, InventoryUpdateDto dto)
    {
        var inv = await _context.RoomInventories.FindAsync(id);
        if (inv == null) return null;

        inv.TotalRooms = dto.TotalRooms;
        inv.AvailableRooms = dto.AvailableRooms;
        inv.PriceOverride = dto.PriceOverride;
        inv.InventoryDate = dto.InventoryDate.Date;
        inv.RoomTypeId = dto.RoomTypeId;

        await _context.SaveChangesAsync();
        await _context.Entry(inv).Reference(x => x.RoomType).LoadAsync();
        return MapToDto(inv);
    }

    public async Task<bool> DeleteByIdAsync(int id)
    {
        var inv = await _context.RoomInventories.FindAsync(id);
        if (inv == null) return false;

        _context.RoomInventories.Remove(inv);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<InventoryResponseDto?> CloneAsync(int id)
    {
        var source = await _context.RoomInventories.AsNoTracking().FirstOrDefaultAsync(ri => ri.Id == id);
        if (source == null) return null;

        var clone = new RoomInventory
        {
            RoomTypeId = source.RoomTypeId,
            InventoryDate = source.InventoryDate.AddDays(1), // Default to next day
            TotalRooms = source.TotalRooms,
            AvailableRooms = source.AvailableRooms,
            PriceOverride = source.PriceOverride
        };

        _context.RoomInventories.Add(clone);
        await _context.SaveChangesAsync();
        
        // Reload with RoomType
        return await GetByIdAsync(clone.Id);
    }

    private static InventoryResponseDto MapToDto(RoomInventory ri) => new(
        ri.Id, ri.RoomTypeId, ri.RoomType?.Name ?? "N/A", ri.InventoryDate, ri.TotalRooms, ri.AvailableRooms, ri.PriceOverride);
}
