// @ts-nocheck
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import type { BookingResponseDto, InvoiceResponseDto } from '../../services/bookingApi';
import type { RoomDto } from '../../services/adminApi';

const formatMoney = (v?: number | null) =>
  v !== undefined && v !== null ? v.toLocaleString('vi-VN') + ' ₫' : '—';

const nightsBetween = (from: string, to: string) =>
  Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000));

const INVOICE_STATUS_LABEL: Record<string, string> = {
  Unpaid: 'Chưa thanh toán',
  PartiallyPaid: 'Thanh toán một phần',
  Paid: 'Đã thanh toán',
  Cancelled: 'Đã hủy',
};

export interface HotelInvoicePrintProps {
  booking: BookingResponseDto;
  invoice: InvoiceResponseDto;
  rooms: RoomDto[];
  cashierName?: string | null;
  damages?: any[];
  services?: any[];
  hotel?: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    taxCode?: string;
    website?: string;
  };
}

const DEFAULT_HOTEL = {
  name: 'KANT HOTEL',
  address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
  phone: '028 1234 5678',
  email: 'kant@hotel.vn',
  taxCode: '0312345678',
  website: 'kanthotel.vn',
};

const HotelInvoicePrint: React.FC<HotelInvoicePrintProps> = ({
  booking,
  invoice,
  rooms,
  cashierName,
  damages,
  services,
  hotel,
}) => {
  const hotelInfo = hotel ?? DEFAULT_HOTEL;
  const statusLabel = INVOICE_STATUS_LABEL[invoice.status] ?? invoice.status ?? '—';

  const totalPaid = useMemo(
    () => (invoice.payments?.reduce((sum, p) => sum + (p.amountPaid || 0), 0) ?? 0) + (invoice.depositAmount || 0),
    [invoice.payments, invoice.depositAmount]
  );

  const remaining = Math.max(0, (invoice.finalTotal || 0) - totalPaid);

  const stay = useMemo(() => {
    const details = booking.details ?? [];
    if (details.length === 0) return null;
    const minIn = details.reduce((min, d) => (min && min < d.checkInDate ? min : d.checkInDate), details[0].checkInDate);
    const maxOut = details.reduce((max, d) => (max && max > d.checkOutDate ? max : d.checkOutDate), details[0].checkOutDate);
    return { checkIn: minIn, checkOut: maxOut };
  }, [booking.details]);

  return (
    <div id="print-invoice" className="printable-invoice">
      <style>{`
        /* Hide from screen by default */
        @media screen {
          #print-invoice { display: none !important; }
        }

        /* Print-specific logic */
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            visibility: hidden !important;
            overflow: hidden !important;
          }

          #print-invoice {
            visibility: visible !important;
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            background: #fff !important;
            box-sizing: border-box !important;
          }

          #print-invoice * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }
        }

        /* ── Compact Styles for A4 fit ── */
        #print-invoice { font-family: 'Segoe UI', Arial, sans-serif; color: #000; font-size: 10px; line-height: 1.35; }
        #print-invoice .pi-header { text-align: center; border-bottom: 1.5px solid #A6894B; padding-bottom: 8px; margin-bottom: 10px; }
        #print-invoice .pi-hotel-name { font-size: 20px; font-weight: 900; color: #A6894B !important; letter-spacing: 1px; }
        #print-invoice .pi-hotel-sub { font-size: 9px; color: #555 !important; margin-top: 2px; }
        #print-invoice .pi-title { font-size: 15px; font-weight: 900; margin: 6px 0 0; text-transform: uppercase; }
        #print-invoice .pi-meta { margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px 14px; font-size: 10px; }
        #print-invoice .pi-section { margin: 8px 0; }
        #print-invoice .pi-section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.6px; color: #A6894B !important; margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 2px; }
        #print-invoice .pi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 16px; }
        #print-invoice .pi-label { color: #555 !important; font-size: 10px; }
        #print-invoice .pi-value { font-weight: 700; font-size: 10px; }
        #print-invoice table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 4px; }
        #print-invoice th { background: #f5f5f5 !important; border-bottom: 1.5px solid #ddd; text-align: left; padding: 4px 6px; font-weight: 800; font-size: 9px; }
        #print-invoice td { padding: 3px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
        #print-invoice .pi-total-box { background: #fdfbf7 !important; border: 1px solid #eee; border-radius: 6px; padding: 8px 12px; margin-top: 10px; }
        #print-invoice .pi-total-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 10px; }
        #print-invoice .pi-grand-total { font-size: 14px; font-weight: 900; color: #A6894B !important; padding-top: 6px; margin-top: 4px; border-top: 1.5px solid #A6894B; }
        #print-invoice .pi-note { font-size: 8px; color: #888 !important; margin-top: 4px; font-style: italic; }
        #print-invoice .pi-sign { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px; }
        #print-invoice .pi-sign-col { text-align: center; font-size: 10px; }
        #print-invoice .pi-sign-line { margin-top: 35px; border-top: 1px solid #ddd; padding-top: 4px; width: 130px; margin-left: auto; margin-right: auto; font-size: 9px; }
        #print-invoice .pi-footer { margin-top: 12px; text-align: center; font-size: 8px; color: #999 !important; border-top: 1px solid #eee; padding-top: 6px; }
      `}</style>

      <div className="pi-header">
        <div className="pi-hotel-name">{hotelInfo.name}</div>
        <div className="pi-hotel-sub">
          {hotelInfo.address} | Tel: {hotelInfo.phone}
        </div>
        <div className="pi-hotel-sub">
          {hotelInfo.taxCode ? `MST: ${hotelInfo.taxCode}` : null}
          {hotelInfo.taxCode && hotelInfo.email ? ' | ' : null}
          {hotelInfo.email ? `Email: ${hotelInfo.email}` : null}
          {(hotelInfo.taxCode || hotelInfo.email) && hotelInfo.website ? ' | ' : null}
          {hotelInfo.website ? hotelInfo.website : null}
        </div>
        <div className="pi-title">HÓA ĐƠN THANH TOÁN</div>

        <div className="pi-meta">
          <div>Hóa đơn: <b>#INV-{invoice.id}</b></div>
          <div>Mã booking: <b>{booking.bookingCode}</b></div>
          <div>Ngày xuất: <b>{dayjs().format('DD/MM/YYYY HH:mm')}</b></div>
          <div>Trạng thái: <b>{statusLabel}</b></div>
          <div>Thu ngân/Lễ tân: <b>{cashierName || '—'}</b></div>
          <div />
        </div>
      </div>

      <div className="pi-section">
        <div className="pi-section-title">Thông tin khách hàng</div>
        <div className="pi-grid">
          <div><span className="pi-label">Họ tên: </span><span className="pi-value">{booking.guestName || '—'}</span></div>
          <div><span className="pi-label">SĐT: </span><span className="pi-value">{booking.guestPhone || '—'}</span></div>
          <div><span className="pi-label">Email: </span><span className="pi-value">{booking.guestEmail || '—'}</span></div>
          <div>
            <span className="pi-label">Thời gian lưu trú: </span>
            <span className="pi-value">
              {stay ? `${dayjs(stay.checkIn).format('DD/MM/YYYY')} → ${dayjs(stay.checkOut).format('DD/MM/YYYY')}` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="pi-section">
        <div className="pi-section-title">Chi tiết phòng</div>
        <table>
          <thead>
            <tr>
              <th>Phòng</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th style={{ textAlign: 'center' }}>Số đêm</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(booking.details ?? []).map((d, i) => {
              const room = rooms.find(r => r.id === d.roomId);
              const nights = nightsBetween(d.checkInDate, d.checkOutDate);
              const amount = (d.pricePerNight || 0) * nights;
              return (
                <tr key={i}>
                  <td>{room ? `Phòng ${room.roomNumber}` : `#${d.roomId || d.roomTypeId}`}</td>
                  <td>{dayjs(d.checkInDate).format('DD/MM/YYYY')}</td>
                  <td>{dayjs(d.checkOutDate).format('DD/MM/YYYY')}</td>
                  <td style={{ textAlign: 'center' }}>{nights}</td>
                  <td>{formatMoney(d.pricePerNight)}</td>
                  <td><b>{formatMoney(amount)}</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Services Section */}
      {services && services.length > 0 && (
        <div className="pi-section">
          <div className="pi-section-title">Dịch vụ & Vật tư đã sử dụng</div>
          <table>
            <thead>
              <tr>
                <th>Sản phẩm / Dịch vụ</th>
                <th style={{ textAlign: 'center' }}>Số lượng</th>
                <th style={{ textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {services.map((order, i) => (
                <React.Fragment key={i}>
                  {order.details?.map((item: any, j: number) => (
                    <tr key={`${i}-${j}`}>
                      <td>{item.serviceName}</td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right' }}>{formatMoney(item.lineTotal)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Damages Section */}
      {damages && damages.length > 0 && (
        <div className="pi-section">
          <div className="pi-section-title">Bồi thường Thất thoát / Hư hỏng</div>
          <table>
            <thead>
              <tr>
                <th>Vật tư hư hỏng</th>
                <th style={{ textAlign: 'center' }}>SL</th>
                <th style={{ textAlign: 'right' }}>Phí phạt</th>
              </tr>
            </thead>
            <tbody>
              {damages.map((d, i) => (
                <tr key={i}>
                  <td>{d.equipmentName || 'Vật dụng'} ({d.roomNumber || '—'})</td>
                  <td style={{ textAlign: 'center' }}>{d.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatMoney(d.penaltyAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pi-total-box">
        <div className="pi-total-row"><span>Tiền phòng</span><span>{formatMoney(invoice.totalRoomAmount)}</span></div>
        <div className="pi-total-row"><span>Dịch vụ</span><span>{formatMoney(invoice.totalServiceAmount)}</span></div>
        <div className="pi-total-row"><span>Giảm giá</span><span style={{ color: '#16a34a' }}>- {formatMoney(invoice.discountAmount)}</span></div>
        <div className="pi-total-row"><span>Thuế VAT</span><span>{formatMoney(invoice.taxAmount)}</span></div>
        <div className="pi-total-row pi-grand-total"><span>TỔNG CỘNG</span><span>{formatMoney(invoice.finalTotal)}</span></div>
        {(invoice.depositAmount || 0) > 0 && (
          <div className="pi-total-row"><span>Tiền đặt cọc</span><span style={{ color: '#d97706' }}>- {formatMoney(invoice.depositAmount)}</span></div>
        )}
        <div className="pi-total-row"><span>Đã thanh toán thêm</span><span style={{ color: '#16a34a' }}>{formatMoney(totalPaid - (invoice.depositAmount || 0))}</span></div>
        <div className="pi-total-row"><span>Đã thanh toán</span><span style={{ color: '#16a34a', fontWeight: 900 }}>{formatMoney(totalPaid)}</span></div>
        <div className="pi-total-row"><span>Còn phải thu</span><span style={{ color: remaining > 0 ? '#dc2626' : '#16a34a', fontWeight: 900 }}>{formatMoney(remaining)}</span></div>
        <div className="pi-note">Lưu ý: Quý khách vui lòng kiểm tra thông tin và số tiền trước khi rời quầy.</div>
      </div>

      {(invoice.payments?.length ?? 0) > 0 && (
        <div className="pi-section">
          <div className="pi-section-title">Lịch sử thanh toán</div>
          <table>
            <thead>
              <tr>
                <th>Phương thức</th>
                <th>Mã giao dịch</th>
                <th>Thời gian</th>
                <th style={{ textAlign: 'right' }}>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.paymentMethod || '—'}</td>
                  <td style={{ fontFamily: 'monospace' }}>#{p.transactionCode || '—'}</td>
                  <td>{p.paymentDate ? dayjs(p.paymentDate).format('DD/MM/YYYY HH:mm') : '—'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800 }}>{formatMoney(p.amountPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pi-sign">
        <div className="pi-sign-col">
          Khách hàng
          <div className="pi-sign-line">(Ký, ghi rõ họ tên)</div>
        </div>
        <div className="pi-sign-col">
          Thu ngân / Lễ tân
          <div className="pi-sign-line">(Ký, ghi rõ họ tên)</div>
        </div>
      </div>

      <div className="pi-footer">
        <div>Cảm ơn Quý khách đã lưu trú tại {hotelInfo.name}.</div>
        <div>Hóa đơn được xuất bởi hệ thống quản lý khách sạn.</div>
      </div>
    </div>
  );
};

export default HotelInvoicePrint;

