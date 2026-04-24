using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagementAPI.Data;

namespace HotelManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DbFixController : ControllerBase
{
    private readonly AppDbContext _context;

    public DbFixController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("fix-notifications")]
    public async Task<IActionResult> FixNotifications()
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(@"
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'title')
                ALTER TABLE [dbo].[Notifications] ADD [title] [nvarchar](255) NULL;
                
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'content')
                ALTER TABLE [dbo].[Notifications] ADD [content] [nvarchar](max) NULL;
                
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND name = 'reference_link')
                ALTER TABLE [dbo].[Notifications] ADD [reference_link] [varchar](255) NULL;
            ");
            
            await _context.Database.ExecuteSqlRawAsync(@"
                UPDATE [dbo].[Notifications] SET [title] = 'System' WHERE [title] IS NULL;
                UPDATE [dbo].[Notifications] SET [content] = '' WHERE [content] IS NULL;
            ");
            
            return Ok(new { message = "Database fixed successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("seed-demo-presentation")]
    public async Task<IActionResult> SeedDemoPresentation()
    {
        try
        {
            var summary = await DemoPresentationSeeder.SeedAsync(HttpContext.RequestServices);
            return Ok(new
            {
                message = "Demo presentation data seeded successfully",
                summary
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
