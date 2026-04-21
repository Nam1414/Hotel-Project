-- ============================================================
-- SEED DATA: Điểm tham quan & Bài viết cho Kant Hotel - Biên Hòa, Đồng Nai
-- ============================================================

-- ── 1. ĐIỂM THAM QUAN ──────────────────────────────────────
-- Xoá data cũ (nếu muốn reset)
-- DELETE FROM Attractions;

INSERT INTO Attractions (name, description, address, category, distance_km, latitude, longitude, image_url, is_active, created_at, updated_at)
VALUES
(N'Văn miếu Trấn Biên', 
 N'Văn miếu Trấn Biên được xây dựng năm 1715, là văn miếu đầu tiên ở Nam Bộ, thờ Khổng Tử và các bậc hiền triết. Đây là điểm tham quan văn hóa - lịch sử nổi bật nhất Biên Hòa với kiến trúc cổ kính uy nghiêm.',
 N'Phường Bửu Long, TP. Biên Hòa, Đồng Nai', N'Lịch sử - Văn hóa', 5.0,
 10.9478, 106.8530,
 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'Khu du lịch Bửu Long', 
 N'Khu du lịch sinh thái Bửu Long nổi tiếng với hồ Long Ẩn xanh biếc, núi đá vôi hùng vĩ và chùa Bửu Phong cổ kính. Là điểm đến lý tưởng cho du khách muốn tận hưởng thiên nhiên ngay trong thành phố.',
 N'Phường Bửu Long, TP. Biên Hòa, Đồng Nai', N'Thiên nhiên', 6.0,
 10.9520, 106.8600,
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'Chùa Đại Giác', 
 N'Chùa Đại Giác (còn gọi là chùa Phật lớn) được xây dựng từ thế kỷ XVIII, nằm bên bờ sông Đồng Nai. Là một trong những ngôi chùa cổ nhất Biên Hòa với kiến trúc pha trộn Á - Âu độc đáo.',
 N'Xã Hiệp Hòa, TP. Biên Hòa, Đồng Nai', N'Tâm linh', 3.5,
 10.9510, 106.8225,
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'Cù lao Phố', 
 N'Cù lao Phố là vùng đất lịch sử nằm giữa sông Đồng Nai, từng là thương cảng sầm uất nhất Nam Bộ thế kỷ XVII-XVIII. Hiện nay nơi đây còn lưu giữ nhiều di tích lịch sử, đình chùa cổ và làng nghề truyền thống.',
 N'Xã Hiệp Hòa, TP. Biên Hòa, Đồng Nai', N'Lịch sử - Văn hóa', 4.0,
 10.9505, 106.8180,
 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'Làng bưởi Tân Triều', 
 N'Làng bưởi Tân Triều nổi tiếng cả nước với giống bưởi da xanh và bưởi đường lá cam thơm ngon. Du khách có thể tham quan vườn bưởi, thưởng thức trái cây tươi và trải nghiệm đời sống miệt vườn Nam Bộ.',
 N'Xã Tân Bình, Huyện Vĩnh Cửu, Đồng Nai', N'Ẩm thực - Trải nghiệm', 8.0,
 10.9800, 106.8400,
 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'Chợ Biên Hòa', 
 N'Chợ Biên Hòa là ngôi chợ truyền thống lâu đời nhất thành phố, nơi hội tụ đủ loại đặc sản Đồng Nai từ bưởi Tân Triều, gốm Biên Hòa đến các món ăn dân dã. Là điểm đến không thể bỏ qua để trải nghiệm văn hóa ẩm thực địa phương.',
 N'Đường Nguyễn Văn Trị, P. Thanh Bình, TP. Biên Hòa', N'Ẩm thực - Trải nghiệm', 2.0,
 10.9458, 106.8269,
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'Vườn quốc gia Cát Tiên', 
 N'Vườn quốc gia Cát Tiên là khu bảo tồn thiên nhiên UNESCO, nơi lưu giữ hệ sinh thái rừng nhiệt đới nguyên sinh phong phú với nhiều loài động thực vật quý hiếm. Cách Biên Hòa khoảng 150km, lý tưởng cho chuyến đi 2 ngày 1 đêm.',
 N'Huyện Tân Phú, Đồng Nai', N'Thiên nhiên', 150.0,
 11.4250, 107.4260,
 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'Thác Giang Điền', 
 N'Khu du lịch Thác Giang Điền là điểm đến nghỉ dưỡng cuối tuần lý tưởng với thác nước mát lạnh, hồ bơi, khu cắm trại và nhiều trò chơi ngoài trời. Thích hợp cho gia đình và nhóm bạn.',
 N'Xã Giang Điền, Huyện Trảng Bom, Đồng Nai', N'Thiên nhiên', 25.0,
 10.9100, 106.9700,
 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8673?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE());

