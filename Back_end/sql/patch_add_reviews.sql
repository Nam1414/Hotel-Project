-- 1. Thêm cột attraction_id vào bảng Articles
ALTER TABLE Articles
ADD attraction_id int NULL;

-- 2. Thêm khóa ngoại cho attraction_id liên kết với Attractions
ALTER TABLE Articles
ADD CONSTRAINT FK_Articles_Attractions_attraction_id
FOREIGN KEY (attraction_id) REFERENCES Attractions(id)
ON DELETE SET NULL;

-- 3. Tạo bảng Reviews
CREATE TABLE Reviews (
    id int IDENTITY(1,1) NOT NULL,
    target_type nvarchar(50) NOT NULL,
    target_id int NOT NULL,
    user_id int NULL,
    guest_name nvarchar(255) NULL,
    rating int NOT NULL DEFAULT 5,
    comment nvarchar(MAX) NULL,
    is_approved bit NOT NULL DEFAULT 0,
    created_at datetime2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT PK_Reviews PRIMARY KEY (id),
    CONSTRAINT FK_Reviews_Users_user_id FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- Tùy chọn: Tạo index để query nhanh hơn
CREATE INDEX IX_Reviews_target_type_target_id ON Reviews(target_type, target_id);
CREATE INDEX IX_Articles_attraction_id ON Articles(attraction_id);
