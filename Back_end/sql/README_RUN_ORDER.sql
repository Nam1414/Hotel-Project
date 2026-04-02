-- ============================================================
-- HƯỚNG DẪN CHẠY SQL SCRIPTS ĐỂ ĐỒNG BỘ DATABASE
-- Chậy trên database HotelManagementDB đang tồn tại
-- ============================================================

-- ─── BƯỚC 1: Thêm cột vào các bảng đã có ─────────────────────────────────────

-- 1. Articles (Thumbnail, UpdatedAt)
-- Chạy file: patch_articles_add_columns.sql

-- 2. Rooms (is_active cho soft delete)
-- Chạy file: patch_rooms_add_is_active.sql

-- 3. Room_Images (PublicId cho Cloudinary)
-- Chạy file: patch_room_images_add_public_id.sql

-- 4. Users (Tokens, AvatarPublicId)
-- Chạy file: patch_users_add_token_columns.sql

-- 5. Article_Categories (Description, CreatedAt, UpdatedAt)
-- Chạy file: patch_article_categories_add_columns.sql

-- 6. Attractions (category, image_url, created_at, updated_at)
-- Chạy file: patch_attractions_add_fields.sql

-- 7. Memberships (created_at)
-- Chạy file: patch_memberships_add_created_at.sql


-- ─── BƯỚC 2: Đồng bộ tên cột (Rename) ────────────────────────────────────────

-- 8. Equipments (Đổi PascalCase sang snake_case)
-- Chạy file: patch_equipments_rename_columns.sql


-- ─── BƯỚC 3: Tạo các bảng mới ────────────────────────────────────────────────

-- 9. Minibar (MinibarItems + RoomMinibarStock)
-- Chạy file: create_minibar_tables.sql

-- 10. Room_Items (Bảng phụ cho clone vật tư)
-- Chạy file: create_room_items_table.sql


-- ─── BƯỚC 4: Chuẩn hóa dữ liệu (QUAN TRỌNG) ──────────────────────────────────

-- 11. Sửa lỗi SqlNullValueException (Gán mặc định cho dữ liệu NULL) - MỚI
-- Chạy file: patch_fix_null_active_status.sql


-- ─── BẢNG TÓM TẮT THAY ĐỔI MÔ HÌNH BACKEND ──────────────────────────────────
-- 
--  Model           | Tình trạng
--  ─────────────────────────────────────────────────────────────────────────────
--  Article.cs      | Đã fix map published_at, thumbnail_url + patch SQL
--  RoomType.cs     | Đã fix map Room_Types + Capacity + patch SQL
--  Room.cs         | Đã fix properties + patch bổ sung is_active NOT NULL
--  Attraction.cs   | Cần chạy patch_attractions_add_fields + patch_fix_null_active_status
--  Equipment.cs    | Cần chạy patch_equipments_rename_columns (đã xử lý Computed Column)
--  Amenity.cs      | Đã thêm IsActive + patch_fix_null_active_status

PRINT 'Đã cập nhật hướng dẫn chạy SQL Scripts mới nhất.';
GO
