using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;


[Table("Equipments")]
public class Equipment
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string ItemCode { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = null!;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Unit { get; set; } = string.Empty;

    public int TotalQuantity { get; set; }

    public int InUseQuantity { get; set; }

    public int DamagedQuantity { get; set; }

    public int LiquidatedQuantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal BasePrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DefaultPriceIfLost { get; set; }

    [MaxLength(200)]
    public string? Supplier { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public ICollection<LossAndDamage> LossAndDamages { get; set; } = new List<LossAndDamage>();
}


