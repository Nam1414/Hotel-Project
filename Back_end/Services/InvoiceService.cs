using System;
using System.Linq;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly AppDbContext _context;

        public InvoiceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<InvoiceResponseDto?> GetInvoiceByBookingIdAsync(int bookingId)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.BookingId == bookingId);

            if (invoice == null) return null;

            await RecalculateInvoiceAsync(bookingId);
            return await MapToDtoAsync(invoice);
        }

        public async Task<InvoiceResponseDto> CreateInvoiceAsync(int bookingId)
        {
            // ── Kiểm tra hóa đơn đã tồn tại → trả về luôn, không tạo trùng ──
            var existingInvoice = await _context.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.BookingId == bookingId);

            if (existingInvoice != null)
            {
                // Recalculate để cập nhật số liệu mới nhất rồi trả về
                await RecalculateInvoiceAsync(bookingId);
                existingInvoice = await _context.Invoices
                    .Include(i => i.Payments)
                    .FirstOrDefaultAsync(i => i.BookingId == bookingId);
                return await MapToDtoAsync(existingInvoice!);
            }

            var booking = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Include(b => b.Voucher)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null) throw new Exception("Booking not found");

            decimal totalRoom = booking.BookingDetails.Sum(bd =>
                Math.Max(1, (decimal)(bd.CheckOutDate.Date - bd.CheckInDate.Date).Days) * bd.PricePerNight);

            // Chỉ tính dịch vụ đã Delivered để lên hóa đơn
            var deliveredServiceTotal = await _context.OrderServices
                .Include(o => o.BookingDetail)
                .Where(o => o.BookingDetail != null && o.BookingDetail.BookingId == bookingId && o.StatusString == OrderServiceStatus.Delivered.ToString())
                .SumAsync(o => (decimal?)(o.TotalAmount ?? 0)) ?? 0m;

            // Tính tiền phạt hỏng hóc vật tư
            var detailIds = booking.BookingDetails.Select(bd => bd.Id).ToList();
            var penaltyTotal = await _context.LossAndDamages
                .Where(ld => ld.BookingDetailId.HasValue && detailIds.Contains(ld.BookingDetailId.Value))
                .SumAsync(ld => ld.PenaltyAmount);
            
            deliveredServiceTotal += penaltyTotal;

            var discount = CalculateVoucherDiscount(booking, totalRoom + deliveredServiceTotal);
            var invoice = new Invoice
            {
                BookingId = bookingId,
                TotalRoomAmount = totalRoom,
                TotalServiceAmount = deliveredServiceTotal,
                DiscountAmount = discount,
                TaxAmount = (totalRoom + deliveredServiceTotal - discount) * 0.1m,
                FinalTotal = (totalRoom + deliveredServiceTotal - discount) * 1.1m,
                Status = InvoiceStatus.Unpaid
            };

            if (invoice.FinalTotal < 0) invoice.FinalTotal = 0;

            if (booking.VoucherId.HasValue && booking.Voucher != null)
            {
                booking.Voucher.UsageCount += 1;
            }

            await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();

            return await MapToDtoAsync(invoice);
        }

        public async Task RecalculateInvoiceAsync(int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Include(b => b.Voucher)
                .FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null) return;

            var invoice = await _context.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.BookingId == bookingId);
            bool isNew = false;
            if (invoice == null)
            {
                invoice = new Invoice
                {
                    BookingId = bookingId,
                    Status = InvoiceStatus.Unpaid,
                    TotalRoomAmount = 0,
                    TotalServiceAmount = 0,
                    TaxAmount = 0,
                    DiscountAmount = 0,
                    FinalTotal = 0
                };
                isNew = true;
            }

            var totalRoom = booking.BookingDetails.Sum(bd =>
                Math.Max(1, (decimal)(bd.CheckOutDate.Date - bd.CheckInDate.Date).Days) * bd.PricePerNight);

            var deliveredServiceTotal = await _context.OrderServices
                .Include(o => o.BookingDetail)
                .Where(o => o.BookingDetail != null && o.BookingDetail.BookingId == bookingId && o.StatusString == OrderServiceStatus.Delivered.ToString())
                .SumAsync(o => (decimal?)(o.TotalAmount ?? 0)) ?? 0m;

            var detailIds = booking.BookingDetails.Select(bd => bd.Id).ToList();
            var penaltyTotal = await _context.LossAndDamages
                .Where(ld => ld.BookingDetailId.HasValue && detailIds.Contains(ld.BookingDetailId.Value))
                .SumAsync(ld => ld.PenaltyAmount);
                
            deliveredServiceTotal += penaltyTotal;

            var discount = CalculateVoucherDiscount(booking, totalRoom + deliveredServiceTotal);
            var subTotal = totalRoom + deliveredServiceTotal - discount;
            if (subTotal < 0) subTotal = 0;

            var tax = subTotal * 0.1m;
            invoice.TotalRoomAmount = totalRoom;
            invoice.TotalServiceAmount = deliveredServiceTotal;
            invoice.DiscountAmount = discount;
            invoice.TaxAmount = tax;
            invoice.FinalTotal = subTotal + tax;

            // Recalculate status based on payments AND deposit
            decimal deposit = booking.DepositAmount;
            decimal totalPaid = (invoice.Payments?.Sum(p => p.AmountPaid) ?? 0m) + deposit;
            
            if (invoice.FinalTotal == 0)
            {
                invoice.Status = InvoiceStatus.Paid;
            }
            else if (totalPaid >= invoice.FinalTotal)
            {
                invoice.Status = InvoiceStatus.Paid;
            }
            else if (totalPaid > 0)
            {
                invoice.Status = InvoiceStatus.PartiallyPaid;
            }
            else
            {
                invoice.Status = InvoiceStatus.Unpaid;
            }

            if (isNew)
            {
                await _context.Invoices.AddAsync(invoice);
            }
            await _context.SaveChangesAsync();
        }

        public async Task<PaymentResponseDto> AddPaymentAsync(int invoiceId, AddPaymentDto paymentDto)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.Id == invoiceId);

            if (invoice == null) throw new Exception("Invoice not found");

            var payment = new Payment
            {
                InvoiceId = invoiceId,
                PaymentMethod = paymentDto.PaymentMethod,
                AmountPaid = paymentDto.AmountPaid,
                // Tự động sinh mã giao dịch nếu client không gửi
                TransactionCode = !string.IsNullOrWhiteSpace(paymentDto.TransactionCode)
                    ? paymentDto.TransactionCode
                    : $"TXN-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
                PaymentDate = DateTime.Now
            };

            await _context.Payments.AddAsync(payment);
            
            // Check if fully paid (including deposit)
            var bookingRecord = await _context.Bookings.FindAsync(invoice.BookingId);
            decimal depositAmt = bookingRecord?.DepositAmount ?? 0;
            var totalWithDeposit = invoice.Payments.Sum(p => p.AmountPaid) + payment.AmountPaid + depositAmt;
            
            if (totalWithDeposit >= invoice.FinalTotal)
                invoice.Status = InvoiceStatus.Paid;
            else if (totalWithDeposit > 0)
                invoice.Status = InvoiceStatus.PartiallyPaid;

            await _context.SaveChangesAsync();

            return new PaymentResponseDto
            {
                Id = payment.Id,
                PaymentMethod = payment.PaymentMethod,
                AmountPaid = payment.AmountPaid,
                TransactionCode = payment.TransactionCode,
                PaymentDate = payment.PaymentDate
            };
        }

        private async Task<InvoiceResponseDto> MapToDtoAsync(Invoice invoice)
        {
            var bookingId = invoice.BookingId;
            
            // Lấy danh sách dịch vụ
            var services = await _context.OrderServices
                .Include(o => o.Details)
                    .ThenInclude(d => d.Service)
                .Include(o => o.BookingDetail)
                .Where(o => o.BookingDetail != null && o.BookingDetail.BookingId == bookingId && (o.StatusString == "Delivered" || o.StatusString == "1"))
                .ToListAsync();

            // Lấy danh sách hỏng hóc
            var detailIds = await _context.BookingDetails
                .Where(bd => bd.BookingId == bookingId)
                .Select(bd => bd.Id)
                .ToListAsync();

            var damages = await _context.LossAndDamages
                .Include(ld => ld.Equipment)
                .Include(ld => ld.RoomInventory)
                    .ThenInclude(ri => ri!.Room)
                .Where(ld => ld.BookingDetailId.HasValue && detailIds.Contains(ld.BookingDetailId.Value))
                .ToListAsync();

            return new InvoiceResponseDto
            {
                Id = invoice.Id,
                BookingId = invoice.BookingId,
                TotalRoomAmount = invoice.TotalRoomAmount ?? 0,
                TotalServiceAmount = invoice.TotalServiceAmount ?? 0,
                DiscountAmount = invoice.DiscountAmount ?? 0,
                TaxAmount = invoice.TaxAmount ?? 0,
                FinalTotal = invoice.FinalTotal ?? 0,
                Status = invoice.Status,
                Payments = invoice.Payments?.Select(p => new PaymentResponseDto
                {
                    Id = p.Id,
                    PaymentMethod = p.PaymentMethod,
                    AmountPaid = p.AmountPaid,
                    TransactionCode = p.TransactionCode,
                    PaymentDate = p.PaymentDate
                }).ToList() ?? new System.Collections.Generic.List<PaymentResponseDto>(),
                ServiceOrders = services.Select(s => new OrderServiceResponseDto(
                    s.Id,
                    s.BookingDetailId,
                    s.OrderDate,
                    s.TotalAmount ?? 0,
                    s.Status,
                    s.Details.Select(sd => new OrderServiceDetailDto(
                        sd.ServiceId,
                        sd.Service?.Name ?? "N/A",
                        sd.Quantity,
                        sd.UnitPrice,
                        sd.UnitPrice * sd.Quantity
                    )).ToList()
                )).ToList(),
                LossDamages = damages.Select(ld => new LossDamageResponseDto(
                    ld.Id,
                    ld.BookingDetailId,
                    ld.RoomInventoryId,
                    ld.Quantity,
                    ld.PenaltyAmount,
                    ld.Description,
                    ld.ImageUrl,
                    ld.CreatedAt,
                    ld.RoomInventory?.Room?.RoomNumber,
                    ld.Equipment?.Name ?? ld.RoomInventory?.Equipment?.Name ?? "Vật tư"
                )).ToList(),
                DepositAmount = (await _context.Bookings.FindAsync(invoice.BookingId))?.DepositAmount ?? 0
            };
        }

        private static decimal CalculateVoucherDiscount(Booking booking, decimal baseAmount)
        {
            if (booking.Voucher == null)
            {
                return 0m;
            }

            var voucher = booking.Voucher;
            var now = DateTime.Now;
            var canApply = voucher.IsActive
                && voucher.StartDate <= now
                && voucher.EndDate >= now
                && baseAmount >= voucher.MinBookingAmount;

            if (!canApply)
            {
                return 0m;
            }

            var discount = voucher.DiscountType == "Fixed"
                ? voucher.DiscountValue
                : baseAmount * (voucher.DiscountValue / 100m);

            if (voucher.MaxDiscountAmount.HasValue)
            {
                discount = Math.Min(discount, voucher.MaxDiscountAmount.Value);
            }

            return Math.Max(0m, discount);
        }
    }
}
