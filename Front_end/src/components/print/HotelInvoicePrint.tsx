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
  hotel,
}) => {
  const hotelInfo = hotel ?? DEFAULT_HOTEL;
  const statusLabel = INVOICE_STATUS_LABEL[invoice.status] ?? invoice.status ?? '—';

  const totalPaid = useMemo(
    () => invoice.payments?.reduce((sum, p) => sum + (p.amountPaid || 0), 0) ?? 0,
    [invoice.payments]
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
    <div id="print-invoice" style={{ display: 'none' }}>
      <style>{`
        @media print {
          body > *:not(#print-invoice) { display: none !important; }
          #print-invoice {
            display: block !important;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #111;
            max-width: 820px;
            margin: 0 auto;
            padding: 24px;
          }
          .pi-header { text-align: center; border-bottom: 2px solid #A6894B; padding-bottom: 14px; margin-bottom: 18px; }
          .pi-hotel-name { font-size: 26px; font-weight: 900; color: #A6894B; letter-spacing: 1.4px; }
          .pi-hotel-sub { font-size: 12px; color: #666; margin-top: 4px; }
          .pi-title { font-size: 18px; font-weight: 900; margin: 10px 0 0; }
          .pi-meta { margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; font-size: 12px; color: #444; }
          .pi-meta b { color: #111; }
          .pi-section { margin: 14px 0; }
          .pi-section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.9px; color: #A6894B; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
          .pi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
          .pi-label { color: #555; font-size: 12px; }
          .pi-value { font-weight: 800; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { background: #f5f0e8; color: #7a6430; text-align: left; padding: 8px 10px; font-weight: 900; }
          td { padding: 7px 10px; border-bottom: 1px solid #eee; vertical-align: top; }
          .pi-total-box { background: #f5f0e8; border-radius: 10px; padding: 14px 16px; margin-top: 12px; }
          .pi-total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
          .pi-grand-total { font-size: 16px; font-weight: 1000; color: #A6894B; padding-top: 10px; margin-top: 8px; border-top: 1px solid #cbb87a; }
          .pi-note { margin-top: 10px; font-size: 11px; color: #666; }
          .pi-sign { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 22px; }
          .pi-sign-col { text-align: center; font-size: 11px; color: #666; }
          .pi-sign-line { margin-top: 44px; border-top: 1px dashed #bbb; padding-top: 8px; }
          .pi-footer { margin-top: 18px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
        }
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

      <div className="pi-total-box">
        <div className="pi-total-row"><span>Tiền phòng</span><span>{formatMoney(invoice.totalRoomAmount)}</span></div>
        <div className="pi-total-row"><span>Dịch vụ</span><span>{formatMoney(invoice.totalServiceAmount)}</span></div>
        <div className="pi-total-row"><span>Giảm giá</span><span style={{ color: '#16a34a' }}>- {formatMoney(invoice.discountAmount)}</span></div>
        <div className="pi-total-row"><span>Thuế VAT</span><span>{formatMoney(invoice.taxAmount)}</span></div>
        <div className="pi-total-row pi-grand-total"><span>TỔNG CỘNG</span><span>{formatMoney(invoice.finalTotal)}</span></div>
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

