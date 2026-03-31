using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using HotelManagementAPI.Enums;

namespace HotelManagementAPI.Models;

[Table("Notifications")]
public class Notification
<<<<<<< HEAD
{   
    public int Id { get; set; }
    
    // Null = thông báo broadcast toàn hệ thống
    public int? UserId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    
    public NotificationType Type { get; set; } = NotificationType.Info;
    
    public string? ReferenceLink { get; set; }
    
    public bool IsRead { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;

=======
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("userid")]          // ← KHÔNG có underscore
    public int UserId { get; set; }

    [Column("title")]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("content")]
    public string Content { get; set; } = string.Empty;

    [Column("type")]
    [MaxLength(50)]
    public string Type { get; set; } = "General";

    [Column("referencelink")]   // ← KHÔNG có underscore
    public string? ReferenceLink { get; set; }

    [Column("isread")]          // ← KHÔNG có underscore
    public bool IsRead { get; set; } = false;

    [Column("createdat")]       // ← KHÔNG có underscore
    public DateTime? CreatedAt { get; set; }

    [ForeignKey("UserId")]
>>>>>>> origin/nam_nt
    public User? User { get; set; }
}