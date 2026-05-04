# 🏨 KANT Hotel Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-gold)
![.NET](https://img.shields.io/badge/.NET-10.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-CC2927)
![License](https://img.shields.io/badge/license-MIT-green)

**Hệ thống quản lý khách sạn toàn diện**
</div>

---

## 📖 Giới thiệu

**KANT Hotel Management System** là một hệ thống ERP (Enterprise Resource Planning) quản lý khách sạn được xây dựng theo kiến trúc **Full-Stack hiện đại**, bao gồm:

- 🖥️ **Backend**: ASP.NET Core Web API (.NET 10)
- ⚛️ **Frontend**: React 19 + Vite + TypeScript
- 🗄️ **Database**: Microsoft SQL Server
- 🔌 **Realtime**: SignalR (WebSocket)

Hệ thống phục vụ đầy đủ 3 vai trò: **Khách hàng**, **Nhân viên** và **Quản trị viên**, với giao diện sang trọng theo phong cách Luxury Hotel.

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 🔐 **Xác thực & Phân quyền** | JWT + Refresh Token, RBAC động theo Permission |
| 📅 **Đặt phòng trực tuyến** | Khách hàng đặt phòng, chọn ngày, áp voucher |
| 💳 **Thanh toán MoMo** | Tích hợp cổng thanh toán MoMo thực tế |
| 🔔 **Thông báo Real-time** | SignalR push notification theo role |
| 📊 **Dashboard & Thống kê** | Biểu đồ doanh thu, tỷ lệ lấp đầy phòng |
| 🧾 **Hóa đơn & In ấn** | Tạo, quản lý và in hóa đơn PDF |
| 📦 **Import Excel** | Nhập hàng loạt dữ liệu vật tư qua file .xlsx/.csv |
| 🛎️ **Dịch vụ phòng** | Khách gọi dịch vụ, nhân viên xử lý real-time |
| 🏆 **Hạng thành viên** | Tích điểm loyalty, tự động nâng hạng |
| 📜 **Nhật ký hệ thống** | Audit log toàn bộ hành động, xuất JSON |
| 🔧 **Đền bù hỏng hóc** | Quản lý vật tư hư hỏng, trừ trực tiếp hóa đơn |
| 🌐 **CMS Nội dung** | Quản lý tin tức, địa điểm, tiện ích |

---

## 🏗️ Kiến trúc hệ thống

```
Hotel-Project/
├── Back_end/                    # ASP.NET Core Web API
│   ├── Controllers/             # 28 API Controllers
│   ├── Services/                # 29 Business Logic Services
│   ├── Models/                  # 33 Entity Models
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Data/                    # DbContext, Seeders, Initializers
│   ├── Hubs/                    # SignalR NotificationHub
│   ├── Middleware/              # Exception, Permission, RefreshToken
│   ├── Configurations/          # MoMo, Settings configs
│   └── sql/DBHotel.sql          # Script tạo database
│
└── Front_end/                   # React + Vite + TypeScript
    └── src/
        ├── pages/
        │   ├── public/          # 11 trang khách hàng
        │   ├── admin/           # 19 trang quản trị
        │   ├── staff/           # 4 trang nhân viên
        │   └── auth/            # Đăng nhập, Đăng ký, Quên MK
        ├── components/          # Components tái sử dụng
        ├── store/               # Redux Toolkit state
        ├── services/            # Axios API calls
        ├── hooks/               # Custom React hooks
        ├── routes/              # Routing + ProtectedRoute
        └── utils/               # Tiện ích dùng chung
```

---

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| ASP.NET Core | .NET 10 | Web API Framework |
| Entity Framework Core | 9.x | ORM Database |
| SQL Server | 2019+ | Cơ sở dữ liệu |
| JWT Bearer | — | Xác thực Token |
| BCrypt.Net-Next | — | Mã hóa mật khẩu |
| SignalR | — | Realtime Notification |
| Cloudinary SDK | — | Lưu trữ hình ảnh |
| MoMo Payment API | — | Cổng thanh toán |
| Swagger / OpenAPI | — | Tài liệu API |
| MemoryCache | — | Caching |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 6.x | Build Tool |
| TypeScript | 5.x | Type Safety |
| Redux Toolkit | — | State Management |
| React Router | v7 | Routing |
| Axios | — | HTTP Client |
| Ant Design | 5.x | UI Component Library |
| Tailwind CSS | 3.x | Utility CSS |
| Framer Motion | — | Animations |
| Recharts | — | Biểu đồ thống kê |
| Lucide React | — | Icon Library |
| SignalR Client | — | Realtime Connection |
| dayjs | — | Xử lý ngày tháng |

---

## 📋 Chức năng chi tiết

### 👤 Khách hàng (Public)
- Xem trang chủ, phòng, dịch vụ, điểm tham quan, tin tức, giới thiệu
- Tìm kiếm và lọc phòng theo ngày, loại, giá
- Xem chi tiết phòng với ảnh đẹp, tiện ích
- **Đặt phòng trực tuyến** với áp dụng mã voucher
- **Thanh toán đặt cọc qua MoMo**
- Xem lịch sử đặt phòng, trạng thái booking
- Gọi dịch vụ phòng trong thời gian lưu trú
- Đánh giá phòng / dịch vụ sau check-out
- Nhận thông báo real-time qua trình duyệt
- Quản lý hồ sơ cá nhân, đổi mật khẩu, avatar
- Xem tích điểm và hạng thành viên

### 🧑‍💼 Nhân viên (Staff)
- Theo dõi danh sách đặt phòng theo trạng thái
- Xử lý Check-in / Check-out khách hàng
- Cập nhật trạng thái dọn phòng theo thời gian thực
- Quản lý đơn gọi dịch vụ phòng (nhận, xử lý, hoàn thành)
- Quản lý hóa đơn và thanh toán
- Cộng minibar / dịch vụ phát sinh vào hóa đơn
- Nhận thông báo ngay khi có booking hoặc yêu cầu mới

### 👑 Quản trị viên (Admin)
- **Dashboard**: Thống kê doanh thu, tỷ lệ lấp đầy, khách hàng mới
- **Phân tích**: Biểu đồ doanh thu theo tháng, loại phòng, phương thức thanh toán
- **Người dùng**: CRUD, khóa/mở tài khoản, phân role
- **Phòng**: Tạo hàng loạt, đồng bộ vật tư, quản lý ảnh, trạng thái
- **Loại phòng**: Quản lý hạng phòng, tiện ích, ảnh đại diện
- **Booking**: Toàn quyền quản lý, đổi phòng, tách booking
- **Hóa đơn**: Xem, tạo thanh toán (Tiền mặt / Chuyển khoản / MoMo), in PDF
- **Vật tư**: CRUD, Import Excel hàng loạt, quản lý kho
- **Đền bù hỏng hóc**: Ghi nhận, xác nhận, hủy — tự động cập nhật hóa đơn
- **Dịch vụ & Voucher**: Quản lý dịch vụ, tạo mã khuyến mãi
- **Hạng thành viên**: Cấu hình ngưỡng điểm, quyền lợi
- **Phân quyền**: Quản lý Role, gán/gỡ Permission động
- **Nội dung**: CMS tin tức, điểm tham quan, tiện ích khách sạn
- **Nhật ký**: Audit log toàn bộ thao tác, lọc và xuất JSON
- **Cài đặt hệ thống**: Cấu hình thông tin khách sạn

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- ✅ .NET SDK **10.0** trở lên
- ✅ Node.js **18.x** trở lên + npm
- ✅ SQL Server **2019** trở lên
- ✅ Visual Studio 2022 / VS Code / Rider

### Bước 1 — Clone dự án

```bash
git clone https://github.com/Nam1414/Hotel-Project.git
cd Hotel-Project
```

### Bước 2 — Thiết lập Database

1. Mở **SQL Server Management Studio (SSMS)**
2. Chạy file script:
   ```
   Back_end/sql/DBHotel.sql
   ```
3. Kiểm tra database `HotelManagementDB` đã được tạo

### Bước 3 — Cấu hình Backend

Mở file `Back_end/appsettings.json` và cập nhật các thông số:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HotelManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "your-super-secret-key-minimum-32-chars",
    "Issuer": "HotelManagementAPI",
    "Audience": "HotelManagementClient",
    "ExpiryMinutes": 60
  },
  "Cloudinary": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "MoMo": {
    "PartnerCode": "your-partner-code",
    "AccessKey": "your-access-key",
    "SecretKey": "your-secret-key",
    "PaymentUrl": "https://test-payment.momo.vn/v2/gateway/api/create",
    "ReturnUrl": "http://localhost:5173",
    "NotifyUrl": "https://your-ngrok-url/api/invoices/momo-notify"
  },
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-app-password"
  }
}
```

### Bước 4 — Chạy Backend

```bash
cd Back_end
dotnet restore
dotnet run
```

> Backend mặc định chạy tại: `http://localhost:5052`
> Swagger UI: `http://localhost:5052` (truy cập trực tiếp root)

