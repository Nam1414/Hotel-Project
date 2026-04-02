# Hotel Management System

Hệ thống quản lý khách sạn full-stack gồm `Back_end` (ASP.NET Core Web API) và `Front_end` (React + TypeScript). Project tập trung vào vận hành nội bộ khách sạn: xác thực và phân quyền, quản lý người dùng, phòng, vật tư, hỏng/mất, thông báo thời gian thực, nội dung và upload ảnh qua Cloudinary.

## Tổng quan nhanh

- Backend: ASP.NET Core Web API, Entity Framework Core, SQL Server, JWT, SignalR, Swagger, Cloudinary.
- Frontend: React 19, TypeScript, Vite, Redux Toolkit, React Router, Ant Design, Axios.
- Database: cài bằng script SQL trong `Back_end/sql`, không đi theo EF migrations.
- Kiến trúc: frontend gọi REST API, nhận notification qua SignalR, route/UI được chặn theo permission.

## Công nghệ sử dụng

### Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core + SQL Server
- JWT access token + refresh token
- SignalR
- CloudinaryDotNet
- BCrypt.Net
- Swagger / OpenAPI

### Frontend

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Ant Design
- Lucide React
- SignalR client

## Chức năng chính

### Xác thực và phân quyền

- Đăng nhập bằng JWT.
- Refresh token qua cookie `HttpOnly`.
- Phân quyền theo `Role` và `Permission`.
- Tự điều hướng người dùng sau khi login vào trang phù hợp với quyền hiện có.
- Chặn route frontend và API backend theo permission.

### Quản lý người dùng và vai trò

- CRUD người dùng.
- Gán role và quản lý quyền.
- Trang hồ sơ cá nhân.
- Upload avatar người dùng lên Cloudinary.

### Quản lý phòng và hạng phòng

- CRUD phòng và hạng phòng.
- Tạo hàng loạt phòng.
- Clone/sync vật tư theo phòng mẫu.
- Quản lý ảnh phòng và tiện ích.

### Quản lý vật tư và hỏng/mất

- CRUD vật tư.
- Nhập vật tư từ Excel.
- Theo dõi tồn kho, đang dùng, hỏng/mất.
- Upload ảnh vật tư.
- Ghi nhận hỏng/mất và upload ảnh minh chứng.
- Quản lý bồi thường vật tư.

### Nội dung và dữ liệu mở rộng

- Quản lý bài viết và danh mục bài viết.
- Quản lý tiện ích.
- Quản lý điểm tham quan.
- Upload ảnh điểm tham quan lên Cloudinary.
- Membership và dữ liệu mở rộng khác.

### Thông báo thời gian thực

- SignalR hub tại `/notificationHub`.
- Thông báo hiển thị trên frontend theo thời gian thực.
- Thông báo nghiệp vụ được lưu vào database để không mất khi refresh.

## Cấu trúc thư mục

```text
Hotel-Project/
|-- Back_end/
|   |-- Controllers/
|   |-- Data/
|   |-- DTOs/
|   |-- Enums/
|   |-- Hubs/
|   |-- Middleware/
|   |-- Models/
|   |-- Services/
|   |-- sql/
|   |-- Program.cs
|   `-- appsettings.json
|
|-- Front_end/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- store/
|   `-- package.json
|
`-- README.md
```

## Backend hiện có

Các controller chính trong `Back_end/Controllers`:

- `AuthController`
- `UserManagementController`
- `UserProfileController`
- `RolesController`
- `RoomsController`
- `RoomTypesController`
- `RoomItemsController`
- `InventoryController`
- `EquipmentsController`
- `EquipmentController`
- `MinibarController`
- `LossAndDamagesController`
- `NotificationsController`
- `AmenitiesController`
- `AttractionsController`
- `ArticlesController`
- `ArticleCategoriesController`
- `DbFixController`

## Frontend hiện có

Các màn hình admin chính trong `Front_end/src/pages/admin`:

- Dashboard
- User Management
- Rooms
- Room Types
- Cleaning
- Inventory
- Damage / Loss
- Role Management
- Profile
- Attractions

Route chính đang dùng:

- `/login`
- `/register`
- `/admin`
- `/admin/users`
- `/admin/rooms`
- `/admin/room-types`
- `/admin/cleaning`
- `/admin/bookings`
- `/admin/inventory`
- `/admin/inventory/damages`
- `/admin/roles`
- `/admin/profile`
- `/admin/attractions`

## Yêu cầu môi trường

### Backend

- .NET SDK 10.0
- SQL Server

### Frontend

- Node.js 20+
- npm

## Cài đặt database

Project dùng script SQL có sẵn trong `Back_end/sql`.

### Cài mới

1. Mở SQL Server Management Studio.
2. Chạy file `Back_end/sql/00_MASTER_INSTALL.sql`.
3. Script sẽ tạo database `HotelManagementDB` và seed dữ liệu nền.

### Patch thêm cho database cũ

- Xem thứ tự chạy trong `Back_end/sql/README_RUN_ORDER.sql`.
- Một số patch quan trọng:
- `patch_users_add_token_columns.sql`
- `patch_rooms_add_is_active.sql`
- `patch_room_images_add_public_id.sql`
- `patch_article_categories_add_columns.sql`
- `patch_articles_add_columns.sql`
- `patch_attractions_add_fields.sql`
- `patch_memberships_add_created_at.sql`
- `patch_equipments_rename_columns.sql`
- `patch_fix_null_active_status.sql`
- `create_minibar_tables.sql`
- `create_room_items_table.sql`
- `setup_equipment_module.sql`

Ngoài ra backend hiện có `DatabaseSchemaInitializer` để tự vá một số khác biệt schema cho module hỏng/mất vật tư khi app khởi động.

## Cấu hình backend

Chỉnh `Back_end/appsettings.json` hoặc dùng biến môi trường / secret manager.

Ví dụ cấu hình:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HotelManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "your-secret",
    "Issuer": "HotelManagementAPI",
    "Audience": "HotelManagementClient",
    "AccessTokenExpireMinutes": 480,
    "RefreshTokenExpireDays": 7
  },
  "Cloudinary": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  },
  "EmailSettings": {
    "Email": "your-email",
    "Password": "your-app-password",
    "Host": "smtp.gmail.com",
    "Port": 587
  }
}
```

