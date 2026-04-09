namespace HotelManagementAPI.Models
{
    public class Voucher
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string DiscountType { get; set; } = null!;  // "PERCENT" hoặc "FIXEDAMOUNT"
        public decimal DiscountValue { get; set; }
        public decimal? MinBookingValue { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public int? UsageLimit { get; set; }

        // Navigation
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}