### Bước 5 — Chạy Frontend

```bash
cd Front_end
npm install
npm run dev
```

> Frontend mặc định chạy tại: `http://localhost:5173`

---

## 🔑 Tài khoản Demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| **Admin** | admin@kant.com | Admin@123 |
| **Manager** | manager@kant.com | Manager@123 |
| **Staff** | staff@kant.com | Staff@123 |
| **Khách hàng** | guest@kant.com | Guest@123 |

> ℹ️ Dữ liệu mẫu được tự động seed khi chạy lần đầu trong môi trường Development.

---

## 🗄️ Cơ sở dữ liệu

Hệ thống sử dụng **33 bảng** chính:

```
Users, Roles, Permissions, RolePermissions
Rooms, RoomTypes, RoomImages, RoomInventory, RoomCleanings, RoomTransferLogs
Bookings, BookingDetails
Invoices, Payments
OrderServices, OrderServiceDetails
Equipments, LossAndDamages
Services, ServiceCategories
Vouchers, Memberships
Reviews, Notifications, AuditLogs
Articles, ArticleCategories, Attractions, Amenities
SystemSettings
```

---

## 🔐 Bảo mật

- **JWT Authentication** với Access Token (60 phút) + Refresh Token (7 ngày)
- **RBAC** (Role-Based Access Control) — Phân quyền chi tiết theo Permission
- **BCrypt** mã hóa mật khẩu với salt tự động
- **Middleware bảo vệ** toàn bộ route Admin/Staff
- **Audit Log** ghi lại mọi thao tác quan trọng (bao gồm đăng nhập thất bại)
- **CORS** chỉ cho phép origin frontend

