using System;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers
{
    [ApiController]
    [Route("api/invoices")]
    public class InvoicesController : ControllerBase
    {
        private readonly IMoMoService _momoService;
        private readonly AppDbContext _context;
        private readonly IInvoiceService _invoiceService;
        private readonly INotificationService _notificationService;

        public InvoicesController(IInvoiceService invoiceService, IMoMoService momoService, AppDbContext context, INotificationService notificationService)
        {
            _invoiceService = invoiceService;
            _momoService = momoService;
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost("{id}/momo-create")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateMoMoPayment(int id, [FromBody] MoMoCreateRequestDto dto)
        {
            try
            {
                var invoice = await _context.Invoices
                    .Include(i => i.Payments)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (invoice == null)
                {
                    return NotFound(new { message = "Invoice not found" });
                }

                var booking = invoice.BookingId.HasValue
                    ? await _context.Bookings.FindAsync(invoice.BookingId.Value)
                    : null;

                var depositAmount = IsDepositPaid(booking) ? booking!.DepositAmount : 0m;
                var paidAmount = (invoice.Payments?.Sum(p => p.AmountPaid) ?? 0m) + depositAmount;
                var invoiceTotal = invoice.FinalTotal ?? 0m;
                var remainingAmount = Math.Max(0m, invoiceTotal - paidAmount);

                var requestedAmount = dto.Amount.GetValueOrDefault();
                var amountToPay = requestedAmount > 0 ? requestedAmount : remainingAmount;

                if (amountToPay <= 0)
                {
                    return BadRequest(new { message = "Invoice is already fully paid or payment amount is invalid" });
                }

                if (remainingAmount > 0 && requestedAmount > remainingAmount)
                {
                    return BadRequest(new
                    {
                        message = "Requested amount exceeds the remaining payable amount",
                        remainingAmount
                    });
                }

                var result = await _momoService.CreatePaymentAsync(id, amountToPay, dto.OrderInfo);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating MoMo payment", error = ex.Message });
            }
        }

        [HttpPost("momo-notify")]
        [AllowAnonymous]
        public async Task<IActionResult> MoMoNotify([FromBody] MoMoNotifyDto notify)
        {
            try
            {
                if (!_momoService.VerifyIpnSignature(notify))
                {
                    return BadRequest(new { resultCode = 5, message = "Invalid signature" });
                }

                if (notify.ResultCode != 0)
                {
                    return Ok(new { resultCode = 0, message = "Payment not completed" });
                }

                var invoiceId = ExtractInvoiceId(notify);
                if (!invoiceId.HasValue)
                {
                    return BadRequest(new { resultCode = 6, message = "InvoiceId not found in MoMo payload" });
                }

                var transactionCode = notify.TransId > 0
                    ? $"MOMO-{notify.TransId}"
                    : notify.OrderId;

                var existedPayment = await _context.Payments
                    .AnyAsync(p => p.TransactionCode == transactionCode);

                var invoice = await _context.Invoices
                    .FirstOrDefaultAsync(i => i.Id == invoiceId.Value);

                if (invoice == null)
                {
                    return BadRequest(new { resultCode = 7, message = "Invoice not found" });
                }

                var booking = invoice.BookingId.HasValue
                    ? await _context.Bookings.FindAsync(invoice.BookingId.Value)
                    : null;

                var isDepositPayment = notify.OrderInfo.Contains("coc", StringComparison.OrdinalIgnoreCase);

                var shouldMarkDepositAsPaid =
                    booking != null
                    && booking.DepositAmount > 0
                    && !IsDepositPaid(booking)
                    && isDepositPayment
                    && notify.Amount == (long)Math.Round(booking.DepositAmount);

                if (shouldMarkDepositAsPaid)
                {
                    booking!.DepositStatus = "Paid";
                    await _context.SaveChangesAsync();

                    if (invoice.BookingId.HasValue)
                    {
                        await _invoiceService.RecalculateInvoiceAsync(invoice.BookingId.Value);
                    }

                    await NotifyPaymentAsync(booking, invoiceId.Value, notify.Amount, true);
                }
                else if (booking != null && IsDepositPaid(booking) && isDepositPayment)
                {
                    return Ok(new { resultCode = 0, message = "Success" });
                }
                else if (!existedPayment)
                {
                    await _invoiceService.AddPaymentAsync(invoiceId.Value, new AddPaymentDto
                    {
                        PaymentMethod = "MoMo",
                        AmountPaid = notify.Amount,
                        TransactionCode = transactionCode
                    });

                    await NotifyPaymentAsync(booking, invoiceId.Value, notify.Amount, false);
                }

                return Ok(new { resultCode = 0, message = "Success" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { resultCode = 99, message = ex.Message });
            }
        }

        [HttpGet("momo-return")]
        [AllowAnonymous]
        public IActionResult MoMoReturn(
            [FromQuery] string? orderId,
            [FromQuery] int resultCode = -1,
            [FromQuery] string? message = null)
        {
            return Ok(new { orderId, resultCode, message });
        }

        private static int? ExtractInvoiceId(MoMoNotifyDto notify)
        {
            var fromExtraData = TryParseInvoiceIdFromExtraData(notify.ExtraData);
            if (fromExtraData.HasValue)
            {
                return fromExtraData.Value;
            }

            if (string.IsNullOrWhiteSpace(notify.OrderId))
            {
                return null;
            }

            var parts = notify.OrderId.Split('-', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length >= 2 && int.TryParse(parts[1], out var invoiceId))
            {
                return invoiceId;
            }

            return null;
        }

        private static int? TryParseInvoiceIdFromExtraData(string extraData)
        {
            if (string.IsNullOrWhiteSpace(extraData))
            {
                return null;
            }

            try
            {
                var json = Encoding.UTF8.GetString(Convert.FromBase64String(extraData));
                using var doc = JsonDocument.Parse(json);

                if (doc.RootElement.TryGetProperty("invoiceId", out var invoiceIdElement)
                    && invoiceIdElement.TryGetInt32(out var invoiceId))
                {
                    return invoiceId;
                }
            }
            catch
            {
                return null;
            }

            return null;
        }

        private static bool IsDepositPaid(Models.Booking? booking)
        {
            return booking != null
                && string.Equals(booking.DepositStatus, "Paid", StringComparison.OrdinalIgnoreCase);
        }

        private async Task NotifyPaymentAsync(Models.Booking? booking, int invoiceId, decimal amount, bool isDepositPayment)
        {
            try
            {
                var bookingCode = booking?.BookingCode ?? $"Invoice #{invoiceId}";
                var paymentLabel = isDepositPayment ? "thanh toán cọc" : "thanh toán hóa đơn";
                var amountText = amount.ToString("N0");

                if (booking?.UserId != null)
                {
                    await _notificationService.SendNotificationAsync(
                        booking.UserId.Value,
                        "Thanh toán thành công",
                        $"Hệ thống đã ghi nhận {paymentLabel} cho {bookingCode} với số tiền {amountText} VND.",
                        NotificationType.Success,
                        "/profile");
                }

                await _notificationService.SendToRoleByNameAsync(
                    "Admin",
                    "Đã nhận thanh toán",
                    $"MoMo đã xác nhận {paymentLabel} cho {bookingCode} với số tiền {amountText} VND.",
                    NotificationType.Success,
                    "/admin/invoices");

                await _notificationService.SendToRoleByNameAsync(
                    "Staff",
                    "Đã nhận thanh toán",
                    $"MoMo đã xác nhận {paymentLabel} cho {bookingCode} với số tiền {amountText} VND.",
                    NotificationType.Success,
                    "/staff/invoices");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Payment Notification Error]: {ex.Message}");
            }
        }
    }
}
