using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/Rooms")]
public class RoomCleaningController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;

    public RoomCleaningController(AppDbContext context, INotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpPatch("{id}/cleaning-status")]
    [Authorize(Roles = "Admin,Housekeeping")]
    public async Task<IActionResult> UpdateCleaningStatus(int id, [FromBody] UpdateRoomCleaningDto dto)
    {
        var room = await _context.Rooms
            .Include(r => r.RoomType)
            .FirstOrDefaultAsync(r => r.Id == id && r.IsActive);

        if (room == null)
        {
            return NotFound(new { message = "Phong khong ton tai" });
        }

        var previousStatus = room.Status;
        room.Status = dto.Status;
        room.CleaningStatus = dto.CleaningStatus;

        await _context.SaveChangesAsync();

        if (!string.Equals(previousStatus, "Cleaning", StringComparison.OrdinalIgnoreCase)
            && string.Equals(dto.Status, "Cleaning", StringComparison.OrdinalIgnoreCase))
        {
            await _notificationService.SendToRoleByNameAsync(
                "Admin",
                "Phong dang duoc don",
                $"Phong {room.RoomNumber} dang duoc nhan vien buong phong xu ly. Tam thoi khong nhan dat phong nay.",
                NotificationType.Warning,
                "/admin/cleaning"
            );
        }

        return Ok(new RoomResponseDto(
            room.Id,
            room.RoomNumber,
            room.RoomType?.Name ?? "N/A",
            room.RoomTypeId,
            room.Status,
            room.CleaningStatus,
            room.IsActive,
            room.Floor,
            room.ExtensionNumber));
    }
}
