using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Room_Types")]
public class RoomType
{
    [Column("id")]
    public int Id { get; set; }

    [Column("public_id")]
    public string? PublicId { get; set; } = string.Empty;

    [Required]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("base_price")]
    public decimal BasePrice { get; set; }

    [Column("capacity_adults")]
    public int? CapacityAdults { get; set; }

    [Column("capacity_children")]
    public int? CapacityChildren { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("size_sqm")]
    public int? SizeSqm { get; set; }

    [Column("bed_type")]
    public string? BedType { get; set; }

    [Column("view_type")]
    public string? ViewType { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("slug")]
    public string? Slug { get; set; }

    [Column("content")]
    public string? Content { get; set; }

    // ← KHÔNG CÓ: CreatedAt, UpdatedAt, MaxCapacity

    // Navigation
    public ICollection<Room>? Rooms { get; set; }
    public ICollection<RoomImage>? Images { get; set; }
    public ICollection<RoomInventory>? Inventories { get; set; }
    public ICollection<Amenity>? Amenities { get; set; }
}
