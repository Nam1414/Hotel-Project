# Hotel Management API - Hệ Thống ERP Quản Lý Khách Sạn

Dự án này là một API backend được xây dựng bằng **.NET 8.0/9.0/10.0**, cung cấp các dịch vụ quản lý cho hệ thống khách sạn, bao gồm quản lý người dùng, loại phòng, phòng, kho lưu trữ, thông báo Real-time và tích hợp lưu trữ hình ảnh qua Cloudinary.

## 🚀 Công Nghệ Sử Dụng

- **Framework**: .NET 10.0 (Web API)
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core 9.0
- **Authentication**: JWT (JSON Web Token) với Refresh Token
- **Real-time**: **SignalR** (Hệ thống thông báo)
- **Hashing**: BCrypt.Net-Next
- **Image Cloud**: Cloudinary
- **API Documentation**: Swagger/OpenAPI (Swashbuckle)
- **Utils**: Slugify.Core (Tạo slug cho URL)

## ✨ Tính Năng Chính

- **Quản lý người dùng (User Management API)**:
    - Danh sách người dùng, tạo mới, cập nhật và xóa.
    - Tự động gửi thông báo khi tài khoản bị khóa hoặc mở khóa.
- **Xác thực & Phân quyền (Auth & Roles)**:
    - Đăng ký, đăng nhập, bảo mật JWT với Refresh Token.
    - **Full CRUD Roles**: Quản lý vai trò, danh sách quyền hạn (Permissions).
    - **Custom Error Handling**: Trả lỗi 401 (Unauthorized) và 403 (Forbidden) định dạng JSON chuẩn.
- **Quản lý phòng (Room Module)**:
    - Cấu hình loại phòng (Room Types), Tiện nghi (Amenities).
    - Quản lý danh sách phòng thực tế và hình ảnh phòng.
- **Quản lý Vật tư & Minibar (Management Module)**:
    - **Room Items**: Quản lý trang thiết bị, vật tư trong từng phòng.
    - **Minibar**: Quản lý danh mục đồ uống và theo dõi số lượng tồn kho thực tế của Minibar trong mỗi phòng.
- **Hệ thống Thông báo (Notification System)**:
    - Tích hợp **SignalR** cho thông báo Real-time.
    - Tự động gửi thông báo khi: Thay đổi quyền hạn, Khóa/Mở khóa tài khoản, Cập nhật hệ thống.
- **Quản lý tồn kho (Inventory API)**:
    - Xem tình trạng phòng trống và giá theo dải ngày.
    - **Nhân bản dữ liệu (Clone)**: Sao chép thông tin từ một bản ghi sang ngày tiếp theo.
- **Lưu trữ hình ảnh**: Tích hợp Cloudinary (Avatar, ảnh phòng, ảnh bài viết).
- **API Documentation**: Tài liệu API đầy đủ qua Swagger UI.

## 🛠️ Hướng Dẫn Cài Đặt (Khi pull về máy mới)

Để chạy project trên một môi trường mới, bạn cần thực hiện các bước sau:

### 1. Yêu Cầu Hệ Thống (Prerequisites)
- Cài đặt **.NET 8.0 SDK** trở lên.
- Cài đặt **Microsoft SQL Server**.
- Một tài khoản **Cloudinary**.

### 2. Thiết Lập Cơ Sở Dữ Liệu (Database)
Hãy thực hiện các file script trong thư mục `sql/` theo thứ tự sau để đảm bảo tính toàn vẹn:
1.  `DBHotel.sql`: Script chính tạo Database và dữ liệu gốc.
2.  `fix_auth_articles_cloudinary.sql`: Sửa lỗi đồng bộ cột Cloudinary và Audit.
3.  `setup_notifications.sql`: Cài đặt bảng thông báo.
4.  `setup_minibar_module.sql`: Cài đặt module quản lý Minibar & Vật tư.
5.  `seed_room_data.sql`: Nạp dữ liệu phòng mẫu.
6.  `patch_attractions_gps.sql`: Cập nhật tọa độ GPS cho các điểm tham quan.

### 3. Cấu Hình Ứng Dụng (Configuration)
Mở file `appsettings.json` và cập nhật:
- **ConnectionStrings**: Thay đổi chuỗi kết nối tới SQL Server của bạn.
- **JWT Settings**: Cấu hình Secret Key và thời gian hết hạn.
- **Cloudinary**: Cập nhật CloudName, ApiKey, và ApiSecret từ trang quản trị Cloudinary.
- **SignalR**: Đảm bảo CORS cho phép `AllowCredentials()` để SignalR hoạt động.

### 4. Chạy Ứng Dụng
1. Mở terminal tại thư mục gốc của project.
2. Chạy lệnh:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
3. Truy cập Swagger tại: `http://localhost:5206/index.html` (port có thể thay đổi tùy cấu hình).

## 📂 Cấu Trúc Thư Mục

- `Controllers/`: Chứa các API Endpoints.
- `Models/`: Định nghĩa các thực thể (Entities).
- `DTOs/`: Chứa các đối tượng chuyển đổi dữ liệu (RoleDtos, ManagementDtos...).
- `Services/`: Chứa logic nghiệp vụ (NotificationService, UserManagementService...).
- `Hubs/`: Chứa `NotificationHub.cs` xử lý Real-time SignalR.
- `Middleware/`: Chứa các lớp xử lý request/response trung gian.
- `sql/`: Các mã nguồn SQL theo module.

## 🔒 Tài Khoản Mặc Định
- **Admin**: `admin@hotel.com` / `Admin@123` (Hoặc theo cấu hình trong file SQL).

---
*Dự án ERP Khách sạn*
