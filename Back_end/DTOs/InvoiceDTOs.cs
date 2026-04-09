using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using HotelManagementAPI.Enums;

namespace HotelManagementAPI.DTOs
{
    public class InvoiceResponseDto
    {
        public int Id { get; set; }
        public int? BookingId { get; set; }
        public decimal TotalRoomAmount { get; set; }
        public decimal TotalServiceAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal FinalTotal { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public InvoiceStatus Status { get; set; }
        public List<PaymentResponseDto> Payments { get; set; } = new List<PaymentResponseDto>();
    }

    public class PaymentResponseDto
    {
        public int Id { get; set; }
        public string? PaymentMethod { get; set; }
        public decimal AmountPaid { get; set; }
        public string? TransactionCode { get; set; }
        public DateTime? PaymentDate { get; set; }
    }

    public class AddPaymentDto
    {
        public string PaymentMethod { get; set; }
        public decimal AmountPaid { get; set; }
        public string TransactionCode { get; set; }
    }
}
