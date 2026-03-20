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

        // Precision for decimal
        modelBuilder.Entity<RoomType>()
            .Property(rt => rt.BasePrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<RoomInventory>()
            .Property(ri => ri.PriceOverride)
            .HasPrecision(18, 2);
    }
}


