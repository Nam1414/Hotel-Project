# 🏨 Hệ Thống Quản Lý Khách Sạn

Ứng dụng quản lý khách sạn **full-stack** được xây dựng với công nghệ hiện đại, tập trung vào hoạt động nội bộ của khách sạn.

**Cấu Trúc:**
- 🔧 **Backend**: ASP.NET Core 10 Web API
- 🎨 **Frontend**: React 19 + TypeScript + Vite

---

## 📋 Mục Lục

1. [Tính Năng Chính](#✨-tính-năng-chính)
2. [Stack Công Nghệ](#💻-stack-công-nghệ)
3. [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
4. [Các Tuyến Route](#-các-tuyến-route)
5. [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
6. [Cài Đặt Nhanh](#-cài-đặt-nhanh)
7. [Cấu Hình](#-cấu-hình)
8. [Tài Khoản Mặc Định](#-tài-khoản-mặc-định)

---

## ✨ Tính Năng Chính

### 🔐 Xác Thực & Bảo Mật
- ✅ Đăng nhập với JWT token
- ✅ Refresh token lưu trong cookie `HttpOnly`
- ✅ Mã hóa mật khẩu với BCrypt
- ✅ Quản lý phiên làm việc an toàn

### 👥 Quản Lý Người Dùng & Phân Quyền
- ✅ Quản lý danh sách người dùng
- ✅ Phân quyền theo `Role` (Admin, Manager, Receptionist, Housekeeping)
- ✅ Phân quyền chi tiết theo `Permission`
- ✅ Hồ sơ cá nhân & đổi mật khẩu
- ✅ Tải ảnh đại diện từ Cloudinary

### 🏠 Quản Lý Phòng
- ✅ Danh sách phòng chi tiết
- ✅ Phân loại phòng theo hạng (Standard, Deluxe, Suite, etc)
- ✅ Quản lý hình ảnh phòng (upload via Cloudinary)
- ✅ Quản lý tiện nghi phòng (Amenities)
- ✅ Theo dõi trạng thái phòng (Trống, Đã đặt, Đang dọn, Bảo trì)
- ✅ Tracking vệ sinh phòng (Sạch, Bẩn, Đang dọn)

### 🧹 Quản Lý Dọn Phòng
- ✅ Gán công việc dọn cho housekeeping  
- ✅ Cập nhật trạng thái realtime
- ✅ Theo dõi tiến độ công việc

### 📦 Quản Lý Vật Tư & Kho
- ✅ Danh sách vật tư đầy đủ
- ✅ Theo dõi tồn kho (Trong kho, Đang dùng, Hỏng)
- ✅ Ghi nhận vật tư hỏng/mất mát
- ✅ Tính toán chi phí bồi thường tự động

### 🎯 Quản Lý Điểm Tham Quan
- ✅ Danh sách điểm tham quan gần khách sạn
- ✅ Khoảng cách & tọa độ GPS
- ✅ Tải lên ảnh qua Cloudinary
- ✅ Hiển thị/ẩn điểm tham quan

### 📰 Quản Lý Nội Dung / CMS
- ✅ Tạo & quản lý bài viết
- ✅ Phân loại bài viết theo danh mục (Article Categories)
- ✅ Tạo slug tự động

### 📢 Thông Báo Realtime
- ✅ Thông báo tức thời qua SignalR WebSocket
- ✅ Lọc thông báo theo vai trò (Admin, Manager)
- ✅ Lưu lịch sử thông báo trong database
- ✅ Thông báo các sự kiện quan trọng

### 📊 Dashboard
- ✅ Tổng phòng hoạt động
- ✅ Tỉ lệ lấp đầy phòng
- ✅ Số phòng cần dọn
- ✅ Tồn kho vật tư
- ✅ Danh sách phòng cần chú ý
- ✅ Thông báo gần đây

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
| Redux Toolkit | 2.11.2 | State Management |
| React Router | 7.13.2 | Routing |
| Axios | 1.13.6 | HTTP Client |
| Ant Design | 6.3.4 | UI Components |
| Lucide React | 0.546.0 | Icons |
| SignalR Client | 10.0.0 | WebSocket Client |
| TailwindCSS | 4.1.14 | Styling |

---

## 🗂️ Cấu Trúc Dự Án

### Backend

```
Back_end/
├── Controllers/               # 19 API Controllers
│   ├── AuthController.cs
│   ├── UserManagementController.cs
│   ├── RoomsController.cs
│   ├── RoomCleaningController.cs
│   ├── EquipmentController.cs
│   ├── InventoryController.cs
│   ├── LossAndDamagesController.cs
│   ├── RolesController.cs
│   ├── AttractionsController.cs
│   └── ... (10 more)
│
├── Services/                  # Business Logic (10+ services)
│   ├── TokenService.cs
│   ├── UserManagementService.cs
│   ├── EmailService.cs
│   ├── NotificationService.cs
│   ├── CloudinaryService.cs
│   └── ...
│
├── Models/                    # 19 Database Models
│   ├── User.cs
│   ├── Room.cs
│   ├── Equipment.cs
│   ├── RoomInventory.cs
│   ├── LossAndDamage.cs
│   ├── Notification.cs
│   └── ...
│
├── Data/
│   ├── AppDbContext.cs
│   └── DatabaseSchemaInitializer.cs
│
├── DTOs/                      # Data Transfer Objects
│   ├── UserDtos.cs
│   ├── RoomDtos.cs
│   ├── AuthDtos.cs
│   └── ...
│
├── Middleware/
│   ├── PermissionMiddleware.cs
│   ├── RequirePermissionAttribute.cs
│   └── RefreshTokenMiddleware.cs
│
├── Hubs/
│   └── NotificationHub.cs      # SignalR Hub
│
├── sql/                        # Database Scripts
│   ├── 00_MASTER_INSTALL.sql
│   ├── create_admin_account.sql
│   └── README_RUN_ORDER.sql
│
└── Program.cs                 # Entry Point
```

### Frontend

```
Front_end/src/
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── admin/                 # 17+ admin pages
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── RoomManagement.tsx
│   │   ├── RoomTypeManagement.tsx
│   │   ├── CleaningPage.tsx
│   │   ├── Inventory.tsx
│   │   ├── DamageLossPage.tsx
│   │   ├── RoleManagement.tsx
│   │   ├── AttractionsPage.tsx
│   │   ├── Profile.tsx
│   │   ├── CMS.tsx
│   │   └── ... (7 more)
│   ├── staff/
│   │   └── StaffPage.tsx
│   └── errors/
│       └── UnauthorizedPage.tsx
│
├── components/                # 20+ React Components
│   ├── layouts/
│   ├── admin/
│   └── ...
│
├── services/
│   ├── signalRService.ts      # SignalR Setup
│   ├── adminApi.ts             # API Client
│   └── ...
│
├── store/                      # Redux Store
│   ├── index.ts
│   └── slices/
│
├── routes/
│   └── AppRoutes.tsx          # Route Definitions
│
├── hooks/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

---

## 🛣️ Các Tuyến Route

### 🔐 Public Routes
| Route | Mô Tả | Yêu cầu |
|-------|-------|---------|
| `/login` | Trang đăng nhập | - |
| `/401` | Trang Unauthorized | - |

### 👨‍💼 Admin Routes (Yêu cầu role: Admin)
| Route | Mô Tả |
|-------|-------|
| `/admin/users` | Quản lý người dùng |
| `/admin/rooms` | Quản lý phòng |
| `/admin/room-types` | Phân loại phòng |
| `/admin/cleaning` | Quản lý dọn phòng |
| `/admin/equipment` | Quản lý vật tư |
| `/admin/inventory` | Quản lý kho |
| `/admin/roles` | Quản lý vai trò |
| `/admin/attractions` | Quản lý điểm tham quan |
| `/admin/profile` | Hồ sơ cá nhân |

### 👷 Staff Portal (Yêu cầu: authenticated)
| Route | Mô Tả |
|-------|-------|
| `/staff-portal/staff` | Danh sách nhân viên |
| `/staff-portal/equipment` | Quản lý vật tư (quyền chế) |

---

## 💾 Yêu Cầu Hệ Thống

### Backend
- 🔹 **.NET SDK 10.0.201** → [Download](https://dotnet.microsoft.com)
- 🔹 **SQL Server 2019+** hoặc **SQL Server Express**
- 🔹 **Visual Studio 2022** hoặc **VS Code + C# Extension**

### Frontend
- 🔹 **Node.js 20+** → [Download](https://nodejs.org)
- 🔹 **npm 10+** (đi kèm Node.js)
- 🔹 **Visual Studio Code** (tùy chọn)

---

## 🚀 Cài Đặt Nhanh

### Bước 1: Cài Database

```bash
# Mở SQL Server Management Studio (SSMS)
# Chạy script:
Back_end/sql/DBHotel.sql
```

✅ Database `HotelManagementDB` sẽ được tạo với dữ liệu khởi tạo.

### Bước 2: Cài Backend

```bash
cd Back_end
dotnet restore
dotnet build
dotnet run
```

✅ Backend: `https://localhost:5206`  
📚 Swagger: `https://localhost:5206/swagger`

### Bước 3: Cài Frontend

```bash
cd Front_end
npm install
npm run dev
```

✅ Frontend: `http://localhost:5173`

---

## ⚙️ Cấu Hình

### Backend - `Back_end/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HotelManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "HotelManagementSuperSecretKey2024!@#$%",
    "Issuer": "HotelManagementAPI",
    "Audience": "HotelManagementClient",
    "AccessTokenExpireMinutes": 480,
    "RefreshTokenExpireDays": 7
  },
  "Cloudinary": {
    "CloudName": "dwkqcuanf",
    "ApiKey": "283157785521954",
    "ApiSecret": "csuQH3OXxhLTQmGo4wQNZLcGng0"
  },
  "EmailSettings": {
    "Email": "khatong072@gmail.com",
    "Password": "uurc xgbh msep faxe",
    "Host": "smtp.gmail.com",
    "Port": 587
  }
}
```

### Frontend - `Front_end/.env.local`

```env
VITE_API_URL=http://localhost:5206
```

---

## 🔑 Tài Khoản Mặc Định

### Admin Account
```
📧 Email: admin@hotel.com
🔐 Password: Admin@123
```

⚠️ **Thay đổi mật khẩu ngay sau lần đăng nhập đầu tiên!**

---

## 🔧 Lệnh Hữu Ích

```bash
# Frontend
npm run dev       # Chạy dev server
npm run build     # Build production
npm run lint      # Check TypeScript

# Backend
dotnet run        # Chạy ứng dụng
dotnet build      # Build
dotnet clean      # Clean build
dotnet restore    # Restore packages
```

---

## 📝 Notes

- **SignalR**: Kết nối WebSocket tự động khi user đăng nhập
- **Thông báo**: Lọc theo role (Admin + Manager chủ yếu)
- **Permissions**: 2 cấp - Role + Permission chi tiết
- **Database**: Không dùng EF Migrations, dùng SQL scripts
- **Images**: Tất cả ảnh lưu trên Cloudinary

---

## 📄 License

**Private** - Phần mềm được phát triển cho mục đích nội bộ.
