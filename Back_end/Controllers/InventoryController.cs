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

    // GET /api/Inventory?startDate=2026-04-24&endDate=2026-04-30
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetInventory(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate,
        [FromQuery] int? roomTypeId)
    {
        if (startDate == default) startDate = DateTime.Today;
        if (endDate   == default) endDate   = DateTime.Today.AddDays(30);

        var result = await _inventoryService.GetInventoryAsync(startDate, endDate, roomTypeId);
        return Ok(result);
    }

    // GET /api/Inventory/5
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _inventoryService.GetByIdAsync(id);
        if (result == null)
            return NotFound(new { message = "Không tìm thấy dữ liệu phòng trống" });
        return Ok(result);
    }

    // POST /api/Inventory — Tạo mới hoặc cập nhật nếu đã tồn tại (upsert)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Upsert([FromBody] InventoryUpdateDto dto)
    {
        var result = await _inventoryService.UpsertInventoryAsync(dto);
        return Ok(result);
    }

    // PUT /api/Inventory/5 — Cập nhật theo id
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] InventoryUpdateDto dto)
    {
        // Validate availableRooms không được vượt quá totalRooms
        if (dto.AvailableRooms > dto.TotalRooms)
            return BadRequest(new { message = "Số phòng trống không được lớn hơn tổng số phòng" });

        var result = await _inventoryService.UpdateByIdAsync(id, dto);

        if (result == null)
        {
            // Kiểm tra do not found hay duplicate
            var exists = await _inventoryService.GetByIdAsync(id);
            if (exists == null)
                return NotFound(new { message = "Không tìm thấy dữ liệu phòng trống" });

            return Conflict(new { message = "Đã tồn tại dữ liệu phòng trống cho loại phòng và ngày này" });
        }

        return Ok(result);
    }

    // DELETE /api/Inventory/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _inventoryService.DeleteByIdAsync(id);
        if (!result)
            return NotFound(new { message = "Không tìm thấy dữ liệu phòng trống" });
        return Ok(new { message = "Xóa dữ liệu phòng trống thành công" });
    }

    // POST /api/Inventory/5/clone — Nhân bản sang ngày hôm sau
    [HttpPost("{id}/clone")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Clone(int id)
    {
        var result = await _inventoryService.CloneAsync(id);
        if (result == null)
            return BadRequest(new { message = "Không thể nhân bản: bản ghi không tồn tại hoặc ngày kế tiếp đã có dữ liệu" });
        return Ok(result);
    }

    // PUT /api/Inventory/bulk-price — Cập nhật giá hàng loạt
    [HttpPut("bulk-price")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BulkUpdatePrice([FromBody] BulkUpdatePriceDto dto)
    {
        var result = await _inventoryService.BulkUpdatePriceAsync(dto);
        if (!result)
            return NotFound(new { message = "Không tìm thấy bản ghi trong khoảng thời gian này" });
        return Ok(new { message = "Cập nhật số phòng trống thành công" });
    }
}