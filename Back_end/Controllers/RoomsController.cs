using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? roomTypeId)
    {
        var result = await _roomService.GetAllRoomsAsync(roomTypeId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _roomService.GetRoomByIdAsync(id);
        if (result == null) return NotFound(new { message = "Phòng không tồn tại" });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateRoomDto dto)
    {
        var result = await _roomService.CreateRoomAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomDto dto)
    {
        var result = await _roomService.UpdateRoomAsync(id, dto);
        if (result == null) return NotFound(new { message = "Phòng không tồn tại" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _roomService.DeleteRoomAsync(id);
        if (!result) return NotFound(new { message = "Phòng không tồn tại" });
        return Ok(new { message = "Đã vô hiệu hóa phòng thành công" });
    }
}
