# Hotel Management System

Hệ thống quản lý khách sạn full-stack gồm `Back_end` (ASP.NET Core Web API) và `Front_end` (React + TypeScript). Project tập trung vào các nghiệp vụ quản trị nội bộ như đăng nhập và phân quyền, quản lý người dùng, phòng, vật tư, minibar, bài viết, điểm tham quan và thông báo thời gian thực.

## 1. Tổng quan công nghệ

### Backend
- ASP.NET Core Web API (`net10.0`)
- Entity Framework Core + SQL Server
- JWT Access Token + Refresh Token qua cookie
- Role-based authorization + permission middleware
- SignalR cho thông báo thời gian thực
- Swagger/OpenAPI
- Cloudinary để lưu ảnh
- BCrypt để băm mật khẩu

### Frontend
- React 19 + TypeScript
- Vite 6
- Ant Design 6
- Redux Toolkit
- Zustand
- React Router 7
- Axios
- Framer Motion
- SignalR client

## 2. Chức năng chính

### Xác thực và phân quyền
- Đăng nhập bằng JWT.
- Tự cấp lại access token bằng refresh token.
- Phân quyền theo `Role` và `Permission`.
- Chặn route và chức năng trên frontend theo permission.

### Quản lý người dùng
- Tạo, cập nhật, xóa người dùng.
- Lọc danh sách người dùng theo email, số điện thoại, trạng thái.
- Đổi role cho người dùng.
- Quản lý hồ sơ người dùng.

### Quản lý phòng và hạng phòng
- CRUD phòng.
- CRUD hạng phòng.
- Tạo hàng loạt phòng.
- Clone/sync vật tư từ phòng mẫu sang các phòng khác.
- Quản lý ảnh phòng và tiện ích đi kèm.

### Quản lý vật tư, minibar và mất mát/hư hỏng
- Quản lý thiết bị/vật tư trong phòng.
- Theo dõi tồn kho sử dụng theo phòng.
- Quản lý minibar và tồn minibar theo từng phòng.
- Ghi nhận mất mát, hư hỏng và chi phí bồi thường.

### Nội dung và dữ liệu mở rộng
- Quản lý bài viết và danh mục bài viết.
- Quản lý tiện ích khách sạn.
- Quản lý điểm tham quan.
- Quản lý membership.

### Thông báo thời gian thực
- Backend map hub tại `/notificationHub`.
- Frontend có kết nối SignalR để nhận `ReceiveNotification`.
- Thông báo được đẩy vào Redux store và hiển thị qua Ant Design notification.

## 3. Cấu trúc thư mục

```text
Hotel-Project/
|-- Back_end/
|   |-- Controllers/        # API controllers
|   |-- Data/               # AppDbContext
|   |-- DTOs/               # Request/response models
|   |-- Enums/              # Notification enums
|   |-- Hubs/               # SignalR hubs
|   |-- Middleware/         # Refresh token, permission middleware
|   |-- Models/             # Entity models
|   |-- Services/           # Business services
|   |-- sql/                # SQL install/patch scripts
|   |-- Program.cs          # DI, auth, CORS, Swagger, SignalR
|   `-- appsettings.json    # Local configuration
|
|-- Front_end/
|   |-- src/
|   |   |-- api/            # Axios client
|   |   |-- components/     # UI components
|   |   |-- hooks/          # Notification, SignalR, utilities
|   |   |-- layouts/        # Admin/Staff layouts
|   |   |-- pages/          # Auth/Admin/Staff pages
|   |   |-- routes/         # Protected routes
|   |   `-- store/          # Redux/Zustand state
|   `-- package.json
|
|-- README.md
`-- .gitignore
```

## 4. Các API/module backend hiện có

Project hiện có các controller sau:

- `AuthController`
- `UserManagementController`
- `UserProfileController`
- `RolesController`
- `RoomsController`
- `RoomTypesController`
- `RoomItemsController`
- `InventoryController`
- `EquipmentsController`
- `MinibarController`
- `LossAndDamagesController`
- `NotificationsController`
- `AmenitiesController`
- `AttractionsController`
- `ArticlesController`
- `ArticleCategoriesController`
- `DbFixController`

## 5. Các màn hình frontend hiện có

### Authentication
- `/login`
- `/register`