-- ── 2. DANH MỤC BÀI VIẾT ───────────────────────────────────

IF NOT EXISTS (SELECT 1 FROM Article_Categories WHERE name = N'Du lịch Đồng Nai')
INSERT INTO Article_Categories (name, description, is_active, created_at, updated_at)
VALUES (N'Du lịch Đồng Nai', N'Khám phá các điểm đến và trải nghiệm du lịch tại Biên Hòa - Đồng Nai', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM Article_Categories WHERE name = N'Ẩm thực')
INSERT INTO Article_Categories (name, description, is_active, created_at, updated_at)
VALUES (N'Ẩm thực', N'Khám phá ẩm thực đặc sản vùng miền Đông Nam Bộ', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM Article_Categories WHERE name = N'Khách sạn')
INSERT INTO Article_Categories (name, description, is_active, created_at, updated_at)
VALUES (N'Khách sạn', N'Tin tức, sự kiện và ưu đãi đặc biệt từ Kant Hotel', 1, GETDATE(), GETDATE());

IF NOT EXISTS (SELECT 1 FROM Article_Categories WHERE name = N'Mẹo du lịch')
INSERT INTO Article_Categories (name, description, is_active, created_at, updated_at)
VALUES (N'Mẹo du lịch', N'Bí kíp và kinh nghiệm du lịch hữu ích', 1, GETDATE(), GETDATE());

-- ── 3. BÀI VIẾT MẪU ────────────────────────────────────────
-- Lấy category IDs
DECLARE @catDuLich INT = (SELECT TOP 1 id FROM Article_Categories WHERE name = N'Du lịch Đồng Nai');
DECLARE @catAmThuc INT = (SELECT TOP 1 id FROM Article_Categories WHERE name = N'Ẩm thực');
DECLARE @catKhachSan INT = (SELECT TOP 1 id FROM Article_Categories WHERE name = N'Khách sạn');
DECLARE @catMeo INT = (SELECT TOP 1 id FROM Article_Categories WHERE name = N'Mẹo du lịch');

-- Lấy attraction IDs
DECLARE @vanMieu INT = (SELECT TOP 1 id FROM Attractions WHERE name = N'Văn miếu Trấn Biên');
DECLARE @buuLong INT = (SELECT TOP 1 id FROM Attractions WHERE name = N'Khu du lịch Bửu Long');
DECLARE @cuLaoPho INT = (SELECT TOP 1 id FROM Attractions WHERE name = N'Cù lao Phố');
DECLARE @langBuoi INT = (SELECT TOP 1 id FROM Attractions WHERE name = N'Làng bưởi Tân Triều');

INSERT INTO Articles (title, slug, content, category_id, attraction_id, thumbnail_url, is_active, published_at, updated_at)
VALUES
(N'Khám phá Văn miếu Trấn Biên - Di tích lịch sử đầu tiên ở Nam Bộ',
 'kham-pha-van-mieu-tran-bien',
 N'<h2>Văn miếu Trấn Biên - Niềm tự hào của Biên Hòa</h2>
<p>Văn miếu Trấn Biên được xây dựng vào năm 1715 dưới thời chúa Nguyễn Phúc Chu, là văn miếu <strong>đầu tiên</strong> được xây dựng tại vùng đất Nam Bộ. Trải qua hơn 300 năm lịch sử, nơi đây vẫn giữ nguyên vẻ uy nghiêm và trang trọng.</p>
<h3>Kiến trúc độc đáo</h3>
<p>Quần thể Văn miếu rộng hơn 15 hecta, bao gồm khu thờ chính, Nhà bia tiến sĩ, Hồ Thiên Quang và vườn cây cổ thụ. Kiến trúc pha trộn giữa phong cách cung đình Huế và nét đặc trưng Nam Bộ tạo nên một không gian văn hóa đặc sắc.</p>
<h3>Thời gian tham quan</h3>
<p>Văn miếu mở cửa từ <strong>7h00 - 17h00</strong> hàng ngày. Vé tham quan miễn phí. Đặc biệt vào dịp Tết Nguyên Đán và các ngày lễ lớn, nơi đây tổ chức nhiều hoạt động văn hóa truyền thống hấp dẫn.</p>
<blockquote>💡 <em>Mẹo: Nên đến vào buổi sáng sớm (7h-9h) để tận hưởng không khí trong lành và tránh nắng.</em></blockquote>',
 @catDuLich, @vanMieu,
 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80',
 1, DATEADD(DAY, -5, GETDATE()), GETDATE()),

