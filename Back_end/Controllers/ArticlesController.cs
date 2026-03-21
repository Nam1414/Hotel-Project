using System.Runtime.CompilerServices;
using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
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
    private readonly Cloudinary _cloudinary;

    public ArticlesController(
        AppDbContext context, 
        ISlugService slugService, 
        Cloudinary cloudinary)
    {
        _context = context;
        _slugService = slugService;
        _cloudinary = cloudinary;
    }

    // GET /api/Articles  ← Public
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId, [FromQuery] int page = 1)
    {
        var query = _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .Where(a => a.IsActive);

        if (categoryId.HasValue)
            query = query.Where(a => a.CategoryId == categoryId.Value);

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
                PublishedAt = a.PublishedAt,
                Author = a.Author!.FullName,
                Category = a.Category!.Name
            })
            .ToListAsync();

        return Ok(articles);
    }

    // GET /api/Articles/{slug}  ← Public, AllowAnonymous (Google Crawler index được)
    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .FirstOrDefaultAsync(a => a.Slug == slug && a.IsActive);

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        return Ok(new
        {
            article.Id,
            article.Title,
            article.Slug,
            article.Content,
            article.ThumbnailUrl,
            PublishedAt = article.PublishedAt,
            UpdatedAt = article.UpdatedAt,
            Author = article.Author!.FullName,
            Category = new { article.Category!.Id, article.Category.Name }
        });
    }

    // POST /api/Articles  ← Authorize, tự động gán AuthorId từ Token
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateArticleDto dto)
    {
        // Lấy AuthorId từ JWT Token — KHÔNG nhận từ client
        var authorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (authorIdClaim == null) return Unauthorized();

        // Kiểm tra Category
        var categoryExists = await _context.ArticleCategories
            .AnyAsync(c => c.Id == dto.CategoryId && c.IsActive);
        if (!categoryExists)
            return BadRequest(new { message = "Danh mục không tồn tại" });

        // Auto-generate Slug từ Title
        var slug = await _slugService.GenerateUniqueSlugAsync(dto.Title);

        var article = new Article
        {
            Title = dto.Title,
            Slug = slug,
            Content = dto.Content,
            CategoryId = dto.CategoryId,
            AuthorId = int.Parse(authorIdClaim), // Lấy từ Token
            PublishedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBySlug), new { slug = article.Slug }, new
        {
            article.Id,
            article.Title,
            article.Slug
        });
    }

    // PUT /api/Articles/{id}  ← Authorize
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateArticleDto dto)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        // Tự động cập nhật slug nếu title thay đổi
        if (article.Title != dto.Title)
        {
            article.Slug = await _slugService.GenerateUniqueSlugAsync(dto.Title, id);
            article.Title = dto.Title;
        }

        article.Content = dto.Content;
        article.CategoryId = dto.CategoryId;
        article.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(article);
    }

    // DELETE /api/Articles/{id}  ← SOFT DELETE
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        article.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã vô hiệu hóa bài viết" });
    }

    // POST /api/Articles/{id}/thumbnail  ← Upload ảnh bìa lên Cloudinary
    [HttpPost("{id}/thumbnail")]
    [Authorize]
    public async Task<IActionResult> UploadThumbnail(int id, IFormFile file)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(a => a.Id == id && a.IsActive);

        if (article == null)
            return NotFound(new { message = "Bài viết không tồn tại" });

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "File không hợp lệ" });

        // Bước 1: Xóa ảnh cũ trên Cloudinary (dọn rác tự động)
        if (!string.IsNullOrEmpty(article.ThumbnailPublicId))
        {
            await _cloudinary.DestroyAsync(
                new DeletionParams(article.ThumbnailPublicId));
        }

        // Bước 2: Upload ảnh mới (in-memory, không lưu file tạm)
        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "HotelManagement/Articles",
            Transformation = new Transformation()
                .Width(1200).Height(630)
                .Crop("fill")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
            return BadRequest(new { message = uploadResult.Error.Message });

        // Bước 3: Lưu URL và PublicId mới
        article.ThumbnailUrl = uploadResult.SecureUrl.ToString();
        article.ThumbnailPublicId = uploadResult.PublicId;
        article.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Upload ảnh bìa thành công",
            thumbnailUrl = article.ThumbnailUrl
        });
    }
}
