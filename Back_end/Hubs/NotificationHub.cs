using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace HotelManagementAPI.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    // Hub này dùng để người dùng kết nối qua WebSockets
    // ID người dùng sẽ được lấy từ JWT Token (Context.User)
    
    public override async Task OnConnectedAsync()
    {
        // Tự động join group dựa vào Role trong JWT
        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value;
        if (!string.IsNullOrEmpty(role))
            await Groups.AddToGroupAsync(Context.ConnectionId, role);

        await base.OnConnectedAsync();
    }
    
        // Client gọi để join group theo role
    public async Task JoinRoleGroup(string roleName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roleName);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}
