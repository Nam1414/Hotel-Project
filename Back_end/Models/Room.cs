using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Rooms")]
public class Room
{
    [Column("id")]
    public int Id { get; set; }

    [Column("room_type_id")]
    public int RoomTypeId { get; set; }

    [Required]
    [Column("room_number")]
    public string RoomNumber { get; set; } = string.Empty;

    [Column("floor")]
    public int? Floor { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Available";

    [Column("cleaning_status")]
    public string? CleaningStatus { get; set; }

    [Column("extension_number")]
    public string? ExtensionNumber { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    // Navigation
    public RoomType? RoomType { get; set; }
}