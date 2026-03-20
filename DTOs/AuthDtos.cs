namespace HotelManagementAPI.DTOs;

public record LoginDto(string Email, string Password);

public record LoginResponseDto(
    string AccessToken,
    string FullName,
    string Email,
    string Role,
    List<string> Permissions
);

public record RefreshTokenDto(string AccessToken);
