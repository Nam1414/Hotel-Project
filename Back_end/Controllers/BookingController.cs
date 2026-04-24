using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuditLogService _auditLogService;
    private readonly INotificationService _notificationService;

    public BookingController(
        AppDbContext context,
        IAuditLogService auditLogService,
        INotificationService notificationService)
    {
        _context              = context;
        _auditLogService      = auditLogService;
        _notificationService  = notificationService;
    }

    // ─── GET /api/Booking ───────────────────────────────────────────
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Bookings.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(b => b.Status == status);

        var total = await query.CountAsync();

        // ← [SỬA] Không dùng Include — query thủ công tránh nullable mismatch
        var bookings = await query
            .OrderByDescending(b => b.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new
            {
                b.Id,
                b.BookingCode,
                b.GuestName,
                b.GuestPhone,
                b.GuestEmail,
                b.Status,
                b.UserId,
                b.VoucherId
            })
            .ToListAsync();

        return Ok(new { data = bookings, total, page, pageSize });
    }

    // ─── GET /api/Booking/{id} ──────────────────────────────────────
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.BookingDetails)
            .Include(b => b.Invoice)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return NotFound(new { message = "Booking không tồn tại" });

        // ← [SỬA] Trả anonymous object — tránh circular reference
        return Ok(new
        {
            booking.Id,
            booking.BookingCode,
            booking.GuestName,
            booking.GuestPhone,
            booking.GuestEmail,
            booking.Status,
            // booking.CreatedAt,
            booking.UserId,
            booking.VoucherId,
            BookingDetails = booking.BookingDetails.Select(bd => new
            {
                bd.Id,
                bd.RoomId,
                bd.RoomTypeId,
                bd.CheckInDate,
                bd.CheckOutDate,
                bd.PricePerNight
            }),
            Invoice = booking.Invoice == null ? null : new
            {
                booking.Invoice.Id,
                booking.Invoice.TotalRoomAmount,
                booking.Invoice.TotalServiceAmount,
                booking.Invoice.DiscountAmount,
                booking.Invoice.TaxAmount,
                booking.Invoice.FinalTotal,
                booking.Invoice.Status
            }
        });
    }

    // ─── POST /api/Booking ──────────────────────────────────────────
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
    {
        foreach (var detail in dto.Details)
        {
            var room = await _context.Rooms.FindAsync(detail.RoomId);
            if (room == null)
                return BadRequest(new { message = $"Phòng ID={detail.RoomId} không tồn tại" });

            if (!await IsRoomAvailable(detail.RoomId, detail.CheckInDate, detail.CheckOutDate))
                return BadRequest(new
                {
                    message = $"Phòng {room.RoomNumber} đã được đặt trong khoảng " +
                              $"{detail.CheckInDate:dd/MM/yyyy} – {detail.CheckOutDate:dd/MM/yyyy}"
                });
        }

        var bookingCode = $"BK{DateTime.UtcNow:yyyyMMddHHmmss}{new Random().Next(100, 999)}";

        var booking = new Booking
        {
            UserId      = dto.UserId,
            GuestName   = dto.GuestName,
            GuestPhone  = dto.GuestPhone,
            GuestEmail  = dto.GuestEmail,
            BookingCode = bookingCode,
            VoucherId   = dto.VoucherId,
            Status      = "Pending",
            // CreatedAt   = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        decimal totalRoomAmount = 0m;

        foreach (var detail in dto.Details)
        {
            var roomType = await _context.RoomTypes
                .FirstOrDefaultAsync(rt => _context.Rooms
                    .Any(r => r.Id == detail.RoomId && r.RoomTypeId == rt.Id));

            var nights = (detail.CheckOutDate - detail.CheckInDate).Days;

            // ← [SỬA] BasePrice là decimal? — ép (decimal) tường minh tránh nhầm Dictionary
            decimal pricePerNight = roomType != null ? roomType.BasePrice : 0m;

            totalRoomAmount += pricePerNight * nights;

            _context.BookingDetails.Add(new BookingDetail
            {
                BookingId     = booking.Id,
                RoomId        = detail.RoomId,
                RoomTypeId    = roomType?.Id,
                CheckInDate   = detail.CheckInDate,
                CheckOutDate  = detail.CheckOutDate,
                PricePerNight = pricePerNight
            });
        }

        await _context.SaveChangesAsync();

        decimal discountAmount = 0m;
        if (dto.VoucherId.HasValue)
        {
            var voucher = await _context.Vouchers.FindAsync(dto.VoucherId.Value);

            if (voucher != null)
            {
                // ← [SỬA] Voucher thực dùng ValidFrom/ValidTo, không có IsActive/ExpiryDate
                bool isValid =
                    (voucher.ValidFrom == null || voucher.ValidFrom <= DateTime.UtcNow) &&
                    (voucher.ValidTo   == null || voucher.ValidTo   >= DateTime.UtcNow);

                // ← [SỬA] MinBookingValue là decimal? → dùng ?? 0m an toàn
                bool meetsMinimum = totalRoomAmount >= (voucher.MinBookingValue ?? 0m);

                if (isValid && meetsMinimum)
                {
                    // ← [SỬA] DiscountValue là decimal non-nullable → dùng trực tiếp
                    discountAmount = voucher.DiscountType == "PERCENT"
                        ? totalRoomAmount * voucher.DiscountValue / 100m
                        : voucher.DiscountValue;
                }
            }
}

        var taxAmount  = (totalRoomAmount - discountAmount) * 0.1m;
        var finalTotal = totalRoomAmount - discountAmount + taxAmount;

        _context.Invoices.Add(new Invoice
        {
            BookingId          = booking.Id,
            TotalRoomAmount    = totalRoomAmount,
            TotalServiceAmount = 0m,
            DiscountAmount     = discountAmount,
            TaxAmount          = taxAmount,
            FinalTotal         = finalTotal,
            Status             = "Unpaid"
        });

        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            dto.GuestName ?? "Guest",
            "CREATE_BOOKING",
            booking.Id,
            "Bookings",
            null,
            booking.Id,
            System.Text.Json.JsonSerializer.Serialize(new
            {
                booking.BookingCode,
                booking.Status,
                totalRoomAmount,
                finalTotal
            }),
            $"Tạo booking mới: {booking.BookingCode}"
        );

        if (dto.UserId.HasValue)
        {
            await _notificationService.SendNotificationAsync(
                dto.UserId.Value,
                $"Đặt phòng {bookingCode} thành công! Tổng tiền: {finalTotal:N0} VNĐ",
                "Booking"
            );
        }

        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, new
        {
            booking.Id,
            booking.BookingCode,
            booking.Status,
            totalRoomAmount,
            discountAmount,
            taxAmount,
            finalTotal
        });
    }

    // ─── PATCH /api/Booking/{id}/status ─────────────────────────────
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusDto dto)
    {
        var booking = await _context.Bookings
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return NotFound(new { message = "Booking không tồn tại" });

        var validStatuses = new[] { "Pending", "Confirmed", "CheckedIn", "CheckedOut", "Cancelled" };
        if (!validStatuses.Contains(dto.Status))
            return BadRequest(new
            {
                message = $"Trạng thái không hợp lệ. Cho phép: {string.Join(", ", validStatuses)}"
            });

        var oldStatus  = booking.Status;
        booking.Status = dto.Status;
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            "Admin",
            "UPDATE_BOOKING_STATUS",
            id,
            "Bookings",
            System.Text.Json.JsonSerializer.Serialize(new { Status = oldStatus }),
            id,
            System.Text.Json.JsonSerializer.Serialize(new { dto.Status }),
            $"Đổi status booking ID={id}: {oldStatus} → {dto.Status}"
        );

        if (booking.UserId.HasValue)
        {
            await _notificationService.SendNotificationAsync(
                booking.UserId.Value,
                $"Booking {booking.BookingCode} đã được cập nhật: {oldStatus} → {dto.Status}",
                "Booking"
            );
        }

        return Ok(new { message = "Cập nhật trạng thái thành công", booking.BookingCode, booking.Status });
    }

    // ─── DELETE /api/Booking/{id} ────────────────────────────────────
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Cancel(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null)
            return NotFound(new { message = "Booking không tồn tại" });

        if (booking.Status == "CheckedIn" || booking.Status == "CheckedOut")
            return BadRequest(new { message = "Không thể hủy booking đã check-in hoặc check-out" });

        booking.Status = "Cancelled";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã hủy booking thành công", booking.BookingCode });
    }

    // ─── Helper ─────────────────────────────────────────────────────
    private async Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut)
    {
        return !await _context.BookingDetails
            .Include(bd => bd.Booking)
            .AnyAsync(bd =>
                bd.RoomId == roomId &&
                bd.Booking!.Status != "Cancelled" &&
                bd.CheckInDate < checkOut &&
                bd.CheckOutDate > checkIn
            );
    }
}