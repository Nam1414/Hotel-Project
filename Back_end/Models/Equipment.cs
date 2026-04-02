// ============================================================
// Back_end/Models/Equipment.cs
// Map sang bảng Equipments trong HotelManagementDB
// ============================================================

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Equipments")]
public class Equipment
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("item_code")]
    [MaxLength(50)]
    public string ItemCode { get; set; } = null!;

    [Required]
    [Column("name")]
    [MaxLength(200)]
    public string Name { get; set; } = null!;

    [Column("category")]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Column("unit")]
    [MaxLength(50)]
    public string Unit { get; set; } = string.Empty;

    [Column("total_quantity")]
    public int TotalQuantity { get; set; }

    [Column("in_use_quantity")]
    public int InUseQuantity { get; set; }

    [Column("damaged_quantity")]
    public int DamagedQuantity { get; set; }

    [Column("liquidated_quantity")]
    public int LiquidatedQuantity { get; set; }

    [Column("base_price", TypeName = "decimal(18,2)")]
    public decimal BasePrice { get; set; }

    [Column("default_price_if_lost", TypeName = "decimal(18,2)")]
    public decimal DefaultPriceIfLost { get; set; }

    [Column("supplier")]
    [MaxLength(200)]
    public string? Supplier { get; set; }

    [Column("image_url")]
    public string? ImageUrl { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public ICollection<LossAndDamage> LossAndDamages { get; set; } = new List<LossAndDamage>();
}


// ============================================================
// Back_end/Models/LossAndDamage.cs
// Map sang bảng Loss_And_Damages
// ============================================================

[Table("Loss_And_Damages")]
public class LossAndDamage
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("equipment_id")]
    public int EquipmentId { get; set; }

    [Column("booking_detail_id")]
    public int? BookingDetailId { get; set; }

    [Column("room_inventory_id")]
    public int? RoomInventoryId { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("penalty_amount", TypeName = "decimal(18,2)")]
    public decimal PenaltyAmount { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("image_url")]
    public string? ImageUrl { get; set; }

    /// <summary>pending | confirmed | cancelled</summary>
    [Column("status")]
    [MaxLength(20)]
    public string Status { get; set; } = "pending";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(EquipmentId))]
    public Equipment? Equipment { get; set; }
}