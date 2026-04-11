using System.Security.Claims;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/Reviews/{targetType}/{targetId}
    [HttpGet("{targetType}/{targetId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetReviews(string targetType, int targetId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.TargetType == targetType && r.TargetId == targetId && r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(
                r.Id,
                r.TargetType,
                r.TargetId,
                r.User != null ? r.User.FullName : (r.GuestName ?? "Khách vô danh"),
                r.Rating,
                r.Comment,
                r.IsApproved,
                r.CreatedAt
            ))
            .ToListAsync();

        var averageRating = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : 0;
        
        return Ok(new {
            AverageRating = averageRating,
            TotalReviews = reviews.Count,
            Reviews = reviews
        });
    }

    // POST /api/Reviews
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest(new { message = "Điểm đánh giá phải từ 1 đến 5." });

        if (dto.TargetType != "Article" && dto.TargetType != "Attraction")
            return BadRequest(new { message = "Loại đối tượng không hợp lệ." });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? userId = null;
        if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var parsedId))
        {
            userId = parsedId;
        }

        var review = new Review
        {
            TargetType = dto.TargetType,
            TargetId = dto.TargetId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            GuestName = dto.GuestName,
            UserId = userId,
            IsApproved = false // Admin phải duyệt
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đã gửi đánh giá thành công. Vui lòng chờ kiểm duyệt." });
    }

    // --- ADMIN METHODS ---

    // GET /api/Reviews/admin
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllForAdmin([FromQuery] bool? isApproved)
    {
        var query = _context.Reviews.Include(r => r.User).AsQueryable();
        
        if (isApproved.HasValue)
        {
            query = query.Where(r => r.IsApproved == isApproved.Value);
        }

        var reviews = await query
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(
                r.Id,
                r.TargetType,
                r.TargetId,
                r.User != null ? r.User.FullName : (r.GuestName ?? "Khách vô danh"),
                r.Rating,
                r.Comment,
                r.IsApproved,
                r.CreatedAt
            ))
            .ToListAsync();

        return Ok(reviews);
    }

    // PUT /api/Reviews/admin/{id}/approve
    [HttpPut("admin/{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        review.IsApproved = true;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã duyệt bình luận" });
    }

    // DELETE /api/Reviews/admin/{id}
    [HttpDelete("admin/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa bình luận" });
    }
}
