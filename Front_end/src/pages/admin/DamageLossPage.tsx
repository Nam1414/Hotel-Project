// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { App, Button, Card as AntCard, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { Check, ImagePlus, Plus, X } from 'lucide-react';
import { adminApi, DamageDto, EquipmentDto, RoomDto, RoomInventoryDto } from '../../services/adminApi';

const DamageLossPage: React.FC = () => {
  const { message } = App.useApp();
  const [damages, setDamages] = useState<DamageDto[]>([]);
  const [equipments, setEquipments] = useState<EquipmentDto[]>([]);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [roomInventory, setRoomInventory] = useState<RoomInventoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ status?: string; equipmentId?: number }>({});
  const [openForm, setOpenForm] = useState(false);
  const [form] = Form.useForm();

  const loadData = async (nextFilters = filters) => {
    setLoading(true);
    try {
      const [damageData, equipmentData, roomData] = await Promise.all([
        adminApi.getDamages(nextFilters),
        adminApi.getEquipments(),
        adminApi.getRooms(),
      ]);
      setDamages(damageData);
      setEquipments(equipmentData);
      setRooms(roomData);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tải dữ liệu hỏng / mất');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, []);

  const summary = useMemo(() => {
    const totalIncidents = damages.length;
    const totalCompensation = damages.reduce((sum, item) => sum + (Number(item.penaltyAmount) || 0), 0);
    const latestUpdatedAt = damages
      .map((item) => item.createdAt)
      .filter(Boolean)
      .sort((a, b) => new Date(b as string).getTime() - new Date(a as string).getTime())[0];

    return {
      totalIncidents,
      totalCompensation,
      latestUpdatedAt: latestUpdatedAt ? new Date(latestUpdatedAt).toLocaleString('vi-VN') : 'Chua co du lieu',
    };
  }, [damages]);

  const loadInventoryByRoom = async (roomId?: number) => {
    if (!roomId) {
      setRoomInventory([]);
      form.setFieldValue('roomInventoryId', undefined);
      return;
    }

    try {
      const data = await adminApi.getRoomInventory(roomId);
      setRoomInventory(data);
    } catch {
      setRoomInventory([]);
    }
  };

  const submitForm = async (values: any) => {
    try {
      await adminApi.reportDamage(values);
      message.success('Đã ghi nhận hỏng / mất');
      setOpenForm(false);
      form.resetFields();
      setRoomInventory([]);
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể ghi nhận');
    }
  };

  const updateStatus = async (record: DamageDto, status: 'confirmed' | 'cancelled') => {
    try {
      await adminApi.updateDamageStatus(record.id, status);
      message.success(status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy');
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  const uploadDamageImage = async (damageId: number, file?: File) => {
    if (!file) return;

    try {
      await adminApi.uploadDamageImage(damageId, file);
      message.success('Đã tải ảnh hỏng lên');
      loadData(filters);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể upload ảnh');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography.Title level={2} style={{ color: '#fff', marginBottom: 0 }}>
            Hỏng / mất / đền bù
          </Typography.Title>
          <Typography.Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
            Ghi nhận vật tư hỏng, liên kết tồn kho phòng và cập nhật trạng thái xác nhận.
          </Typography.Paragraph>
        </div>

        <Button type="primary" className="btn-gold" icon={<Plus size={16} />} onClick={() => setOpenForm(true)}>
          Ghi nhận mới
        </Button>
      </div>

      <AntCard className="glass-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <AntCard className="glass-card">
              <Statistic title="Tong su co" value={summary.totalIncidents} />
            </AntCard>
          </Col>
          <Col xs={24} md={8}>
            <AntCard className="glass-card">
              <Statistic title="Tong tien den bu" value={summary.totalCompensation} formatter={(value) => `${Number(value || 0).toLocaleString('vi-VN')} d`} />
            </AntCard>
          </Col>
          <Col xs={24} md={8}>
            <AntCard className="glass-card">
              <Statistic title="Cap nhat lan cuoi" value={summary.latestUpdatedAt} />
            </AntCard>
          </Col>
        </Row>
      </AntCard>

      <AntCard className="glass-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Lọc theo vật tư"
              value={filters.equipmentId}
              options={equipments.map((item) => ({ value: item.id, label: item.name }))}
              onChange={(value) => setFilters((prev) => ({ ...prev, equipmentId: value }))}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Lọc theo trạng thái"
              value={filters.status}
              options={['pending', 'confirmed', 'cancelled'].map((value) => ({ value, label: value }))}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            />
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <Button type="primary" onClick={() => loadData(filters)}>
                Lọc
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
      </AntCard>

      <AntCard className="glass-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={damages}
          scroll={{ x: 1100 }}
          columns={[
            { title: 'Vật tư', dataIndex: 'equipmentName' },
            { title: 'Mã', dataIndex: 'equipmentCode' },
            { title: 'Số lượng', dataIndex: 'quantity' },
            { title: 'Đền bù', dataIndex: 'penaltyAmount', render: (value: number) => value.toLocaleString('vi-VN') + ' đ' },
            { title: 'Mô tả', dataIndex: 'description', render: (value?: string | null) => value || '-' },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (value: string) => <Tag color={value === 'confirmed' ? 'green' : value === 'cancelled' ? 'red' : 'gold'}>{value}</Tag>,
            },
            {
              title: 'Thao tác',
              render: (_, record: DamageDto) => (
                <Space wrap>
                  {record.status === 'pending' ? (
                    <>
                      <Button icon={<Check size={14} />} onClick={() => updateStatus(record, 'confirmed')}>
                        Xác nhận
                      </Button>
                      <Button danger icon={<X size={14} />} onClick={() => updateStatus(record, 'cancelled')}>
                        Hủy
                      </Button>
                    </>
                  ) : null}
                  <label style={{ cursor: 'pointer' }}>
                    <input type="file" hidden accept="image/*" onChange={(event) => uploadDamageImage(record.id, event.target.files?.[0])} />
                    <Button icon={<ImagePlus size={14} />}>Ảnh</Button>
                  </label>
                </Space>
              ),
            },
          ]}
        />
      </AntCard>

      <Modal open={openForm} title="Ghi nhận hỏng / mất" onCancel={() => setOpenForm(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={submitForm}>
          <Form.Item name="equipmentId" label="Vật tư" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="label" options={equipments.map((item) => ({ value: item.id, label: `${item.itemCode} - ${item.name}` }))} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="penaltyAmount" label="Tiền đền bù" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="roomId" label="Phòng liên quan">
            <Select allowClear options={rooms.map((room) => ({ value: room.id, label: `${room.roomNumber} - ${room.roomTypeName}` }))} onChange={loadInventoryByRoom} />
          </Form.Item>
          <Form.Item name="roomInventoryId" label="Vật tư trong phòng">
            <Select allowClear options={roomInventory.map((item) => ({ value: item.id, label: `${item.equipmentName} (${item.quantity || 0})` }))} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpenForm(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Ghi nhận
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DamageLossPage;
