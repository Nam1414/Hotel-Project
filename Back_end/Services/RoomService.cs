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

    // =============================================
    // 1. ROOM TYPES
    // =============================================

    public async Task<IEnumerable<RoomTypeResponseDto>> GetAllRoomTypesAsync()
    {
        return await _context.RoomTypes
            .Include(rt => rt.Images)
            .Include(rt => rt.Amenities)
            .OrderByDescending(rt => rt.CreatedAt)
            .Select(rt => MapToDto(rt))
            .ToListAsync();
    }

    public async Task<RoomTypeResponseDto?> GetRoomTypeByIdAsync(int id)
    {
        var rt = await _context.RoomTypes
            .Include(rt => rt.Images)
            .Include(rt => rt.Amenities)
            .FirstOrDefaultAsync(rt => rt.Id == id);

        return rt == null ? null : MapToDto(rt);
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

        return MapToDto(rt);
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
        return MapToDto(rt);
    }

    public async Task<bool> DeleteRoomTypeAsync(int id)
    {
        var rt = await _context.RoomTypes.FindAsync(id);
        if (rt == null) return false;

        rt.IsActive = false; // Soft delete
        rt.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return true;
    }

    // =============================================
    // 2. ROOMS
    // =============================================

    public async Task<IEnumerable<RoomResponseDto>> GetAllRoomsAsync(int? roomTypeId = null)
    {
        var query = _context.Rooms.Include(r => r.RoomType).AsQueryable();

        if (roomTypeId.HasValue)
        {
            query = query.Where(r => r.RoomTypeId == roomTypeId.Value);
        }

        return await query
            .OrderBy(r => r.RoomNumber)
            .Select(r => new RoomResponseDto(
                r.Id, r.RoomNumber, r.RoomType!.Name, r.RoomTypeId, r.Status, r.IsActive))
            .ToListAsync();
    }

    public async Task<RoomResponseDto?> GetRoomByIdAsync(int id)
    {
        var room = await _context.Rooms.Include(r => r.RoomType)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        return room == null ? null : new RoomResponseDto(
            room.Id, room.RoomNumber, room.RoomType?.Name ?? "N/A", room.RoomTypeId, room.Status, room.IsActive);
    }

    public async Task<RoomResponseDto> CreateRoomAsync(CreateRoomDto dto)
    {
        var room = new Room
        {
            RoomNumber = dto.RoomNumber,
            RoomTypeId = dto.RoomTypeId,
            Status = dto.Status,
            IsActive = true
        };

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return (await GetRoomByIdAsync(room.Id))!;
    }

    public async Task<RoomResponseDto?> UpdateRoomAsync(int id, UpdateRoomDto dto)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return null;

        room.RoomNumber = dto.RoomNumber;
        room.RoomTypeId = dto.RoomTypeId;
        room.Status = dto.Status;
        room.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return await GetRoomByIdAsync(id);
    }

    public async Task<bool> DeleteRoomAsync(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return false;

        room.IsActive = false; // Soft delete
        await _context.SaveChangesAsync();
        return true;
    }

    // MAPPERS
    private static RoomTypeResponseDto MapToDto(RoomType rt) => new(
        rt.Id,
        rt.Name,
        rt.Description,
        rt.BasePrice,
        rt.MaxCapacity,
        rt.IsActive,
        rt.Images?.Select(i => new RoomImageResponseDto(i.Id, i.ImageUrl, i.IsPrimary)).ToList(),
        rt.Amenities?.Select(a => new AmenityDto(a.Id, a.Name, a.IconUrl)).ToList()
    );
}
