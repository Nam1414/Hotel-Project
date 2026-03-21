# Hotel Management API - Hệ Thống ERP Quản Lý Khách Sạn

Dự án này là một API backend được xây dựng bằng **.NET 10**, cung cấp các dịch vụ quản lý cho hệ thống khách sạn, bao gồm quản lý người dùng, loại phòng, phòng, kho lưu trữ và tích hợp lưu trữ hình ảnh qua Cloudinary.

## 🚀 Công Nghệ Sử Dụng

- **Framework**: .NET 10.0 (Web API)
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core 9.0
- **Authentication**: JWT (JSON Web Token) với Refresh Token
- **Hasing**: BCrypt.Net-Next
- **Image Cloud**: Cloudinary
- **API Documentation**: Swagger/OpenAPI (Swashbuckle)
- **Utils**: Slugify.Core (Tạo slug cho URL)

## ✨ Tính Năng Chính

- **Quản lý người dùng (User Management API)**:
    - Danh sách người dùng, tạo mới, cập nhật và xóa.
    - **Thay đổi quyền/vai trò** (`change-role`) trực tiếp cho người dùng.
- **Xác thực & Phân quyền**:
    - Đăng ký, đăng nhập.
    - Bảo mật JWT với cơ chế Refresh Token thông qua Middleware.
    - Phân quyền người dùng (Roles & Permissions).
- **Quản lý phòng (Room Module)**:
    - Quản lý loại phòng (Room Types) với tính năng tạo Slug tự động.
- **Quản lý tồn kho (Inventory API)**:
    - Xem tình trạng phòng trống và giá theo dải ngày.
    - Hỗ trợ các thao tác chuẩn: Lấy theo ID, Cập nhật (PUT), Xóa (DELETE).
    - **Nhân bản dữ liệu (Clone)**: Sao chép thông tin từ một bản ghi sang ngày tiếp theo.
    - Quản lý danh sách các điểm du lịch xung quanh khách sạn.
    - **Hỗ trợ tọa độ GPS (Latitude, Longitude)** để tích hợp bản đồ.
- **Tiện nghi (Amenities API)**:
    - Quản lý danh sách các tiện nghi (Wifi, Điều hòa, Bể bơi...).
    - Thiết lập tiện nghi cho từng loại phòng (Table junction `RoomType_Amenities`).
- **Lưu trữ hình ảnh**: Tích hợp Cloudinary để upload và quản lý ảnh (avatar, ảnh phòng...).
- **API Documentation**: Tài liệu API đầy đủ qua Swagger UI.
- **Middleware**: Xử lý Refresh Token tự động.

## 🛠️ Hướng Dẫn Cài Đặt (Khi pull về máy mới)

Để chạy project trên một môi trường mới, bạn cần thực hiện các bước sau:

### 1. Yêu Cầu Hệ Thống (Prerequisites)
- Cài đặt **.NET 10 SDK** (hoặc bản mới nhất tương thích).
- Cài đặt **Microsoft SQL Server** (2019 hoặc mới hơn).
- Một tài khoản **Cloudinary** (để lấy API Key).

- **Thiết Lập Cơ Sở Dữ Liệu (Database)**
    1. Mở SQL Server Management Studio (SSMS).
    2. Chạy file script chính `sql/DBHotel.sql` để tạo database `HotelManagementDB` và dữ liệu mẫu.
    3. **Chạy script bổ sung**: `sql/patch_attractions_gps.sql` để cập nhật tọa độ GPS cho các điểm tham quan.
    4. (Tùy chọn) Chạy `sql/create_admin_account.sql` nếu muốn khởi tạo lại tài khoản Admin chuyên biệt (`admin@hotel.com` / `Admin@123`).

### 3. Cấu Hình Ứng Dụng (Configuration)
Mở file `appsettings.json` trong thư mục gốc và cập nhật các thông tin sau:

- **ConnectionStrings**: Thay đổi `Server`, `User Id`, và `Password` cho phù hợp. Đảm bảo `Database=HotelManagementDB`.
  ```json
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=HotelManagementDB;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=true;"
  ```
- **JWT Settings**: Có thể thay đổi `Secret` để tăng tính bảo mật.
- **Cloudinary**: Cập nhật `CloudName`, `ApiKey`, và `ApiSecret` từ dashboard Cloudinary của bạn.

### 4. Chạy Ứng Dụng
1. Mở terminal tại thư mục gốc của project.
2. Restore các package cần thiết:
   ```bash
   dotnet restore
   ```
3. Chạy project:
   ```bash
   dotnet run
   ```
4. Sau khi chạy thành công, truy cập vào Swagger UI tại địa chỉ mặc định (thường là `http://localhost:5030/` hoặc theo port hiển thị trên console) để xem danh sách API.

## 📂 Cấu Trúc Thư Mục

- `Controllers/`: Chứa các API Endpoints.
- `Models/`: Định nghĩa các thực thể (Entities) và cấu trúc dữ liệu.
- `DTOs/`: Chứa các Data Transfer Objects.
- `Data/`: Chứa `AppDbContext` để liên kết với Database.
- `Services/`: Chứa logic nghiệp vụ (Business Logic).
- `Middleware/`: Chứa các lớp xử lý request/response trung gian (VD: Refresh Token).
- `sql/`: Các mã nguồn SQL để khởi tạo và đồng bộ database.

## 🔒 Tài Khoản Mặc Định (Sau khi chạy Scripts)
- **Admin**: `admin@hotel.com` / `12345678` (Hoặc theo cấu hình trong file SQL).

---
*Dự án được phát triển nhằm mục đích quản lý ERP cho khách sạn.*
