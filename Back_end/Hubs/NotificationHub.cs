using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace HotelManagementAPI.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    // Hub này dùng để người dùng kết nối qua WebSockets
    // ID người dùng sẽ được lấy từ JWT Token (Context.User)
    
    public override async Task OnConnectedAsync()
    {
        // Có thể log user connected nếu cần
        await base.OnConnectedAsync();
    }
}
