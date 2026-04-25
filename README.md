## 🏨 Hệ Thống Quản Lý Khách Sạn

Đây là đồ án web quản lý khách sạn theo mô hình **full-stack** gồm:

- **Backend**: ASP.NET Core Web API (.NET 10)
- **Frontend**: React + Vite + TypeScript
- **Database**: SQL Server
- **Realtime**: SignalR

Dự án được xây dựng theo hướng phục vụ đồ án sinh viên, tập trung vào các nghiệp vụ thực tế của một khách sạn: đặt phòng, quản lý phòng, dịch vụ, hóa đơn, phân quyền và thống kê.

---

## 1. Mục tiêu dự án

Hệ thống giúp:

- Khách hàng tìm kiếm và đặt phòng trực tuyến
- Nhân viên theo dõi tình trạng phòng, dịch vụ và booking
- Quản trị viên quản lý người dùng, phân quyền, doanh thu và nội dung hệ thống
- Đồng bộ dữ liệu và cập nhật trạng thái theo thời gian thực

---

## 2. Công nghệ sử dụng

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- BCrypt.Net-Next
- SignalR
- Swagger / OpenAPI
- CloudinaryDotNet
- MoMo payment integration

### Frontend

- React 19
- Vite
- TypeScript
- Redux Toolkit
- React Router
- Axios
- Ant Design
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

---

## 3. Chức năng chính

### 3.1. Khách hàng

- Xem trang chủ, phòng, bài viết, điểm tham quan và dịch vụ
- Tìm kiếm, lọc và xem chi tiết phòng
- Đặt phòng trực tuyến
- Thanh toán đặt cọc hoặc thanh toán theo nghiệp vụ của hệ thống
- Đánh giá dịch vụ / phòng sau khi sử dụng
- Nhận thông báo cập nhật trạng thái

### 3.2. Nhân viên

- Cập nhật trạng thái phòng
- Quản lý dọn phòng và theo dõi tình trạng buồng phòng
- Xử lý đơn dịch vụ của khách
- Theo dõi thông báo theo thời gian thực

### 3.3. Quản trị viên

- Quản lý tài khoản, vai trò và phân quyền
- Quản lý phòng, loại phòng, tiện ích và hình ảnh
- Quản lý booking, hóa đơn, dịch vụ và minibar
- Quản lý thiết bị, tồn kho, hư hỏng và mất mát
- Quản lý bài viết, danh mục, điểm tham quan và nội dung website
- Theo dõi thống kê, báo cáo, audit log và thông báo hệ thống

---

## 4. Cấu trúc thư mục

```text
Hotel-Project/
├── Back_end/
│   ├── Controllers/        # API endpoints
│   ├── DTOs/               # Data Transfer Objects
│   ├── Models/             # Entity models
│   ├── Services/           # Business logic
│   ├── Data/               # DbContext, seeders, initializer
│   ├── Hubs/               # SignalR hubs
│   ├── Middleware/         # Middleware xử lý request
│   └── sql/DBHotel.sql     # Script tạo database
├── Front_end/
│   ├── src/
│   │   ├── components/     # Component dùng lại
│   │   ├── pages/          # Các trang giao diện
│   │   ├── store/          # Redux store
│   │   └── services/       # Gọi API
└── README.md
```

---

## 5. Yêu cầu hệ thống

Trước khi chạy dự án, cần có:

- .NET SDK 10.0 trở lên
- Node.js 18 trở lên
- SQL Server
- npm
- Visual Studio / VS Code / Rider

---

## 6. Hướng dẫn cài đặt và chạy dự án

### 6.1. Tải mã nguồn

```bash
git clone <repository-url>
cd Hotel-Project
```

### 6.2. Cài đặt cơ sở dữ liệu

1. Mở SQL Server
2. Chạy file `Back_end/sql/DBHotel.sql` để tạo database và dữ liệu mẫu nếu có
3. Kiểm tra lại chuỗi kết nối trong `Back_end/appsettings.json`

