using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticleCategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ArticleCategoriesController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/ArticleCategories ← Public
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.ArticleCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.CreatedAt,
                ArticleCount = c.Articles.Count(a => a.IsActive)
            })
            .ToListAsync();

        return Ok(categories);
    }

    // GET /api/ArticleCategories/{id} ← Public
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _context.ArticleCategories
            .Where(c => c.Id == id && c.IsActive)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.CreatedAt,
                ArticleCount = c.Articles.Count(a => a.IsActive)
            })
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound(new { message = "Danh mục không tồn tại" });

        return Ok(category);
    }

    // POST /api/ArticleCategories ← Admin
    [HttpPost]
    [Authorize(Policy = "MANAGE_CONTENT")]
    public async Task<IActionResult> Create([FromBody] CreateArticleCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Tên danh mục không được để trống" });

        var slug = GenerateSlug(dto.Name);

        // Kiểm tra slug trùng
        bool slugExists = await _context.ArticleCategories
            .AnyAsync(c => c.Slug == slug && c.IsActive);
        if (slugExists)
            return BadRequest(new { message = "Danh mục này đã tồn tại" });

        var category = new ArticleCategory
        {
            Name = dto.Name,
            Slug = slug,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.ArticleCategories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    // PUT /api/ArticleCategories/{id} ← Admin
    [HttpPut("{id}")]
    [Authorize(Policy = "MANAGE_CONTENT")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateArticleCategoryDto dto)
    {
        var category = await _context.ArticleCategories
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (category == null)
            return NotFound(new { message = "Danh mục không tồn tại" });

        category.Name = dto.Name;
        category.Slug = GenerateSlug(dto.Name);
        await _context.SaveChangesAsync();

        return Ok(category);
    }

    // DELETE /api/ArticleCategories/{id} ← SOFT DELETE
    [HttpDelete("{id}")]
    [Authorize(Policy = "MANAGE_CONTENT")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.ArticleCategories
            .Include(c => c.Articles)
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (category == null)
            return NotFound(new { message = "Danh mục không tồn tại hoặc đã bị xóa" });

        int activeArticles = category.Articles.Count(a => a.IsActive);
        if (activeArticles > 0)
            return BadRequest(new { 
                message = $"Danh mục đang có {activeArticles} bài viết, không thể xóa" 
            });

        // SOFT DELETE
        category.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã vô hiệu hóa danh mục thành công" });
    }

    // Helper
    private static string GenerateSlug(string name)
    {
        return name.ToLower()
            .Replace("đ", "d").Replace("Đ", "d")
            .Replace("à", "a").Replace("á", "a").Replace("ã", "a")
            .Replace("â", "a").Replace("ă", "a")
            .Replace("è", "e").Replace("é", "e").Replace("ê", "e")
            .Replace("ì", "i").Replace("í", "i")
            .Replace("ò", "o").Replace("ó", "o").Replace("ô", "o").Replace("ơ", "o")
            .Replace("ù", "u").Replace("ú", "u").Replace("ư", "u")
            .Replace("ý", "y")
            .Replace(" ", "-")
            .Trim();
    }
}