(N'Khu du lịch Bửu Long - Vịnh Hạ Long thu nhỏ giữa lòng Biên Hòa',
 'khu-du-lich-buu-long-vinh-ha-long-thu-nho',
 N'<h2>Bửu Long - Viên ngọc xanh của Đồng Nai</h2>
<p>Khu du lịch Bửu Long được ví như <strong>"Vịnh Hạ Long thu nhỏ"</strong> của miền Nam với hồ nước xanh biếc bao quanh bởi những ngọn núi đá vôi hùng vĩ. Chỉ cách trung tâm Biên Hòa khoảng 6km, đây là điểm đến lý tưởng cho một ngày nghỉ ngơi thư giãn.</p>
<h3>Điểm nhấn không thể bỏ qua</h3>
<ul>
<li><strong>Hồ Long Ẩn</strong>: Hồ nước xanh ngọc bích, nơi du khách có thể chèo thuyền ngắm cảnh</li>
<li><strong>Chùa Bửu Phong</strong>: Ngôi chùa cổ trên đỉnh núi với view panorama tuyệt đẹp</li>
<li><strong>Hang đá</strong>: Những hang động tự nhiên kỳ thú ẩn mình trong núi đá</li>
</ul>
<h3>Chi phí tham khảo</h3>
<p>Vé vào cửa: <strong>30.000đ/người lớn</strong>, <strong>15.000đ/trẻ em</strong>. Thuê thuyền: 50.000đ/lượt.</p>',
 @catDuLich, @buuLong,
 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
 1, DATEADD(DAY, -3, GETDATE()), GETDATE()),

(N'Cù lao Phố - Hành trình về thương cảng huyền thoại',
 'cu-lao-pho-thuong-cang-huyen-thoai',
 N'<h2>Cù lao Phố - Nơi giao thoa văn hóa Việt - Hoa</h2>
<p>Nằm giữa dòng sông Đồng Nai hiền hòa, Cù lao Phố từng là thương cảng sầm uất nhất Nam Bộ vào thế kỷ XVII-XVIII. Ngày nay, nơi đây vẫn giữ được nét cổ kính với những ngôi đình, chùa và miếu có tuổi đời hàng trăm năm.</p>
<h3>Những điểm tham quan nổi bật</h3>
<ul>
<li><strong>Chùa Ông</strong> (Thất Phủ Cổ Miếu): Ngôi chùa Hoa lớn nhất Đồng Nai, kiến trúc tuyệt đẹp</li>
<li><strong>Đình Tân Lân</strong>: Thờ danh tướng Trần Thượng Xuyên</li>
<li><strong>Làng gốm</strong>: Tham quan xưởng gốm truyền thống Biên Hòa</li>
</ul>
<p>Từ Kant Hotel, du khách có thể đi xe máy hoặc taxi chỉ khoảng <strong>15 phút</strong> là tới nơi.</p>',
 @catDuLich, @cuLaoPho,
 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
 1, DATEADD(DAY, -2, GETDATE()), GETDATE()),

(N'Top 7 món ngon Biên Hòa nhất định phải thử khi đến Đồng Nai',
 'top-7-mon-ngon-bien-hoa',
 N'<h2>Ẩm thực Biên Hòa - Đậm đà hương vị miền Đông</h2>
<p>Biên Hòa không chỉ nổi tiếng với lịch sử và thiên nhiên mà còn sở hữu nền ẩm thực đa dạng, phong phú. Dưới đây là top 7 món ăn mà du khách lưu trú tại Kant Hotel nên thử:</p>
<h3>1. Bưởi Tân Triều</h3>
<p>Bưởi da xanh Tân Triều nổi tiếng với vị ngọt thanh, tép mọng nước. Đây là đặc sản số 1 của Đồng Nai, thích hợp mua về làm quà.</p>
<h3>2. Bánh canh gạo Biên Hòa</h3>
<p>Sợi bánh canh làm từ bột gạo xay, dai mềm, ăn kèm thịt heo, giò chả. Món ăn sáng quen thuộc của người dân nơi đây.</p>
<h3>3. Gỏi cá sông Đồng Nai</h3>
<p>Cá tươi đánh bắt từ sông Đồng Nai, làm gỏi cùng rau sống và nước mắm chua ngọt đặc trưng.</p>
<h3>4. Nem nướng Biên Hòa</h3>
<p>Nem nướng cuốn bánh tráng rau sống, chấm nước chấm đậu phộng — đơn giản nhưng gây thương nhớ.</p>
<h3>5. Gà nướng đất sét</h3>
<p>Gà nguyên con bọc đất sét nướng than hoa, thịt mềm thấm gia vị đặc biệt.</p>
<h3>6. Cơm lá sen</h3>
<p>Cơm gạo lứt nấu trong lá sen, thơm dịu, thường kèm theo nhiều món ăn kèm đặc sắc.</p>
<h3>7. Chè bưởi</h3>
<p>Tráng miệng hoàn hảo với chè bưởi — tận dụng cùi bưởi Tân Triều nấu cùng đường phèn và nước cốt dừa béo ngậy.</p>',
 @catAmThuc, @langBuoi,
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
 1, DATEADD(DAY, -1, GETDATE()), GETDATE()),

