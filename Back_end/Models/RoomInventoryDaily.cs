using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Models;

[Table("RoomInventoryDaily")]
public class RoomInventoryDaily
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
    [Precision(18, 2)]
    public decimal? PriceOverride { get; set; }

    public RoomType? RoomType { get; set; }
}