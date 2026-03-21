using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Tất cả endpoint cần đăng nhập
public class RolesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RolesController(AppDbContext context)
    {
        _context = context;
    }

    // POST /api/Roles/assign-permission  ← Chỉ Admin
    [HttpPost("assign-permission")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignPermission([FromBody] AssignPermissionDto dto)
    {
        // Kiểm tra Role tồn tại
        var roleExists = await _context.Roles.AnyAsync(r => r.Id == dto.RoleId);
        if (!roleExists) return NotFound(new { message = "Role không tồn tại" });

        // Kiểm tra Permission tồn tại
        var permissionExists = await _context.Permissions.AnyAsync(p => p.Id == dto.PermissionId);
        if (!permissionExists) return NotFound(new { message = "Permission không tồn tại" });

        // Kiểm tra đã gán chưa
        var existing = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => 
                rp.RoleId == dto.RoleId && 
                rp.PermissionId == dto.PermissionId);

        if (existing != null)
            return BadRequest(new { message = "Permission đã được gán cho Role này rồi" });

        // Gán permission
        var rolePermission = new RolePermission
        {
            RoleId = dto.RoleId,
            PermissionId = dto.PermissionId
        };

        _context.RolePermissions.Add(rolePermission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Gán permission thành công" });
    }

    // GET /api/Roles/my-permissions  ← Bất kỳ user đã đăng nhập
    [HttpGet("my-permissions")]
    public IActionResult GetMyPermissions()
    {
        // Lấy permissions từ JWT Token claims (không query DB)
        var permissions = User.Claims
            .Where(c => c.Type == "permission")
            .Select(c => c.Value)
            .ToList();

        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Ok(new
        {
            userId = int.Parse(userId ?? "0"),
            role,
            permissions
        });
    }
}
