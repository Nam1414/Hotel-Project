using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services;

public class RoomService(AppDbContext context) : IRoomService
{
    private readonly AppDbContext _context = context;

    // =============================================
    // 1. ROOM TYPES
    // =============================================

    public async Task<IEnumerable<RoomTypeResponseDto>> GetAllRoomTypesAsync()
    {
        return await _context.RoomTypes
            .Include(rt => rt.Images)
            .Include(rt => rt.Amenities)
            .OrderBy(rt => rt.Id)
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
            Name        = dto.Name,
            Description = dto.Description,
            BasePrice   = dto.BasePrice,
            CapacityAdults = dto.CapacityAdults,
            CapacityChildren = dto.CapacityChildren,
            SizeSqm = dto.SizeSqm,
            BedType = dto.BedType,
            ViewType = dto.ViewType,
            Slug = dto.Slug,
            Content = dto.Content,
            IsActive    = true,
            // CreatedAt   = DateTime.UtcNow,
            // UpdatedAt   = DateTime.UtcNow
        };

        _context.RoomTypes.Add(rt);
        await _context.SaveChangesAsync();

        return MapToDto(rt);
    }

    public async Task<RoomTypeResponseDto?> UpdateRoomTypeAsync(int id, UpdateRoomTypeDto dto)
    {
        var rt = await _context.RoomTypes.FindAsync(id);
        if (rt == null) return null;

        rt.Name        = dto.Name;
        rt.Description = dto.Description;
        rt.BasePrice   = dto.BasePrice;
        rt.CapacityAdults = dto.CapacityAdults;
        rt.CapacityChildren = dto.CapacityChildren;
        rt.SizeSqm = dto.SizeSqm;
        rt.BedType = dto.BedType;
        rt.ViewType = dto.ViewType;
        rt.Slug = dto.Slug;
        rt.Content = dto.Content;
        // rt.UpdatedAt   = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(rt);
    }

    public async Task<bool> DeleteRoomTypeAsync(int id)
    {
        var rt = await _context.RoomTypes.FindAsync(id);
        if (rt == null) return false;

        rt.IsActive  = false;
        // rt.UpdatedAt = DateTime.UtcNow;

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
            query = query.Where(r => r.RoomTypeId == roomTypeId.Value);

        return await query
            .OrderBy(r => r.RoomNumber)
            .Select(r => new RoomResponseDto(
                r.Id,
                r.RoomNumber,
                r.RoomType!.Name,
                r.RoomTypeId,
                r.Floor,
                r.Status,
                r.CleaningStatus,
                r.ExtensionNumber,
                r.IsActive
            ))
            .ToListAsync();
    }

    public async Task<RoomResponseDto?> GetRoomByIdAsync(int id)
    {
        var room = await _context.Rooms
            .Include(r => r.RoomType)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (room == null) return null;

        return new RoomResponseDto(
            room.Id,
            room.RoomNumber,
            room.RoomType?.Name ?? "",
            room.RoomTypeId,
            room.Floor,
            room.Status,
            room.CleaningStatus,
            room.ExtensionNumber,
            room.IsActive
        );
    }

    public async Task<RoomResponseDto> CreateRoomAsync(CreateRoomDto dto)
    {
        var room = new Room
        {
            RoomNumber = dto.RoomNumber,
            RoomTypeId = dto.RoomTypeId,
            Status = dto.Status ?? "Available",
            Floor = dto.Floor,
            CleaningStatus = dto.CleaningStatus,
            IsActive = true // mặc định active khi tạo mới
            // ← [SỬA] Bỏ IsActive — Room không có field này
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
        room.Status     = dto.Status;
        // ← [SỬA] Bỏ IsActive — dùng Status để quản lý trạng thái

        await _context.SaveChangesAsync();
        return await GetRoomByIdAsync(id);
    }

    public async Task<bool> DeleteRoomAsync(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return false;

        // ← [SỬA] Soft delete bằng Status thay vì IsActive
        room.Status = "Inactive";
        await _context.SaveChangesAsync();
        return true;
    }

    // MAPPERS
    private static RoomTypeResponseDto MapToDto(RoomType rt) => new(
        rt.Id,
        rt.Name,
        rt.Description,
        rt.BasePrice,
        rt.CapacityAdults,
        rt.CapacityChildren,
        rt.SizeSqm,
        rt.BedType,
        rt.ViewType,
        rt.Slug,
        rt.Content,
        rt.IsActive,
        rt.Images?.Select(i => new RoomImageResponseDto(
            i.Id,
            i.PublicId,
            i.ImageUrl,
            i.IsPrimary
        )).ToList(),
        rt.Amenities?.Select(a => new AmenityDto(
            a.Id,
            a.Name,
            a.IconUrl
        )).ToList()
    );
}