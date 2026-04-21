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
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        /// <summary>Lấy tất cả booking — chỉ Staff/Admin có quyền MANAGE_BOOKINGS</summary>
        [HttpGet]
        [Authorize]
        [RequirePermission("MANAGE_BOOKINGS")]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookingsAsync();
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving bookings", error = ex.Message });
            }
        }

        /// <summary>Lấy tất cả booking của user đang đăng nhập</summary>
        [HttpGet("my-bookings")]
        [Authorize]
        public async Task<IActionResult> GetMyBookings()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Không xác định được danh tính người dùng" });
                }

                var bookings = await _bookingService.GetBookingsByUserIdAsync(userId);
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi tải danh sách booking", error = ex.Message });
            }
        }

        /// <summary>Lấy chi tiết booking — chỉ Staff/Admin có quyền MANAGE_BOOKINGS</summary>
        [HttpGet("{id:int}")]
        [Authorize]
        [RequirePermission("MANAGE_BOOKINGS")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            try
            {
                var booking = await _bookingService.GetBookingByIdAsync(id);
                if (booking == null) return NotFound(new { message = "Booking not found" });
                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the booking", error = ex.Message });
            }
        }

        /// <summary>Tạo booking — khách hàng và staff đều gọi được (AllowAnonymous)</summary>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto requestDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);
                var newBooking = await _bookingService.CreateBookingAsync(requestDto);
                return CreatedAtAction(nameof(GetBookingById), new { id = newBooking.Id }, newBooking);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Voucher") || ex.Message.Contains("phòng"))
                    return BadRequest(new { message = ex.Message });
                return StatusCode(500, new { message = "An error occurred while creating the booking", error = ex.Message });
            }
        }

        /// <summary>Cập nhật trạng thái booking — chỉ Staff/Admin có quyền MANAGE_BOOKINGS</summary>
        [HttpPut("{id:int}/status")]
        [Authorize]
        [RequirePermission("MANAGE_BOOKINGS")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto statusDto)
        {
            try
            {
                var updatedBooking = await _bookingService.UpdateBookingStatusAsync(id, statusDto.Status);
                if (updatedBooking == null) return NotFound(new { message = "Booking not found" });
                return Ok(updatedBooking);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Đổi phòng — xử lý: phòng chưa dọn, khách trước chưa trả, bảo trì, nâng hạng</summary>
        [HttpPut("{id:int}/reassign-room")]
        [Authorize]
        [RequirePermission("MANAGE_BOOKINGS")]
        public async Task<IActionResult> ReassignRoom(int id, [FromBody] ReassignRoomDto dto)
        {
            try
            {
                var result = await _bookingService.ReassignRoomAsync(id, dto);
                if (result == null) return NotFound(new { message = "Booking not found" });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Tách phòng: khách có 2+ phòng trong 1 booking, muốn trả 1 phòng trước → booking + hóa đơn riêng</summary>
        [HttpPost("{id:int}/split")]
        [Authorize]
        [RequirePermission("MANAGE_BOOKINGS")]
        public async Task<IActionResult> SplitBooking(int id, [FromBody] SplitBookingDto dto)
        {
            try
            {
                var result = await _bookingService.SplitBookingAsync(id, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
