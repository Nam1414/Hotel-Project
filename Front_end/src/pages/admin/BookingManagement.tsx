// @ts-nocheck
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  App,
  Button,
  Card as AntCard,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import {
  BanknoteIcon,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  LogIn,
  LogOut,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Ticket,
  XCircle,
} from 'lucide-react';
import dayjs from 'dayjs';
import {
  bookingApi,
  BookingResponseDto,
  BookingStatus,
  InvoiceResponseDto,
} from '../../services/bookingApi';
import { adminApi, RoomDto, RoomTypeDto } from '../../services/adminApi';
import { voucherApi, VoucherResponseDto } from '../../services/voucherApi';
import HotelInvoicePrint from '../../components/print/HotelInvoicePrint';
const { Title, Paragraph, Text } = Typography;

// ─── helpers ───────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<BookingStatus, string> = {
  Pending: 'gold',
  Confirmed: 'blue',
  CheckedIn: 'green',
  CheckedOut: 'default',
  Cancelled: 'red',
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  Pending: 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  CheckedIn: 'Đã nhận phòng',
  CheckedOut: 'Đã trả phòng',
  Cancelled: 'Đã hủy',
};

const PAYMENT_METHODS = ['Cash', 'Card', 'BankTransfer', 'MoMo', 'VNPay'];

const formatMoney = (v?: number | null) =>
  v !== undefined && v !== null ? v.toLocaleString('vi-VN') + ' ₫' : '—';

const nightsBetween = (from: string, to: string) =>
  Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000));

type BookingViewMode = 'manage' | 'arrivals' | 'in-house' | 'check-out' | 'invoices';

const VIEW_CONFIG: Record<
  BookingViewMode,
  {
    title: string;
    subtitle: string;
    createLabel: string;
    defaultStatus: BookingStatus | 'all';
    showCreate: boolean;
  }
> = {
  manage: {
    title: 'Quản lý Đặt phòng',
    subtitle: 'Tạo booking, nhận phòng, trả phòng và theo dõi toàn bộ lịch lưu trú.',
    createLabel: 'Tạo booking mới',
    defaultStatus: 'all',
    showCreate: true,
  },
  arrivals: {
    title: 'Khách đến hôm nay',
    subtitle: 'Danh sách booking dự kiến check-in trong ngày để lễ tân xử lý nhanh.',
    createLabel: 'Tạo booking mới',
    defaultStatus: 'Confirmed',
    showCreate: false,
  },
  'in-house': {
    title: 'Khách đang lưu trú',
    subtitle: 'Theo dõi khách đã nhận phòng và tình trạng lưu trú hiện tại.',
    createLabel: 'Tạo booking mới',
    defaultStatus: 'CheckedIn',
    showCreate: false,
  },
  'check-out': {
    title: 'Thủ tục trả phòng',
    subtitle: 'Lọc các booking cần check-out để thao tác nhanh tại quầy lễ tân.',
    createLabel: 'Tạo booking mới',
    defaultStatus: 'CheckedIn',
    showCreate: false,
  },
  invoices: {
    title: 'Quản lý Hóa đơn',
    subtitle: 'Tạo hóa đơn, ghi nhận thanh toán và in chứng từ cho khách.',
    createLabel: 'Tạo booking mới',
    defaultStatus: 'all',
    showCreate: false,
  },
};

const getViewMode = (pathname: string): BookingViewMode => {
  if (pathname.endsWith('/arrivals')) return 'arrivals';
  if (pathname.endsWith('/in-house')) return 'in-house';
  if (pathname.endsWith('/check-out')) return 'check-out';
  if (pathname.endsWith('/invoices')) return 'invoices';
  return 'manage';
};

const isToday = (value?: string | null) =>
  Boolean(value) && dayjs(value).isSame(dayjs(), 'day');

