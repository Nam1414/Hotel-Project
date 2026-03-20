using System.Security.Claims;
using HotelManagementAPI.Data;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserProfileController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ICloudinaryService _cloudinaryService;

    public UserProfileController(AppDbContext context, ICloudinaryService cloudinaryService)
    {
        _context = context;
        _cloudinaryService = cloudinaryService;
    }

    // GET /api/UserProfile
    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        return Ok(new
        {
            user.FullName,
            user.Email,
            user.Phone,
            user.AvatarUrl,
            Role = user.Role?.Name
        });
    }

    // POST /api/UserProfile/avatar
    [HttpPost("avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        // 1. Xóa ảnh cũ trên Cloudinary nếu có
        if (!string.IsNullOrEmpty(user.AvatarPublicId))
        {
            await _cloudinaryService.DeleteImageAsync(user.AvatarPublicId);
        }

        // 2. Upload ảnh mới (Chuẩn hóa 500x500, nhận diện khuôn mặt)
        var avatarTransformation = new CloudinaryDotNet.Transformation()
            .Width(500).Height(500).Crop("fill").Gravity("face").Quality("auto");

        var (url, publicId) = await _cloudinaryService.UploadImageAsync(
            file, 
            "HotelManagement/Avatars", 
            avatarTransformation);

        // 3. Lưu vào DB
        user.AvatarUrl = url;
        user.AvatarPublicId = publicId;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật ảnh đại diện thành công", url });
    }
}
