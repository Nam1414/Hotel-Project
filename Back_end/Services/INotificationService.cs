namespace HotelManagementAPI.Services;

public interface INotificationService
{
    Task SendNotificationAsync(int userId, string message, string type = "General");
    Task SendToRoleAsync(int roleId, string message, string type = "General");
}
