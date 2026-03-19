using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Rooms")]
public class Room
{
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("room_number")]
    public string RoomNumber { get; set; } = string.Empty;

    [Column("room_type_id")]
    public int RoomTypeId { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Available"; // Available, Occupied, Maintenance, Dirty

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public RoomType? RoomType { get; set; }
}
