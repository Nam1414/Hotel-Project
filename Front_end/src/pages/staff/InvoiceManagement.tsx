// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  App,
  Button,
  Card as AntCard,
  Col,
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
  CreditCard,
  FileText,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Ticket,
} from 'lucide-react';
import dayjs from 'dayjs';
import { bookingApi, BookingResponseDto, InvoiceResponseDto } from '../../services/bookingApi';
import { adminApi, RoomDto } from '../../services/adminApi';
import HotelInvoicePrint from '../../components/print/HotelInvoicePrint';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
const { Title, Paragraph, Text } = Typography;

const INVOICE_STATUS_COLOR: Record<string, string> = {
  Unpaid: 'gold',
  PartiallyPaid: 'blue',
  Paid: 'green',
  Cancelled: 'red',
};

const INVOICE_STATUS_LABEL: Record<string, string> = {
  Unpaid: 'Chưa thanh toán',
  PartiallyPaid: 'Thanh toán một phần',
  Paid: 'Đã thanh toán',
  Cancelled: 'Đã hủy',
};

const PAYMENT_METHODS = ['Cash', 'Card', 'BankTransfer', 'MoMo', 'VNPay'];

const formatMoney = (v?: number | null) =>
  v !== undefined && v !== null ? v.toLocaleString('vi-VN') + ' ₫' : '—';

const nightsBetween = (from: string, to: string) =>
  Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000));

