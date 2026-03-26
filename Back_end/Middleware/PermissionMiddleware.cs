using System.Security.Claims;

namespace HotelManagementAPI.Middleware;

public class PermissionMiddleware
{
    private readonly RequestDelegate _next;

    // Định nghĩa mapping: [Route pattern] → [Permission cần có]
    // Key: "{METHOD}:{path_prefix}"
    private static readonly Dictionary<string, string> _permissionMap = new()
    {
        { "GET:/api/usermanagement", "user.view" },
        { "POST:/api/usermanagement", "user.create" },
        { "PUT:/api/usermanagement", "user.edit" },
        { "DELETE:/api/usermanagement", "user.delete" },
        { "GET:/api/roles", "role.view" },
        { "POST:/api/roles", "role.manage" },
        { "PUT:/api/roles", "role.manage" },
        { "DELETE:/api/roles", "role.manage" },
    };

    public PermissionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value?.ToLower() ?? "";
        var method = context.Request.Method.ToUpper();

        // Tìm permission yêu cầu dựa trên route
        var requiredPermission = GetRequiredPermission(method, path);

        if (requiredPermission != null)
        {
            // Kiểm tra đã đăng nhập chưa
            if (!context.User.Identity?.IsAuthenticated ?? true)
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new
                {
                    statusCode = 401,
                    message = "Bạn chưa đăng nhập!"
                });
                return;
            }

            // Admin bypass tất cả permission check
            var isAdmin = context.User.IsInRole("Admin");
            if (!isAdmin)
            {
                // Lấy danh sách permission từ JWT claims
                var userPermissions = context.User.Claims
                    .Where(c => c.Type == "permission")
                    .Select(c => c.Value)
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                if (!userPermissions.Contains(requiredPermission))
                {
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(new
                    {
                        statusCode = 403,
                        message = $"Bạn không có quyền [{requiredPermission}] để thực hiện thao tác này!"
                    });
                    return;
                }
            }
        }

        await _next(context);
    }

    private static string? GetRequiredPermission(string method, string path)
    {
        foreach (var entry in _permissionMap)
        {
            var parts = entry.Key.Split(':');
            if (parts[0] == method && path.StartsWith(parts[1]))
                return entry.Value;
        }
        return null;
    }
}

// Extension method để đăng ký
public static class PermissionMiddlewareExtensions
{
    public static IApplicationBuilder UsePermissionMiddleware(this IApplicationBuilder builder)
        => builder.UseMiddleware<PermissionMiddleware>();
}