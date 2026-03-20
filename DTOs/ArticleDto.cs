namespace HotelManagementAPI.DTOs;

public record CreateArticleDto(
    string Title,
    string Content,
    int CategoryId
);

public record UpdateArticleDto(
    string Title,
    string Content,
    int CategoryId
);
