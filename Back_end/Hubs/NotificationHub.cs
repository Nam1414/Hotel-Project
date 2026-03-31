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
<<<<<<< HEAD
        var userId = Context.UserIdentifier;
        var role = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        if (!string.IsNullOrEmpty(role))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, role);
            Console.WriteLine($"[SignalR] Client Connected. ConnectionId: {Context.ConnectionId}, UserId: {userId}, Role: {role}");
        }
        else
        {
            Console.WriteLine($"[SignalR] Client Connected but without a valid Role. ConnectionId: {Context.ConnectionId}, UserId: {userId}");
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(System.Exception? exception)
    {
        var role = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        if (!string.IsNullOrEmpty(role))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, role);
            System.Console.WriteLine($"[SignalR] Client Disconnected. ConnectionId: {Context.ConnectionId}, Role: {role}");
        }

=======
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
>>>>>>> origin/nam_nt
        await base.OnDisconnectedAsync(exception);
    }
}
