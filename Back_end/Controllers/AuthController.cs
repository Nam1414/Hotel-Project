using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, ITokenService tokenService, IConfiguration config)
    {
        _context = context;
        _tokenService = tokenService;
        _config = config;
    }

    // POST /api/Auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // Query đơn giản trước — không Include phức tạp
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });

        if (!user.Status)
            return Unauthorized(new { message = "Tài khoản đã bị khóa" });

        // Query permissions riêng — tránh null chain
        var permissions = await _context.RolePermissions
            .Where(rp => rp.RoleId == user.RoleId)
            .Include(rp => rp.Permission)
            .Select(rp => rp.Permission!.Name)
            .ToListAsync();

        var accessToken = _tokenService.GenerateAccessToken(user, permissions);
        var refreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            accessToken,
            refreshToken,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role?.Name ?? "",
            permissions
        });
    }

    // ⚠️ CHỈ DÙNG ĐỂ LẤY HASH — XÓA SAU KHI DÙNG
    [HttpGet("generate-hash")]
    [AllowAnonymous]
    public IActionResult GenerateHash([FromQuery] string password)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password);
        return Ok(new { password, hash });
    }


    // POST /api/Auth/refresh-token
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
    {
        // Giải mã access token cũ (đã expired)
        var principal = _tokenService.GetPrincipalFromExpiredToken(dto.AccessToken);
        if (principal == null)
            return BadRequest(new { message = "Access token không hợp lệ" });

        var userIdClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return BadRequest(new { message = "Token không có UserId" });

        var user = await _context.Users
            .Include(u => u.Role)
                .ThenInclude(r => r!.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Id == int.Parse(userIdClaim.Value));

        if (user == null || 
            user.RefreshToken != dto.RefreshToken ||
            user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            return Unauthorized(new { message = "Refresh token không hợp lệ hoặc đã hết hạn" });
        }

        var permissions = user.Role?.RolePermissions
            .Select(rp => rp.Permission!.Name)
            .ToList() ?? new List<string>();

        // Cấp token mới
        var newAccessToken = _tokenService.GenerateAccessToken(user, permissions);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        return Ok(new RefreshTokenDto(newAccessToken, newRefreshToken));
    }

    // POST /api/Auth/logout  
    [HttpPost("logout")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim != null)
        {
            var user = await _context.Users.FindAsync(int.Parse(userIdClaim.Value));
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiry = null;
                await _context.SaveChangesAsync();
            }
        }
        return Ok(new { message = "Đăng xuất thành công" });
    }
}
