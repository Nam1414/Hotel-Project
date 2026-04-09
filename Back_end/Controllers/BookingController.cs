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
    [RequirePermission("MANAGE_BOOKINGS")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
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

        [HttpGet("{id}")]
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

        [HttpPost]
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
                return StatusCode(500, new { message = "An error occurred while creating the booking", error = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
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
                return StatusCode(500, new { message = "An error occurred while updating the booking status", error = ex.Message });
            }
        }
    }
}
