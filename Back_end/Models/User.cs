using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Users")]
public class User
{
    [Column("id")]
    public int Id { get; set; }

    [Column("role_id")]
    public int? RoleId { get; set; }

    [Column("membership_id")]
    public int? MembershipId { get; set; }

    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("phone")]
    public string? Phone { get; set; }

    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("status")]
    public bool Status { get; set; } = true;

    [Column("avatar_url")]
    public string? AvatarUrl { get; set; }

    [Column("refresh_token")]
    public string? RefreshToken { get; set; }

    [Column("refresh_token_expiry")]
    public DateTime? RefreshTokenExpiry { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Role? Role { get; set; }
}
