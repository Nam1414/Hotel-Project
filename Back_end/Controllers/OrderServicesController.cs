using System;
using System.Linq;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Middleware;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[RequirePermission("MANAGE_ROOMS")]
public class OrderServicesController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderServicesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("booking/{bookingId}")]
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
    public async Task<IActionResult> Create([FromBody] CreateOrderServiceRequestDto dto)
    {
        if (dto.Items == null || dto.Items.Count == 0)
            return BadRequest(new { message = "Items is required" });

        var bookingDetail = await _context.BookingDetails
            .FirstOrDefaultAsync(bd => bd.Id == dto.BookingDetailId);
        if (bookingDetail == null)
            return NotFound(new { message = "Booking detail not found" });

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
            await RecalculateInvoiceAsync(bookingDetail.BookingId.Value);
        }

        // Reload with service names for response
        var reloaded = await _context.OrderServices
            .Include(o => o.Details).ThenInclude(d => d.Service)
            .FirstAsync(o => o.Id == order.Id);

        return Ok(MapToDto(reloaded));
    }

    [HttpPut("{id}/status")]
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
            await RecalculateInvoiceAsync(order.BookingDetail.BookingId.Value);
        }

        return Ok(new { success = true });
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

    private async Task RecalculateInvoiceAsync(int bookingId)
    {
        var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.BookingId == bookingId);
        if (invoice == null) return;

        var booking = await _context.Bookings
            .Include(b => b.BookingDetails)
            .FirstOrDefaultAsync(b => b.Id == bookingId);
        if (booking == null) return;

        var totalRoom = booking.BookingDetails.Sum(bd =>
            Math.Max(1, (decimal)(bd.CheckOutDate - bd.CheckInDate).TotalDays) * bd.PricePerNight);

        var deliveredServiceTotal = await _context.OrderServices
            .Include(o => o.BookingDetail)
            .Where(o => o.BookingDetail != null && o.BookingDetail.BookingId == bookingId && o.StatusString == OrderServiceStatus.Delivered.ToString())
            .SumAsync(o => (decimal?)(o.TotalAmount ?? 0)) ?? 0m;

        var discount = invoice.DiscountAmount ?? 0m;
        var subTotal = totalRoom + deliveredServiceTotal - discount;
        if (subTotal < 0) subTotal = 0;

        var tax = subTotal * 0.1m;
        invoice.TotalRoomAmount = totalRoom;
        invoice.TotalServiceAmount = deliveredServiceTotal;
        invoice.TaxAmount = tax;
        invoice.FinalTotal = subTotal + tax;

        await _context.SaveChangesAsync();
    }
}