/** Sinh mã giao dịch ngẫu nhiên phía client (backup nếu cần hiển thị tức thì) */
const generateTxnCode = () => {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${dayjs().format('YYYYMMDD')}-${rand}`;
};

// ─── Print Invoice Component ────────────────────────────────────────────────
interface PrintInvoiceProps {
  booking: BookingResponseDto;
  invoice: InvoiceResponseDto;
  rooms: RoomDto[];
  cashierName?: string | null;
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({ booking, invoice, rooms, cashierName }) => (
  <HotelInvoicePrint booking={booking} invoice={invoice} rooms={rooms} cashierName={cashierName} />
);

// ─── Main Component ────────────────────────────────────────────────────────
const BookingPage: React.FC = () => {
  const { message } = App.useApp();
  const cashierName = useSelector((s: RootState) => s.auth.user?.fullName || s.auth.user?.name || null);
  const location = useLocation();
  const viewMode = getViewMode(location.pathname);
  const viewConfig = VIEW_CONFIG[viewMode];

  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
  const [vouchers, setVouchers] = useState<VoucherResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingResponseDto | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponseDto | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();

  // ── load ──
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bk, rm, rt, vc] = await Promise.all([
        bookingApi.getAll(),
        adminApi.getRooms(),
        adminApi.getRoomTypes(),
        voucherApi.getAll(),
      ]);
      setBookings(bk);
      setRooms(rm);
      setRoomTypes(rt);
      setVouchers(vc);
    } catch {
      message.error('Không thể tải dữ liệu đặt phòng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Tự động điền mã giao dịch khi mở payment modal
  useEffect(() => {
    if (paymentOpen) {
      paymentForm.setFieldsValue({ transactionCode: generateTxnCode() });
    }
  }, [paymentOpen]);

  useEffect(() => {
    setStatusFilter(viewConfig.defaultStatus);
    setSearchTerm('');
  }, [viewConfig.defaultStatus, viewMode]);

  // ── derived stats ──
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    checkedIn: bookings.filter(b => b.status === 'CheckedIn').length,
    checkedOut: bookings.filter(b => b.status === 'CheckedOut').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    arrivalsToday: bookings.filter(
      b => (b.status === 'Pending' || b.status === 'Confirmed') && b.details?.some(d => isToday(d.checkInDate))
    ).length,
    departuresToday: bookings.filter(
      b => b.status === 'CheckedIn' && b.details?.some(d => isToday(d.checkOutDate))
    ).length,
    withInvoice: bookings.filter(b => Boolean(b.invoiceId)).length,
    withVoucher: bookings.filter(b => Boolean(b.voucherId)).length,
  };

  const availableVouchers = vouchers.filter(voucher => voucher.isActive && dayjs(voucher.endDate).endOf('day').isAfter(dayjs()));

  const visibleBookings = bookings.filter(b => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      b.guestName?.toLowerCase().includes(term) ||
      b.bookingCode?.toLowerCase().includes(term) ||
      b.guestPhone?.includes(term) ||
      b.guestEmail?.toLowerCase().includes(term);
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;

    const matchView =
      viewMode === 'arrivals'
        ? (b.status === 'Pending' || b.status === 'Confirmed') && b.details?.some(d => isToday(d.checkInDate))
        : viewMode === 'in-house'
          ? b.status === 'CheckedIn'
          : viewMode === 'check-out'
            ? b.status === 'CheckedIn' && b.details?.some(d => isToday(d.checkOutDate))
            : viewMode === 'invoices'
              ? Boolean(b.invoiceId) || b.status === 'CheckedOut'
              : true;

    return matchSearch && matchStatus && matchView;
  });

  const statCards =
    viewMode === 'arrivals'
      ? [
          { label: 'Khách đến hôm nay', value: stats.arrivalsToday, color: '#0ea5e9', icon: <CalendarDays size={20} /> },
          { label: 'Chờ xác nhận', value: stats.pending, color: '#d97706', icon: <Ticket size={20} /> },
          { label: 'Đã xác nhận', value: stats.confirmed, color: '#2563eb', icon: <CheckCircle2 size={20} /> },
        ]
      : viewMode === 'in-house'
        ? [
            { label: 'Khách đang ở', value: stats.checkedIn, color: '#16a34a', icon: <LogIn size={20} /> },
            { label: 'Trả phòng hôm nay', value: stats.departuresToday, color: '#7c3aed', icon: <LogOut size={20} /> },
            { label: 'Có hóa đơn', value: stats.withInvoice, color: '#A6894B', icon: <FileText size={20} /> },
          ]
        : viewMode === 'check-out'
          ? [
              { label: 'Cần trả phòng', value: stats.departuresToday, color: '#7c3aed', icon: <LogOut size={20} /> },
              { label: 'Đang lưu trú', value: stats.checkedIn, color: '#16a34a', icon: <LogIn size={20} /> },
              { label: 'Có hóa đơn', value: stats.withInvoice, color: '#A6894B', icon: <FileText size={20} /> },
            ]
          : viewMode === 'invoices'
            ? [
                { label: 'Đã có hóa đơn', value: stats.withInvoice, color: '#A6894B', icon: <FileText size={20} /> },
                { label: 'Đã trả phòng', value: stats.checkedOut, color: '#6b7280', icon: <LogOut size={20} /> },
                { label: 'Đang lưu trú', value: stats.checkedIn, color: '#16a34a', icon: <LogIn size={20} /> },
              ]
            : [
                { label: 'Tổng booking', value: stats.total, color: '#A6894B', icon: <Ticket size={20} /> },
                { label: 'Chờ xác nhận', value: stats.pending, color: '#d97706', icon: <CalendarDays size={20} /> },
                { label: 'Đang ở', value: stats.checkedIn, color: '#16a34a', icon: <LogIn size={20} /> },
                { label: 'Đã trả phòng', value: stats.checkedOut, color: '#6b7280', icon: <LogOut size={20} /> },
                { label: 'Đã hủy', value: stats.cancelled, color: '#dc2626', icon: <XCircle size={20} /> },
              ];

  // ── actions ──
  const updateStatus = async (booking: BookingResponseDto, status: BookingStatus) => {
    try {
      await bookingApi.updateStatus(booking.id, status);
      message.success(`Đã cập nhật → ${STATUS_LABEL[status]}`);
      loadData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const openDetail = (booking: BookingResponseDto) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  const openInvoice = async (booking: BookingResponseDto) => {
    setSelectedBooking(booking);
    setInvoiceOpen(true);
    setInvoiceLoading(true);
    setSelectedInvoice(null);
    try {
      const inv = await bookingApi.getInvoiceByBookingId(booking.id);
      setSelectedInvoice(inv);
    } catch {
      setSelectedInvoice(null);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const createInvoice = async () => {
    if (!selectedBooking) return;
    try {
      const inv = await bookingApi.createInvoice(selectedBooking.id);
      setSelectedInvoice(inv);
      message.success('Tạo hóa đơn thành công');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tạo hóa đơn');
    }
  };

  const submitPayment = async (values: any) => {
    if (!selectedInvoice) return;
    try {
      await bookingApi.addPayment(selectedInvoice.id, {
        paymentMethod: values.paymentMethod,
        amountPaid: values.amountPaid,
        // Gửi lên backend (backend sẽ tự sinh nếu rỗng)
        transactionCode: values.transactionCode || undefined,
      });
      message.success('Ghi nhận thanh toán thành công');
      paymentForm.resetFields();
      setPaymentOpen(false);
      const inv = await bookingApi.getInvoiceByBookingId(selectedBooking!.id);
      setSelectedInvoice(inv);
      loadData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thanh toán thất bại');
    }
  };

  const submitCreate = async (values: any) => {
    try {
      const details = values.details.map((d: any) => ({
        roomId: d.roomId ?? null,
        roomTypeId: rooms.find(r => r.id === d.roomId)?.roomTypeId ?? null,
        checkInDate: d.dates[0].toISOString(),
        checkOutDate: d.dates[1].toISOString(),
        pricePerNight: d.pricePerNight,
      }));
      await bookingApi.create({
        guestName: values.guestName,
        guestPhone: values.guestPhone,
        guestEmail: values.guestEmail,
        voucherId: values.voucherId ?? null,
        details,
      });
      message.success('Tạo booking thành công');
      setCreateOpen(false);
      form.resetFields();
      loadData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tạo booking');
    }
  };

  /** Mở hộp thoại in hóa đơn */
  const handlePrint = () => {
    window.print();
  };

  const remainingAmount = selectedInvoice
    ? selectedInvoice.finalTotal - selectedInvoice.payments.reduce((s, p) => s + p.amountPaid, 0)
    : 0;

  // ── table columns ──────────────────────────────────────────────────────
  const columns = [
    {
      title: 'Mã đặt phòng',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (code: string) => (
        <Text strong style={{ fontFamily: 'monospace', color: '#A6894B' }}>{code}</Text>
      ),
      width: 150,
    },
    {
      title: 'Khách hàng',
      key: 'guest',
      render: (_: any, r: BookingResponseDto) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.guestName || '—'}</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{r.guestPhone}</div>
        </div>
      ),
    },
    {
      title: 'Phòng / Ngày',
      key: 'rooms',
      render: (_: any, r: BookingResponseDto) => {
        const d = r.details?.[0];
        if (!d) return '—';
        const room = rooms.find(rm => rm.id === d.roomId);
        const nights = nightsBetween(d.checkInDate, d.checkOutDate);
        return (
          <div>
            <div style={{ fontWeight: 500 }}>
              {room ? `Phòng ${room.roomNumber}` : `Loại #${d.roomTypeId}`}
              {r.details.length > 1 && <Tag style={{ marginLeft: 4 }} color="default">+{r.details.length - 1}</Tag>}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>
              {dayjs(d.checkInDate).format('DD/MM')} → {dayjs(d.checkOutDate).format('DD/MM/YYYY')} · {nights} đêm
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: BookingStatus) => <Tag color={STATUS_COLOR[s]}>{STATUS_LABEL[s]}</Tag>,
      width: 140,
    },
    {
      title: 'Voucher',
      key: 'voucher',
      render: (_: any, r: BookingResponseDto) =>
        r.voucherCode ? <Tag color="blue">{r.voucherCode}</Tag> : <Tag>Không</Tag>,
      width: 120,
    },
    {
      title: 'Hóa đơn',
      key: 'invoice',
      render: (_: any, r: BookingResponseDto) =>
        r.invoiceId ? <Tag color="green">Có HĐ</Tag> : <Tag>Chưa có</Tag>,
      width: 90,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 330,
      render: (_: any, r: BookingResponseDto) => (
        <Space wrap size="small">
          <Button size="small" icon={<Eye size={13} />} onClick={() => openDetail(r)}>
            Chi tiết
          </Button>
          {r.status === 'Pending' && (
            <Button size="small" type="primary" icon={<CheckCircle2 size={13} />} onClick={() => updateStatus(r, 'Confirmed')}>
              Xác nhận
            </Button>
          )}
          {r.status === 'Confirmed' && (
            <Button size="small" style={{ background: '#16a34a', color: '#fff', border: 'none' }} icon={<LogIn size={13} />} onClick={() => updateStatus(r, 'CheckedIn')}>
              Nhận phòng
            </Button>
          )}
          {r.status === 'CheckedIn' && (
            <Button size="small" style={{ background: '#7c3aed', color: '#fff', border: 'none' }} icon={<LogOut size={13} />} onClick={() => updateStatus(r, 'CheckedOut')}>
              Trả phòng
            </Button>
          )}
          {(r.status === 'Pending' || r.status === 'Confirmed') && (
            <Button size="small" danger icon={<XCircle size={13} />} onClick={() => updateStatus(r, 'Cancelled')}>Hủy</Button>
          )}
          <Button size="small" icon={<FileText size={13} />} onClick={() => openInvoice(r)}>
            Hóa đơn
          </Button>
        </Space>
      ),
    },
  ];

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* PrintInvoice wrapper - ẩn trên màn hình, hiện khi in */}
      {selectedInvoice && selectedBooking && (
        <PrintInvoice booking={selectedBooking} invoice={selectedInvoice} rooms={rooms} cashierName={cashierName} />
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>{viewConfig.title}</Title>
          <Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
            {viewConfig.subtitle}
          </Paragraph>
        </div>
        <Space>
          <Button icon={<RefreshCw size={15} />} onClick={loadData} loading={loading}>Làm mới</Button>
          {viewConfig.showCreate && (
            <Button type="primary" className="btn-gold" icon={<Plus size={16} />} onClick={() => { setCreateOpen(true); form.resetFields(); }}>
              {viewConfig.createLabel}
            </Button>
          )}
        </Space>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]}>
        {statCards.map((s, i) => (

          <Col key={i} xs={24} sm={12} md={8} lg={5}>
            <AntCard className="glass-card text-center" bodyStyle={{ padding: '16px' }}>
              <div style={{ color: s.color }} className="flex justify-center mb-2">{s.icon}</div>
              <Statistic
                title={<span style={{ fontSize: 12 }}>{s.label}</span>}
                value={s.value}
                valueStyle={{ color: s.color, fontSize: 24 }}
              />
            </AntCard>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <AntCard className="glass-card">
        <Row gutter={16} align="middle">
          <Col xs={24} md={10}>
            <Input
              prefix={<Search size={16} style={{ color: '#9ca3af' }} />}
              placeholder={viewMode === 'invoices' ? 'Tìm theo mã booking, khách hàng, SĐT...' : 'Tìm theo tên, mã booking, SĐT, email...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={v => setStatusFilter(v)}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                ...Object.entries(STATUS_LABEL).map(([v, l]) => ({ value: v, label: l })),
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <Button block onClick={() => { setSearchTerm(''); setStatusFilter(viewConfig.defaultStatus); }}>Xóa bộ lọc</Button>
          </Col>
        </Row>
      </AntCard>

      {/* Table */}
      <AntCard className="glass-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={visibleBookings}
          columns={columns}
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </AntCard>

      {/* ── Create Booking Modal ─────────────────────────────────────────────── */}
      <Modal
        open={createOpen}
        title="Tạo Booking Mới"
        onCancel={() => setCreateOpen(false)}
        footer={null}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={submitCreate}>
          <Divider orientation="left">Thông tin khách hàng</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="guestName" label="Tên khách" rules={[{ required: true }]}>
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="guestPhone" label="Số điện thoại">
                <Input placeholder="0912345678" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="guestEmail" label="Email">
            <Input placeholder="guest@example.com" />
          </Form.Item>

          <Form.Item name="voucherId" label="Voucher ap dung">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Chon voucher neu co..."
              options={availableVouchers.map(voucher => ({
                value: voucher.id,
                label: `${voucher.code} � ${voucher.discountType === 'Percentage' ? `${voucher.discountValue}%` : formatMoney(voucher.discountValue)}`,
              }))}
            />
          </Form.Item>

          <Divider orientation="left">Chi tiết phòng</Divider>
          <Form.List name="details" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => {
                  const watchedRoomId = form.getFieldValue(['details', name, 'roomId']);
                  const roomType = roomTypes.find(rt => rt.id === rooms.find(r => r.id === watchedRoomId)?.roomTypeId);
                  return (
                    <AntCard
                      key={key}
                      size="small"
                      className="mb-4 border border-dashed"
                      title={`Phòng ${name + 1}`}
                      extra={fields.length > 1 ? <Button danger size="small" onClick={() => remove(name)}>Xóa</Button> : null}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item {...rest} name={[name, 'roomId']} label="Chọn phòng" rules={[{ required: true }]}>
                            <Select
                              showSearch
                              optionFilterProp="label"
                              placeholder="Chọn phòng..."
                              options={rooms.map(r => ({ value: r.id, label: `${r.roomNumber} – ${r.roomTypeName}` }))}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...rest} name={[name, 'dates']} label="Ngày nhận / trả" rules={[{ required: true }]}>
                            <DatePicker.RangePicker
                              style={{ width: '100%' }}
                              format="DD/MM/YYYY"
                              disabledDate={d => d && d < dayjs().startOf('day')}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item {...rest} name={[name, 'pricePerNight']} label="Giá / đêm (₫)" rules={[{ required: true }]} initialValue={roomType?.basePrice ?? 0}>
                        <InputNumber
                          min={0}
                          style={{ width: '100%' }}
                          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          addonAfter="₫"
                        />
                      </Form.Item>
                    </AntCard>
                  );
                })}
                <Button block icon={<Plus size={14} />} onClick={() => add({})}>Thêm phòng</Button>
              </>
            )}
          </Form.List>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" className="btn-gold">Tạo booking</Button>
          </div>
        </Form>
      </Modal>

      {/* ── Detail Modal ──────────────────────────────────────────────────────── */}
      <Modal
        open={detailOpen}
        title={`Chi tiết booking · ${selectedBooking?.bookingCode}`}
        onCancel={() => setDetailOpen(false)}
        width={720}
        footer={
          <Space>
            <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
            {selectedBooking && (
              <Button type="primary" icon={<FileText size={14} />} onClick={() => { setDetailOpen(false); openInvoice(selectedBooking); }}>
                Xem hóa đơn
              </Button>
            )}
          </Space>
        }
      >
        {selectedBooking && (
          <>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã booking" span={2}>
                <Text strong style={{ fontFamily: 'monospace' }}>{selectedBooking.bookingCode}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Khách">{selectedBooking.guestName || '—'}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{selectedBooking.guestPhone || '—'}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>{selectedBooking.guestEmail || '—'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={STATUS_COLOR[selectedBooking.status]}>{STATUS_LABEL[selectedBooking.status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Voucher" span={2}>
                {selectedBooking.voucherCode ? <Tag color="blue">{selectedBooking.voucherCode}</Tag> : 'Khong ap dung'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Chi tiết phòng</Divider>
            <Table
              size="small"
              pagination={false}
              rowKey="id"
              dataSource={selectedBooking.details}
              columns={[
                { title: 'Phòng', render: (_: any, d: any) => rooms.find(r => r.id === d.roomId)?.roomNumber ?? `#${d.roomId}` },
                { title: 'Nhận phòng', dataIndex: 'checkInDate', render: (v: string) => dayjs(v).format('DD/MM/YYYY') },
                { title: 'Trả phòng', dataIndex: 'checkOutDate', render: (v: string) => dayjs(v).format('DD/MM/YYYY') },
                { title: 'Số đêm', render: (_: any, d: any) => nightsBetween(d.checkInDate, d.checkOutDate) },
                { title: 'Giá/đêm', dataIndex: 'pricePerNight', render: (v: number) => formatMoney(v) },
                { title: 'Thành tiền', render: (_: any, d: any) => formatMoney(d.pricePerNight * nightsBetween(d.checkInDate, d.checkOutDate)) },
              ]}
            />

            <Divider orientation="left">Cập nhật trạng thái</Divider>
            <Space wrap>
              {selectedBooking.status === 'Pending' && (
                <>
                  <Button type="primary" icon={<CheckCircle2 size={14} />} onClick={() => { updateStatus(selectedBooking, 'Confirmed'); setDetailOpen(false); }}>Xác nhận</Button>
                  <Button danger icon={<XCircle size={14} />} onClick={() => { updateStatus(selectedBooking, 'Cancelled'); setDetailOpen(false); }}>Hủy booking</Button>
                </>
              )}
              {selectedBooking.status === 'Confirmed' && (
                <>
                  <Button style={{ background: '#16a34a', color: '#fff', border: 'none' }} icon={<LogIn size={14} />} onClick={() => { updateStatus(selectedBooking, 'CheckedIn'); setDetailOpen(false); }}>Check-in</Button>
                  <Button danger icon={<XCircle size={14} />} onClick={() => { updateStatus(selectedBooking, 'Cancelled'); setDetailOpen(false); }}>Hủy</Button>
                </>
              )}
              {selectedBooking.status === 'CheckedIn' && (
                <Button style={{ background: '#7c3aed', color: '#fff', border: 'none' }} icon={<LogOut size={14} />} onClick={() => { updateStatus(selectedBooking, 'CheckedOut'); setDetailOpen(false); }}>Check-out</Button>
              )}
            </Space>
          </>
        )}
      </Modal>

      {/* ── Invoice Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={invoiceOpen}
        title={
          <Space>
            <FileText size={16} />
            <span>Hóa đơn · {selectedBooking?.bookingCode}</span>
          </Space>
        }
        onCancel={() => setInvoiceOpen(false)}
        width={720}
        footer={
          <Space>
            <Button onClick={() => setInvoiceOpen(false)}>Đóng</Button>
            {!selectedInvoice && selectedBooking?.status !== 'Cancelled' && (
              <Button type="primary" icon={<FileText size={14} />} onClick={createInvoice}>
                Tạo hóa đơn
              </Button>
            )}
            {selectedInvoice && (
              <Tooltip title="In hóa đơn (PDF/máy in)">
                <Button icon={<Printer size={14} />} onClick={handlePrint}>
                  In hóa đơn
                </Button>
              </Tooltip>
            )}
            {selectedInvoice && selectedInvoice.status !== 'Paid' && (
              <Button
                type="primary"
                className="btn-gold"
                icon={<CreditCard size={14} />}
                onClick={() => setPaymentOpen(true)}
              >
                Ghi nhận thanh toán
              </Button>
            )}
          </Space>
        }
      >
        {invoiceLoading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#9ca3af' }}>Đang tải hóa đơn...</div>
        ) : !selectedInvoice ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#9ca3af' }}>
            Chưa có hóa đơn. Nhấn <b>Tạo hóa đơn</b> để khởi tạo.
          </div>
        ) : (
          <>
            {/* Tổng tiền */}
            <AntCard size="small" style={{ background: '#faf7f2', border: '1px solid #e8d9bb', marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Tiền phòng</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{formatMoney(selectedInvoice.totalRoomAmount)}</div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Thuế VAT</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{formatMoney(selectedInvoice.taxAmount)}</div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Tổng cộng</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#A6894B' }}>{formatMoney(selectedInvoice.finalTotal)}</div>
                </Col>
              </Row>
            </AntCard>

            <Descriptions bordered column={2} size="small">
              {selectedInvoice.discountAmount > 0 && (
                <Descriptions.Item label="Giảm giá" span={2} style={{ color: '#16a34a' }}>
                  - {formatMoney(selectedInvoice.discountAmount)}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={
                  selectedInvoice.status === 'Paid' ? 'green'
                    : selectedInvoice.status === 'PartiallyPaid' ? 'blue'
                    : selectedInvoice.status === 'Cancelled' ? 'red' : 'gold'
                }>
                  {selectedInvoice.status === 'Paid' ? '✓ Đã thanh toán đủ'
                    : selectedInvoice.status === 'PartiallyPaid' ? '◑ Thanh toán một phần'
                    : selectedInvoice.status === 'Cancelled' ? '✗ Đã hủy'
                    : '○ Chưa thanh toán'}
                </Tag>
              </Descriptions.Item>
              {selectedInvoice.status !== 'Paid' && (
                <Descriptions.Item label="Còn phải thu" span={2}>
                  <Text strong style={{ color: '#dc2626', fontSize: 16 }}>{formatMoney(remainingAmount)}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Lịch sử thanh toán */}
            {selectedInvoice.payments?.length > 0 && (
              <>
                <Divider orientation="left">Lịch sử thanh toán</Divider>
                <Timeline
                  items={selectedInvoice.payments.map((p, i) => ({
                    color: 'green',
                    dot: <BanknoteIcon size={14} />,
                    children: (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
                        <div>
                          <Text strong>{formatMoney(p.amountPaid)}</Text>
                          <Tag style={{ marginLeft: 8 }}>{p.paymentMethod}</Tag>
                          <Tag color="default" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                            #{p.transactionCode}
                          </Tag>
                        </div>
                        <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                          {p.paymentDate ? dayjs(p.paymentDate).format('DD/MM/YYYY HH:mm') : ''}
                        </Text>
                      </div>
                    ),
                  }))}
                />
                <div style={{ textAlign: 'right', borderTop: '1px solid #eee', paddingTop: 8, fontWeight: 600 }}>
                  Đã thanh toán: <Text strong style={{ color: '#16a34a', fontSize: 15 }}>
                    {formatMoney(selectedInvoice.payments.reduce((s, p) => s + p.amountPaid, 0))}
                  </Text>
                </div>
              </>
            )}
          </>
        )}
      </Modal>

      {/* ── Payment Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={paymentOpen}
        title={
          <Space><CreditCard size={16} /><span>Ghi nhận thanh toán</span></Space>
        }
        onCancel={() => { setPaymentOpen(false); paymentForm.resetFields(); }}
        footer={null}
        width={460}
      >
        <Form form={paymentForm} layout="vertical" onFinish={submitPayment}>
          {selectedInvoice && (
            <div style={{ background: '#faf7f2', border: '1px solid #e8d9bb', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
              <Row>
                <Col span={12}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Tổng hóa đơn</div>
                  <div style={{ fontWeight: 700 }}>{formatMoney(selectedInvoice.finalTotal)}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Còn phải thu</div>
                  <div style={{ fontWeight: 700, color: remainingAmount > 0 ? '#dc2626' : '#16a34a' }}>
                    {formatMoney(remainingAmount)}
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <Form.Item name="paymentMethod" label="Phương thức thanh toán" rules={[{ required: true, message: 'Vui lòng chọn phương thức' }]}>
            <Select
              options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
              placeholder="Chọn phương thức..."
              onChange={() => {
                // Tự sinh lại mã khi đổi phương thức
                paymentForm.setFieldsValue({ transactionCode: generateTxnCode() });
              }}
            />
          </Form.Item>

          <Form.Item
            name="amountPaid"
            label="Số tiền thanh toán (₫)"
            rules={[{ required: true, message: 'Nhập số tiền' }]}
            initialValue={remainingAmount > 0 ? Math.round(remainingAmount) : undefined}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={v => v!.replace(/,/g, '') as any}
              addonAfter="₫"
            />
          </Form.Item>

          <Form.Item
            name="transactionCode"
            label={
              <Space>
                <span>Mã giao dịch</span>
                <Button
                  size="small"
                  type="link"
                  style={{ padding: 0, height: 'auto', fontSize: 12 }}
                  onClick={() => paymentForm.setFieldsValue({ transactionCode: generateTxnCode() })}
                >
                  ↻ Tạo mới
                </Button>
              </Space>
            }
          >
            <Input
              placeholder="TXN-..."
              style={{ fontFamily: 'monospace' }}
              suffix={
                <Tooltip title="Mã sẽ tự động sinh nếu để trống">
                  <span style={{ fontSize: 11, color: '#9ca3af', cursor: 'help' }}>auto</span>
                </Tooltip>
              }
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={() => { setPaymentOpen(false); paymentForm.resetFields(); }}>Hủy</Button>
            <Button type="primary" htmlType="submit" className="btn-gold" icon={<CreditCard size={14} />}>
              Xác nhận thanh toán
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingPage;






