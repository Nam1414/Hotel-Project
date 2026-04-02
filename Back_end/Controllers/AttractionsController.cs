using CloudinaryDotNet;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttractionsController : ControllerBase
{
    private readonly IAttractionService _attractionService;
    private readonly AppDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;

    public AttractionsController(
        IAttractionService attractionService,
        AppDbContext context,
        ICloudinaryService cloudinaryService)
    {
        _attractionService = attractionService;
        _context = context;
        _cloudinaryService = cloudinaryService;
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

    [HttpPost("{id}/image")]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(10_000_000)]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Vui long chon anh hop le" });
        }

        var attraction = await _context.Attractions.FirstOrDefaultAsync(a => a.Id == id);
        if (attraction == null)
        {
            return NotFound(new { message = "Diem tham quan khong ton tai" });
        }

        var imageTransformation = new Transformation()
            .Width(1600)
            .Height(900)
            .Crop("fill")
            .Gravity("auto")
            .Quality("auto")
            .FetchFormat("auto");

        var (url, _) = await _cloudinaryService.UploadImageAsync(
            file,
            $"HotelManagement/Attractions/{id}",
            imageTransformation);

        attraction.ImageUrl = url;
        attraction.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Cap nhat anh diem tham quan thanh cong",
            imageUrl = attraction.ImageUrl,
        });
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
