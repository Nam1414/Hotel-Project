namespace HotelManagementAPI.DTOs;

public record CreateMinibarItemDto(string Name, decimal Price);
public record UpdateMinibarItemDto(string Name, decimal Price, bool IsActive);
public record UpdateMinibarStockDto(int RoomId, int MinibarItemId, int Quantity);

public record CreateRoomItemDto(int RoomId, string ItemName, int Quantity, decimal PriceIfLost);
public record UpdateRoomItemDto(string ItemName, int Quantity, decimal PriceIfLost);
