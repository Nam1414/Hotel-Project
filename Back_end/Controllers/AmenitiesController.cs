using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AmenitiesController : ControllerBase
{
    private readonly IAmenityService _amenityService;

    public AmenitiesController(IAmenityService amenityService)
    {
        _amenityService = amenityService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await _amenityService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _amenityService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "Tiện nghi không tồn tại" });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAmenityDto dto)
    {
        var result = await _amenityService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAmenityDto dto)
    {
        var result = await _amenityService.UpdateAsync(id, dto);
        if (result == null) return NotFound(new { message = "Tiện nghi không tồn tại" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _amenityService.DeleteAsync(id);
        if (!result) return NotFound(new { message = "Tiện nghi không tồn tại" });
        return Ok(new { message = "Đã xóa tiện nghi thành công" });
    }

    // LINKING
    [HttpPost("link/{roomTypeId}/{amenityId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddToRoomType(int roomTypeId, int amenityId)
    {
        var result = await _amenityService.AddToRoomTypeAsync(roomTypeId, amenityId);
        if (!result) return BadRequest(new { message = "Không thể liên kết tiện nghi (có thể ID không đúng)" });
        return Ok(new { message = "Đã liên kết tiện nghi thành công" });
    }

    [HttpDelete("link/{roomTypeId}/{amenityId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RemoveFromRoomType(int roomTypeId, int amenityId)
    {
        var result = await _amenityService.RemoveFromRoomTypeAsync(roomTypeId, amenityId);
        if (!result) return BadRequest(new { message = "Không thể gỡ bỏ liên kết" });
        return Ok(new { message = "Đã gỡ bỏ liên kết tiện nghi thành công" });
    }
}