const generateTxnCode = () => {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${dayjs().format('YYYYMMDD')}-${rand}`;
};

interface PrintInvoiceProps {
  booking: BookingResponseDto;
  invoice: InvoiceResponseDto;
  rooms: RoomDto[];
  cashierName?: string | null;
  damages?: any[];
  services?: any[];
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({ booking, invoice, rooms, cashierName, damages, services }) => (
  <HotelInvoicePrint
    booking={booking}
    invoice={invoice}
    rooms={rooms}
    cashierName={cashierName}
    damages={damages}
    services={services}
  />
);

const InvoiceManagementPage: React.FC = () => {
  const { message } = App.useApp();
  const cashierName = useSelector((s: RootState) => s.auth.user?.fullName || s.auth.user?.name || null);
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [hasInvoiceOnly, setHasInvoiceOnly] = useState(true);

  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<BookingResponseDto | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponseDto | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceDamages, setInvoiceDamages] = useState<any[]>([]);
  const [invoiceServices, setInvoiceServices] = useState<any[]>([]);

  const [paymentForm] = Form.useForm();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bk, rm] = await Promise.all([bookingApi.getAll(), adminApi.getRooms()]);
      setBookings(bk);
      setRooms(rm);
    } catch {
      message.error('Không thể tải dữ liệu hóa đơn');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (paymentOpen) {
      paymentForm.setFieldsValue({ transactionCode: generateTxnCode() });
    }
  }, [paymentOpen]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const withInvoice = bookings.filter(b => Boolean(b.invoiceId)).length;
    const checkedOut = bookings.filter(b => b.status === 'CheckedOut').length;
    return { total, withInvoice, checkedOut };
  }, [bookings]);

  const visibleRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return bookings
      .filter((b) => (hasInvoiceOnly ? Boolean(b.invoiceId) : true))
      .filter((b) => {
        if (!term) return true;
        return (
          b.bookingCode?.toLowerCase().includes(term) ||
          b.guestName?.toLowerCase().includes(term) ||
          b.guestPhone?.includes(term) ||
          b.guestEmail?.toLowerCase().includes(term)
        );
      });
  }, [bookings, hasInvoiceOnly, searchTerm]);

  const openInvoice = async (booking: BookingResponseDto) => {
    setSelectedBooking(booking);
    setInvoiceOpen(true);
    setInvoiceLoading(true);
    setSelectedInvoice(null);
    setInvoiceDamages([]);
    setInvoiceServices([]);
    try {
      const inv = await bookingApi.getInvoiceByBookingId(booking.id);
      setSelectedInvoice(inv);
      
      // Sử dụng dữ liệu gộp từ backend nếu có
      if (inv.serviceOrders) {
        setInvoiceServices(inv.serviceOrders);
      }
      if (inv.lossDamages) {
        setInvoiceDamages(inv.lossDamages);
      }
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
      if (inv.serviceOrders) {
        setInvoiceServices(inv.serviceOrders);
      }
      if (inv.lossDamages) {
        setInvoiceDamages(inv.lossDamages);
      }
      message.success('Tạo hóa đơn thành công');
      loadData();
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
        transactionCode: values.transactionCode || undefined,
      });
      message.success('Ghi nhận thanh toán thành công');
      paymentForm.resetFields();
      setPaymentOpen(false);
      if (selectedBooking) {
        const inv = await bookingApi.getInvoiceByBookingId(selectedBooking.id);
        setSelectedInvoice(inv);
        if (inv.serviceOrders) {
          setInvoiceServices(inv.serviceOrders);
        }
        if (inv.lossDamages) {
          setInvoiceDamages(inv.lossDamages);
        }
      }
      loadData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thanh toán thất bại');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const remainingAmount = selectedInvoice
    ? selectedInvoice.finalTotal - (selectedInvoice.depositAmount || 0) - selectedInvoice.payments.reduce((sum, p) => sum + p.amountPaid, 0)
    : 0;

  const columns = [
    {
      title: 'Mã booking',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      width: 160,
      render: (code: string) => <Text strong style={{ fontFamily: 'monospace', color: '#A6894B' }}>{code}</Text>,
    },
    {
      title: 'Khách hàng',
      key: 'guest',
      render: (_: any, r: BookingResponseDto) => (
        <div>
          <div style={{ fontWeight: 700 }}>{r.guestName || '—'}</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{r.guestPhone || '—'}</div>
        </div>
      ),
    },
    {
      title: 'Tình trạng',
      key: 'invoice',
      width: 150,
      render: (_: any, r: BookingResponseDto) =>
        r.invoiceId ? <Tag color="green">Có hóa đơn</Tag> : <Tag>Chưa có</Tag>,
    },
    {
      title: 'Tiền cọc',
      key: 'deposit',
      width: 120,
      render: (_: any, r: BookingResponseDto) => (
        <Text strong style={{ color: r.depositAmount > 0 ? '#16a34a' : 'inherit' }}>
          {formatMoney(r.depositAmount)}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_: any, r: BookingResponseDto) => (
        <Space wrap size="small">
          <Button size="small" icon={<FileText size={14} />} onClick={() => openInvoice(r)}>
            Hóa đơn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {selectedInvoice && selectedBooking && (
        <PrintInvoice
          booking={selectedBooking}
          invoice={selectedInvoice}
          rooms={rooms}
          cashierName={cashierName}
          damages={invoiceDamages}
          services={invoiceServices}
        />
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>Quản lý Hóa đơn</Title>
          <Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
            Tra cứu, tạo hóa đơn, ghi nhận thanh toán và in hóa đơn cho khách.
          </Paragraph>
        </div>
        <Space>
          <Button icon={<RefreshCw size={15} />} onClick={loadData} loading={loading}>Làm mới</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {[
          { label: 'Tổng booking', value: stats.total, color: '#6b7280', icon: <Ticket size={20} /> },
          { label: 'Có hóa đơn', value: stats.withInvoice, color: '#A6894B', icon: <FileText size={20} /> },
          { label: 'Đã trả phòng', value: stats.checkedOut, color: '#16a34a', icon: <CreditCard size={20} /> },
        ].map((s, i) => (
          <Col key={i} xs={24} sm={12} md={8} lg={6}>
            <AntCard className="glass-card text-center" bodyStyle={{ padding: '16px' }}>
              <div style={{ color: s.color }} className="flex justify-center mb-2">{s.icon}</div>
              <Statistic title={<span style={{ fontSize: 12 }}>{s.label}</span>} value={s.value} valueStyle={{ color: s.color, fontSize: 24 }} />
            </AntCard>
          </Col>
        ))}
      </Row>

      <AntCard className="glass-card">
        <Row gutter={16} align="middle">
          <Col xs={24} md={12}>
            <Input
              prefix={<Search size={16} style={{ color: '#9ca3af' }} />}
              placeholder="Tìm theo mã booking, tên khách, SĐT, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              style={{ width: '100%' }}
              value={hasInvoiceOnly ? 'with' : 'all'}
              onChange={(v) => setHasInvoiceOnly(v === 'with')}
              options={[
                { value: 'with', label: 'Chỉ booking có hóa đơn' },
                { value: 'all', label: 'Tất cả booking' },
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <Button block onClick={() => { setSearchTerm(''); setHasInvoiceOnly(true); }}>Xóa bộ lọc</Button>
          </Col>
        </Row>
      </AntCard>

      <AntCard className="glass-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={visibleRows}
          columns={columns}
          scroll={{ x: 820 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </AntCard>

      <Modal
        open={invoiceOpen}
        title={
          <Space>
            <FileText size={16} />
            <span>Xác nhận thanh toán & In hóa đơn</span>
          </Space>
        }
        onCancel={() => setInvoiceOpen(false)}
        width={1000}
        footer={null}
      >
        {invoiceLoading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#9ca3af' }}>Đang tải hóa đơn...</div>
        ) : !selectedInvoice ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ marginBottom: 12 }}>Chưa có hóa đơn.</div>
            {selectedBooking?.status !== 'Cancelled' && (
              <Button type="primary" icon={<Plus size={14} />} onClick={createInvoice}>
                Tạo hóa đơn
              </Button>
            )}
          </div>
        ) : (
          <Row gutter={24}>
            {/* ── Left Column: Cost Breakdown ── */}
            <Col span={16}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>HÓA ĐƠN THANH TOÁN</div>
                <div style={{ fontSize: 13, color: '#9ca3af' }}>Mã đơn #{selectedInvoice.id}</div>
              </div>

              {/* Costs Breakdown */}
              <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 8, padding: '12px', background: '#fafafa', borderRadius: 6, color: '#111827' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#111827' }}>Chi tiết chi phí</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14 }}>
                  <span>Tiền phòng:</span>
                  <span style={{ fontWeight: 500 }}>{formatMoney(selectedInvoice.totalRoomAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14 }}>
                  <span>Dịch vụ & Vật tư (Minibar...):</span>
                  <span>{formatMoney(invoiceServices.reduce((sum, s) => sum + (s.totalAmount || 0), 0))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: '#dc2626' }}>
                  <span>Hỏng hóc & Thất thoát:</span>
                  <span style={{ fontWeight: 500 }}>+{formatMoney(invoiceDamages.reduce((sum, d) => sum + (d.penaltyAmount || 0), 0))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 4px', fontSize: 14, fontWeight: 700, borderTop: '1px dashed #e5e7eb', marginTop: 4 }}>
                  <span>TỔNG CỘNG (Chưa Thuế):</span>
                  <span>{formatMoney(selectedInvoice.totalRoomAmount + selectedInvoice.totalServiceAmount)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: 8, padding: '12px', background: '#f0fdf4', borderRadius: 6, color: '#111827' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#111827' }}>Các khoản giảm trừ</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: '#16a34a' }}>
                  <span>Ưu đãi / Voucher:</span>
                  <span>-{formatMoney(selectedInvoice.discountAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 14, color: '#d97706' }}>
                  <span>Tiền đã cọc:</span>
                  <span>-{formatMoney(selectedInvoice.depositAmount)}</span>
                </div>
              </div>

              {/* Amount Due Table */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Thông tin lưu trú:</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ textAlign: 'left', padding: '8px 12px', border: '1px solid #e5e7eb', color: '#374151' }}>Phòng</th>
                      <th style={{ textAlign: 'center', padding: '8px 12px', border: '1px solid #e5e7eb', color: '#374151' }}>Số đêm</th>
                      <th style={{ textAlign: 'right', padding: '8px 12px', border: '1px solid #e5e7eb', color: '#374151' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBooking?.details?.map((d, i) => {
                      const nights = nightsBetween(d.checkInDate, d.checkOutDate);
                      return (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                          <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb', color: '#111' }}>
                            Phòng {rooms.find(r => r.id === d.roomId)?.roomNumber ?? d.roomId}
                          </td>
                          <td style={{ textAlign: 'center', padding: '8px 12px', border: '1px solid #e5e7eb', color: '#111' }}>{nights}</td>
                          <td style={{ textAlign: 'right', padding: '8px 12px', border: '1px solid #e5e7eb', color: '#111', fontWeight: 600 }}>{formatMoney(d.pricePerNight * nights)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Services Table */}
              {invoiceServices && invoiceServices.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#0369a1' }}>Dịch vụ & Vật tư đã sử dụng:</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f0f9ff' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', border: '1px solid #bae6fd', color: '#0369a1' }}>Sản phẩm/Dịch vụ</th>
                        <th style={{ textAlign: 'center', padding: '8px 12px', border: '1px solid #bae6fd', color: '#0369a1' }}>Số lượng</th>
                        <th style={{ textAlign: 'right', padding: '8px 12px', border: '1px solid #bae6fd', color: '#0369a1' }}>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceServices.map((order, i) => (
                        <React.Fragment key={i}>
                          {order.details?.map((item: any, j: number) => (
                            <tr key={`${i}-${j}`} style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                              <td style={{ padding: '8px 12px', border: '1px solid #bae6fd' }}>{item.serviceName}</td>
                              <td style={{ textAlign: 'center', padding: '8px 12px', border: '1px solid #bae6fd' }}>{item.quantity}</td>
                              <td style={{ textAlign: 'right', padding: '8px 12px', border: '1px solid #bae6fd' }}>{formatMoney(item.lineTotal)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Damages Table */}
              {invoiceDamages && invoiceDamages.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#dc2626' }}>Hỏng hóc & Thất thoát:</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ backgroundColor: '#fff7ed' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', border: '1px solid #fed7aa', color: '#9a3412' }}>Vật tư hư hỏng</th>
                        <th style={{ textAlign: 'center', padding: '8px 12px', border: '1px solid #fed7aa', color: '#9a3412' }}>Số lượng</th>
                        <th style={{ textAlign: 'right', padding: '8px 12px', border: '1px solid #fed7aa', color: '#9a3412' }}>Phí bồi thường</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceDamages.map((d, i) => (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#fff7ed', color: '#111827' }}>
                          <td style={{ padding: '8px 12px', border: '1px solid #fed7aa' }}>{d.equipmentName || 'Vật dụng'} ({d.roomNumber || 'N/A'})</td>
                          <td style={{ textAlign: 'center', padding: '8px 12px', border: '1px solid #fed7aa' }}>{d.quantity}</td>
                          <td style={{ textAlign: 'right', padding: '8px 12px', border: '1px solid #fed7aa', color: '#dc2626', fontWeight: 600 }}>{formatMoney(d.penaltyAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Col>

            {/* ── Right Column: Summary & Actions ── */}
            <Col span={8}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Trạng thái thanh toán</div>
                <div style={{ marginBottom: 20 }}>
                   <Tag color={INVOICE_STATUS_COLOR[selectedInvoice.status] ?? 'default'} style={{ fontSize: 13, padding: '4px 12px' }}>
                    {INVOICE_STATUS_LABEL[selectedInvoice.status] ?? selectedInvoice.status}
                  </Tag>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px', marginBottom: 20, color: '#111827' }}>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Tổng cần thu</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{formatMoney(remainingAmount)}</div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Còn lại</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: remainingAmount > 0 ? '#dc2626' : '#16a34a' }}>
                    {formatMoney(Math.max(0, remainingAmount))}
                  </div>
                </div>

                <Space direction="vertical" style={{ width: '100%' }} size={10}>
                  <Button block size="large" icon={<Printer size={16} />} onClick={handlePrint}>
                    In hóa đơn
                  </Button>
                  
                  {selectedInvoice.status !== 'Paid' ? (
                    <Button 
                      block 
                      size="large" 
                      type="primary" 
                      className="btn-gold" 
                      icon={<CreditCard size={16} />} 
                      onClick={() => setPaymentOpen(true)}
                      style={{ height: 50, fontSize: 15, fontWeight: 600 }}
                    >
                      GHI NHẬN THANH TOÁN
                    </Button>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f0fdf4', borderRadius: 8, color: '#16a34a', fontWeight: 600 }}>
                      ✓ ĐÃ THANH TOÁN ĐỦ
                    </div>
                  )}
                </Space>

                {selectedInvoice.payments?.length > 0 && (
                  <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 8, color: '#64748b' }}>LỊCH SỬ GIAO DỊCH</div>
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {selectedInvoice.payments.map((p, i) => (
                        <div key={i} style={{ padding: '8px 0', borderBottom: '1px dashed #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ fontWeight: 600 }}>{formatMoney(p.amountPaid)}</span>
                            <span style={{ color: '#94a3b8', fontSize: 11 }}>{p.paymentMethod}</span>
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.paymentDate ? dayjs(p.paymentDate).format('DD/MM HH:mm') : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        )}
      </Modal>

      <Modal
        open={paymentOpen}
        title={<Space><CreditCard size={16} /><span>Ghi nhận thanh toán</span></Space>}
        onCancel={() => { setPaymentOpen(false); paymentForm.resetFields(); }}
        footer={null}
        width={460}
      >
        <Form form={paymentForm} layout="vertical" onFinish={submitPayment}>
          {selectedInvoice && (
            <div style={{ background: '#faf7f2', border: '1px solid #e8d9bb', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#111827' }}>
              <Row>
                <Col span={12}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Tổng hóa đơn</div>
                  <div style={{ fontWeight: 900 }}>{formatMoney(selectedInvoice.finalTotal)}</div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Còn phải thu</div>
                  <div style={{ fontWeight: 900, color: remainingAmount > 0 ? '#dc2626' : '#16a34a' }}>
                    {formatMoney(Math.max(0, remainingAmount))}
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <Form.Item name="paymentMethod" label="Phương thức thanh toán" rules={[{ required: true, message: 'Vui lòng chọn phương thức' }]}>
            <Select
              options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
              placeholder="Chọn phương thức..."
              onChange={() => paymentForm.setFieldsValue({ transactionCode: generateTxnCode() })}
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
                <Button size="small" type="link" style={{ padding: 0, height: 'auto', fontSize: 12 }} onClick={() => paymentForm.setFieldsValue({ transactionCode: generateTxnCode() })}>
                  ↻ Tạo mới
                </Button>
              </Space>
            }
          >
            <Input placeholder="TXN-..." style={{ fontFamily: 'monospace' }} />
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

export default InvoiceManagementPage;

