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

    public async Task<IEnumerable<InventoryResponseDto>> GetInventoryAsync(
        DateTime startDate, DateTime endDate, int? roomTypeId = null)
    {
        var query = _context.RoomInventoryDailies
            .Include(r => r.RoomType)
            .Where(r => r.InventoryDate >= startDate.Date
                     && r.InventoryDate <= endDate.Date);

        if (roomTypeId.HasValue)
            query = query.Where(r => r.RoomTypeId == roomTypeId.Value);

        return await query
            .OrderBy(r => r.InventoryDate)
            .ThenBy(r => r.RoomTypeId)
            .Select(r => new InventoryResponseDto(
                r.Id,
                r.RoomTypeId,
                r.RoomType!.Name,
                r.InventoryDate,
                r.TotalRooms,
                r.AvailableRooms,
                r.PriceOverride))
            .ToListAsync();
    }

    public async Task<InventoryResponseDto?> GetByIdAsync(int id)
    {
        var inv = await _context.RoomInventoryDailies
            .Include(r => r.RoomType)
            .FirstOrDefaultAsync(r => r.Id == id);

        return inv == null ? null : MapToDto(inv);
    }

    public async Task<InventoryResponseDto?> UpsertInventoryAsync(InventoryUpdateDto dto)
    {
        var existing = await _context.RoomInventoryDailies
            .FirstOrDefaultAsync(r => r.RoomTypeId    == dto.RoomTypeId
                                   && r.InventoryDate == dto.InventoryDate.Date);

        if (existing == null)
        {
            existing = new RoomInventoryDaily
            {
                RoomTypeId    = dto.RoomTypeId,
                InventoryDate = dto.InventoryDate.Date,
            };
            _context.RoomInventoryDailies.Add(existing);
        }

        existing.TotalRooms     = dto.TotalRooms;
        existing.AvailableRooms = dto.AvailableRooms;
        existing.PriceOverride  = dto.PriceOverride;

        await _context.SaveChangesAsync();
        await _context.Entry(existing).Reference(x => x.RoomType).LoadAsync();
        return MapToDto(existing);
    }

    public async Task<InventoryResponseDto?> UpdateByIdAsync(int id, InventoryUpdateDto dto)
    {
        var inv = await _context.RoomInventoryDailies.FindAsync(id);
        if (inv == null) return null;

        // Kiểm tra nếu đổi roomTypeId hoặc date → phải check duplicate trước
        if (inv.RoomTypeId != dto.RoomTypeId || inv.InventoryDate.Date != dto.InventoryDate.Date)
        {
            var duplicate = await _context.RoomInventoryDailies
                .AnyAsync(r => r.RoomTypeId    == dto.RoomTypeId
                            && r.InventoryDate == dto.InventoryDate.Date
                            && r.Id            != id); // loại trừ chính nó

            if (duplicate)
                return null; // Controller sẽ trả 409 Conflict
        }

        inv.RoomTypeId     = dto.RoomTypeId;
        inv.InventoryDate  = dto.InventoryDate.Date;
        inv.TotalRooms     = dto.TotalRooms;
        inv.AvailableRooms = dto.AvailableRooms;
        inv.PriceOverride  = dto.PriceOverride;

        await _context.SaveChangesAsync();
        await _context.Entry(inv).Reference(x => x.RoomType).LoadAsync();
        return MapToDto(inv);
    }

    public async Task<bool> DeleteByIdAsync(int id)
    {
        var inv = await _context.RoomInventoryDailies.FindAsync(id);
        if (inv == null) return false;

        _context.RoomInventoryDailies.Remove(inv);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<InventoryResponseDto?> CloneAsync(int id)
    {
        var source = await _context.RoomInventoryDailies
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (source == null) return null;

        // Kiểm tra ngày hôm sau đã tồn tại chưa
        var nextDate = source.InventoryDate.AddDays(1);
        var duplicate = await _context.RoomInventoryDailies
            .AnyAsync(r => r.RoomTypeId    == source.RoomTypeId
                        && r.InventoryDate == nextDate);

        if (duplicate) return null; // Trả null nếu đã tồn tại

        var clone = new RoomInventoryDaily
        {
            RoomTypeId    = source.RoomTypeId,
            InventoryDate = nextDate,
            TotalRooms    = source.TotalRooms,
            AvailableRooms = source.AvailableRooms,
            PriceOverride = source.PriceOverride
        };

        _context.RoomInventoryDailies.Add(clone);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(clone.Id);
    }

    public async Task<bool> BulkUpdatePriceAsync(BulkUpdatePriceDto dto)
    {
        var records = await _context.RoomInventoryDailies
            .Where(r => r.RoomTypeId    == dto.RoomTypeId
                     && r.InventoryDate >= dto.StartDate.Date
                     && r.InventoryDate <= dto.EndDate.Date)
            .ToListAsync();

        if (!records.Any()) return false;

        foreach (var r in records)
            r.PriceOverride = dto.PriceOverride;

        await _context.SaveChangesAsync();
        return true;
    }

    private static InventoryResponseDto MapToDto(RoomInventoryDaily r) => new(
        r.Id,
        r.RoomTypeId,
        r.RoomType?.Name ?? "N/A",
        r.InventoryDate,
        r.TotalRooms,
        r.AvailableRooms,
        r.PriceOverride);
}