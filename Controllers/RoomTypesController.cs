using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomTypesController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomTypesController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await _roomService.GetAllRoomTypesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _roomService.GetRoomTypeByIdAsync(id);
        if (result == null) return NotFound(new { message = "Loại phòng không tồn tại" });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateRoomTypeDto dto)
    {
        var result = await _roomService.CreateRoomTypeAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomTypeDto dto)
    {
        var result = await _roomService.UpdateRoomTypeAsync(id, dto);
        if (result == null) return NotFound(new { message = "Loại phòng không tồn tại" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _roomService.DeleteRoomTypeAsync(id);
        if (!result) return NotFound(new { message = "Loại phòng không tồn tại" });
        return Ok(new { message = "Đã vô hiệu hóa loại phòng thành công" });
    }
}
