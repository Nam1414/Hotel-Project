using System.Linq;
using System.Threading.Tasks;
using HotelManagementAPI.Data;
using HotelManagementAPI.DTOs;
using HotelManagementAPI.Middleware;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuditLogService _auditLogService;

    public ServicesController(AppDbContext context, IAuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategories()
    {
        var data = await _context.ServiceCategories
            .OrderBy(c => c.Name)
            .Select(c => new ServiceCategoryDto(c.Id, c.Name))
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetServices()
    {
        var data = await _context.Services
            .OrderBy(s => s.Name)
            .Select(s => new ServiceDto(
                s.Id,
                s.CategoryId,
                s.Name,
                s.Price,
                s.Unit
            ))
            .ToListAsync();

        return Ok(data);
    }
}
