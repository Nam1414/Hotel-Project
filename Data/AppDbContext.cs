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
    public DbSet<Attraction> Attractions { get; set; }

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
            
        modelBuilder.Entity<Attraction>(entity =>
        {
            entity.Property(a => a.DistanceKm).HasColumnName("distance_km").HasColumnType("decimal(5,2)");
            entity.Property(a => a.MapEmbedLink).HasColumnName("map_embed_link");
            entity.Property(a => a.ImageUrl).HasColumnName("image_url");
            entity.Property(a => a.IsActive).HasColumnName("is_active");
            entity.Property(a => a.CreatedAt).HasColumnName("created_at");
            entity.Property(a => a.Latitude).HasColumnName("latitude").HasColumnType("decimal(10,7)");
            entity.Property(a => a.Longitude).HasColumnName("longitude").HasColumnType("decimal(10,7)");
        });
    }
}
