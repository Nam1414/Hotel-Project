-- Script xóa hóa đơn trùng lặp: giữ lại hóa đơn MỚI NHẤT cho mỗi booking
-- Chạy script này 1 lần để dọn dẹp data cũ

-- 1. Xóa payments của các hóa đơn trùng (giữ lại hóa đơn có ID lớn nhất)
DELETE p FROM Payments p
INNER JOIN Invoices i ON p.invoice_id = i.id
WHERE i.id NOT IN (
    SELECT MAX(id) FROM Invoices
    WHERE booking_id IS NOT NULL
    GROUP BY booking_id
)
AND i.booking_id IN (
    SELECT booking_id FROM Invoices
    WHERE booking_id IS NOT NULL
    GROUP BY booking_id
    HAVING COUNT(*) > 1
);

-- 2. Xóa các hóa đơn trùng (giữ lại cái có ID lớn nhất)
DELETE FROM Invoices
WHERE id NOT IN (
    SELECT max_id FROM (
        SELECT MAX(id) AS max_id FROM Invoices
        WHERE booking_id IS NOT NULL
        GROUP BY booking_id
    ) AS keep_ids
)
AND booking_id IN (
    SELECT dup_booking FROM (
        SELECT booking_id AS dup_booking FROM Invoices
        WHERE booking_id IS NOT NULL
        GROUP BY booking_id
        HAVING COUNT(*) > 1
    ) AS dup_ids
);

-- 3. Kiểm tra kết quả
SELECT booking_id, COUNT(*) as invoice_count
FROM Invoices
WHERE booking_id IS NOT NULL
GROUP BY booking_id
HAVING COUNT(*) > 1;
-- Kết quả trả về phải RỖNG (0 rows) = không còn hóa đơn trùng