### Admin
- `/admin`
- `/admin/users`
- `/admin/rooms`
- `/admin/bookings`
- `/admin/inventory`
- `/admin/roles`

### Staff
- Có `StaffLayout` và `StaffDashboard` trong source, sẵn sàng để mở rộng thêm route nghiệp vụ staff.

## 6. Yêu cầu môi trường

### Backend
- .NET SDK 10.0
- SQL Server

### Frontend
- Node.js 20+
- npm

## 7. Cài đặt database

Project đang đi theo hướng cài database bằng script SQL có sẵn thay vì EF migration.

### Cách nhanh nhất cho máy mới
1. Mở SQL Server Management Studio.
2. Chạy file `Back_end/sql/00_MASTER_INSTALL.sql`.
3. Script sẽ tạo database `HotelManagementDB` và seed dữ liệu nền.

### Khi database đã tồn tại và cần đồng bộ thêm
- Xem thứ tự patch trong `Back_end/sql/README_RUN_ORDER.sql`.
- Một số file patch quan trọng:
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

## 8. Cấu hình backend

Chỉnh file `Back_end/appsettings.json` cho phù hợp máy chạy:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HotelManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Secret": "your-secret",
    "Issuer": "HotelManagementAPI",
    "Audience": "HotelManagementClient"
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

Lưu ý:
- Không nên dùng nguyên các giá trị bí mật đang nằm trong file cấu hình hiện tại khi deploy thật.
- Nên chuyển secret sang User Secrets, biến môi trường hoặc hệ thống secret manager.

## 9. Chạy backend

```powershell
cd Back_end
dotnet restore
dotnet run
```

Mặc định backend chạy tại:

- `http://localhost:5206`
- `https://localhost:7259`

Swagger UI:

- `http://localhost:5206/`

## 10. Cấu hình frontend

Frontend gọi API qua biến môi trường:

```env
VITE_API_URL=http://localhost:5206
```

Nếu không khai báo, code hiện tại sẽ fallback về `http://localhost:5206`.

## 11. Chạy frontend

```powershell
cd Front_end
npm install
npm run dev
```

Mặc định frontend chạy tại:

- `http://localhost:5173`

## 12. Luồng xác thực

1. Người dùng đăng nhập qua `POST /api/Auth/login`.
2. Backend trả về `accessToken` và ghi `refreshToken` vào cookie `HttpOnly`.
3. Frontend lưu access token vào `localStorage`.
4. Axios tự gắn `Authorization: Bearer <token>` cho các request tiếp theo.
5. Khi token hết hạn, backend hỗ trợ `POST /api/Auth/refresh-token`.

## 13. Real-time notification

- Backend map SignalR hub ở `/notificationHub`.
- Frontend sử dụng `@microsoft/signalr` trong hook `useNotification`.
- Client lắng nghe event `ReceiveNotification`.
- Dữ liệu notification được đẩy vào Redux slice `notificationSlice`.

Ghi chú:
- Trong source vẫn còn file `Front_end/src/hooks/useSignalR.ts` dùng để mô phỏng sự kiện. Hook kết nối SignalR thực tế hiện nằm ở `useNotification.ts`.

## 14. Tài khoản mẫu

Script SQL hiện có seed sẵn tài khoản:

- Email: `admin@hotel.com`
- Password: `Admin@123`

Tài khoản này phù hợp để test nhanh sau khi chạy script cài database.

## 15. Gợi ý quy trình chạy local

1. Chạy `00_MASTER_INSTALL.sql`.
2. Cập nhật `Back_end/appsettings.json`.
3. Chạy backend bằng `dotnet run`.
4. Tạo `.env` cho frontend nếu muốn đổi API URL.
5. Chạy frontend bằng `npm run dev`.
6. Truy cập `http://localhost:5173` và đăng nhập bằng tài khoản mẫu.

## 16. Ghi chú hiện trạng

- Repo đang chứa cả mã nguồn lẫn thư mục build như `bin/`, `obj/`, `temp_obj/`; nên cân nhắc dọn `.gitignore` nếu muốn repo sạch hơn.
- README này mô tả theo hiện trạng source code hiện có trong repo.
- Nếu tiếp tục phát triển production, nên bổ sung file `.env.example` cho frontend và cấu hình secret an toàn cho backend.
