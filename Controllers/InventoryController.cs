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

    [HttpPost("update")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateInventory([FromBody] InventoryUpdateDto dto)
    {
        var result = await _inventoryService.UpdateInventoryAsync(dto);
        return Ok(result);
    }

    [HttpPost("initialize")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> InitializeInventory([FromQuery] int roomTypeId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        if (startDate == default) startDate = DateTime.Today;
        if (endDate == default) endDate = startDate.AddDays(30);

        var result = await _inventoryService.InitializeInventoryAsync(roomTypeId, startDate, endDate);
        if (!result) return BadRequest(new { message = "Khởi tạo kho phòng thất bại. Vui lòng kiểm tra lại loại phòng." });
        
        return Ok(new { message = "Khởi tạo kho phòng thành công" });
    }
}
