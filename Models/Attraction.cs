using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Attractions")]
public class Attraction
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("distance_km")]
    public decimal? DistanceKm { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("map_embed_link")]
    public string? MapEmbedLink { get; set; }

    [Column("latitude", TypeName = "decimal(18, 10)")]
    public decimal? Latitude { get; set; }

    [Column("longitude", TypeName = "decimal(18, 10)")]
    public decimal? Longitude { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