(N'Kant Hotel - Điểm dừng chân lý tưởng khi du lịch Biên Hòa',
 'kant-hotel-diem-dung-chan-ly-tuong',
 N'<h2>Chào mừng đến Kant Hotel</h2>
<p>Tọa lạc tại trung tâm thành phố Biên Hòa, <strong>Kant Hotel</strong> mang đến trải nghiệm lưu trú sang trọng với dịch vụ chuyên nghiệp, phòng ốc hiện đại và vị trí thuận tiện để khám phá mọi ngóc ngách của Đồng Nai.</p>
<h3>Tại sao chọn Kant Hotel?</h3>
<ul>
<li>🏨 Phòng nghỉ tiêu chuẩn 4 sao, nội thất cao cấp</li>
<li>🍳 Buffet sáng phong phú với đặc sản địa phương</li>
<li>🚗 Bãi đỗ xe rộng rãi, miễn phí</li>
<li>📍 Chỉ 5 phút đến Chợ Biên Hòa, 15 phút đến Bửu Long</li>
<li>💆 Spa, hồ bơi và phòng gym hiện đại</li>
</ul>
<h3>Ưu đãi đặc biệt</h3>
<p>Đặt phòng trực tuyến tại website để nhận <strong>giảm 15%</strong> cho lần lưu trú đầu tiên. Áp dụng cho tất cả hạng phòng.</p>',
 @catKhachSan, NULL,
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
 1, GETDATE(), GETDATE()),

(N'5 mẹo du lịch Biên Hòa tiết kiệm cho dân phượt',
 '5-meo-du-lich-bien-hoa-tiet-kiem',
 N'<h2>Du lịch Biên Hòa không cần tốn kém</h2>
<p>Biên Hòa là điểm đến lý tưởng cho những chuyến đi ngắn ngày với chi phí phải chăng. Dưới đây là 5 mẹo giúp bạn có chuyến du lịch trọn vẹn mà không lo "cháy" ví:</p>
<h3>1. Di chuyển bằng xe máy</h3>
<p>Hầu hết các điểm tham quan ở Biên Hòa đều nằm trong bán kính 10km. Thuê xe máy khoảng 100-150k/ngày là lựa chọn tiết kiệm nhất.</p>
<h3>2. Ăn tại quán địa phương</h3>
<p>Tránh các nhà hàng du lịch, hãy ăn tại quán cơm bình dân hoặc hàng quán vỉa hè. Một bữa ăn chỉ từ 30-50k.</p>
<h3>3. Đi vào ngày thường</h3>
<p>Giá phòng khách sạn và vé tham quan thường rẻ hơn 20-30% so với cuối tuần. Ngoài ra, bạn sẽ tránh được đông đúc.</p>
<h3>4. Mang theo đồ ăn nhẹ</h3>
<p>Mua trái cây tại Chợ Biên Hòa hoặc vườn bưởi Tân Triều với giá gốc, vừa ngon vừa tiết kiệm.</p>
<h3>5. Đặt phòng online</h3>
<p>Đặt phòng qua website khách sạn thường có giá tốt hơn đặt qua app trung gian. Tại Kant Hotel, đặt online được giảm thêm 15%!</p>',
 @catMeo, NULL,
 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
 1, DATEADD(DAY, -4, GETDATE()), GETDATE());

PRINT N'✅ Seed data thành công! Đã thêm 8 điểm tham quan + 4 danh mục + 6 bài viết.';
