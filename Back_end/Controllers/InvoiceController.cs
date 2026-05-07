using System;
using System.Threading.Tasks;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Middleware;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly IAuditLogService _auditLogService;

        public InvoiceController(IInvoiceService invoiceService, IAuditLogService auditLogService)
        {
            _invoiceService = invoiceService;
            _auditLogService = auditLogService;
        }

        [HttpGet("booking/{bookingId}")]
        [RequirePermission("MANAGE_BOOKINGS", "MANAGE_INVOICES")]
        public async Task<IActionResult> GetInvoiceByBookingId(int bookingId)
        {
            try
            {
                var invoice = await _invoiceService.GetInvoiceByBookingIdAsync(bookingId);
                if (invoice == null) return NotFound(new { message = "Invoice not found for this booking" });
                return Ok(invoice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the invoice", error = ex.Message });
            }
        }

        [HttpPost("booking/{bookingId}")]
        [RequirePermission("MANAGE_INVOICES")]
        public async Task<IActionResult> CreateInvoice(int bookingId)
        {
            try
            {
                var newInvoice = await _invoiceService.CreateInvoiceAsync(bookingId);
                await _auditLogService.LogAsync("CREATE", "Invoice", new { bookingId, newInvoice.Id }, null, newInvoice, $"Tạo hóa đơn cho booking #{bookingId}.");
                return Ok(newInvoice);
            }
            catch (Exception ex)
            {
                // In production, log the exception
                if (ex.Message == "Booking not found") return NotFound(new { message = ex.Message });
                return StatusCode(500, new { message = "An error occurred while creating the invoice", error = ex.Message });
            }
        }

        [HttpPost("{id}/payment")]
        [RequirePermission("MANAGE_INVOICES")]
        public async Task<IActionResult> AddPayment(int id, [FromBody] AddPaymentDto paymentDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var payment = await _invoiceService.AddPaymentAsync(id, paymentDto);
                await _auditLogService.LogAsync("CREATE", "Payment", new { invoiceId = id }, null, paymentDto, $"Thêm thanh toán cho invoice #{id}.");
                return Ok(payment);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Invoice not found") return NotFound(new { message = ex.Message });
                return StatusCode(500, new { message = "An error occurred while adding the payment", error = ex.Message });
            }
        }
    }
}
