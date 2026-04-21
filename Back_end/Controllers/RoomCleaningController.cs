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
    [Authorize(Roles = "Admin,Manager,Staff,Housekeeping,Receptionist,Lễ tân,Dọn phòng,Nhân viên")]
    public async Task<IActionResult> UpdateCleaningStatus(int id, [FromBody] UpdateRoomCleaningDto dto)
    {
        var room = await _context.Rooms
            .Include(r => r.RoomType)
            .FirstOrDefaultAsync(r => r.Id == id && r.IsActive);

        if (room == null)
        {
            return NotFound(new { message = "Phòng không tồn tại" });
        }

        var previousStatus = room.Status;
        var nextStatus = dto.Status;

        // Nếu nhân viên chọn Hoàn tất (Available) nhưng thực tế có khách đang ở (Stay)
        // thì phải trả lại trạng thái là Occupied.
        if (string.Equals(nextStatus, "Available", StringComparison.OrdinalIgnoreCase))
        {
            var hasActiveGuest = await _context.BookingDetails
                .Include(bd => bd.Booking)
                .AnyAsync(bd => bd.RoomId == room.Id && bd.Booking != null && bd.Booking.StatusString == "Stay");
            
            if (hasActiveGuest)
            {
                nextStatus = "Occupied";
            }
        }

        room.Status = nextStatus;
        room.CleaningStatus = dto.CleaningStatus;

        await _context.SaveChangesAsync();

        if (!string.Equals(previousStatus, "Cleaning", StringComparison.OrdinalIgnoreCase)
            && string.Equals(dto.Status, "Cleaning", StringComparison.OrdinalIgnoreCase))
        {
            await _notificationService.SendToRoleByNameAsync(
                "Admin",
                "Phòng đang được dọn",
                $"Phòng {room.RoomNumber} đang được nhân viên phòng vệ sinh xử lý. Tạm thời không nhận đặt phòng này.",
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
