// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { App, Button, Card as AntCard, Col, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { adminApi, RoomDto } from '../../services/adminApi';

const CleaningPage: React.FC = () => {
  const { message } = App.useApp();
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const loadData = async () => {
    setLoading(true);
    try {
      const roomData = await adminApi.getRooms();
      setRooms(roomData);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tải danh sách dọn phòng');
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
      await adminApi.updateRoom(record.id, {
        ...record,
        cleaningStatus: nextCleaningStatus,
        status: nextStatus || record.status,
      });
      message.success('Đã cập nhật trạng thái dọn phòng');
      loadData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={2} style={{ color: '#fff', marginBottom: 0 }}>
          Danh sách dọn phòng
        </Typography.Title>
        <Typography.Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
          Theo dõi các phòng cần dọn và cập nhật trạng thái hoàn tất.
        </Typography.Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Phòng bẩn" value={summary.dirty} />
          </AntCard>
        </Col>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Đang dọn" value={summary.cleaning} />
          </AntCard>
        </Col>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Sạch" value={summary.clean} />
          </AntCard>
        </Col>
      </Row>

      <AntCard className="glass-card">
        <Space wrap>
          <Select
            allowClear
            style={{ width: 240 }}
            placeholder="Lọc trạng thái vệ sinh"
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
            Làm mới
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
            { title: 'Phòng', dataIndex: 'roomNumber', render: (value: string) => <strong style={{ color: '#fff' }}>{value}</strong> },
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
                  <Button onClick={() => updateCleaning(record, 'Dirty', 'Cleaning')}>Đánh dấu bẩn</Button>
                  <Button onClick={() => updateCleaning(record, 'Inspecting', 'Cleaning')}>Đang dọn</Button>
                  <Button type="primary" onClick={() => updateCleaning(record, 'Clean', 'Available')}>
                    Hoàn tất
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </AntCard>
    </div>
  );
};

export default CleaningPage;
