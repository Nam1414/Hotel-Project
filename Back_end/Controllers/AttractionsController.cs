using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttractionsController : ControllerBase
{
    private readonly IAttractionService _attractionService;

    public AttractionsController(IAttractionService attractionService)
    {
        _attractionService = attractionService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await _attractionService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _attractionService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "Điểm tham quan không tồn tại" });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAttractionDto dto)
    {
        var result = await _attractionService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAttractionDto dto)
    {
        var result = await _attractionService.UpdateAsync(id, dto);
        if (result == null) return NotFound(new { message = "Điểm tham quan không tồn tại" });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _attractionService.DeleteAsync(id);
        if (!result) return NotFound(new { message = "Điểm tham quan không tồn tại" });
        return Ok(new { message = "Đã xóa điểm tham quan thành công" });
    }
}
