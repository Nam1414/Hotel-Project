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
    public string ItemCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Unit { get; set; } = string.Empty;

    public int TotalQuantity { get; set; }

    public int InUseQuantity { get; set; }

    public int DamagedQuantity { get; set; }

    public int LiquidatedQuantity { get; set; }

    // Computed — không lưu DB
    [NotMapped]
    public int InStockQuantity =>
        TotalQuantity - InUseQuantity - DamagedQuantity - LiquidatedQuantity;

    [Column(TypeName = "decimal(18,2)")]
    public decimal BasePrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DefaultPriceIfLost { get; set; }

    [MaxLength(255)]
    public string? Supplier { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}