Ví dụ:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=HotelManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 6.3. Chạy Backend

```bash
cd Back_end
dotnet restore
dotnet run
```

Backend thường chạy theo cấu hình trong `launchSettings.json` hoặc `appsettings.json`.

### 6.4. Chạy Frontend

```bash
cd Front_end
npm install
npm run dev
```

Sau đó mở trình duyệt theo địa chỉ Vite hiển thị, thường là:

```bash
http://localhost:5173
```

---

## 7. Cấu hình quan trọng

Tùy vào môi trường, bạn có thể cần cấu hình thêm các thông tin sau trong `Back_end/appsettings.json` hoặc `Back_end/appsettings.Development.json`:

- Chuỗi kết nối SQL Server
- JWT Secret / Issuer / Audience
- Cloudinary keys
- MoMo payment credentials
- Email SMTP settings

Nếu frontend gọi API khác cổng, hãy kiểm tra lại địa chỉ backend trong phần cấu hình API của frontend.

---

## 8. API và tài liệu

Backend có hỗ trợ Swagger để kiểm thử API.

Khi chạy backend, mở:

```bash
https://localhost:<port>/swagger
```

hoặc

```bash
http://localhost:<port>/swagger
```

---

## 9. Môi trường phát triển

### Backend

- `Back_end/Program.cs`: cấu hình dịch vụ, middleware và route
- `Back_end/Controllers/`: các API chính
- `Back_end/Services/`: xử lý nghiệp vụ
- `Back_end/Hubs/`: realtime notification

### Frontend

- `Front_end/src/pages/`: các trang giao diện
- `Front_end/src/components/`: component tái sử dụng
- `Front_end/src/store/`: quản lý state
- `Front_end/src/services/`: gọi API backend

---

## 10. Tính năng nổi bật

- Hệ thống quản lý khách sạn theo nghiệp vụ thực tế
- Phân quyền rõ ràng theo vai trò
- Realtime notification bằng SignalR
- Tích hợp thanh toán và dịch vụ đám mây
- Giao diện hiện đại, phù hợp đồ án sinh viên
- Có cấu trúc tách biệt backend / frontend rõ ràng

---

## 11. Đề xuất khi làm báo cáo đồ án

Khi viết báo cáo, bạn có thể trình bày theo các phần sau:

1. Lý do chọn đề tài
2. Mục tiêu và phạm vi dự án
3. Công nghệ sử dụng
4. Phân tích yêu cầu hệ thống
5. Thiết kế cơ sở dữ liệu
6. Thiết kế giao diện
7. Chức năng hệ thống
8. Kiểm thử
9. Kết luận và hướng phát triển

---

## 12. Hướng phát triển

- Tích hợp thanh toán online đầy đủ hơn
- Tối ưu dashboard phân tích dữ liệu
- Bổ sung email / SMS marketing
- Tăng cường kiểm thử tự động
- Nâng cấp trải nghiệm mobile

---

## 13. Thông tin liên hệ

Dự án được phát triển phục vụ mục đích học tập và đồ án sinh viên.


- Tên dự án: Kant Hotel Management
- Tên nhóm thực hiện: KANT
- Lớp :23CT111 / khoa: Công nghệ thông tin / trường: Đại học Lạc Hồng
- Email liên hệ: khatong072@gmail.com

---

## 14. Ghi chú

Một số chức năng của hệ thống có thể phụ thuộc vào dữ liệu mẫu, file cấu hình hoặc dịch vụ bên ngoài như Cloudinary, MoMo và SMTP.

Nếu chạy lần đầu, hãy kiểm tra kỹ:

- Database đã được tạo chưa
- Connection string đã đúng chưa
- Frontend đã trỏ đúng API backend chưa
- Các biến môi trường / appsettings đã đầy đủ chưa

---

**Sản phẩm được thực hiện bới KANT Team**
