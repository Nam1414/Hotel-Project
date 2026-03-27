using System.Text;
using CloudinaryDotNet;
using HotelManagementAPI.Data;
using HotelManagementAPI.Middleware;
using HotelManagementAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


// =============================================
// 1. DATABASE
// =============================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// =============================================
// 2. JWT AUTHENTICATION
// =============================================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"]
    ?? throw new InvalidOperationException("JWT Secret không được để trống!");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var path = context.HttpContext.Request.Path;
            var token = context.Request.Query["access_token"];

            if (path.StartsWithSegments("/notificationHub") && !string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = ctx =>
        {
            if (ctx.Exception is SecurityTokenExpiredException)
                ctx.Response.Headers.Append("Token-Expired", "true");
            return Task.CompletedTask;
        },
        OnChallenge = async ctx =>
        {
            // Tắt response mặc định của JWT Bearer
            ctx.HandleResponse();
            ctx.Response.StatusCode = 401;
            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsJsonAsync(new { 
                statusCode = 401, 
                message = "Bạn chưa đăng nhập hoặc Token không hợp lệ!" 
            });
        },
        OnForbidden = async ctx =>
        {
            ctx.Response.StatusCode = 403;
            ctx.Response.ContentType = "application/json";
            await ctx.Response.WriteAsJsonAsync(new { 
                statusCode = 403, 
                message = "Bạn không có quyền truy cập vào chức năng này!" 
            });
        }
    };
});

builder.Services.AddAuthorization();

// =============================================
// 3. CLOUDINARY — SINGLETON
// =============================================
var cloudinarySection = builder.Configuration.GetSection("Cloudinary");
var cloudinaryAccount = new Account(
    cloudinarySection["CloudName"],
    cloudinarySection["ApiKey"],
    cloudinarySection["ApiSecret"]);
builder.Services.AddSingleton(new Cloudinary(cloudinaryAccount));

// =============================================
// 4. SERVICES
// =============================================
builder.Services.AddSignalR(); // Bổ sung SignalR
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ISlugService, SlugService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IAttractionService, AttractionService>();
builder.Services.AddScoped<IAmenityService, AmenityService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<INotificationService, NotificationService>(); // Đăng ký NotificationService
builder.Services.AddScoped<IEmailService, EmailService>(); // Đăng ký EmailService


// =============================================
// 5. CONTROLLERS
// =============================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// =============================================
// 6. SWAGGER + JWT BUTTON
// =============================================
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hotel Management API",
        Version = "v1",
        Description = "ERP System cho Khách Sạn — Kant"
    });

    // Thêm nút Authorize 🔒 trên Swagger UI
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Nhập: Bearer {token}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    options.AddSecurityDefinition("Bearer", securityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});

// =============================================
// 7. CORS
// =============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:5175")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials() // BẮT BUỘC cho SignalR
            .WithExposedHeaders("Token-Expired"));
});

// =============================================
// BUILD APP
// =============================================
var app = builder.Build();

// =============================================
// MIDDLEWARE PIPELINE
// =============================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hotel Management API v1");
        c.RoutePrefix = string.Empty; // Swagger tại localhost:PORT/
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
    });
}

app.UseCors("AllowAll");
// app.UseHttpsRedirection(); // Tắt khi dev local tránh warning

app.UseRefreshTokenMiddleware();

app.UseAuthentication();
app.UsePermissionMiddleware();
app.UseAuthorization();

app.MapControllers();
app.MapHub<HotelManagementAPI.Hubs.NotificationHub>("/notificationHub"); // Map SignalR Hub

app.Run();
