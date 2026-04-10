using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Enums;
using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Services
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _context;

        public BookingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BookingResponseDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Include(b => b.Invoice)
                .Include(b => b.Voucher)
                .ToListAsync();

            return bookings.Select(MapToResponseDto);
        }

        public async Task<BookingResponseDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Include(b => b.Invoice)
                .Include(b => b.Voucher)
                .FirstOrDefaultAsync(b => b.Id == id);

            return booking == null ? null : MapToResponseDto(booking);
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto requestDto)
        {
            var bookingCode = "BK" + DateTime.Now.ToString("yyyyMMddHHmmss");
            var bookingAmount = requestDto.Details.Sum(d =>
                Math.Max(1, (decimal)(d.CheckOutDate - d.CheckInDate).TotalDays) * d.PricePerNight);

            if (requestDto.VoucherId.HasValue)
            {
                var voucher = await _context.Vouchers.FirstOrDefaultAsync(v => v.Id == requestDto.VoucherId.Value);
                if (voucher == null)
                {
                    throw new Exception("Voucher không tồn tại");
                }

                var now = DateTime.Now;
                var isValid = voucher.IsActive
                    && voucher.StartDate <= now
                    && voucher.EndDate >= now
                    && bookingAmount >= voucher.MinBookingAmount
                    && (!voucher.UsageLimit.HasValue || voucher.UsageCount < voucher.UsageLimit.Value);

                if (!isValid)
                {
                    throw new Exception("Voucher không hợp lệ hoặc không áp dụng được");
                }
            }
            
            var booking = new Booking
            {
                UserId = requestDto.UserId,
                GuestName = requestDto.GuestName,
                GuestPhone = requestDto.GuestPhone,
                GuestEmail = requestDto.GuestEmail,
                VoucherId = requestDto.VoucherId,
                BookingCode = bookingCode,
                DepositAmount = requestDto.DepositAmount,
                Status = BookingStatus.Pending,
                BookingDetails = requestDto.Details.Select(d => new BookingDetail
                {
                    RoomId = d.RoomId,
                    RoomTypeId = d.RoomTypeId,
                    CheckInDate = d.CheckInDate,
                    CheckOutDate = d.CheckOutDate,
                    PricePerNight = d.PricePerNight
                }).ToList()
            };

            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();

            return MapToResponseDto(booking);
        }

        public async Task<BookingResponseDto?> UpdateBookingStatusAsync(int id, BookingStatus newStatus)
        {
            var booking = await _context.Bookings
                .Include(b => b.BookingDetails)
                .Include(b => b.Invoice)
                .Include(b => b.Voucher)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (booking == null) return null;

            booking.Status = newStatus;
            
            // If checked in or out, logic for handling related entities could go here
            if (newStatus == BookingStatus.CheckedIn && booking.BookingDetails != null)
            {
                var roomIds = booking.BookingDetails.Where(bd => bd.RoomId.HasValue).Select(bd => bd.RoomId!.Value).ToList();
                if (roomIds.Any())
                {
                    var rooms = await _context.Rooms.Where(r => roomIds.Contains(r.Id)).ToListAsync();
                    foreach (var room in rooms)
                    {
                        if (room.Status != "Available" || (room.CleaningStatus != "Clean" && !string.IsNullOrEmpty(room.CleaningStatus))) 
                        {
                            var cleaningDisplay = room.CleaningStatus == "Dirty" ? "chưa dọn dẹp" : (room.CleaningStatus == "Inspecting" ? "đang kiểm tra" : room.CleaningStatus);
                            var statusDisplay = room.Status == "Maintenance" ? "đang bảo trì" : room.Status;
                            throw new Exception($"Phòng {room.RoomNumber} chưa sẵn sàng đón khách. Tình trạng: {(room.Status != "Available" ? statusDisplay : cleaningDisplay)}.");
                        }
                        room.Status = "Occupied";
                    }
                }
            }
            else if (newStatus == BookingStatus.CheckedOut && booking.BookingDetails != null)
            {
                var roomIds = booking.BookingDetails.Where(bd => bd.RoomId.HasValue).Select(bd => bd.RoomId!.Value).ToList();
                if (roomIds.Any())
                {
                    var rooms = await _context.Rooms.Where(r => roomIds.Contains(r.Id)).ToListAsync();
                    foreach (var room in rooms)
                    {
                        room.Status = "Available";
                        room.CleaningStatus = "Dirty";
                    }
                }
            }
            
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();

            return MapToResponseDto(booking);
        }

        private BookingResponseDto MapToResponseDto(Booking booking)
        {
            return new BookingResponseDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                GuestName = booking.GuestName,
                GuestPhone = booking.GuestPhone,
                GuestEmail = booking.GuestEmail,
                BookingCode = booking.BookingCode,
                VoucherId = booking.VoucherId,
                VoucherCode = booking.Voucher?.Code,
                Status = booking.Status,
                InvoiceId = booking.Invoice?.Id,
                DepositAmount = booking.DepositAmount,
                Details = booking.BookingDetails?.Select(d => new BookingDetailResponseDto
                {
                    Id = d.Id,
                    RoomId = d.RoomId,
                    RoomTypeId = d.RoomTypeId,
                    CheckInDate = d.CheckInDate,
                    CheckOutDate = d.CheckOutDate,
                    PricePerNight = d.PricePerNight
                }).ToList() ?? new List<BookingDetailResponseDto>()
            };
        }
    }
}
