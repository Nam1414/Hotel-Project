using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

public class Notification
{   
    [Column("id")]
    public int Id { get; set; }
    [Column("user_id")]
    public int UserId { get; set; }
    [Column("content")]
    public string Message { get; set; } = string.Empty;
    [Column("type")]
    public string Type { get; set; } = "General";
    [Column("is_read")]
    public bool IsRead { get; set; } = false;
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User? User { get; set; }
}