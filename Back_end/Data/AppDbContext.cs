using HotelManagementAPI.Models;
using HotelManagementAPI.Enums;
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
    public DbSet<Equipment> Equipments { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<LossAndDamage> LossAndDamages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ─── Role_Permissions (composite key) ───────────────────────────────────
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

        // ─── User → Role ─────────────────────────────────────────────────────────
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId);

        // ─── User → Membership ───────────────────────────────────────────────────
        modelBuilder.Entity<User>()
            .HasOne(u => u.Membership)
            .WithMany(m => m.Users)
            .HasForeignKey(u => u.MembershipId);

        // ─── Article → Category + Author ────────────────────────────────────────
        modelBuilder.Entity<Article>()
            .HasOne(a => a.Category)
            .WithMany(c => c.Articles)
            .HasForeignKey(a => a.CategoryId);

        modelBuilder.Entity<Article>()
            .HasOne(a => a.Author)
            .WithMany()
            .HasForeignKey(a => a.AuthorId);

        // ─── Room → RoomType ─────────────────────────────────────────────────────
        modelBuilder.Entity<Room>()
            .HasOne(r => r.RoomType)
            .WithMany(rt => rt.Rooms)
            .HasForeignKey(r => r.RoomTypeId);

        // ─── RoomImage → RoomType ────────────────────────────────────────────────
        modelBuilder.Entity<RoomImage>()
            .HasOne(ri => ri.RoomType)
            .WithMany(rt => rt.Images)
            .HasForeignKey(ri => ri.RoomTypeId);

        // ─── RoomInventory → Room ────────────────────────────────────────────────
        // RoomInventory chứa thiết bị trong phòng (room_id → Rooms, EquipmentId → Equipments)
        modelBuilder.Entity<RoomInventory>()
            .HasOne(ri => ri.Room)
            .WithMany()
            .HasForeignKey(ri => ri.RoomId);

        modelBuilder.Entity<RoomInventory>()
            .HasOne(ri => ri.Equipment)
            .WithMany()
            .HasForeignKey(ri => ri.EquipmentId);

        modelBuilder.Entity<LossAndDamage>()
            .HasOne(ld => ld.RoomInventory)
            .WithMany()
            .HasForeignKey(ld => ld.RoomInventoryId);

        // ─── RoomType ↔ Amenity (Many-to-Many) ──────────────────────────────────
        modelBuilder.Entity<RoomType>()
            .HasMany(rt => rt.Amenities)
            .WithMany(a => a.RoomTypes)
            .UsingEntity<Dictionary<string, object>>(
                "RoomType_Amenities",
                j => j.HasOne<Amenity>().WithMany().HasForeignKey("amenity_id"),
                j => j.HasOne<RoomType>().WithMany().HasForeignKey("room_type_id")
            );

        // ─── RoomMinibarStock → Room + MinibarItem ───────────────────────────────
        modelBuilder.Entity<RoomMinibarStock>()
            .HasOne(rms => rms.Room)
            .WithMany()
            .HasForeignKey(rms => rms.RoomId);

        modelBuilder.Entity<RoomMinibarStock>()
            .HasOne(rms => rms.MinibarItem)
            .WithMany()
            .HasForeignKey(rms => rms.MinibarItemId);

        // ─── Notification → User ─────────────────────────────────────────────────
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(n => n.Id);
            entity.Property(n => n.Id).HasColumnName("id");
            entity.Property(n => n.UserId).HasColumnName("user_id").IsRequired(false);
            entity.Property(n => n.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
            entity.Property(n => n.Content).HasColumnName("content").IsRequired();
            entity.Property(n => n.Type).HasColumnName("type").HasMaxLength(50).HasConversion<string>();
            entity.Property(n => n.ReferenceLink).HasColumnName("reference_link").HasMaxLength(255);
            entity.Property(n => n.IsRead).HasColumnName("is_read").IsRequired();
            entity.Property(n => n.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("GETDATE()");

            entity.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ─── Decimal precision ───────────────────────────────────────────────────
        modelBuilder.Entity<RoomType>()
            .Property(rt => rt.BasePrice)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<RoomInventory>()
            .Property(ri => ri.PriceIfLost)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<Attraction>()
            .Property(a => a.DistanceKm)
            .HasColumnType("decimal(5, 2)");

        modelBuilder.Entity<Attraction>()
            .Property(a => a.Latitude)
            .HasColumnType("decimal(18, 10)");

        modelBuilder.Entity<Attraction>()
            .Property(a => a.Longitude)
            .HasColumnType("decimal(18, 10)");

        modelBuilder.Entity<RoomItem>()
            .Property(ri => ri.PriceIfLost)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<MinibarItem>()
            .Property(m => m.Price)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<Equipment>()
            .Property(e => e.DefaultPriceIfLost)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<Equipment>()
            .Property(e => e.BasePrice)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<LossAndDamage>()
            .Property(ld => ld.PenaltyAmount)
            .HasColumnType("decimal(18, 2)");
    }
}
