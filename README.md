# 🏨 Hệ Thống Quản Lý & Đặt Phòng Khách Sạn (Hotel Management ERP & Booking Portal)

Ứng dụng toàn diện phục vụ kinh doanh khách sạn **full-stack**, kết hợp giữa Cổng thông tin cho Khách hàng (Customer Booking Portal) và Hệ thống Quản trị Nội bộ (ERP/Admin Dashboard).

**Cấu Trúc:**
- 🔧 **Backend**: ASP.NET Core 10 Web API
- 🎨 **Frontend**: React 19 + TypeScript + Vite + TailwindCSS

---

## 📋 Mục Lục

1. [Tính Năng Nổi Bật](#✨-tính-năng-nổi-bật)
2. [Stack Công Nghệ](#💻-stack-công-nghệ)
3. [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
4. [Các Tuyến Route (Routing)](#-các-tuyến-route)
5. [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
6. [Cài Đặt Nhanh](#-cài-đặt-nhanh)
7. [Cấu Hình](#-cấu-hình)
8. [Tài Khoản Mặc Định](#-tài-khoản-mặc-định)

---

## ✨ Tính Năng Nổi Bật

### 🌐 Trải nghiệm Khách hàng (Customer Portal)
- ✅ **Hệ thống đặt phòng đa dạng:** Hỗ trợ khách hàng đặt nhiều loại phòng cùng lúc (Multi-room Booking), chọn ngày Check-in / Check-out, áp dụng Mã giảm giá (Voucher) và tính toán số tiền cọc.
- ✅ **Cổng thông tin cá nhân (My Bookings):** Khách hàng quản lý lịch sử đặt phòng, xem trạng thái, theo dõi chi phí ngay tại trang Profile cá nhân.
- ✅ **Gọi dịch vụ tại phòng (Room Service):** Tính năng tự phục vụ - Khách hàng đang lưu trú có thể gọi thức ăn, đồ uống, spa... ngay trên hệ thống. Bill tự động cộng dồn vào hóa đơn tổng khi trả phòng.
- ✅ **Đánh giá & Trải nghiệm (Review System):** Khách hàng có thể để lại nhận xét, chấm điểm cho từng loại phòng. Đánh giá được kiểm duyệt qua Admin trước khi hiển thị công khai.

### 🔐 Xác Thực & Bảo Mật
- ✅ Đăng nhập với JWT token (Hỗ trợ Refresh Token lưu an toàn trong cookie `HttpOnly`).
- ✅ Mã hóa mật khẩu với BCrypt.
- ✅ Phân quyền chặt chẽ: Dựa trên Role (Admin, Staff, Guest) và Cấp quyền chi tiết (Permissions như `MANAGE_ROOMS`, `MANAGE_BOOKINGS`...).

### 🏢 Quản Trị Hệ Thống (Admin ERP)
- ✅ **Quản Lý Phòng & Loại Phòng:** Setup phòng, hạng phòng, tiện ích (Amenities), tải ảnh trực tiếp qua Cloudinary. Theo dõi trạng thái realtime (Trống, Đã đặt, Đang dọn, Bảo trì).
- ✅ **Lễ Tân & Đặt Phòng (Receptionist):** Nhận/trả phòng, tách hóa đơn, chuyển phòng, theo dõi và tính phụ phí Minibar.
- ✅ **Dọn Phòng (Housekeeping):** Tự động chuyển trạng thái phòng sang "Bẩn" sau khi trả phòng, giao việc cho nhân viên dọn dẹp.
- ✅ **Quản Lý Vật Tư & Kho:** Theo dõi vật tư trong kho, trong phòng, quản lý hàng hỏng/mất mát và tự động tính tiền đền bù vào hóa đơn.
- ✅ **Quản Lý Nội Dung (CMS):** Viết bài viết, quản lý danh mục (Blog/News), tự động tạo slug chuẩn SEO. Giới thiệu các "Điểm Tham Quan" lân cận kèm tọa độ GPS.

### 📢 Thông Báo & Thống Kê (Realtime & Dashboard)
- ✅ WebSockets (SignalR) bắn thông báo thời gian thực khi có người đặt phòng, gọi dịch vụ, thay đổi trạng thái...
- ✅ Dashboard trực quan: Báo cáo tỷ lệ lấp đầy, phòng trống, hàng tồn kho, công việc cần làm trong ngày.

---

## 💻 Stack Công Nghệ

### Backend
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| .NET SDK | 10.0.201 | Runtime |
| ASP.NET Core | 10.0 | Web API Framework |
| Entity Framework | 9.0.3 | ORM |
| SQL Server | 2019+ | Database |
| JWT Bearer | 10.0 | Authentication |
| SignalR | built-in | Realtime WebSocket |
| Swagger | 6.9.0 | API Documentation |
| BCrypt.Net | 4.0.3 | Password Hashing |
| CloudinaryDotNet | 1.27.8 | Image Storage |
| Slugify.Core | 5.1.1 | URL Slug |

### Frontend
| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| React | 19.0.0 | UI Library |
| TypeScript | 5.8.2 | Type Safety |
| Vite | 6.2.0 | Build Tool |
| TailwindCSS | 4.1.14 | Styling / Layout |
| Redux Toolkit | 2.11.2 | State Management |
| React Router | 7.13.2 | Routing |
| Axios | 1.13.6 | HTTP Client |
| Ant Design | 6.3.4 | UI Components |
| Lucide React | 0.546.0 | Icons |
| SignalR Client | 10.0.0 | WebSocket Client |

---

## 🗂️ Cấu Trúc Dự Án

### Backend
```
Back_end/
├── Controllers/               # 20+ API Controllers (Booking, Services, Auth, Rooms...)
├── Services/                  # Business Logic (BookingService, InvoiceService, Notification...)
├── Models/                    # Entity Models (User, Room, Booking, Invoice, Review...)
├── Data/                      # Database Context & Init logic
├── DTOs/                      # Data Transfer Objects
├── Middleware/                # Auth, Permission & RefreshToken Middlewares
├── Hubs/                      # SignalR Hub (NotificationHub)
├── sql/                       # SQL Setup scripts (00_MASTER_INSTALL.sql)
└── Program.cs                 # App Bootstrap & Service Registration
```

### Frontend
```
Front_end/src/
├── pages/
│   ├── auth/                  # Login, Register
│   ├── public/                # Trang Khách hàng (Home, Rooms, RoomDetail, Booking...)
│   ├── admin/                 # 20+ Trang Quản trị (Dashboard, Booking, Inventory, Users...)
│   ├── staff/                 # Cổng Nhân viên (Dọn phòng, Xem lịch...)
│   └── errors/                # 401, 404 Pages
├── components/                # Reusable UI Components
├── services/                  # API Callers (axios, bookingApi, reviewApi...)
├── store/                     # Redux slices (authSlice, themeStore...)
├── routes/                    # Private/Public Routing logic
└── utils/                     # Formatters, Helpers
```

---

## 🛣️ Các Tuyến Route (Routing)

### 🌟 Public Routes (Khách Hàng)
| Route | Mô Tả |
|-------|-------|
| `/` | Trang chủ giới thiệu khách sạn |
| `/rooms` | Danh sách loại phòng |
| `/rooms/:id` | Chi tiết phòng & Đánh giá |
| `/booking` | Trang thanh toán / Đặt phòng đa tùy chọn |

### 👨‍💼 Customer Portal
| Route | Mô Tả | Yêu cầu |
|-------|-------|---------|
| `/profile` | Quản lý thông tin, Đổi mật khẩu, **My Bookings**, Gọi dịch vụ | Đăng nhập |

### 👑 Admin / Staff Routes (Nội Bộ)
| Route | Mô Tả | Yêu Cầu Phân Quyền |
|-------|-------|--------------------|
| `/admin` | Tổng quan (Dashboard) | Admin / Manager |
| `/admin/bookings` | Quản lý đặt phòng, Check-in/out, Hóa đơn | `MANAGE_BOOKINGS` |
| `/admin/users` | Quản lý người dùng, Vai trò | `MANAGE_USERS` |
| `/admin/rooms` | Quản lý danh sách phòng vật lý | `MANAGE_ROOMS` |
| `/admin/room-types` | Quản lý Loại phòng & Giá cả | `MANAGE_ROOMS` |
| `/admin/cleaning` | Phân công Dọn dẹp phòng | Staff / Housekeeping |
| `/admin/equipment` | Quản lý Vật tư, Tài sản cố định | `MANAGE_INVENTORY` |
| `/admin/inventory` | Quản lý Kho lưu trữ tiêu hao | `MANAGE_INVENTORY` |
| `/admin/reviews` | Duyệt / Xóa đánh giá của khách hàng | Admin / Manager |

---

## 💾 Yêu Cầu Hệ Thống

### Backend
- 🔹 **.NET SDK 10.0+**
- 🔹 **SQL Server 2019+** hoặc **SQL Server Express**

### Frontend
- 🔹 **Node.js 20+**
- 🔹 **npm 10+**

---

## 🚀 Cài Đặt Nhanh

### Bước 1: Khởi tạo Database
1. Mở **SQL Server Management Studio (SSMS)** hoặc **Azure Data Studio**.
2. Chạy script file `Back_end/sql/DBHotel.sql` hoặc `00_MASTER_INSTALL.sql` để tạo toàn bộ bảng, stored procedure, và dữ liệu mẫu mặc định.

### Bước 2: Chạy Backend
```bash
cd Back_end
dotnet restore
dotnet build
dotnet run
```
> API chạy tại: `http://localhost:5206`
> Swagger UI: `http://localhost:5206/swagger`

### Bước 3: Chạy Frontend
```bash
cd Front_end
npm install
npm run dev
```
> Website chạy tại: `http://localhost:5173`

---

## ⚙️ Cấu Hình

### Backend - `Back_end/appsettings.json`
Đảm bảo bạn thay đổi `ConnectionStrings` và thông tin `Cloudinary` / `JwtSettings` phù hợp với môi trường của bạn:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HotelManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "Your_Super_Secret_Key_Here",
    "Issuer": "HotelManagementAPI",
    "Audience": "HotelManagementClient",
    "AccessTokenExpireMinutes": 480,
    "RefreshTokenExpireDays": 7
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  }
}
```

### Frontend - `Front_end/.env.local`
```env
VITE_API_URL=http://localhost:5206
```

---

## 🔑 Tài Khoản Mặc Định

Nếu sử dụng DB mặc định, bạn có thể đăng nhập bằng tài khoản Quản trị viên:
```
📧 Email: admin@hotel.com
🔐 Password: Admin@123
```
*(Khuyến cáo: Vui lòng thay đổi mật khẩu hoặc xóa tài khoản này trên môi trường Production!)*

---

## 📝 Kiến Trúc & Quy Ước
- **Database Logic:** Hệ thống ưu tiên chạy bằng các file `.sql` script (nằm ở thư mục `/sql`), hạn chế Entity Framework Migrations nhằm tăng tốc độ khởi tạo.
- **Media Upload:** Toàn bộ file ảnh tĩnh/avatar đều được lưu trữ trực tiếp trên **Cloudinary**. Hệ thống DB chỉ lưu URL.
- **Realtime / WebSockets:** Sử dụng SignalR Hub để liên lạc hai chiều giữa API và React (Thông báo dọn phòng, thông báo khách đặt dịch vụ, v.v).

---
*Phát triển chuyên sâu dành cho mục tiêu Quản trị Khách sạn thông minh.*
