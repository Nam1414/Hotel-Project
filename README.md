# Hotel Management System

He thong quan ly khach san full-stack gom:

- `Back_end`: ASP.NET Core Web API
- `Front_end`: React + TypeScript + Vite

Project tap trung vao van hanh noi bo khach san: xac thuc, phan quyen, quan ly nguoi dung, phong, don phong, vat tu, den bu/that thoat, noi dung va thong bao realtime.

## 1. Tinh nang chinh

- Dang nhap bang JWT, refresh token qua cookie `HttpOnly`
- Phan quyen theo `Role` va `Permission`
- Quan ly nguoi dung, vai tro va ho so ca nhan
- Quan ly phong, hang phong, anh phong va tien ich
- Luong don phong cho `Housekeeping`
- Quan ly vat tu, ton kho, hong/mat va tien den bu
- Quan ly diem tham quan
- Upload anh qua Cloudinary
- Notification realtime bang SignalR

## 2. Cong nghe su dung

### Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core + SQL Server
- JWT Bearer Authentication
- SignalR
- Swagger / OpenAPI
- BCrypt.Net
- CloudinaryDotNet

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

## 3. Cau truc thu muc

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
|   |-- HotelManagementAPI.csproj
|   |-- Program.cs
|   |-- appsettings.json
|   `-- appsettings.Development.json
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
|   |   |-- store/
|   |   `-- utils/
|   |-- package.json
|   `-- vite.config.ts
|
|-- package.json
`-- README.md
```

## 4. Route chinh dang dung

### Auth

- `/login`
- `/register`

### Admin

- `/admin`
- `/admin/profile`
- `/admin/users`
- `/admin/rooms`
- `/admin/room-types`
- `/admin/cleaning`
- `/admin/inventory`
- `/admin/inventory/damages`
- `/admin/roles`
- `/admin/attractions`

### Staff

- `/staff/cleaning`

### Public

- `/`
- `/rooms`

Luu y: trang `booking` hien da duoc an khoi frontend.

## 5. Yeu cau moi truong

### Backend

- .NET SDK 10
- SQL Server

### Frontend

- Node.js 20+
- npm

## 6. Cai dat database

Project dung SQL script co san, khong di theo EF migrations.

### Cai moi

1. Mo SQL Server Management Studio.
2. Chay file:

```text
Back_end/sql/00_MASTER_INSTALL.sql
```

3. Script se tao database `HotelManagementDB` va seed du lieu nen.

### Ghi chu

- Neu ban dang nang cap tu database cu, xem them:

```text
Back_end/sql/README_RUN_ORDER.sql
```

- Backend hien co `DatabaseSchemaInitializer` de tu va them mot phan schema khi app khoi dong.

## 7. Cau hinh backend

File cau hinh chinh:

```text
Back_end/appsettings.json
```

Vi du cau hinh:

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

## 8. Cau hinh frontend

Tao file:

```text
Front_end/.env
```

Noi dung:

```env
VITE_API_URL=http://localhost:5206
```

Neu khong co `.env`, frontend se fallback ve `http://localhost:5206`.

## 9. Chay project local

### Chay backend

```powershell
cd Back_end
dotnet restore
dotnet run
```

Mac dinh backend:

- `http://localhost:5206`
- `https://localhost:7259`

Swagger:

- `http://localhost:5206/`

### Chay frontend

```powershell
cd Front_end
npm install
npm run dev
```

Mac dinh frontend:

- `http://localhost:5173`

### Build

Frontend:

```powershell
cd Front_end
npm run build
```

Backend:

```powershell
cd Back_end
dotnet build
```

## 10. Luong xac thuc

1. User dang nhap qua API auth.
2. Backend tra ve `accessToken`.
3. `refreshToken` duoc set qua cookie `HttpOnly`.
4. Frontend luu access token va tu gan `Authorization: Bearer <token>`.
5. Khi token het han, frontend tu goi endpoint refresh token.
6. Route frontend va API backend deu duoc chan theo quyen.

## 11. Notification realtime

- SignalR hub: `/notificationHub`
- Frontend nhan event `ReceiveNotification`
- Notification duoc luu database va hien thi realtime tren giao dien admin/staff

## 12. Cac module chinh

### Nguoi dung va phan quyen

- Quan ly user
- Doi role
- Khoa/mo khoa tai khoan
- Quan ly role va permission

### Phong va don phong

- CRUD phong
- CRUD hang phong
- Tao hang loat phong
- Don phong cho `Housekeeping`
- Khi phong chuyen sang `Cleaning`, admin nhan thong bao realtime

### Vat tu va that thoat

- Quan ly vat tu
- Dong bo vat tu theo phong
- Bao hong/mat
- Quan ly den bu
- Upload anh minh chung

### Noi dung

- Diem tham quan
- Tien ich
- Bai viet va danh muc bai viet

## 13. Tai khoan mau

Database seed hien co tai khoan admin mau:

- Email: `admin@hotel.com`
- Password: `Admin@123`

Neu seed cua ban da thay doi, kiem tra lai trong script SQL.

## 14. Kiem tra nhanh sau khi cai

1. Chay `00_MASTER_INSTALL.sql`
2. Cap nhat `appsettings.json`
3. Tao `Front_end/.env`
4. Chay backend
5. Chay frontend
6. Dang nhap tai khoan admin
7. Kiem tra cac man:
- Dashboard
- User Management
- Rooms
- Cleaning
- Inventory
- Damage / Loss
- Role Management
- Attractions

## 15. Luu y bao mat

Repo hien dang co dau hieu chua secret that trong `Back_end/appsettings.json`.

Ban nen:

- doi toan bo JWT secret
- rotate Cloudinary credentials
- rotate email app password
- chuyen secret sang environment variables hoac user secrets

Khong nen deploy truc tiep voi cau hinh hien tai neu chua thay secret.

## 16. Ghi chu phat trien

- Project hien dung SQL script thay vi EF migrations
- Mot so file cu/thu nghiem van con trong repo
- Trong qua trinh phat trien gan day, phan admin da duoc cap nhat them:
- responsive layout
- permission-based action visibility
- cleaning flow cho `Housekeeping`
- an trang booking khoi frontend
- doi thao tac xoa user thanh khoa tai khoan

## 17. De xuat cai thien tiep theo

- them `appsettings.example.json`
- them `Front_end/.env.example`
- chuan hoa toan bo encoding tieng Viet trong repo
- don cac file build tam khoi source tree
- bo sung tai lieu seed role/permission
- bo sung huong dan deploy
