# 🏨 Hotel Management System - Hệ Thống ERP Quản Lý Khách Sạn Toàn Diện

Một giải pháp phần mềm quản trị khách sạn hiện đại, cung cấp hệ sinh thái đầy đủ từ backend mạnh mẽ đến frontend mượt mà. Hệ thống hỗ trợ quản lý nhân sự, đặt phòng, thiết bị, minibar và tính năng **thông báo theo thời gian thực (Real-time Notifications)**.

---

## 🚀 Công Nghệ Sử Dụng

### Backend (API Server)
- **Framework**: .NET 8.0 (ASP.NET Core Web API)
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core
- **Authentication**: JWT (JSON Web Token) với kiến trúc Refresh Token
- **Real-time Engine**: **SignalR** (Auto-Negotiation: WebSockets ➔ SSE ➔ Long Polling)
- **Security**: Phân quyền RBAC (Role-Based Access Control), Password Hashing (BCrypt.Net-Next)
- **Cloud Storage**: Cloudinary (lưu trữ ảnh phòng, avatar)
- **Document**: Swagger / OpenAPI

### Frontend (Client App)
- **Core**: React 18 + TypeScript (build bằng Vite siêu tốc)
- **UI Framework**: Ant Design v5 (Thiết kế hiện đại, tùy biến cao)
- **State Management**: Redux Toolkit & Zustand
- **Animations**: Framer Motion
- **Fetching**: Axios (kèm Interceptors xử lý Token tự động)

---

## ✨ Các Module Tính Năng Chính

### 1. Phân Quyền & Bảo Mật (Auth & Roles)
- Đăng nhập, xuất/nhập/cấp lại JWT Token an toàn.
- Hệ thống Role linh hoạt (Admin, Manager, Receptionist,...).
- Mapping Permissions (Quyền hạn) trực tiếp từ database lên UI bảo vệ từng Nút bấm và Route.

### 2. Quản Lý Nhân Sự (User Management)
- Xem, Thêm, Sửa, Xóa nhân sự, Khóa/Mở Khóa tài khoản.
- *Thay đổi lập tức có hiệu lực ngay trong phiên làm việc của người dùng.*

### 3. Hệ Thống Thông Báo Hiện Thực (Real-time Notifications)
- Cơ chế **Group Broadcasting** (Rải thông báo theo nhóm quyền).
- Tự động reo chuông báo (Ant Design Notification) chém góc màn hình bất cứ khi nào:
  - Có nhân sự mới được thêm vào.
  - Tài khoản bị khóa / mở khóa hoặc thay đổi chức vụ.
- Tích hợp **Redux** để cập nhật con số Badge trên Menu Bell không cần tải lại trang.

### 4. Quản Lý Buồng Phòng (Rooms & Inventory)
- Cấu hình loại phòng, mức giá gốc, tiện ích đi kèm (Amenities).
- Trích xuất hàng loạt Inventory (Tồn kho): quản lý giá tự động biến động theo ngày lễ, cuối tuần.

### 5. Quản Lý Vật Tư & Minibar (Management)
- Thiết lập định mức Minibar cho từng phòng (Nước suối, Snack, Rượu,...).
- Danh sách tài sản cố định trong phòng, tính giá bồi thường tự động khi làm hỏng.

---

## 🛠️ Hướng Dẫn Cài Đặt (Cho máy tính mới)

Chỉ với 3 bước đơn giản, bạn có thể triển khai dự án này lên bất kỳ máy tính nào:

### Bước 1: Khai sinh Database (Chỉ 1 Click)
Chúng tôi đã nén toàn bộ kiến trúc lịch sử, cấu trúc bảng và cả Data Mẫu vào duy nhất **1 file SQL**:
1. Mở **SQL Server Management Studio (SSMS)**.
2. File > Open > File... và chọn tệp: `Back_end/sql/00_MASTER_INSTALL.sql`
3. Nhấn **F5 (Execute)**.
*(Tuyệt đối không cần chạy thủ công các file nhỏ lẻ). Hệ thống đã tự động tạo CSDL `HotelManagementDB` và nạp sẵn hàng loạt nhân sự, dịch vụ.*

### Bước 2: Cấu hình Backend
1. Mở folder `Back_end` bằng Visual Studio hoặc VS Code.
2. Kiểm tra file `appsettings.json`:
   - Xác nhận `ConnectionStrings:DefaultConnection` trỏ đúng vào SQL Server của bạn (thường là `Server=.;`).
   - Sửa key Cloudinary nếu muốn thay đổi kho lưu ảnh chứa hình cá nhân.
3. Mở terminal và chạy lệnh:
   ```bash
   dotnet restore
   dotnet run
   ```
4. API sẽ phơi tại: `http://localhost:5206` (kèm Swagger document tại `/index.html`)

### Bước 3: Khởi chạy Frontend
1. Mở một terminal mới, trỏ vào folder `Front_end`.
2. Chạy lệnh:
   ```bash
   npm install
   npm run dev
   ```
3. Truy cập giao diện tại: `http://localhost:5173`

---

## 🔒 Tài Khoản Đăng Nhập Mẫu

File cài đặt tự động đã nung sẵn tài khoản cao nhất để bạn trải nghiệm ngay lập tức.
- **Tài khoản (Email)**: `admin@hotel.com`
- **Mật khẩu**: `Admin@123`
*(Tài khoản này sở hữu quyền tối thượng: FULL_ACCESS).*

---
*Dự án tâm huyết - Phiên bản nâng cấp 2026/03*
