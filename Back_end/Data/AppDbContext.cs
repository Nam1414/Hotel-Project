using HotelManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<ArticleCategory> ArticleCategories { get; set; }
    public DbSet<Article> Articles { get; set; }
    public DbSet<RoomType> RoomTypes { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<RoomImage> RoomImages { get; set; }
    public DbSet<RoomInventory> RoomInventories { get; set; }
    public DbSet<Attraction> Attractions { get; set; }
    public DbSet<Amenity> Amenities { get; set; }
    public DbSet<RoomItem> RoomItems { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<MinibarItem> MinibarItems { get; set; }
    public DbSet<RoomMinibarStock> RoomMinibarStocks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Composite key Role_Permissions
        modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId);

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId);

        // User → Role
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId);

        // Article → Category
        modelBuilder.Entity<Article>()
            .HasOne(a => a.Category)
            .WithMany(c => c.Articles)
            .HasForeignKey(a => a.CategoryId);

        // Article → Author (User)
        modelBuilder.Entity<Article>()
            .HasOne(a => a.Author)
            .WithMany()
            .HasForeignKey(a => a.AuthorId);

        // Room -> RoomType (n-1)
        modelBuilder.Entity<Room>()
            .HasOne(r => r.RoomType)
            .WithMany(rt => rt.Rooms)
            .HasForeignKey(r => r.RoomTypeId);

        // RoomResources (RoomType -> Images)
        modelBuilder.Entity<RoomImage>()
            .HasOne(ri => ri.RoomType)
            .WithMany(rt => rt.Images)
            .HasForeignKey(ri => ri.RoomTypeId);

        // RoomInventory -> RoomType (n-1)
        modelBuilder.Entity<RoomInventory>()
            .HasOne(ri => ri.RoomType)
            .WithMany(rt => rt.Inventories)
            .HasForeignKey(ri => ri.RoomTypeId);

        // Many-to-Many: RoomType <-> Amenity
        modelBuilder.Entity<RoomType>()
            .HasMany(rt => rt.Amenities)
            .WithMany(a => a.RoomTypes)
            .UsingEntity<Dictionary<string, object>>(
                "RoomType_Amenities",
                j => j.HasOne<Amenity>().WithMany().HasForeignKey("amenity_id"),
                j => j.HasOne<RoomType>().WithMany().HasForeignKey("room_type_id")
            );

        // Precision for decimal
        modelBuilder.Entity<RoomType>()
            .Property(rt => rt.BasePrice)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<RoomInventory>()
            .Property(ri => ri.PriceOverride)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<Attraction>()
            .Property(a => a.DistanceKm)
            .HasColumnType("decimal(5, 2)");

        // Precision for Latitude/Longitude in Attraction
        modelBuilder.Entity<Attraction>()
            .Property(a => a.Latitude)
            .HasColumnType("decimal(18, 10)");

        modelBuilder.Entity<Attraction>()
            .Property(a => a.Longitude)
            .HasColumnType("decimal(18, 10)");

        modelBuilder.Entity<RoomItem>()
            .Property(ri => ri.PriceIfLost)
            .HasColumnType("decimal(18, 2)");

        // MinibarItem -> Price precision
        modelBuilder.Entity<MinibarItem>()
            .Property(m => m.Price)
            .HasColumnType("decimal(18, 2)");

        // RoomMinibarStock -> Room & MinibarItem
        modelBuilder.Entity<RoomMinibarStock>()
            .HasOne(rms => rms.Room)
            .WithMany()
            .HasForeignKey(rms => rms.RoomId);

        modelBuilder.Entity<RoomMinibarStock>()
            .HasOne(rms => rms.MinibarItem)
            .WithMany()
            .HasForeignKey(rms => rms.MinibarItemId);

        // Notification -> User (n-1)
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Notifications column mapping
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(n => n.Id);

            // Sửa lại toàn bộ tên cột thành chữ thường và có gạch dưới
            entity.Property(n => n.Id).HasColumnName("id");
            entity.Property(n => n.UserId).HasColumnName("user_id");
            entity.Property(n => n.Message).HasColumnName("message");
            entity.Property(n => n.Type).HasColumnName("type");
            entity.Property(n => n.IsRead).HasColumnName("is_read");
            entity.Property(n => n.CreatedAt).HasColumnName("created_at");
        });
    }
}