### Lưu ý bảo mật

- File `Back_end/appsettings.json` hiện đang chứa secret thật. Bạn nên đổi ngay toàn bộ JWT secret, Cloudinary key và email app password trước khi deploy hoặc chia sẻ repo.
- Khuyến nghị chuyển các giá trị nhạy cảm sang:
- User Secrets
- biến môi trường
- secret manager của môi trường deploy

## Cấu hình frontend

Tạo file `Front_end/.env`:

```env
VITE_API_URL=http://localhost:5206
```

Nếu không khai báo, frontend sẽ fallback về `http://localhost:5206`.

## Chạy project local

### 1. Chạy backend

```powershell
cd Back_end
dotnet restore
dotnet run
```

Backend mặc định:

- `http://localhost:5206`
- `https://localhost:7259`

Swagger UI:

- `http://localhost:5206/`

### 2. Chạy frontend

```powershell
cd Front_end
npm install
npm run dev
```

Frontend mặc định:

- `http://localhost:5173`

## Luồng xác thực

1. User đăng nhập qua `POST /api/Auth/login`.
2. Backend trả về `accessToken` và set `refreshToken` trong cookie `HttpOnly`.
3. Frontend lưu access token vào `localStorage`.
4. Axios tự gắn header `Authorization: Bearer <token>`.
5. Khi access token hết hạn, frontend gọi `POST /api/Auth/refresh-token`.
6. Nếu không còn phiên hợp lệ, người dùng sẽ bị đưa về `/login`.

## Upload ảnh trong project

Các module đã có upload ảnh qua Cloudinary:

- Avatar người dùng
- Ảnh hạng phòng
- Ảnh vật tư
- Ảnh hỏng/mất vật tư
- Ảnh điểm tham quan

Một số API upload tiêu biểu:

- `POST /api/UserProfile/avatar`
- `POST /api/RoomTypes/{id}/images`
- `POST /api/Equipment/{id}/image`
- `POST /api/Equipment/damage/{id}/image`
- `POST /api/Attractions/{id}/image`

## Notification realtime

- Backend dùng SignalR hub tại `/notificationHub`.
- Frontend kết nối hub để nhận event `ReceiveNotification`.
- Notification được hiển thị ở bell component trong admin layout.
- Thông báo nghiệp vụ được lưu database để không mất khi reload trang.

## Tài khoản mẫu

Script SQL hiện có seed sẵn:

- Email: `admin@hotel.com`
- Password: `Admin@123`

Nếu database của bạn đã thay đổi seed, hãy kiểm tra lại trong script SQL trước khi test.

## Kiểm tra nhanh sau khi cài

1. Chạy database script.
2. Cập nhật cấu hình backend.
3. Chạy backend và mở Swagger.
4. Chạy frontend.
5. Đăng nhập bằng tài khoản admin mẫu.
6. Kiểm tra các màn:
- Dashboard
- User Management
- Inventory
- Profile
- Attractions
- Notification bell

## Ghi chú phát triển

- Backend đang dùng cả `PermissionMiddleware` và route guard trên frontend để đồng bộ phân quyền.
- Frontend admin shell đã có điều hướng theo permission để tránh rơi vào trang 401 không cần thiết sau login.
- Một số file trong repo còn dấu hiệu thử nghiệm hoặc trùng màn hình cũ/mới. Khi cleanup có thể gom lại để giảm trùng lặp.
- Nếu tiếp tục phát triển production, nên bổ sung:
- `.env.example` cho frontend
- `appsettings.example.json` cho backend
- tài liệu seed role/permission
- checklist deploy và rotate secrets
