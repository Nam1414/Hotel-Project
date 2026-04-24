using System.ComponentModel.DataAnnotations.Schema;
using HotelManagementAPI.Models;
[Table("Room_Items")]
public class RoomItem
{
    [Column("id")]
    public int Id { get; set; }

    [Column("room_id")]
    public int RoomId { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("price_if_lost")]
    public decimal? PriceIfLost { get; set; }

    [Column("note")]
    public string? Note { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("item_type")]
    public string? ItemType { get; set; }

    [Column("EquipmentId")]        // ← giữ nguyên viết hoa như trong DB
    public int? EquipmentId { get; set; }

    // Navigation properties
    public Room? Room { get; set; }
    public Equipment? Equipment { get; set; }
}