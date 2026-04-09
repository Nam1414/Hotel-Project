import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BadgePercent, CheckCircle2, Edit3, Percent, Plus, RefreshCw, Search, Ticket, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { voucherApi, type UpsertVoucherDto, type VoucherResponseDto } from '../../services/voucherApi';

const { Title, Paragraph, Text } = Typography;

const formatMoney = (value?: number | null) =>
  value !== undefined && value !== null ? `${value.toLocaleString('vi-VN')} đ` : '—';

const VoucherManagement: React.FC = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [items, setItems] = useState<VoucherResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VoucherResponseDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await voucherApi.getAll();
      setItems(data);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !term ||
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term);

      const isExpired = dayjs(item.endDate).isBefore(dayjs(), 'day');
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.isActive && !isExpired) ||
        (statusFilter === 'inactive' && !item.isActive) ||
        (statusFilter === 'expired' && isExpired);

      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((item) => item.isActive && !dayjs(item.endDate).isBefore(dayjs(), 'day')).length,
    redeemed: items.reduce((sum, item) => sum + item.usageCount, 0),
    avgDiscount: items.length ? Math.round(items.reduce((sum, item) => sum + item.discountValue, 0) / items.length) : 0,
  }), [items]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      discountType: 'Percentage',
      minBookingAmount: 0,
      isActive: true,
      dateRange: [dayjs(), dayjs().add(30, 'day')],
    });
    setOpen(true);
  };

  const openEdit = (voucher: VoucherResponseDto) => {
    setEditing(voucher);
    form.setFieldsValue({
      code: voucher.code,
      name: voucher.name,
      description: voucher.description,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      minBookingAmount: voucher.minBookingAmount,
      maxDiscountAmount: voucher.maxDiscountAmount ?? undefined,
      usageLimit: voucher.usageLimit ?? undefined,
      isActive: voucher.isActive,
      dateRange: [dayjs(voucher.startDate), dayjs(voucher.endDate)],
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await voucherApi.remove(id);
      message.success('Đã xóa voucher');
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể xóa voucher');
    }
  };

  const submit = async (values: any) => {
    const payload: UpsertVoucherDto = {
      code: values.code,
      name: values.name,
      description: values.description || null,
      discountType: values.discountType,
      discountValue: values.discountValue,
      minBookingAmount: values.minBookingAmount || 0,
      maxDiscountAmount: values.maxDiscountAmount ?? null,
      usageLimit: values.usageLimit ?? null,
      isActive: values.isActive,
      startDate: values.dateRange[0].startOf('day').toISOString(),
      endDate: values.dateRange[1].endOf('day').toISOString(),
    };

    try {
      const saved = editing
        ? await voucherApi.update(editing.id, payload)
        : await voucherApi.create(payload);

      setItems((prev) => {
        if (editing) {
          return prev.map((item) => (item.id === saved.id ? saved : item));
        }
        return [saved, ...prev];
      });

      message.success(editing ? 'Đã cập nhật voucher' : 'Đã tạo voucher');
      setOpen(false);
      form.resetFields();
      setEditing(null);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể lưu voucher');
    }
  };

  const columns: ColumnsType<VoucherResponseDto> = [
    {
      title: 'Mã voucher',
      dataIndex: 'code',
      key: 'code',
      render: (code: string, record) => (
        <div>
          <Text strong style={{ color: '#A6894B', fontFamily: 'monospace' }}>{code}</Text>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{record.name}</div>
        </div>
      ),
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.discountType === 'Percentage' ? `${record.discountValue}%` : formatMoney(record.discountValue)}</Text>
          <Text type="secondary">Đơn tối thiểu: {formatMoney(record.minBookingAmount)}</Text>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      key: 'date',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(record.startDate).format('DD/MM/YYYY')}</Text>
          <Text type="secondary">đến {dayjs(record.endDate).format('DD/MM/YYYY')}</Text>
        </Space>
      ),
    },
    {
      title: 'Sử dụng',
      key: 'usage',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.usageCount} lượt</Text>
          <Text type="secondary">
            {record.usageLimit ? `Giới hạn ${record.usageLimit}` : 'Không giới hạn'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const expired = dayjs(record.endDate).isBefore(dayjs(), 'day');
        if (!record.isActive) return <Tag>Đang tắt</Tag>;
        if (expired) return <Tag color="red">Hết hạn</Tag>;
        return <Tag color="green">Đang áp dụng</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<Edit3 size={14} />} onClick={() => openEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa voucher này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<Trash2 size={14} />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={2} style={{ marginBottom: 0 }}>Quản lý Voucher</Title>
          <Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
            Tạo mã giảm giá cho booking và theo dõi hiệu lực sử dụng ngay tại quầy.
          </Paragraph>
        </div>
        <Space>
          <Button icon={<RefreshCw size={15} />} onClick={loadData} loading={loading}>Làm mới</Button>
          <Button type="primary" className="btn-gold" icon={<Plus size={15} />} onClick={openCreate}>
            Thêm voucher
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {[
          { label: 'Tổng voucher', value: stats.total, icon: <Ticket size={20} />, color: '#A6894B' },
          { label: 'Đang áp dụng', value: stats.active, icon: <CheckCircle2 size={20} />, color: '#16a34a' },
          { label: 'Tổng lượt dùng', value: stats.redeemed, icon: <BadgePercent size={20} />, color: '#2563eb' },
          { label: 'Giảm giá TB', value: `${stats.avgDiscount}%`, icon: <Percent size={20} />, color: '#d97706' },
        ].map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card className="glass-card text-center" bodyStyle={{ padding: 16 }}>
              <div style={{ color: stat.color }} className="flex justify-center mb-2">{stat.icon}</div>
              <Statistic title={stat.label} value={stat.value as any} valueStyle={{ color: stat.color }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="glass-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              prefix={<Search size={16} style={{ color: '#9ca3af' }} />}
              placeholder="Tìm theo mã voucher, tên hoặc mô tả..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'active', label: 'Đang áp dụng' },
                { value: 'inactive', label: 'Đang tắt' },
                { value: 'expired', label: 'Hết hạn' },
              ]}
            />
          </Col>
          <Col xs={24} md={6}>
            <Button block onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="glass-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredItems}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 920 }}
        />
      </Card>

      <Modal
        open={open}
        title={editing ? 'Cập nhật voucher' : 'Tạo voucher mới'}
        onCancel={() => { setOpen(false); setEditing(null); form.resetFields(); }}
        footer={null}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Mã voucher" rules={[{ required: true, message: 'Nhập mã voucher' }]}>
                <Input placeholder="VD: SUMMER2026" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Tên voucher" rules={[{ required: true, message: 'Nhập tên voucher' }]}>
                <Input placeholder="Giảm giá mùa hè" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Điều kiện áp dụng, ghi chú..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discountType" label="Loại giảm giá" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Percentage', label: 'Theo phần trăm (%)' },
                    { value: 'Fixed', label: 'Số tiền cố định' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true, message: 'Nhập giá trị giảm' }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="minBookingAmount" label="Đơn tối thiểu">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxDiscountAmount" label="Trần giảm giá">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="usageLimit" label="Giới hạn lượt dùng">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="dateRange" label="Thời gian áp dụng" rules={[{ required: true, message: 'Chọn thời gian áp dụng' }]}>
                <DatePicker.RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isActive" label="Kích hoạt" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: true, label: 'Đang bật' },
                    { value: false, label: 'Đang tắt' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => { setOpen(false); setEditing(null); form.resetFields(); }}>Hủy</Button>
            <Button type="primary" htmlType="submit" className="btn-gold">
              {editing ? 'Lưu thay đổi' : 'Tạo voucher'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;
