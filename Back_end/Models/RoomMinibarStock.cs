using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("RoomMinibarStock")]
public class RoomMinibarStock
{
    [Column("id")]
    public int Id { get; set; }

    [Column("room_id")]
    public int RoomId { get; set; }

    [Column("minibar_item_id")]
    public int MinibarItemId { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    // Navigation
    [ForeignKey("RoomId")]
    public Room? Room { get; set; }

    [ForeignKey("MinibarItemId")]
    public MinibarItem? MinibarItem { get; set; }
}
