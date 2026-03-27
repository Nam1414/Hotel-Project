using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserManagementController : ControllerBase
{
    private readonly IUserManagementService _userService;

    public UserManagementController(IUserManagementService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _userService.GetAllUsersAsync();
        return Ok(result);
    }

    // GET /api/UserManagement/filter?phone=...&email=...&status=true/false
    [HttpGet("filter")]
    public async Task<IActionResult> Filter(
        [FromQuery] string? phone,
        [FromQuery] string? email,
        [FromQuery] bool? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var (data, total) = await _userService.FilterUsersPagedAsync(phone, email, status, page, pageSize);
        return Ok(new FilterUsersResponseDto(data, total, page, pageSize));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _userService.GetUserByIdAsync(id);
        if (result == null) return NotFound(new { message = "Người dùng không tồn tại" });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        var result = await _userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var result = await _userService.UpdateUserAsync(id, dto);
        if (result == null) return NotFound(new { message = "Người dùng không tồn tại" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result) return NotFound(new { message = "Người dùng không tồn tại" });
        return Ok(new { message = "Đã xóa người dùng thành công" });
    }

    [HttpPut("{id}/change-role")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
    {
        var result = await _userService.ChangeUserRoleAsync(id, dto.RoleId);
        if (!result) return BadRequest(new { message = "Không thể thay đổi quyền (có thể ID người dùng hoặc ID quyền không đúng)" });
        return Ok(new { message = "Đã thay đổi quyền thành công" });
    }
}
