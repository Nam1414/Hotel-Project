using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services;

public class RoomService : IRoomService
{
    private readonly AppDbContext _context;

    public RoomService(AppDbContext context)
    {
        _context = context;
    }

    // Room Types
    public async Task<IEnumerable<RoomTypeResponseDto>> GetAllRoomTypesAsync()
    {
        return await _context.RoomTypes
            .Include(rt => rt.Images)
            .Include(rt => rt.Amenities)
            .Where(rt => rt.IsActive)
            .Select(rt => new RoomTypeResponseDto(
                rt.Id, rt.Name, rt.Description, rt.BasePrice, rt.MaxCapacity, rt.IsActive,
                rt.Images!.Select(img => new RoomImageResponseDto(img.Id, img.ImageUrl, img.IsPrimary)).ToList(),
                rt.Amenities!.Select(a => new AmenityDto(a.Id, a.Name, a.IconUrl)).ToList()))
            .ToListAsync();
    }

    public async Task<RoomTypeResponseDto?> GetRoomTypeByIdAsync(int id)
    {
        var rt = await _context.RoomTypes
            .Include(rt => rt.Images)
            .Include(rt => rt.Amenities)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (rt == null || !rt.IsActive) return null;

        return new RoomTypeResponseDto(
            rt.Id, rt.Name, rt.Description, rt.BasePrice, rt.MaxCapacity, rt.IsActive,
            rt.Images!.Select(img => new RoomImageResponseDto(img.Id, img.ImageUrl, img.IsPrimary)).ToList(),
            rt.Amenities!.Select(a => new AmenityDto(a.Id, a.Name, a.IconUrl)).ToList());
    }

    public async Task<RoomTypeResponseDto> CreateRoomTypeAsync(CreateRoomTypeDto dto)
    {
        var rt = new RoomType
        {
            Name = dto.Name,
            Description = dto.Description,
            BasePrice = dto.BasePrice,
            MaxCapacity = dto.MaxCapacity,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.RoomTypes.Add(rt);
        await _context.SaveChangesAsync();

        return new RoomTypeResponseDto(
            rt.Id, rt.Name, rt.Description, rt.BasePrice, rt.MaxCapacity, rt.IsActive);
    }

    public async Task<RoomTypeResponseDto?> UpdateRoomTypeAsync(int id, UpdateRoomTypeDto dto)
    {
        var rt = await _context.RoomTypes.FindAsync(id);
        if (rt == null) return null;

        rt.Name = dto.Name;
        rt.Description = dto.Description;
        rt.BasePrice = dto.BasePrice;
        rt.MaxCapacity = dto.MaxCapacity;
        rt.IsActive = dto.IsActive;
        rt.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new RoomTypeResponseDto(
            rt.Id, rt.Name, rt.Description, rt.BasePrice, rt.MaxCapacity, rt.IsActive);
    }

    public async Task<bool> DeleteRoomTypeAsync(int id)
    {
        var rt = await _context.RoomTypes.FindAsync(id);
        if (rt == null) return false;

        rt.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }

    // Rooms
    public async Task<IEnumerable<RoomResponseDto>> GetAllRoomsAsync(int? roomTypeId = null)
    {
        var query = _context.Rooms.Include(r => r.RoomType).Where(r => r.IsActive);

        if (roomTypeId.HasValue)
        {
            query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
        }

        return await query.Select(r => new RoomResponseDto(
            r.Id, r.RoomNumber, r.RoomType!.Name, r.RoomTypeId, r.Status, r.IsActive))
            .ToListAsync();
    }

    public async Task<RoomResponseDto?> GetRoomByIdAsync(int id)
    {
        var r = await _context.Rooms.Include(r => r.RoomType)
            .FirstOrDefaultAsync(x => x.Id == id && x.IsActive);
        
        if (r == null) return null;

        return new RoomResponseDto(
            r.Id, r.RoomNumber, r.RoomType!.Name, r.RoomTypeId, r.Status, r.IsActive);
    }

    public async Task<RoomResponseDto> CreateRoomAsync(CreateRoomDto dto)
    {
        var r = new Room
        {
            RoomNumber = dto.RoomNumber,
            RoomTypeId = dto.RoomTypeId,
            Status = dto.Status,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Rooms.Add(r);
        await _context.SaveChangesAsync();

        // Load RoomType name
        await _context.Entry(r).Reference(x => x.RoomType).LoadAsync();

        return new RoomResponseDto(
            r.Id, r.RoomNumber, r.RoomType!.Name, r.RoomTypeId, r.Status, r.IsActive);
    }

    public async Task<RoomResponseDto?> UpdateRoomAsync(int id, UpdateRoomDto dto)
    {
        var r = await _context.Rooms.FindAsync(id);
        if (r == null) return null;

        r.RoomNumber = dto.RoomNumber;
        r.RoomTypeId = dto.RoomTypeId;
        r.Status = dto.Status;
        r.IsActive = dto.IsActive;
        r.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _context.Entry(r).Reference(x => x.RoomType).LoadAsync();

        return new RoomResponseDto(
            r.Id, r.RoomNumber, r.RoomType!.Name, r.RoomTypeId, r.Status, r.IsActive);
    }

    public async Task<bool> DeleteRoomAsync(int id)
    {
        var r = await _context.Rooms.FindAsync(id);
        if (r == null) return false;

        r.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}
