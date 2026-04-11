// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import {
  App,
  Button,
  Card,
  Col,
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
  Typography,
} from 'antd';
import { CircleDollarSign, Edit2, FileUp, ImagePlus, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { adminApi, EquipmentDto, EquipmentStats } from '../../services/adminApi';

const InventoryPage: React.FC = () => {
  const { message } = App.useApp();
  const [items, setItems] = useState<EquipmentDto[]>([]);
  const [stats, setStats] = useState<EquipmentStats['overall']>({ total: 0, inUse: 0, damaged: 0, inStock: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ search?: string; includeInactive?: boolean }>({});
  const [editingItem, setEditingItem] = useState<EquipmentDto | null>(null);
  const [priceTarget, setPriceTarget] = useState<EquipmentDto | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openPriceForm, setOpenPriceForm] = useState(false);
  const [form] = Form.useForm();
  const [priceForm] = Form.useForm();
  const importFileRef = useRef<HTMLInputElement | null>(null);
  const imageFileRef = useRef<HTMLInputElement | null>(null);

  const loadData = async (nextFilters = filters) => {
    setLoading(true);
    try {
      const [equipmentData, stockSummary] = await Promise.all([
        adminApi.getEquipments(nextFilters),
        adminApi.getEquipmentStats(),
      ]);
      setItems(equipmentData);
      setStats(stockSummary.overall);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tải vật tư');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ totalQuantity: 0, basePrice: 0, defaultPriceIfLost: 0 });
    setOpenForm(true);
  };

  const openEdit = (record: EquipmentDto) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setOpenForm(true);
  };

  const openPriceModal = (record: EquipmentDto) => {
    setPriceTarget(record);
    priceForm.setFieldsValue({
      basePrice: record.basePrice,
      defaultPriceIfLost: record.defaultPriceIfLost,
    });
    setOpenPriceForm(true);
  };

  const submitForm = async (values: any) => {
    try {
      if (editingItem) {
        await adminApi.updateEquipment(editingItem.id, values);
        message.success('Đã cập nhật vật tư');
      } else {
        await adminApi.createEquipment(values);
        message.success('Đã thêm vật tư');
      }
      setOpenForm(false);
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể lưu vật tư');
    }
  };

  const submitPrice = async (values: any) => {
    if (!priceTarget) return;

    try {
      await adminApi.updateEquipmentPrice(priceTarget.id, values);
      message.success('Đã cập nhật giá và đền bù');
      setOpenPriceForm(false);
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể cập nhật giá');
    }
  };

  const toggleItem = async (record: EquipmentDto) => {
    try {
      if (record.isActive) {
        await adminApi.deleteEquipment(record.id);
        message.success('Đã ẩn vật tư');
      } else {
        await adminApi.restoreEquipment(record.id);
        message.success('Đã khôi phục vật tư');
      }
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const importExcel = async (file?: File) => {
    if (!file) return;

    try {
      const result: any = await adminApi.importEquipmentExcel(file);
      message.success(result.message || 'Đã import Excel');
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Import Excel thất bại');
    }
  };

  const uploadImage = async (file?: File) => {
    if (!file || !editingItem) return;

    try {
      await adminApi.uploadEquipmentImage(editingItem.id, file);
      message.success('Đã upload ảnh vật tư');
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể upload ảnh');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Quản lý vật tư
          </Typography.Title>
          <Typography.Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
            CRUD vật tư, nhập Excel, thống kê kho và cập nhật giá đền bù.
          </Typography.Paragraph>
        </div>

        <Space wrap>
          <input ref={importFileRef} type="file" hidden accept=".xlsx" onChange={(event) => importExcel(event.target.files?.[0])} />
          <Button icon={<FileUp size={16} />} onClick={() => importFileRef.current?.click()}>
            Import Excel
          </Button>
          <Button type="primary" className="btn-gold" icon={<Plus size={16} />} onClick={openCreate}>
            Thêm vật tư
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card">
            <Statistic title="Tổng đơn vị vật tư" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card">
            <Statistic title="Đang dùng" value={stats.inUse} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card">
            <Statistic title="Hỏng / mất" value={stats.damaged} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card">
            <Statistic title="Trong kho" value={stats.inStock} />
          </Card>
        </Col>
      </Row>

      <Card className="glass-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Input
              placeholder="Tìm theo tên vật tư"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value || undefined }))}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              style={{ width: '100%' }}
              value={filters.includeInactive ? 'all' : 'active'}
              options={[
                { value: 'active', label: 'Chỉ đang dùng' },
                { value: 'all', label: 'Bao gồm đã ẩn' },
              ]}
              onChange={(value) => setFilters((prev) => ({ ...prev, includeInactive: value === 'all' }))}
            />
          </Col>
          <Col xs={24} md={6}>
            <Space>
              <Button type="primary" onClick={() => loadData(filters)}>
                Tìm kiếm
              </Button>
              <Button
                onClick={() => {
                  const next = {};
                  setFilters(next);
                  loadData(next);
                }}
              >
                Làm mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="glass-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={items}
          scroll={{ x: 1200 }}
          columns={[
            { title: 'Mã', dataIndex: 'itemCode', render: (value: string) => <strong>{value}</strong> },
            {
              title: 'Hình ảnh',
              dataIndex: 'imageUrl',
              width: 110,
              render: (value: string | null | undefined, record: EquipmentDto) =>
                value ? (
                  <img
                    src={value}
                    alt={record.name}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.05)',
                      color: '#9ca3af',
                      fontSize: 12,
                      textAlign: 'center',
                      padding: 6,
                    }}
                  >
                    Chưa có ảnh
                  </div>
                ),
            },
            { title: 'Tên vật tư', dataIndex: 'name' },
            { title: 'Danh mục', dataIndex: 'category', render: (value: string) => <Tag>{value}</Tag> },
            { title: 'Đơn vị', dataIndex: 'unit' },
            { title: 'Tổng', dataIndex: 'totalQuantity' },
            { title: 'Trong kho', dataIndex: 'inStockQuantity' },
            { title: 'Đang dùng', dataIndex: 'inUseQuantity' },
            { title: 'Hỏng', dataIndex: 'damagedQuantity', render: (value: number) => <Tag color={value > 0 ? 'red' : 'green'}>{value}</Tag> },
            { title: 'Giá gốc', dataIndex: 'basePrice', render: (value: number) => value.toLocaleString('vi-VN') + ' đ' },
            { title: 'Đền bù', dataIndex: 'defaultPriceIfLost', render: (value: number) => value.toLocaleString('vi-VN') + ' đ' },
            { title: 'Trạng thái', dataIndex: 'isActive', render: (value: boolean) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đang dùng' : 'Đã ẩn'}</Tag> },
            {
              title: 'Thao tác',
              render: (_, record: EquipmentDto) => (
                <Space wrap>
                  <Button icon={<Edit2 size={14} />} onClick={() => openEdit(record)}>
                    Sửa
                  </Button>
                  <Button icon={<CircleDollarSign size={14} />} onClick={() => openPriceModal(record)}>
                    Giá
                  </Button>
                  <Button icon={record.isActive ? <Trash2 size={14} /> : <RotateCcw size={14} />} onClick={() => toggleItem(record)}>
                    {record.isActive ? 'Ẩn' : 'Khôi phục'}
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal open={openForm} title={editingItem ? 'Cập nhật vật tư' : 'Thêm vật tư'} onCancel={() => setOpenForm(false)} footer={null}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={submitForm}
          onValuesChange={(changedValues) => {
            if (changedValues.basePrice !== undefined && !editingItem) {
              const base = changedValues.basePrice || 0;
              let multiplier = 1.1; // Tài sản giá trị rất cao (> 5tr) bù thêm 10% phí rủi ro/vận chuyển
              if (base <= 50000) multiplier = 4.0;       // Đồ lặt vặt (ly, tách, bàn chải, dép) -> x4 (VD: 20k -> 80k)
              else if (base <= 200000) multiplier = 2.5; // Đồ dùng vừa (khăn tắm, áo choàng, ấm siêu tốc nhỏ) -> x2.5 (VD: 100k -> 250k)
              else if (base <= 1000000) multiplier = 1.5; // Đồ giá trị trung bình (chăn ga gối, máy sấy) -> x1.5 (VD: 500k -> 750k)
              else if (base <= 5000000) multiplier = 1.2; // Đồ điện tử/móc cứng (Tivi, tủ lạnh mini) -> x1.2 (VD: 3tr -> 3.6tr)
              form.setFieldsValue({ defaultPriceIfLost: Math.round(base * multiplier) }); // Làm tròn số
            }
          }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="itemCode" label="Mã vật tư" rules={[{ required: !editingItem }]}>
                <Input disabled={!!editingItem} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Tên vật tư" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="totalQuantity" label="Số lượng tổng" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            {!editingItem ? (
              <>
                <Col span={8}>
                  <Form.Item name="basePrice" label="Giá gốc" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="defaultPriceIfLost" label="Giá đền bù" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </>
            ) : null}
          </Row>
          <Form.Item name="supplier" label="Nhà cung cấp">
            <Input />
          </Form.Item>

          {editingItem ? (
            <>
              <input ref={imageFileRef} type="file" hidden accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} />
              <Button icon={<ImagePlus size={14} />} onClick={() => imageFileRef.current?.click()}>
                Upload ảnh vật tư
              </Button>
            </>
          ) : null}

          <div className="mt-4 flex justify-end gap-3">
            <Button onClick={() => setOpenForm(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {editingItem ? 'Lưu thay đổi' : 'Tạo vật tư'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal open={openPriceForm} title={`Giá và đền bù: ${priceTarget?.name || ''}`} onCancel={() => setOpenPriceForm(false)} footer={null}>
        <Form 
          form={priceForm} 
          layout="vertical" 
          onFinish={submitPrice}
          onValuesChange={(changedValues) => {
            if (changedValues.basePrice !== undefined) {
              const base = changedValues.basePrice || 0;
              let multiplier = 1.1;
              if (base <= 50000) multiplier = 4.0;
              else if (base <= 200000) multiplier = 2.5;
              else if (base <= 1000000) multiplier = 1.5;
              else if (base <= 5000000) multiplier = 1.2;
              priceForm.setFieldsValue({ defaultPriceIfLost: Math.round(base * multiplier) });
            }
          }}
        >
          <Form.Item name="basePrice" label="Giá gốc" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="defaultPriceIfLost" label="Giá đền bù" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpenPriceForm(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật giá
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
