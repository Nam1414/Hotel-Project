namespace HotelManagementAPI.DTOs;

public record LoginDto(string Email, string Password);

public record LoginResponseDto(
    string AccessToken,
    string RefreshToken,
    string FullName,
    string Email,
    string Role,
    List<string> Permissions
);

public record RefreshTokenDto(string AccessToken, string RefreshToken);
