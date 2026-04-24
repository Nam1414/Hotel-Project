using HotelManagementAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    // ═══════════════════════════════════════════════════════
    // GET /api/Dashboard/overview
    // ═══════════════════════════════════════════════════════
    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var today      = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);

        // Doanh thu hôm nay — dùng Invoice.FinalTotal, lọc theo CheckInDate
        var revenueToday = await _context.Invoices
            .Where(i => i.Booking!.Status == "Confirmed"
                     && i.Booking.BookingDetails.Any(bd => bd.CheckInDate.Date == today))
            .SumAsync(i => (decimal?)i.FinalTotal) ?? 0;

        // Doanh thu tháng này
        var revenueThisMonth = await _context.Invoices
            .Where(i => i.Booking!.Status == "Confirmed"
                     && i.Booking.BookingDetails.Any(bd => bd.CheckInDate >= monthStart))
            .SumAsync(i => (decimal?)i.FinalTotal) ?? 0;

        // Tổng booking tháng này — lọc theo CheckInDate của BookingDetails
        var bookingsThisMonth = await _context.Bookings
            .Where(b => b.BookingDetails.Any(bd => bd.CheckInDate >= monthStart))
            .CountAsync();

        // Booking đang chờ xác nhận
        var pendingBookings = await _context.Bookings
            .Where(b => b.Status == "Pending")
            .CountAsync();

        // Tổng số phòng / đang có khách (Rooms ko có IsActive)
        var totalRooms    = await _context.Rooms.CountAsync();
        var occupiedRooms = await _context.Rooms
            .CountAsync(r => r.Status == "Occupied");

        var occupancyRate = totalRooms > 0
            ? Math.Round((double)occupiedRooms / totalRooms * 100, 1)
            : 0;

        return Ok(new
        {
            revenueToday,
            revenueThisMonth,
            bookingsThisMonth,
            pendingBookings,
            totalRooms,
            occupiedRooms,
            occupancyRate
        });
    }

    // ═══════════════════════════════════════════════════════
    // GET /api/Dashboard/revenue-chart?year=2026
    // ═══════════════════════════════════════════════════════
    [HttpGet("revenue-chart")]
    public async Task<IActionResult> GetRevenueChart(
        [FromQuery] int year = 0)
    {
        if (year == 0) year = DateTime.UtcNow.Year;

        // Lấy invoice + tháng check-in đầu tiên của mỗi booking
        var raw = await _context.Invoices
            .Where(i => i.Booking!.Status == "Confirmed"
                     && i.Booking.BookingDetails.Any(bd => bd.CheckInDate.Year == year))
            .Select(i => new
            {
                Month   = i.Booking!.BookingDetails.Min(bd => bd.CheckInDate).Month,
                Revenue = i.FinalTotal
            })
            .ToListAsync();

        var grouped = raw
            .GroupBy(x => x.Month)
            .Select(g => new
            {
                Month   = g.Key,
                Revenue = g.Sum(x => x.Revenue),
                Count   = g.Count()
            })
            .ToList();

        var result = Enumerable.Range(1, 12).Select(m => new
        {
            Month   = m,
            Revenue = grouped.FirstOrDefault(d => d.Month == m)?.Revenue ?? 0,
            Count   = grouped.FirstOrDefault(d => d.Month == m)?.Count   ?? 0
        });

        return Ok(new { year, data = result });
    }

    // ═══════════════════════════════════════════════════════
    // GET /api/Dashboard/booking-status
    // ═══════════════════════════════════════════════════════
    [HttpGet("booking-status")]
    public async Task<IActionResult> GetBookingStatus()
    {
        var data = await _context.Bookings
            .GroupBy(b => b.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        return Ok(data);
    }

    // ═══════════════════════════════════════════════════════
    // GET /api/Dashboard/top-rooms?top=5
    // ═══════════════════════════════════════════════════════
    [HttpGet("top-rooms")]
    public async Task<IActionResult> GetTopRooms(
        [FromQuery] int top = 5)
    {
        // Room nằm trong BookingDetails, không phải trực tiếp trên Booking
        var data = await _context.BookingDetails
            .Where(bd => bd.Booking!.Status == "Confirmed" && bd.Room != null)
            .GroupBy(bd => new { bd.RoomId, bd.Room!.RoomNumber })
            .Select(g => new
            {
                RoomId     = g.Key.RoomId,
                RoomNumber = g.Key.RoomNumber,
                BookCount  = g.Count(),
                // Doanh thu ước tính = giá/đêm × số đêm
                Revenue    = g.Sum(bd =>
                    bd.PricePerNight *
                    EF.Functions.DateDiffDay(bd.CheckInDate, bd.CheckOutDate))
            })
            .OrderByDescending(x => x.BookCount)
            .Take(top)
            .ToListAsync();

        return Ok(data);
    }

    // ═══════════════════════════════════════════════════════
    // GET /api/Dashboard/recent-bookings?limit=10
    // ═══════════════════════════════════════════════════════
    [HttpGet("recent-bookings")]
    public async Task<IActionResult> GetRecentBookings(
        [FromQuery] int limit = 10)
    {
        var data = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.BookingDetails).ThenInclude(bd => bd.Room)
            .Include(b => b.Invoice)
            .OrderByDescending(b => b.Id)   // Bookings không có CreatedAt → dùng Id
            .Take(limit)
            .Select(b => new
            {
                b.Id,
                GuestName  = b.User != null ? b.User.FullName : b.GuestName,
                RoomNumber = b.BookingDetails
                               .Where(bd => bd.Room != null)
                               .Select(bd => bd.Room!.RoomNumber)
                               .FirstOrDefault() ?? "N/A",
                CheckIn    = b.BookingDetails.Min(bd => (DateTime?)bd.CheckInDate),
                CheckOut   = b.BookingDetails.Max(bd => (DateTime?)bd.CheckOutDate),
                TotalPrice = b.Invoice != null ? b.Invoice.FinalTotal : 0,
                b.Status
            })
            .ToListAsync();

        return Ok(data);
    }
}