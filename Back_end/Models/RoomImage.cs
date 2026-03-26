using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Room_Images")]
public class RoomImage
{
    [Column("id")]
    public int Id { get; set; }

    [Column("room_type_id")]
    public int RoomTypeId { get; set; }

    [Column("image_url")]
    public string ImageUrl { get; set; } = string.Empty;

    [Column("public_id")]
    public string? PublicId { get; set; }

    [Column("is_primary")]
    public bool IsPrimary { get; set; }

    // Navigation
    public RoomType? RoomType { get; set; }
}
