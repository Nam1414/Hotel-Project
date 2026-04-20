using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Middleware;
using HotelManagementAPI.Models;
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
        private readonly IInvoiceService _invoiceService;
        private readonly IMoMoService _momoService;
        private readonly AppDbContext _context;

        public InvoicesController(IInvoiceService invoiceService, IMoMoService momoService, AppDbContext context)
        {
            _invoiceService = invoiceService;
            _momoService = momoService;
            _context = context;
        }

        // ── 1. TẠO LINK THANH TOÁN MOMO ──────────────────────────────────────
        /// <summary>
        /// Tạo yêu cầu thanh toán MoMo cho một hóa đơn.
        /// Trả về payUrl để frontend mở tab mới.
        /// </summary>
        [HttpPost("{id}/momo-create")]
        [Authorize]
        [RequirePermission("MANAGE_INVOICES")]
        public async Task<IActionResult> CreateMoMoPayment(int id, [FromBody] MoMoCreateRequestDto dto)
        {
            try
            {
                var invoice = await _context.Invoices
                    .Include(i => i.Payments)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (invoice == null)
                    return NotFound(new { message = "Không tìm thấy hóa đơn" });

                if (invoice.Status == InvoiceStatus.Paid)
                    return BadRequest(new { message = "Hóa đơn đã được thanh toán đầy đủ" });

                // Tính số tiền còn lại (có thể dùng amount từ request nếu muốn thanh toán một phần)
                var booking = await _context.Bookings.FindAsync(invoice.BookingId);
                var deposit = booking?.DepositAmount ?? 0m;
                var totalPaid = (invoice.Payments?.Sum(p => p.AmountPaid) ?? 0m) + deposit;
                var remaining = (invoice.FinalTotal ?? 0m) - totalPaid;

                if (remaining <= 0)
                    return BadRequest(new { message = "Hóa đơn đã được thanh toán đầy đủ" });

                // Dùng số tiền từ request hoặc mặc định là số còn lại
                var amountToPay = dto.Amount.HasValue && dto.Amount.Value > 0 && dto.Amount.Value <= remaining
                    ? dto.Amount.Value
                    : remaining;

                var result = await _momoService.CreatePaymentAsync(
                    invoiceId: id,
                    amount: amountToPay,
                    orderInfo: dto.OrderInfo
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Không thể tạo thanh toán MoMo", error = ex.Message });
            }
        }

        // ── 2. IPN WEBHOOK TỪ MOMO ───────────────────────────────────────────
        /// <summary>
        /// Endpoint nhận IPN từ MoMo server (không cần JWT).
        /// MoMo gọi POST tới NotifyUrl ngay sau khi giao dịch hoàn tất.
        /// </summary>
        [HttpPost("momo-notify")]
        [AllowAnonymous]
        public async Task<IActionResult> MoMoNotify([FromBody] MoMoNotifyDto notify)
        {
            try
            {
                // 1. Xác thực chữ ký
                if (!_momoService.VerifyIpnSignature(notify))
                {
                    return Ok(new { message = "Invalid signature" }); // MoMo yêu cầu trả 200 dù lỗi
                }

                // 2. Chỉ xử lý giao dịch thành công (resultCode == 0)
                if (notify.ResultCode != 0)
                {
                    return Ok(new { message = $"Transaction failed: {notify.Message}" });
                }

                // 3. Parse invoiceId từ orderId: "INVOICE-{invoiceId}-{timestamp}"
                var parts = notify.OrderId.Split('-');
                if (parts.Length < 2 || !int.TryParse(parts[1], out var invoiceId))
                {
                    return Ok(new { message = "Cannot parse invoiceId from orderId" });
                }

                // 4. Tránh duplicate (kiểm tra transactionCode đã tồn tại chưa)
                var txnCode = $"MOMO-{notify.TransId}";
                var exists = await _context.Payments.AnyAsync(p => p.TransactionCode == txnCode);
                if (exists)
                {
                    return Ok(new { message = "Already processed" });
                }

                // 5. Lấy invoice
                var invoice = await _context.Invoices
                    .Include(i => i.Payments)
                    .FirstOrDefaultAsync(i => i.Id == invoiceId);

                if (invoice == null)
                    return Ok(new { message = "Invoice not found" });

                // 6. Tạo Payment record
                var payment = new Payment
                {
                    InvoiceId = invoiceId,
                    PaymentMethod = "MoMo",
                    AmountPaid = (decimal)notify.Amount,
                    TransactionCode = txnCode,
                    PaymentDate = DateTime.Now
                };
                await _context.Payments.AddAsync(payment);

                // 7. Cập nhật trạng thái invoice
                var bookingRecord = await _context.Bookings.FindAsync(invoice.BookingId);
                var depositAmt = bookingRecord?.DepositAmount ?? 0m;
                var totalWithNew = (invoice.Payments?.Sum(p => p.AmountPaid) ?? 0m)
                                   + (decimal)notify.Amount
                                   + depositAmt;

                if (totalWithNew >= (invoice.FinalTotal ?? 0m))
                    invoice.Status = InvoiceStatus.Paid;
                else if (totalWithNew > 0)
                    invoice.Status = InvoiceStatus.PartiallyPaid;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Success" });
            }
            catch (Exception ex)
            {
                // Luôn trả 200 để MoMo không retry vô hạn
                Console.Error.WriteLine($"[MoMo IPN Error] {ex.Message}");
                return Ok(new { message = "Internal error, logged." });
            }
        }

        // ── 3. RETURN URL (REDIRECT SAU KHI THANH TOÁN) ──────────────────────
        /// <summary>
        /// MoMo redirect về đây sau khi khách thanh toán xong (hoặc huỷ).
        /// Không cần xử lý nghiệp vụ (đã xử lý ở IPN), chỉ redirect về frontend.
        /// </summary>
        [HttpGet("momo-return")]
        [AllowAnonymous]
        public IActionResult MoMoReturn(
            [FromQuery] string? orderId,
            [FromQuery] int resultCode = -1,
            [FromQuery] string? message = null)
        {
            // Kết quả được đọc ở phía frontend từ query params của ReturnUrl
            // Backend chỉ log, không xử lý nghiệp vụ (đã có IPN)
            return Ok(new { orderId, resultCode, message });
        }
    }
}
