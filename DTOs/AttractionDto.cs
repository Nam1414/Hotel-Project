using System.ComponentModel.DataAnnotations;

namespace HotelManagementAPI.DTOs;

// Response — trả về cho FE (dùng cho GET list & GET by id)
public class AttractionDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal? DistanceKm { get; set; }
    public string? Description { get; set; }
    public string? MapEmbedLink { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Request — dùng cho POST (tạo mới) và PUT (cập nhật)
public class CreateAttractionDto
{
    [Required(ErrorMessage = "Tên điểm tham quan không được để trống")]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public decimal? DistanceKm { get; set; }

    public string? Description { get; set; }

    public string? MapEmbedLink { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string? ImageUrl { get; set; }
}

public class UpdateAttractionDto : CreateAttractionDto
{
    // Cho phép admin bật/tắt hiển thị
    public bool IsActive { get; set; } = true;
}