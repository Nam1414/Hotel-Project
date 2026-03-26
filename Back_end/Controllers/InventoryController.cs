using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetInventory([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int? roomTypeId)
    {
        if (startDate == default) startDate = DateTime.Today;
        if (endDate == default) endDate = startDate.AddDays(30);

        var result = await _inventoryService.GetInventoryAsync(startDate, endDate, roomTypeId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _inventoryService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "Không tìm thấy thông tin kho phòng" });
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] InventoryUpdateDto dto)
    {
        var result = await _inventoryService.UpdateByIdAsync(id, dto);
        if (result == null) return NotFound(new { message = "Không tìm thấy thông tin kho phòng" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _inventoryService.DeleteByIdAsync(id);
        if (!result) return NotFound(new { message = "Không tìm thấy thông tin kho phòng" });
        return Ok(new { message = "Đã xóa bản ghi kho phòng thành công" });
    }

    [HttpPost("{id}/clone")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Clone(int id)
    {
        var result = await _inventoryService.CloneAsync(id);
        if (result == null) return NotFound(new { message = "Không tìm thấy bản ghi gốc để nhân bản" });
        return Ok(result);
    }
}
