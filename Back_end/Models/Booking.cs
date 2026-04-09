using System.ComponentModel.DataAnnotations.Schema;
using HotelManagementAPI.Models;

[Table("Bookings")]
public class Booking
{
    [Column("id")]
    public int Id { get; set; }

    [Column("user_id")]
    public int? UserId { get; set; }

    [Column("guest_name")]
    public string? GuestName { get; set; }

    [Column("guest_phone")]
    public string? GuestPhone { get; set; }

    [Column("guest_email")]
    public string? GuestEmail { get; set; }

    [Column("booking_code")]
    public string? BookingCode { get; set; }

    [Column("voucher_id")]
    public int? VoucherId { get; set; }

    [Column("status")]
    public string Status { get; set; } = "Pending";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
    public User? User { get; set; }
    public Invoice? Invoice { get; set; }
}