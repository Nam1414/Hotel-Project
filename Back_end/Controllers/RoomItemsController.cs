using HotelManagementAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomItemsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.RoomItems.Include(ri => ri.Room).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _context.RoomItems.Include(ri => ri.Room).FirstOrDefaultAsync(ri => ri.Id == id);
        if (item == null) return NotFound();
        return Ok(item);
    }
}
