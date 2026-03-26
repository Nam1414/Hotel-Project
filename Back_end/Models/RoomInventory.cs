using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("RoomInventory")]
public class RoomInventory
{
    [Column("id")]
    public int Id { get; set; }

    [Column("room_type_id")]
    public int RoomTypeId { get; set; }

    [Column("inventory_date")]
    public DateTime InventoryDate { get; set; }

    [Column("total_rooms")]
    public int TotalRooms { get; set; }

    [Column("available_rooms")]
    public int AvailableRooms { get; set; }

    [Column("price_override")]
    public decimal? PriceOverride { get; set; }

    // Navigation
    public RoomType? RoomType { get; set; }
}
