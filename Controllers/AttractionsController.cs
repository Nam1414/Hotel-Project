using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttractionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AttractionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/Attractions
    // Public — FE dùng để lấy danh sách hiển thị marker trên Google Maps
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var attractions = await _context.Attractions
            .Where(a => a.IsActive)   // Ẩn điểm đã xóa mềm
            .OrderBy(a => a.DistanceKm)
            .Select(a => new AttractionDto
            {
                Id = a.Id,
                Name = a.Name,
                DistanceKm = a.DistanceKm,
                Description = a.Description,
                MapEmbedLink = a.MapEmbedLink,
                Latitude = a.Latitude,
                Longitude = a.Longitude,
                ImageUrl = a.ImageUrl,
                IsActive = a.IsActive,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        return Ok(attractions);
    }

    // GET /api/Attractions/{id}
    // Public — lấy chi tiết 1 điểm tham quan
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var attraction = await _context.Attractions
            .Where(a => a.Id == id && a.IsActive)
            .Select(a => new AttractionDto
            {
                Id = a.Id,
                Name = a.Name,
                DistanceKm = a.DistanceKm,
                Description = a.Description,
                MapEmbedLink = a.MapEmbedLink,
                Latitude = a.Latitude,
                Longitude = a.Longitude,
                ImageUrl = a.ImageUrl,
                IsActive = a.IsActive,
                CreatedAt = a.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (attraction == null)
            return NotFound(new { message = "Không tìm thấy điểm tham quan" });

        return Ok(attraction);
    }

    // POST /api/Attractions
    // Admin only — tạo điểm tham quan mới
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAttractionDto dto)
    {
        var attraction = new Attraction
        {
            Name = dto.Name,
            DistanceKm = dto.DistanceKm,
            Description = dto.Description,
            MapEmbedLink = dto.MapEmbedLink,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            ImageUrl = dto.ImageUrl,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Attractions.Add(attraction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = attraction.Id },
            new AttractionDto
            {
                Id = attraction.Id,
                Name = attraction.Name,
                DistanceKm = attraction.DistanceKm,
                Description = attraction.Description,
                MapEmbedLink = attraction.MapEmbedLink,
                Latitude = attraction.Latitude,
                Longitude = attraction.Longitude,
                ImageUrl = attraction.ImageUrl,
                IsActive = attraction.IsActive,
                CreatedAt = attraction.CreatedAt
            });
    }

    // PUT /api/Attractions/{id}
    // Admin only — cập nhật thông tin điểm tham quan
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAttractionDto dto)
    {
        var attraction = await _context.Attractions.FindAsync(id);
        if (attraction == null)
            return NotFound(new { message = "Không tìm thấy điểm tham quan" });

        attraction.Name = dto.Name;
        attraction.DistanceKm = dto.DistanceKm;
        attraction.Description = dto.Description;
        attraction.MapEmbedLink = dto.MapEmbedLink;
        attraction.Latitude = dto.Latitude;
        attraction.Longitude = dto.Longitude;
        attraction.ImageUrl = dto.ImageUrl;
        attraction.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật thành công" });
    }

    // DELETE /api/Attractions/{id}
    // Admin only — soft delete: chỉ set is_active = false, không xóa DB
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var attraction = await _context.Attractions.FindAsync(id);
        if (attraction == null)
            return NotFound(new { message = "Không tìm thấy điểm tham quan" });

        attraction.IsActive = false;   // Soft delete — ẩn khỏi danh sách
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã ẩn điểm tham quan thành công" });
    }
}