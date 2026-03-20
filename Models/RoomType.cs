using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("RoomTypes")]
public class RoomType
{
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("base_price")]
    public decimal BasePrice { get; set; }

    [Column("max_capacity")]
    public int MaxCapacity { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Room>? Rooms { get; set; }
    public ICollection<RoomImage>? Images { get; set; }
    public ICollection<RoomInventory>? Inventories { get; set; }
}
