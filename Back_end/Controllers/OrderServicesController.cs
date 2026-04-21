using System;
using System.Linq;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Middleware;
using HotelManagementAPI.Models;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderServicesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IInvoiceService _invoiceService;

    public OrderServicesController(AppDbContext context, IInvoiceService invoiceService)
    {
        _context = context;
        _invoiceService = invoiceService;
    }

    [HttpGet("booking/{bookingId:int}")]
    [Authorize]
    [RequirePermission("MANAGE_ROOMS")]
    public async Task<IActionResult> GetByBookingId(int bookingId)
    {
        var orders = await _context.OrderServices
            .Include(o => o.Details)
            .ThenInclude(d => d.Service)
            .Include(o => o.BookingDetail)
            .Where(o => o.BookingDetail != null && o.BookingDetail.BookingId == bookingId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(MapToDto).ToList());
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateOrderServiceRequestDto dto)
    {
        if (dto.Items == null || dto.Items.Count == 0)
            return BadRequest(new { message = "Items is required" });

        var bookingDetail = await _context.BookingDetails
            .Include(bd => bd.Booking)
            .FirstOrDefaultAsync(bd => bd.Id == dto.BookingDetailId);
        if (bookingDetail == null)
            return NotFound(new { message = "Booking detail not found" });

        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (userRole != "Admin" && userRole != "Staff")
        {
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId) || bookingDetail.Booking?.UserId != userId)
            {
                return Forbid("Bạn không có quyền gọi dịch vụ cho phòng này.");
            }
        }

        var serviceIds = dto.Items.Select(i => i.ServiceId).Distinct().ToList();
        var services = await _context.Services.Where(s => serviceIds.Contains(s.Id)).ToListAsync();
        if (services.Count != serviceIds.Count)
            return BadRequest(new { message = "Some services not found" });

        var order = new OrderService
        {
            BookingDetailId = bookingDetail.Id,
            OrderDate = DateTime.Now,
            Status = OrderServiceStatus.Pending,
        };

        foreach (var item in dto.Items)
        {
            if (item.Quantity <= 0) continue;
            var service = services.First(s => s.Id == item.ServiceId);
            order.Details.Add(new OrderServiceDetail
            {
                ServiceId = service.Id,
                Quantity = item.Quantity,
                UnitPrice = service.Price,
            });
        }

        if (order.Details.Count == 0)
            return BadRequest(new { message = "No valid items" });

        order.TotalAmount = order.Details.Sum(d => d.UnitPrice * d.Quantity);

        await _context.OrderServices.AddAsync(order);
        await _context.SaveChangesAsync();

        if (bookingDetail.BookingId != null)
        {
            await _invoiceService.RecalculateInvoiceAsync(bookingDetail.BookingId.Value);
        }

        // Reload with service names for response
        var reloaded = await _context.OrderServices
            .Include(o => o.Details).ThenInclude(d => d.Service)
            .FirstAsync(o => o.Id == order.Id);

        return Ok(MapToDto(reloaded));
    }

    [HttpPut("{id:int}/status")]
    [Authorize]
    [RequirePermission("MANAGE_ROOMS")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderServiceStatusDto dto)
    {
        var order = await _context.OrderServices
            .Include(o => o.BookingDetail)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound(new { message = "Order not found" });

        order.Status = dto.Status;
        await _context.SaveChangesAsync();

        if (order.BookingDetail?.BookingId != null)
        {
            await _invoiceService.RecalculateInvoiceAsync(order.BookingDetail.BookingId.Value);
        }

        return Ok(new { success = true });
    }

    [HttpPost("room/{roomId:int}/minibar")]
    [Authorize]
    [RequirePermission("MANAGE_ROOMS")]
    public async Task<IActionResult> ReportMinibar(int roomId, [FromBody] List<CreateOrderServiceItemDto> items)
    {
        if (items == null || items.Count == 0)
            return BadRequest(new { message = "Danh sách dịch vụ/Minibar trống" });

        var activeBookingDetail = await _context.BookingDetails
            .Include(bd => bd.Booking)
                .ThenInclude(b => b.Invoice)
            .Where(bd => bd.RoomId == roomId && bd.Booking != null)
            .OrderByDescending(bd => bd.CheckInDate)
            .FirstOrDefaultAsync();

        if (activeBookingDetail == null)
            return BadRequest(new { message = "Phòng không có khách đang ở hoặc chưa có booking hợp lệ." });

        var b = activeBookingDetail.Booking;
        bool canCharge = false;
        
        if (b.StatusString == "CheckedIn") 
        {
            canCharge = true;
        }
        else if (b.StatusString == "CheckedOut" && (b.Invoice == null || b.Invoice.StatusString != "Paid"))
        {
            canCharge = true;
        }

        if (!canCharge)
            return BadRequest(new { message = "Khách đã trả phòng và thanh toán xong, không thể cộng Minibar." });

        var serviceIds = items.Select(i => i.ServiceId).Distinct().ToList();
        var services = await _context.Services.Where(s => serviceIds.Contains(s.Id)).ToListAsync();
        if (services.Count != serviceIds.Count)
            return BadRequest(new { message = "Một số dịch vụ không tồn tại" });

        var order = new OrderService
        {
            BookingDetailId = activeBookingDetail.Id,
            OrderDate = DateTime.Now,
            Status = OrderServiceStatus.Delivered, 
        };

        foreach (var item in items)
        {
            if (item.Quantity <= 0) continue;
            var service = services.First(s => s.Id == item.ServiceId);
            order.Details.Add(new OrderServiceDetail
            {
                ServiceId = service.Id,
                Quantity = item.Quantity,
                UnitPrice = service.Price,
            });
        }

        if (order.Details.Count == 0)
            return BadRequest(new { message = "Không có mục dịch vụ hợp lệ" });

        order.TotalAmount = order.Details.Sum(d => d.UnitPrice * d.Quantity);

        await _context.OrderServices.AddAsync(order);
        await _context.SaveChangesAsync();

        if (activeBookingDetail.BookingId != null)
        {
            await _invoiceService.RecalculateInvoiceAsync(activeBookingDetail.BookingId.Value);
        }

        var reloaded = await _context.OrderServices
            .Include(o => o.Details).ThenInclude(d => d.Service)
            .FirstAsync(o => o.Id == order.Id);

        return Ok(new { 
            message = "Đã cộng dồn Minibar vào hóa đơn thành công", 
            order = MapToDto(reloaded),
            totalAmount = order.TotalAmount,
            bookingCode = b.BookingCode
        });
    }

    private OrderServiceResponseDto MapToDto(OrderService order)
    {
        var details = order.Details?.Select(d => new OrderServiceDetailDto(
            d.ServiceId,
            d.Service?.Name ?? $"#{d.ServiceId}",
            d.Quantity,
            d.UnitPrice,
            d.UnitPrice * d.Quantity
        )).ToList() ?? new();

        return new OrderServiceResponseDto(
            order.Id,
            order.BookingDetailId,
            order.OrderDate,
            order.TotalAmount ?? details.Sum(x => x.LineTotal),
            order.Status,
            details
        );
    }
}
