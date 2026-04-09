using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HotelManagementAPI.Models;

[Table("Booking_Details")]
public class BookingDetail
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("booking_id")]
    public int BookingId { get; set; }

    [Column("room_id")]
    public int RoomId { get; set; }

    [Column("room_type_id")]
    public int? RoomTypeId { get; set; }

    [Column("check_in_date")]
    public DateTime CheckInDate { get; set; }

    [Column("check_out_date")]
    public DateTime CheckOutDate { get; set; }

    [Column("price_per_night")]
    public decimal PricePerNight { get; set; }

    // Navigation
    public Booking? Booking { get; set; }
    public Room? Room { get; set; }
}