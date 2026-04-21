# 🤖 AI Agent Context & Guidelines - Hotel Management ERP

> **Lưu ý dành cho AI Agent:** File này chứa toàn bộ Context (Ngữ cảnh), Architecture (Kiến trúc) và Coding Rules (Quy tắc viết code) của dự án. Hãy đọc kỹ file này trước khi thực hiện bất kỳ yêu cầu tạo mới, sửa đổi hoặc debug code nào từ người dùng.

---

## 1. 🏗 Hệ Sinh Thái & Stack Công Nghệ

Dự án này là một hệ thống **Hotel Management ERP & Booking Portal** (Quản trị Khách sạn & Cổng đặt phòng cho khách).

*   **Backend:**
    *   **Framework:** ASP.NET Core 10 Web API.
    *   **ORM:** Entity Framework Core 9.0.3 (Code-First models nhưng thao tác schema bằng tay qua SQL scripts).
    *   **Auth:** JWT Bearer (Token-based) có hỗ trợ Refresh Token. Phân quyền Middleware tùy chỉnh qua `[RequirePermission("...")]`.
    *   **Realtime:** SignalR Hub (`NotificationHub.cs`) để thông báo thời gian thực (ví dụ dọn phòng, khách gọi dịch vụ).
    *   **Khác:** BCrypt.Net (Hashing), CloudinaryDotNet (Image Storage), Slugify.Core (SEO slugs).
*   **Frontend:**
    *   **Core:** React 19 + TypeScript + Vite.
    *   **Routing:** React Router v7.
    *   **UI/Styling:** TailwindCSS 4 (Utility classes) + Ant Design 6 (Components phức tạp như Table, Form, Modal, Pagination).
    *   **State Management:** Redux Toolkit (`authSlice` lưu trạng thái người dùng), Zustand (`themeStore` lưu Light/Dark mode).
    *   **API Client:** Axios (Interceptors xử lý gắn Token và tự động làm mới Refresh Token, lỗi 401/403 tự động redirect).

---

## 2. 🚦 Các Quy Tắc Viết Code (Coding Rules) TỐI QUAN TRỌNG

1.  **KHÔNG SỬ DỤNG EF CORE MIGRATIONS:**
    *   **Tuyệt đối không chạy lệnh** `dotnet ef migrations add` hay `dotnet ef database update`.
    *   *Cách làm chuẩn:* Nếu cần thay đổi cấu trúc bảng, thêm cột, hoặc thay đổi quan hệ, hãy tạo các script SQL (`ALTER TABLE`, `CREATE TABLE`) và lưu vào thư mục `Back_end/sql/`. Khi thay đổi Model C#, đảm bảo tự cập nhật `AppDbContext.cs` và cập nhật SQL tương ứng.
2.  **Quản lý Hình Ảnh:**
    *   Toàn bộ hình ảnh trong dự án (Avatar người dùng, Ảnh phòng, Ảnh điểm tham quan...) đều phải được upload lên **Cloudinary**.
    *   Backend có sẵn `ICloudinaryService` để upload ảnh và lấy về URL chuỗi. Tuyệt đối không lưu file vật lý vào server.
3.  **Tương tác Database (Data Access):**
    *   Mặc dù dùng EF Core, dự án này **không sử dụng Generic Repository Pattern**. Các Service (ví dụ: `BookingService`, `RoomService`) sẽ tiêm trực tiếp `AppDbContext` để thao tác dữ liệu qua LINQ.
    *   Đảm bảo luôn dùng `.AsNoTracking()` cho các thao tác `GET` chỉ đọc để tối ưu hiệu suất.
    *   Khi update/insert, hãy cẩn thận xử lý Navigation Properties (như `Include()` và `ThenInclude()`).
4.  **Xử lý Lỗi & API Response:**
    *   Controller luôn trả về chuẩn JSON với các StatusCode rõ ràng (200 OK, 201 Created, 400 BadRequest, 401 Unauthorized, 403 Forbidden, 404 NotFound, 500 InternalServerError).
    *   Luôn wrap logic trong block `try-catch` tại Controller, nếu có Exception thì trả về `{ message: ex.Message }`.
