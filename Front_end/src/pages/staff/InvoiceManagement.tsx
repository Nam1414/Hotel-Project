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
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({ booking, invoice, rooms, cashierName }) => (
  <HotelInvoicePrint booking={booking} invoice={invoice} rooms={rooms} cashierName={cashierName} />
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
    ? selectedInvoice.finalTotal - selectedInvoice.payments.reduce((sum, p) => sum + p.amountPaid, 0)
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
        <PrintInvoice booking={selectedBooking} invoice={selectedInvoice} rooms={rooms} cashierName={cashierName} />
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
            <span>Hóa đơn · {selectedBooking?.bookingCode}</span>
          </Space>
        }
        onCancel={() => setInvoiceOpen(false)}
        width={760}
        footer={
          <Space>
            <Button onClick={() => setInvoiceOpen(false)}>Đóng</Button>
            {!selectedInvoice && selectedBooking?.status !== 'Cancelled' && (
              <Button type="primary" icon={<Plus size={14} />} onClick={createInvoice}>
                Tạo hóa đơn
              </Button>
            )}
            {selectedInvoice && (
              <Tooltip title="In hóa đơn">
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
            <AntCard size="small" style={{ background: '#faf7f2', border: '1px solid #e8d9bb', marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Tiền phòng</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{formatMoney(selectedInvoice.totalRoomAmount)}</div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Thuế VAT</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{formatMoney(selectedInvoice.taxAmount)}</div>
                </Col>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Tổng cộng</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#A6894B' }}>{formatMoney(selectedInvoice.finalTotal)}</div>
                </Col>
              </Row>
            </AntCard>

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={INVOICE_STATUS_COLOR[selectedInvoice.status] ?? 'default'}>
                  {INVOICE_STATUS_LABEL[selectedInvoice.status] ?? selectedInvoice.status}
                </Tag>
              </Descriptions.Item>
              {selectedInvoice.discountAmount > 0 && (
                <Descriptions.Item label="Giảm giá" span={2} style={{ color: '#16a34a' }}>
                  - {formatMoney(selectedInvoice.discountAmount)}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Còn phải thu" span={2}>
                <Text strong style={{ color: remainingAmount > 0 ? '#dc2626' : '#16a34a', fontSize: 16 }}>
                  {formatMoney(Math.max(0, remainingAmount))}
                </Text>
              </Descriptions.Item>
            </Descriptions>

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
                            #{p.transactionCode || '—'}
                          </Tag>
                        </div>
                        <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                          {p.paymentDate ? dayjs(p.paymentDate).format('DD/MM/YYYY HH:mm') : ''}
                        </Text>
                      </div>
                    ),
                  }))}
                />
              </>
            )}
          </>
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
            <div style={{ background: '#faf7f2', border: '1px solid #e8d9bb', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
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

