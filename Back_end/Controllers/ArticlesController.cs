using System.Security.Claims;
using System.Text.Json;
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
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ISlugService _slugService;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly IAuditLogService _auditLogService;

    public ArticlesController(
        AppDbContext context,
        ISlugService slugService,
        ICloudinaryService cloudinaryService,
        IAuditLogService auditLogService)
    {
        _context = context;
        _slugService = slugService;
        _cloudinaryService = cloudinaryService;
        _auditLogService = auditLogService;
    }

    // GET /api/Articles ← Public, có filter theo category + phân trang
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId, [FromQuery] int page = 1)
    {
        var query = _context.Articles
            .Where(a => a.IsActive == true);

        if (categoryId.HasValue)
            query = query.Where(a => a.CategoryId == categoryId.Value);

        var totalCount = await query.CountAsync();

        var articles = await query
            .OrderByDescending(a => a.PublishedAt)
            .Skip((page - 1) * 10)
            .Take(10)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.ThumbnailUrl,
                a.PublishedAt,
                Author = a.Author != null ? a.Author.FullName : null,
                Category = a.Category != null ? a.Category.Name : null
            })
            .ToListAsync();

        return Ok(new
        {
            data       = articles,
            page       = page,
            totalCount = totalCount,
            totalPages = (int)Math.Ceiling(totalCount / 10.0)
        });
    }

    // GET /api/Articles/{slug} ← Public, lấy bài viết theo slug
    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _context.Articles
            .Where(a => a.Slug == slug && a.IsActive == true)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Content,
                a.ThumbnailUrl,
                a.PublishedAt,
                a.UpdatedAt,
                Author   = a.Author != null ? a.Author.FullName : null,
                Category = a.Category != null
                    ? new { a.Category.Id, a.Category.Name }
                    : null
            })
            .FirstOrDefaultAsync();

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        return Ok(article);
    }

    // GET /api/Articles/{id:int} ← Admin/Editor, lấy chi tiết theo ID
    [HttpGet("{id:int}")]
    [Authorize(Policy = "MANAGE_CONTENT")]
    public async Task<IActionResult> GetById(int id)
    {
        var article = await _context.Articles
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Content,
                a.ThumbnailUrl,
                a.ThumbnailPublicId,
                a.PublishedAt,
                a.UpdatedAt,
                a.IsActive,
                a.CategoryId,
                a.AuthorId,
                Author   = a.Author != null
                    ? new { a.Author.Id, a.Author.FullName, a.Author.Email }
                    : null,
                Category = a.Category != null
                    ? new { a.Category.Id, a.Category.Name, a.Category.Slug }
                    : null
                // ← KHÔNG include Category.Articles → ngắt circular
            })
            .FirstOrDefaultAsync();

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        return Ok(article);
    }

    // POST /api/Articles ← Tạo bài viết mới
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateArticleDto dto)
    {
        var authorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (authorIdClaim == null) return Unauthorized();

        var categoryExists = await _context.ArticleCategories
            .AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);
        if (!categoryExists)
            return BadRequest(new { message = "Danh mục không tồn tại" });

        var slug = await _slugService.GenerateUniqueSlugAsync(dto.Title);

        var article = new Article
        {
            Title       = dto.Title,
            Slug        = slug,
            Content     = dto.Content,
            CategoryId  = dto.CategoryId,
            AuthorId    = int.Parse(authorIdClaim),
            PublishedAt = DateTime.UtcNow,
            UpdatedAt   = DateTime.UtcNow,
            IsActive    = true
        };

        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            tableName: "Articles",
            action:    "CREATE",
            recordId:  article.Id,
            oldValues: null,
            newValues: JsonSerializer.Serialize(new
            {
                article.Id,
                article.Title,
                article.CategoryId,
                article.AuthorId
            }),
            userId:   int.Parse(authorIdClaim),
            userName: User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown"
        );

        return CreatedAtAction(nameof(GetById), new { id = article.Id }, new
        {
            article.Id,
            article.Title,
            article.Slug
        });
    }

    // PUT /api/Articles/{id} ← Cập nhật bài viết
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateArticleDto dto)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive == true);

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        var oldValues = JsonSerializer.Serialize(new
        {
            article.Title,
            article.Content,
            article.CategoryId
        });

        if (article.Title != dto.Title)
        {
            article.Slug  = await _slugService.GenerateUniqueSlugAsync(dto.Title, id);
            article.Title = dto.Title;
        }

        article.Content    = dto.Content;
        article.CategoryId = dto.CategoryId;
        article.UpdatedAt  = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        await _auditLogService.LogAsync(
            tableName: "Articles",
            action:    "UPDATE",
            recordId:  id,
            oldValues: oldValues,
            newValues: JsonSerializer.Serialize(new
            {
                article.Title,
                article.Content,
                article.CategoryId
            }),
            userId:   userId,
            userName: User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown"
        );

        // ← Trả về DTO thay vì raw entity tránh circular
        return Ok(new
        {
            article.Id,
            article.Title,
            article.Slug,
            article.Content,
            article.CategoryId,
            article.UpdatedAt,
            article.IsActive
        });
    }

    // DELETE /api/Articles/{id} ← Soft delete
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive == true);

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        var deletedInfo = JsonSerializer.Serialize(new
        {
            article.Id,
            article.Title,
            article.CategoryId,
            article.AuthorId
        });

        article.IsActive  = false;
        article.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            tableName: "Articles",
            action:    "DELETE",
            recordId:  article.Id,
            oldValues: deletedInfo,
            newValues: null,
            userId:   int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0"),
            userName: User.FindFirst(ClaimTypes.Name)?.Value ?? "Unknown"
        );

        return Ok(new { message = "Đã vô hiệu hóa bài viết" });
    }

    // POST /api/Articles/{id}/thumbnail ← Upload ảnh bìa
    [HttpPost("{id}/thumbnail")]
    [Authorize]
    public async Task<IActionResult> UploadThumbnail(int id, IFormFile file)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive == true);

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "File không hợp lệ" });

        if (!string.IsNullOrEmpty(article.ThumbnailPublicId))
            await _cloudinaryService.DeleteImageAsync(article.ThumbnailPublicId);

        var (url, publicId) = await _cloudinaryService.UploadImageAsync(file, "HotelManagement/Articles");

        article.ThumbnailUrl      = url;
        article.ThumbnailPublicId = publicId;
        article.UpdatedAt         = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message      = "Upload ảnh bìa thành công",
            thumbnailUrl = article.ThumbnailUrl
        });
    }

    // PATCH /api/Articles/{id}/toggle-status ← Bật/tắt hiển thị
    [HttpPatch("{id}/toggle-status")]
    [Authorize(Policy = "MANAGE_CONTENT")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        article.IsActive  = !article.IsActive;
        article.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message  = article.IsActive ? "Đã hiện bài viết" : "Đã ẩn bài viết",
            isActive = article.IsActive
        });
    }
}