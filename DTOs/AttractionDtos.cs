namespace HotelManagementAPI.DTOs;

public record AttractionDto(
    int Id,
    string Name,
    decimal? DistanceKm,
    string? Description,
    string? MapEmbedLink,
    decimal? Latitude,
    decimal? Longitude,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CreateAttractionDto(
    string Name,
    decimal? DistanceKm,
    string? Description,
    string? MapEmbedLink,
    decimal? Latitude,
    decimal? Longitude
);

public record UpdateAttractionDto(
    string Name,
    decimal? DistanceKm,
    string? Description,
    string? MapEmbedLink,
    decimal? Latitude,
    decimal? Longitude
);
