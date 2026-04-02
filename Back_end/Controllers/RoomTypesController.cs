using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomTypesController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly AppDbContext _context;

    public RoomTypesController(IRoomService roomService, ICloudinaryService cloudinaryService, AppDbContext context)
    {
        _roomService = roomService;
        _cloudinaryService = cloudinaryService;
        _context = context;
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

    // GALLERY MANAGEMENT
    [HttpPost("{id}/images")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file, [FromQuery] bool isPrimary = false)
    {
        var rt = await _context.RoomTypes.FindAsync(id);
        if (rt == null) return NotFound();

        var (url, publicId) = await _cloudinaryService.UploadImageAsync(file, $"HotelManagement/RoomTypes/{id}");

        var roomImage = new RoomImage
        {
            RoomTypeId = id,
            ImageUrl = url,
            PublicId = publicId,
            IsPrimary = isPrimary
        };

        if (isPrimary)
        {
            // Reset other primary images
            var primaries = await _context.RoomImages.Where(img => img.RoomTypeId == id && img.IsPrimary == true).ToListAsync();
            foreach (var p in primaries) p.IsPrimary = false;
        }

        _context.RoomImages.Add(roomImage);
        await _context.SaveChangesAsync();

        return Ok(roomImage);
    }

    [HttpDelete("images/{imageId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteImage(int imageId)
    {
        var img = await _context.RoomImages.FindAsync(imageId);
        if (img == null) return NotFound();

        await _cloudinaryService.DeleteImageAsync(img.PublicId!);

        _context.RoomImages.Remove(img);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã xóa ảnh thành công" });
    }

    [HttpPatch("images/{imageId}/set-primary")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SetPrimary(int imageId)
    {
        var img = await _context.RoomImages.FindAsync(imageId);
        if (img == null) return NotFound();

        // Reset all primary for this RoomType
        var primaries = await _context.RoomImages.Where(i => i.RoomTypeId == img.RoomTypeId && i.IsPrimary == true).ToListAsync();
        foreach (var p in primaries) p.IsPrimary = false;

        img.IsPrimary = true;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã đặt ảnh làm ảnh chính" });
    }
}
