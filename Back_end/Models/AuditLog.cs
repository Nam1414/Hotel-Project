using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelManagementAPI.Models;


// Lưu lại toàn bộ hành động thay đổi dữ liệu trong hệ thống.
// Không cho phép xóa. Giữ tối thiểu 30 ngày.
[Table("Audit_Logs")]
public class AuditLog
// {
//     [Column("id")]
//     public int Id { get; set; }

//     //Tên bảng bị tác động: "Equipments", "Rooms", "Users"...
//     [MaxLength(100)]
//     [Column("table_name")]
//     public string TableName { get; set; } = string.Empty;

//     //Hành động: CREATE | UPDATE | DELETE
//     [MaxLength(20)]
//     [Column("action")]
//     public string Action { get; set; } = string.Empty;

//     //ID của bản ghi bị tác động
//     [Column("record_id")]
//     public int? RecordId { get; set; }

//     //Dữ liệu CŨ trước khi thay đổi (JSON string)
//     [Column("old_value")]
//     public string? OldValues { get; set; }

//     //Dữ liệu MỚI sau khi thay đổi (JSON string)
//     [Column("new_value")]
//     public string? NewValues { get; set; }

//     //ID người thực hiện hành động
//     [Column("user_id")]
//     public int? UserId { get; set; }

//     //Thời điểm xảy ra (UTC)
//     [Column("created_at")]
//     public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
// }
{
    // ← AuditLogs dùng PascalCase — giữ nguyên KHÔNG thêm [Column]
    public int Id { get; set; }
    public string? TableName { get; set; }
    public string? Action { get; set; }
    public int? RecordId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? IpAddress { get; set; }
}