---

## 📡 API Endpoints chính

| Nhóm | Prefix | Mô tả |
|---|---|---|
| Auth | `/api/Auth` | Đăng nhập, đăng ký, refresh, quên mật khẩu |
| Booking | `/api/Booking` | Đặt phòng, cập nhật trạng thái |
| Rooms | `/api/Rooms` | Quản lý phòng |
| Invoices | `/api/invoices` | Hóa đơn, thanh toán MoMo |
| Equipments | `/api/Equipments` | Vật tư, import Excel, đền bù |
| OrderServices | `/api/OrderServices` | Dịch vụ phòng |
| Users | `/api/UserManagement` | Quản lý người dùng |
| Roles | `/api/Roles` | Vai trò & phân quyền |
| AuditLogs | `/api/AuditLogs` | Nhật ký hệ thống |
| Notifications | `/api/Notifications` | Thông báo |

> 📖 Xem đầy đủ tại Swagger: `http://localhost:5052`

---

## 📁 Luồng nghiệp vụ chính

```
Khách hàng đặt phòng
    ↓ Hệ thống tạo Booking (Pending)
    ↓ Admin/Staff xác nhận → Booking (Confirmed)
    ↓ Khách check-in → Booking (CheckedIn)
    ↓ Gọi dịch vụ / Minibar → OrderService
    ↓ Check-out → Booking (CheckedOut)
    ↓ Tạo hóa đơn (Invoice) — tự động tính:
        • Tiền phòng
        • Tiền dịch vụ đã hoàn thành
        • Tiền đền bù hỏng hóc (nếu có)
        • Giảm giá Voucher
        • Thuế VAT 10%
        • Trừ tiền cọc đã đặt
    ↓ Thanh toán (Tiền mặt / Chuyển khoản / MoMo)
    ↓ In hóa đơn PDF
    ↓ Cộng điểm Loyalty cho khách thành viên
```

---

## 🎨 Giao diện

Hệ thống có 3 phân hệ giao diện riêng biệt:

- **🌐 Public (Khách hàng)**: Giao diện khách sạn sang trọng, dark mode, hiệu ứng glassmorphism
- **🛡️ Admin Panel**: Dashboard quản trị đầy đủ công cụ, biểu đồ realtime
- **🧑‍💼 Staff Panel**: Giao diện tối giản, tập trung vào tác vụ nhanh

---

## 🤝 Đóng góp

Đây là dự án **đồ án sinh viên** — không nhận đóng góp từ bên ngoài trong giai đoạn bảo vệ.

---

## 📞 Thông tin nhóm

| | |
|---|---|
| **Tên dự án** | KANT Hotel Management System |
| **Nhóm thực hiện** | KANT Team |
| **Trường** | Đại học Lạc Hồng |
| **Khoa** | Công nghệ Thông tin |
| **Lớp** | 23CT111 |
| **Email** | khatong072@gmail.com |

---

## 📄 License

Dự án được phát triển phục vụ mục đích **học tập và nghiên cứu**.

---

<div align="center">

**© 2026 KANT Team · Đại học Lạc Hồng**

*Chúc buổi bảo vệ đồ án thành công rực rỡ! 🎓*

</div>
