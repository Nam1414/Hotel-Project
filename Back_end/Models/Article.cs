using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;

[Table("Articles")]
public class Article
{
    [Column("id")]
    public int Id { get; set; }

    [Column("category_id")]
    public int? CategoryId { get; set; }

    [Column("author_id")]
    public int? AuthorId { get; set; }

    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("slug")]
    public string? Slug { get; set; }

    [Column("content")]
    public string? Content { get; set; }

    [Column("thumbnail_url")]
    public string? ThumbnailUrl { get; set; }

    [Column("thumbnail_public_id")]
    public string? ThumbnailPublicId { get; set; }

    [Column("published_at")]
    public DateTime? PublishedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    // Navigation
    public ArticleCategory? Category { get; set; }
    public User? Author { get; set; }
}
