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
    //public DbSet<MinibarItem> MinibarItems { get; set; }
    //public DbSet<RoomMinibarStock> RoomMinibarStocks { get; set; }
    public DbSet<Equipment> Equipments { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<BookingDetail> BookingDetails { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<Voucher> Vouchers { get; set; }
    public DbSet<RoomInventoryDaily> RoomInventoryDailies { get; set; }

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
            .HasForeignKey(a => a.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);// Nếu category bị xóa thì article vẫn giữ lại nhưng category_id sẽ thành null

        // Article → Author (User)
        modelBuilder.Entity<Article>()
            .HasOne(a => a.Author)
            .WithMany()
            .HasForeignKey(a => a.AuthorId)
            .OnDelete(DeleteBehavior.Restrict); // Nếu user bị xóa thì article vẫn giữ lại nhưng author_id sẽ thành null

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
        // Membership -> User (n-1)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Membership)
            .WithMany(m => m.Users)
            .HasForeignKey(u => u.MembershipId);

        modelBuilder.Entity<Equipment>()
            .Property(e => e.DefaultPriceIfLost)
            .HasColumnType("decimal(18, 2)");

        modelBuilder.Entity<Equipment>()
            .Property(e => e.BasePrice)
            .HasColumnType("decimal(18, 2)");
        // Notifications column mapping
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(n => n.Id);
            entity.Property(n => n.Id).HasColumnName("id");
            entity.Property(n => n.UserId).HasColumnName("user_id");
            entity.Property(n => n.Title).HasColumnName("title");
            entity.Property(n => n.Content).HasColumnName("content");
            entity.Property(n => n.Type).HasColumnName("type");
            entity.Property(n => n.ReferenceLink).HasColumnName("reference_link");
            entity.Property(n => n.IsRead).HasColumnName("is_read");
            entity.Property(n => n.CreatedAt).HasColumnName("created_at");
        });

        // Thêm vào OnModelCreating
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("Audit_Logs");
            entity.HasKey(a => a.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Action).HasColumnName("action");
            entity.Property(e => e.TableName).HasColumnName("table_name");
            entity.Property(e => e.RecordId).HasColumnName("record_id");
            entity.Property(e => e.OldValues).HasColumnName("old_value");
            entity.Property(e => e.NewValues).HasColumnName("new_value");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.ToTable("Bookings");
            entity.HasKey(b => b.Id);
            entity.Property(b => b.Id).HasColumnName("id");
            entity.Property(b => b.UserId).HasColumnName("userid");
            entity.Property(b => b.GuestName).HasColumnName("guestname");
            entity.Property(b => b.GuestPhone).HasColumnName("guestphone");
            entity.Property(b => b.GuestEmail).HasColumnName("guestemail");
            entity.Property(b => b.BookingCode).HasColumnName("bookingcode");
            entity.Property(b => b.VoucherId).HasColumnName("voucherid");
            entity.Property(b => b.Status).HasColumnName("status");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.ToTable("Invoices");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BookingId).HasColumnName("bookingid");
            entity.Property(e => e.TotalRoomAmount)
                .HasColumnName("totalroomamount")
                .HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalServiceAmount)
                .HasColumnName("totalserviceamount")
                .HasColumnType("decimal(18,2)");
            entity.Property(e => e.DiscountAmount)
                .HasColumnName("discountamount")
                .HasColumnType("decimal(18,2)");
            entity.Property(e => e.TaxAmount)
                .HasColumnName("taxamount")
                .HasColumnType("decimal(18,2)");
            entity.Property(e => e.FinalTotal)
                .HasColumnName("finaltotal")
                .HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasOne(e => e.Booking)
                .WithOne(b => b.Invoice)
                .HasForeignKey<Invoice>(e => e.BookingId);
        });

        //fix decimal warings
        modelBuilder.Entity<BookingDetail>()
            .Property(b => b.PricePerNight)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Voucher>()
            .Property(v => v.DiscountValue)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Voucher>()
            .Property(v => v.MinBookingValue)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Membership>()
            .Property(m => m.DiscountPercent)
            .HasColumnType("decimal(5,2)"); // % nên dùng 5,2

        // Booking — map snake_case columns
        modelBuilder.Entity<Booking>(b =>
        {
            b.ToTable("Bookings");
            b.Property(x => x.UserId).HasColumnName("user_id");
            b.Property(x => x.GuestName).HasColumnName("guest_name");
            b.Property(x => x.GuestPhone).HasColumnName("guest_phone");
            b.Property(x => x.GuestEmail).HasColumnName("guest_email");
            b.Property(x => x.BookingCode).HasColumnName("booking_code");
            b.Property(x => x.VoucherId).HasColumnName("voucher_id");
            b.Property(x => x.Status).HasColumnName("status");
            // b.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        // Invoice — map snake_case columns
        modelBuilder.Entity<Invoice>(b =>
        {
            b.ToTable("Invoices");
            b.Property(x => x.BookingId).HasColumnName("booking_id");
            b.Property(x => x.TotalRoomAmount).HasColumnName("total_room_amount");
            b.Property(x => x.TotalServiceAmount).HasColumnName("total_service_amount");
            b.Property(x => x.DiscountAmount).HasColumnName("discount_amount");
            b.Property(x => x.TaxAmount).HasColumnName("tax_amount");
            b.Property(x => x.FinalTotal).HasColumnName("final_total");
            b.Property(x => x.Status).HasColumnName("status");
        });

        // BookingDetail — map snake_case columns
        modelBuilder.Entity<BookingDetail>(b =>
        {
            b.ToTable("Booking_Details");
            b.Property(x => x.BookingId).HasColumnName("booking_id");
            b.Property(x => x.RoomId).HasColumnName("room_id");
            b.Property(x => x.RoomTypeId).HasColumnName("room_type_id");
            b.Property(x => x.CheckInDate).HasColumnName("check_in_date");
            b.Property(x => x.CheckOutDate).HasColumnName("check_out_date");
            b.Property(x => x.PricePerNight).HasColumnName("price_per_night");
        });
        // ── BookingDetail decimal precision ──────────────────
        modelBuilder.Entity<BookingDetail>()
            .Property(b => b.PricePerNight)
            .HasColumnType("decimal(18,2)");

        // ── Invoice decimal precision ─────────────────────────
        modelBuilder.Entity<Invoice>()
            .Property(i => i.TotalRoomAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.TotalServiceAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.DiscountAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.TaxAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Invoice>()
            .Property(i => i.FinalTotal)
            .HasColumnType("decimal(18,2)");
        modelBuilder.Entity<BookingDetail>()
            .Property(x => x.DiscountAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<BookingDetail>()
            .Property(x => x.FinalTotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<BookingDetail>()
            .Property(x => x.TaxAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<BookingDetail>()
            .Property(x => x.TotalRoomAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<BookingDetail>()
            .Property(x => x.TotalServiceAmount)
            .HasPrecision(18, 2);
    }
}
