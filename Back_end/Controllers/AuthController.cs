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
    private readonly IAuditLogService _auditLogService;

    public AuthController(AppDbContext context, ITokenService tokenService, IConfiguration config, IAuditLogService auditLogService)
    {
        _context = context;
        _tokenService = tokenService;
        _config = config;
        _auditLogService = auditLogService;
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

        SetRefreshTokenCookie(refreshToken);

        await _auditLogService.LogAsync("LOGIN", nameof(User), new { user.Id, user.Email }, null, null, $"Đăng nhập thành công: {user.Email}");

        return Ok(new LoginResponseDto(
            user.Id,
            accessToken,
            user.FullName,
            user.Email,
            user.Role?.Name ?? "",
            permissions
        ));
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
        // Lấy refresh token từ cookie
        var refreshToken = Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { message = "Không tìm thấy Refresh token trong cookie" });

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
            user.RefreshToken != refreshToken ||
            user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            return Unauthorized(new { message = "Refresh token không hợp lệ hoặc đã hết hạn" });
        }

        await _auditLogService.LogAsync("REFRESH_TOKEN", nameof(User), new { user.Id, user.Email }, null, null, "Gia hạn phiên đăng nhập.");

        var permissions = user.Role?.RolePermissions
            .Select(rp => rp.Permission!.Name)
            .ToList() ?? new List<string>();

        // Cấp token mới
        var newAccessToken = _tokenService.GenerateAccessToken(user, permissions);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        SetRefreshTokenCookie(newRefreshToken);

        return Ok(new RefreshTokenDto(newAccessToken));
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

                Response.Cookies.Delete("refreshToken");
                await _auditLogService.LogAsync("LOGOUT", nameof(User), new { user.Id, user.Email }, null, null, $"Đăng xuất: {user.Email}");
            }
        }
        return Ok(new { message = "Đăng xuất thành công" });
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps, // Tự động bật Secure nếu dùng HTTPS
            SameSite = SameSiteMode.Lax, // Lax sẽ dễ dùng hơn cho FE local
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}
