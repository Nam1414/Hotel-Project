import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import RoomCard from '../../components/staff/RoomCard';
import ArrivalCard from '../../components/staff/ArrivalCard';
import { RefreshCw, FileText, BarChart3, Info, CircleAlert, Sparkles, BellRing } from 'lucide-react';
import { adminApi, RoomDto, NotificationDto } from '../../services/adminApi';
import { bookingApi, BookingResponseDto } from '../../services/bookingApi';
import axiosClient from '../../api/axiosClient';
import { formatVietnamTime } from '../../utils/dateFormatter';
import { message } from 'antd';
import dayjs from 'dayjs';

const StaffDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  const permissions = user?.permissions || [];
  const canManageRooms = permissions.includes('MANAGE_ROOMS');
  const canManageBookings = permissions.includes('MANAGE_BOOKINGS');
  const canManageServices = permissions.includes('MANAGE_SERVICES');
  const canViewReports = permissions.includes('VIEW_REPORTS');
  const canManageUsers = permissions.includes('MANAGE_USERS');

  const fetchData = async () => {
    setLoading(true);
    try {
      const promises: Promise<any>[] = [
        adminApi.getRooms(),
        axiosClient.get('/api/Notifications')
      ];

      const hasBookingAccess = canManageBookings || permissions.includes('MANAGE_INVOICES');
      
      if (hasBookingAccess) {
        promises.push(bookingApi.getAll());
      } else {
        promises.push(Promise.resolve([]));
      }

      const [roomsRes, notificationsRes, allBookingsRes] = await Promise.allSettled(promises);

      const fetchedRooms = roomsRes.status === 'fulfilled' ? roomsRes.value : [];
      const fetchedNotifications = notificationsRes.status === 'fulfilled' ? notificationsRes.value : [];
      const fetchedBookings = allBookingsRes.status === 'fulfilled' ? allBookingsRes.value : [];

      setRooms(fetchedRooms as RoomDto[]);
      setNotifications((fetchedNotifications || []) as NotificationDto[]);
      setBookings(fetchedBookings as BookingResponseDto[]);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = (roomId: number, currentStatus: string) => {
    message.info('Vui lòng sử dụng màn hình chuyên dụng để cập nhật trạng thái.');
  };

  const handleConfirmCheckIn = (arrival: any) => {
    message.info('Vui lòng sử dụng màn hình Quản lý đặt phòng để check-in.');
  };

  const arrivals = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return bookings
      .filter(b => b.status === 'Confirmed' && b.details.some(d => d.checkInDate.startsWith(today)))
      .map(b => ({
        id: b.id.toString(),
        guestName: b.guestName || 'Khách lẻ',
        roomNumber: b.details[0]?.roomId ? rooms.find(r => r.id === b.details[0].roomId)?.roomNumber || 'N/A' : 'N/A',
        bookingId: b.bookingCode,
        checkInTime: new Date(b.details[0]?.checkInDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }));
  }, [bookings, rooms]);

  const occupancyRate = useMemo(() => {
    const activeRooms = rooms.filter(r => r.isActive);
    if (!activeRooms.length) return 0;
    const occupied = activeRooms.filter(r => r.status === 'Occupied').length;
    return Math.round((occupied / activeRooms.length) * 100);
  }, [rooms]);

  const mapStatusToRoomStatus = (status: string, cleaningStatus?: string | null): any => {
    if (status === 'Occupied') return 'OCCUPIED';
    if (status === 'Cleaning' || cleaningStatus === 'Dirty') return 'CLEANING';
    return 'VACANT';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-primary">Đang tải...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-[var(--text-title)]">
            Tổng quan công việc
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Các tiện ích hỗ trợ công việc hiển thị dựa trên quyền hạn của bạn
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={fetchData}
            className="flex items-center space-x-2 px-4 py-2 text-[var(--text-muted)] bg-[var(--nav-bg)] rounded-xl border border-[var(--nav-border)] hover:bg-primary/5 transition-colors shadow-sm"
          >
            <RefreshCw size={18} />
            <span className="font-semibold text-sm">Làm mới</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lễ tân / Quản lý Đặt phòng (Chiếm 8 cột nếu có, không có thì các widget khác bung rộng) */}
        {canManageBookings && (
          <div className={`space-y-8 ${canManageRooms || canViewReports || canManageServices ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <div className="bg-[var(--nav-bg)] rounded-2xl border border-[var(--nav-border)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-[var(--text-title)]">Bản đồ phòng (Reception)</h2>
                <div className="flex items-center space-x-6 text-xs font-bold tracking-wider">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-[var(--text-muted)]">TRỐNG</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-[var(--text-muted)]">CÓ KHÁCH</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {rooms.filter(r => r.isActive).map((room) => (
                  <RoomCard 
                    key={room.id}
                    number={room.roomNumber}
                    type={room.roomTypeName}
                    status={mapStatusToRoomStatus(room.status, room.cleaningStatus)}
                    onUpdateStatus={() => handleUpdateStatus(room.id, room.status)}
                  />
                ))}
              </div>
            </div>

            {/* Arrivals Widget */}
            <div className="bg-[var(--nav-bg)] rounded-2xl border border-[var(--nav-border)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-[var(--text-title)]">Khách đến hôm nay</h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                  {arrivals.length} CHỜ
                </span>
              </div>
              <div className="space-y-4">
                {arrivals.length > 0 ? (
                  arrivals.map((arrival) => (
                    <ArrivalCard 
                      key={arrival.id}
                      guestName={arrival.guestName}
                      roomNumber={arrival.roomNumber}
                      bookingId={arrival.bookingId}
                      time={arrival.checkInTime}
                      onConfirm={() => handleConfirmCheckIn(arrival)}
                    />
                  ))
                ) : (
                  <div className="p-8 border border-dashed border-[var(--nav-border)] rounded-xl text-center text-[var(--text-muted)]">
                    <Info size={24} className="mx-auto mb-2 opacity-50" />
                    <p>Không còn khách đến trong hôm nay</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Các cột công cụ phụ trợ (Bên phải) */}
        <div className={`space-y-8 ${canManageBookings ? 'lg:col-span-4' : 'lg:col-span-12 grid md:grid-cols-2 gap-8'}`}>
          
          {/* Housekeeping Widget */}
          {canManageRooms && (
            <div className="bg-[var(--nav-bg)] rounded-2xl border border-[var(--nav-border)] p-6 shadow-sm h-fit">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="text-yellow-500" />
                <h2 className="text-xl font-display font-bold text-[var(--text-title)]">Dọn dẹp phòng</h2>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {rooms.filter(r => r.status === 'Cleaning' || r.cleaningStatus === 'Dirty').map(room => (
                  <div key={room.id} className="flex justify-between items-center p-4 border border-[var(--nav-border)] rounded-xl bg-[var(--bg-main)]">
                    <div>
                      <h4 className="font-bold text-[var(--text-title)]">Phòng {room.roomNumber}</h4>
                      <span className="text-xs text-[var(--text-muted)]">{room.roomTypeName}</span>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-bold border border-yellow-500/20 uppercase">
                      Cần dọn
                    </span>
                  </div>
                ))}
                {rooms.filter(r => r.status === 'Cleaning' || r.cleaningStatus === 'Dirty').length === 0 && (
                  <p className="text-center text-sm text-[var(--text-muted)] py-4">Tuyệt vời, không có phòng nào dơ!</p>
                )}
              </div>
            </div>
          )}

          {/* Kế toán / Quản lý / IT Widget */}
          {(canViewReports || canManageUsers) && (
            <div className="bg-gradient-to-br from-[var(--color-dark-base)] to-[var(--color-dark-navy)] dark:from-[#0B0F19] dark:to-[#111827] p-6 rounded-2xl text-white shadow-xl border border-white/5 h-fit">
              <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-4">Tỷ lệ lấp đầy (Realtime)</h4>
              <div className="flex items-end space-x-2 mb-2">
                <span className="text-4xl font-display font-bold">{occupancyRate}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-6">
                <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${occupancyRate}%` }}></div>
              </div>

              {canViewReports && (
                <div className="mt-6 space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                    <span className="text-sm text-gray-300">Khách đang lưu trú</span>
                    <span className="font-bold text-white">{rooms.filter(r => r.status === 'Occupied').length} phòng</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                    <span className="text-sm text-gray-300">Phòng trống khả dụng</span>
                    <span className="font-bold text-white">{rooms.filter(r => r.status === 'Available').length} phòng</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Đầu bếp / Phục vụ Widget */}
          {canManageServices && (
            <div className="bg-[var(--nav-bg)] rounded-2xl border border-[var(--nav-border)] p-6 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FileText className="text-orange-500" />
                  <h2 className="text-xl font-display font-bold text-[var(--text-title)]">Bếp / Order</h2>
                </div>
              </div>
              <div className="p-6 text-center border border-dashed border-[var(--nav-border)] rounded-xl bg-[var(--bg-main)]">
                <p className="text-sm text-[var(--text-muted)] mb-3">Vui lòng vào trang quản lý dịch vụ để xem order chi tiết.</p>
                <button onClick={() => window.location.href='/staff/orders'} className="text-sm font-bold text-primary hover:underline">
                  Đi đến trang Đặt dịch vụ &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Thông báo chung */}
          <div className="bg-[var(--nav-bg)] rounded-2xl border border-[var(--nav-border)] p-6 shadow-sm h-fit">
            <div className="flex items-center space-x-3 mb-6">
              <BellRing className="text-primary" />
              <h2 className="text-xl font-display font-bold text-[var(--text-title)]">Thông báo hệ thống</h2>
            </div>
            <div className="space-y-4">
              {notifications.slice(0, 3).map(note => (
                <div key={note.id} className="p-3 bg-[var(--bg-main)] border border-[var(--nav-border)] rounded-xl">
                  <h4 className="font-bold text-[var(--text-title)] text-sm">{note.title}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{formatVietnamTime(note.createdAt)}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-center text-sm text-[var(--text-muted)] py-4">Không có thông báo mới.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
