// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { App, Button, Card as AntCard, Col, Row, Select, Space, Statistic, Table, Tag, Typography, Modal, Form, InputNumber, Input, Upload } from 'antd';
import { adminApi, RoomDto, RoomInventoryDto } from '../../services/adminApi';
import { useAppSelector } from '../../hooks/useAppStore';
import { AlertTriangle, ImagePlus } from 'lucide-react';

const CleaningPage: React.FC = () => {
  const { message } = App.useApp();
  const user = useAppSelector((state) => state.auth.user);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const isHousekeeping = user?.role === 'Housekeeping';

  // Report Damage State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
  const [roomInventory, setRoomInventory] = useState<RoomInventoryDto[]>([]);
  const [damageImage, setDamageImage] = useState<File | null>(null);
  const [reportForm] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const roomData = await adminApi.getRooms();
      setRooms(roomData);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tải danh sách đơn phòng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    const dirty = rooms.filter((room) => (room.cleaningStatus || '').toLowerCase() === 'dirty').length;
    const cleaning = rooms.filter((room) => room.status === 'Cleaning').length;
    const clean = rooms.filter((room) => (room.cleaningStatus || '').toLowerCase() === 'clean').length;

    return { dirty, cleaning, clean };
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    if (!statusFilter) return rooms;
    return rooms.filter((room) => (room.cleaningStatus || '').toLowerCase() === statusFilter.toLowerCase());
  }, [rooms, statusFilter]);

  const updateCleaning = async (record: RoomDto, nextCleaningStatus: string, nextStatus?: string) => {
    try {
      await adminApi.updateRoomCleaningStatus(record.id, {
        cleaningStatus: nextCleaningStatus,
        status: nextStatus || record.status,
      });
      message.success('Đã cập nhật trạng thái đơn phòng');
      loadData();
    } catch (err: any) {
      const statusCode = err.response?.status;
      const fallbackMessage =
        statusCode === 404
          ? 'Backend chưa nạp endpoint cleaning-status. Hãy restart API.'
          : statusCode === 403
            ? 'Tài khoản hiện tại không được phép cập nhật đơn phòng.'
            : 'Không thể cập nhật trạng thái';
      message.error(err.response?.data?.message || fallbackMessage);
    }
  };

  const openReportModal = async (room: RoomDto) => {
    setSelectedRoom(room);
    setReportModalOpen(true);
    reportForm.resetFields();
    setDamageImage(null);
    setRoomInventory([]);
    try {
      const inventory = await adminApi.getRoomInventory(room.id);
      setRoomInventory(inventory);
    } catch (err: any) {
      message.error('Không thể lấy danh sách vật tư của phòng này');
    }
  };

  const handleReportSubmit = async (values: any) => {
    try {
      const inventoryItem = roomInventory.find((item) => item.id === values.roomInventoryId);
      if (!inventoryItem) {
         message.error('Vui lòng chọn vật tư bị hỏng');
         return;
      }
      
      const penalty = (inventoryItem.priceIfLost || 0) * values.quantity;

      const res = await adminApi.reportDamage({
        equipmentId: inventoryItem.equipmentId,
        quantity: values.quantity,
        penaltyAmount: penalty,
        description: values.description,
        roomInventoryId: inventoryItem.id
      }) as any;

      const damageId = res?.damageId || res?.data?.damageId;
      if (damageId && damageImage) {
        try {
          await adminApi.uploadDamageImage(damageId, damageImage);
        } catch (uploadErr) {
          message.warning('Đã tạo báo cáo nhưng không thể tải ảnh lên');
        }
      }

      message.success('Đã gửi báo cáo sự cố thành công!');
      setReportModalOpen(false);
      setDamageImage(null);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể gửi báo cáo');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          {isHousekeeping ? 'Công việc dọn phòng' : 'Danh sách dọn phòng'}
        </Typography.Title>
        <Typography.Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
          {isHousekeeping
            ? 'Nhân viên buồng phòng cập nhật tiến độ xử lý phòng theo thời gian thực.'
            : 'Theo dõi các phòng cần dọn và cập nhật trạng thái hoàn tất.'}
        </Typography.Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Phòng bận" value={summary.dirty} />
          </AntCard>
        </Col>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Đang dọn" value={summary.cleaning} />
          </AntCard>
        </Col>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Sach" value={summary.clean} />
          </AntCard>
        </Col>
      </Row>

      <AntCard className="glass-card">
        <Space wrap>
          <Select
            allowClear
            style={{ width: 240 }}
            placeholder="Loc trang thai ve sinh"
            value={statusFilter}
            options={['Clean', 'Dirty', 'Inspecting'].map((value) => ({ value, label: value }))}
            onChange={setStatusFilter}
          />
          <Button
            onClick={() => {
              setStatusFilter(undefined);
              loadData();
            }}
          >
            Lam moi
          </Button>
        </Space>
      </AntCard>

      <AntCard className="glass-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filteredRooms}
          scroll={{ x: 960 }}
          columns={[
            { title: 'Phòng', dataIndex: 'roomNumber', render: (value: string) => <strong>{value}</strong> },
            { title: 'Hạng', dataIndex: 'roomTypeName', render: (value: string) => <Tag color="blue">{value}</Tag> },
            { title: 'Tầng', dataIndex: 'floor', render: (value?: number | null) => value ?? '-' },
            { title: 'Trạng thái phòng', dataIndex: 'status' },
            {
              title: 'Vệ sinh',
              dataIndex: 'cleaningStatus',
              render: (value?: string | null) => (
                <Tag color={(value || '').toLowerCase() === 'dirty' ? 'red' : (value || '').toLowerCase() === 'clean' ? 'green' : 'gold'}>
                  {value || 'Chưa cập nhật'}
                </Tag>
              ),
            },
            {
              title: 'Cập nhật',
              render: (_, record: RoomDto) => (
                <Space wrap>
                  <Button onClick={() => updateCleaning(record, 'Dirty', 'Cleaning')}>Đánh dấu bận</Button>
                  <Button onClick={() => updateCleaning(record, 'Inspecting', 'Cleaning')}>Đang dọn</Button>
                  <Button danger icon={<AlertTriangle size={14} />} onClick={() => openReportModal(record)}>
                    Báo sự cố
                  </Button>
                  <Button type="primary" onClick={() => updateCleaning(record, 'Clean', 'Available')}>
                    Hoàn tất
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </AntCard>

      <Modal open={reportModalOpen} title={`Báo hỏng vật tư - Phòng ${selectedRoom?.roomNumber || ''}`} onCancel={() => setReportModalOpen(false)} footer={null}>
        <Form form={reportForm} layout="vertical" onFinish={handleReportSubmit}>
          <Form.Item name="roomInventoryId" label="Vật tư bị hỏng/thiếu" rules={[{ required: true, message: 'Vui lòng chọn vật tư' }]}>
            <Select 
              options={roomInventory.map((item) => ({ value: item.id, label: `${item.equipmentName} (Kho phòng: ${item.quantity || 0})` }))} 
              placeholder="Chọn vật tư"
            />
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng hỏng/mất" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả sự cố (nếu có)">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết tình trạng hỏng hóc..." />
          </Form.Item>
          <Form.Item label="Ảnh minh chứng">
            <Upload 
              beforeUpload={(file) => {
                setDamageImage(file);
                return false; // Ngăn không cho tự động upload
              }}
              maxCount={1}
              onRemove={() => setDamageImage(null)}
            >
              <Button icon={<ImagePlus size={16} />}>Chọn ảnh đính kèm</Button>
            </Upload>
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setReportModalOpen(false)}>Hủy</Button>
            <Button type="primary" danger htmlType="submit">
              Gửi báo cáo
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CleaningPage;
