using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("ArticleCategories")]
public class ArticleCategory
{
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("slug")]
    public string Slug { get; set; } = string.Empty;

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Article> Articles { get; set; } = new List<Article>();
}