5.  **Giao diện Frontend (UI/UX):**
    *   Ưu tiên dùng TailwindCSS cho bố cục (flex, grid, spacing, colors) để đảm bảo đồng bộ với file `index.css` toàn cục (chứa các biến CSS như `--color-primary`, `--bg-card`).
    *   Khi cần Form nhập liệu phức tạp hoặc Bảng dữ liệu có phân trang/lọc, ưu tiên sử dụng Ant Design (`Table`, `Form`, `Modal`).
    *   Dự án hỗ trợ Dark/Light mode tự động, hãy đảm bảo sử dụng tiền tố `dark:` trong TailwindCSS hoặc biến màu CSS biến thiên.

---

## 3. 🗺 Cấu Trúc Dự Án (File System)

### Backend (`c:\Du an\Hotel-Project\Back_end\`)
*   `Controllers/`: Các Endpoints API. Chú ý các `[Authorize]` và `[RequirePermission("ROLE_NAME")]` trên đầu hàm.
*   `Services/`: Xử lý Business Logic. Tất cả logic nghiệp vụ phải nằm ở đây thay vì Controller.
*   `Models/`: Các file Entity mapping trực tiếp với bảng SQL.
*   `DTOs/`: Data Transfer Objects. Dùng `RequestDto` cho input, `ResponseDto` cho output.
*   `Middleware/`: Chứa logic check quyền truy cập (Permission) và Refresh Token.
*   `sql/`: Các file `.sql` dùng để khởi tạo và nâng cấp database.

### Frontend (`c:\Du an\Hotel-Project\Front_end\`)
*   `src/api/axiosClient.ts`: Core Axios instance, xử lý auto-attach Token và Refresh Token flow.
*   `src/services/`: Các file gọi API riêng lẻ (ví dụ: `bookingApi.ts`, `roomApi.ts`). Mọi API call phải được khai báo tại đây và export object chứa hàm gọi axios.
*   `src/pages/`: Các View chính.
    *   `admin/`: Dành cho Quản trị viên (Có Sidebar, Header quản lý).
    *   `public/`: Giao diện khách hàng (Tìm phòng, Chi tiết phòng, Thanh toán).
*   `src/components/`: Layouts, UI Components tái sử dụng (Button, Card, Notification).
*   `src/store/`: Redux & Zustand stores.

---

## 4. 🧩 Các Logic & Luồng Xử Lý Phức Tạp Hiện Có

1.  **Luồng Đặt Phòng (Booking Flow):**
    *   Khách hàng có thể đặt nhiều phòng (Multi-room). Mỗi phòng đặt được lưu vào `BookingDetails`.
    *   `Booking` tổng có `BookingId`. Hóa đơn (`Invoice`) sẽ tự động được tạo ra ngay sau khi đặt hoặc lúc Check-in.
    *   Tiền cọc (Deposit) được tính theo tỉ lệ (thường là 50%).
2.  **Luồng Dịch Vụ Phòng (Room Services / Minibar):**
    *   Khách (hoặc Lễ tân) có thể thêm `OrderService` cho một `BookingDetail`. Tiền dịch vụ sẽ tự động cộng dồn vào `Invoice` tổng.
3.  **Luồng Dọn Phòng (Housekeeping):**
    *   Phòng có 2 trạng thái độc lập: `Status` (Phòng trống, Đã đặt, Đang lưu trú...) và `CleaningStatus` (Sạch, Bẩn, Đang dọn).
    *   Khi Check-out, `CleaningStatus` tự động chuyển sang "Bẩn". Lễ tân hoặc hệ thống sẽ phân công nhân viên dọn dẹp (`RoomCleaning`).
4.  **Luồng Tách/Đổi Phòng:**
    *   Đổi phòng (Reassign): Khách sang phòng khác, giữ nguyên Booking, thay đổi `BookingDetail.RoomId`.
    *   Tách phòng (Split Booking): Tách 1 phòng từ Booking hiện tại sang một Booking mới hoàn toàn kèm Invoice mới (VD: bạn thực sự muốn tự thanh toán riêng).

---

## 5. 🔑 Thông Tin Kết Nối (Local Môi Trường Dev)
*   **Frontend URL:** `http://localhost:5173`
*   **Backend API URL:** `http://localhost:5206`
*   **Local SQL Server Connection String Pattern:** `Server=.;Database=HotelManagementDB;Trusted_Connection=True;TrustServerCertificate=True;`

*Luôn đối chiếu lại với code thực tế và đọc các nội dung file Controller/Service liên quan trước khi sửa.*
