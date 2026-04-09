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
    public class VouchersController : ControllerBase
    {
        private readonly IVoucherService _voucherService;

        public VouchersController(IVoucherService voucherService)
        {
            _voucherService = voucherService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vouchers = await _voucherService.GetAllAsync();
            return Ok(vouchers);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var voucher = await _voucherService.GetByIdAsync(id);
            return voucher == null ? NotFound(new { message = "Voucher không tồn tại" }) : Ok(voucher);
        }

        [HttpGet("{id:int}/validate")]
        public async Task<IActionResult> ValidateForBooking(int id, [FromQuery] decimal bookingAmount)
        {
            var voucher = await _voucherService.ValidateForBookingAsync(id, bookingAmount);
            return voucher == null ? BadRequest(new { message = "Voucher không hợp lệ với booking này" }) : Ok(voucher);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVoucherDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var created = await _voucherService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVoucherDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var updated = await _voucherService.UpdateAsync(id, dto);
                return updated == null ? NotFound(new { message = "Voucher không tồn tại" }) : Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _voucherService.DeleteAsync(id);
            return deleted ? Ok(new { message = "Đã xóa voucher" }) : NotFound(new { message = "Voucher không tồn tại" });
        }
    }
}
