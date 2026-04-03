// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { App, Button, Card as AntCard, Col, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { adminApi, RoomDto } from '../../services/adminApi';
import { useAppSelector } from '../../hooks/useAppStore';

const CleaningPage: React.FC = () => {
  const { message } = App.useApp();
  const user = useAppSelector((state) => state.auth.user);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const isHousekeeping = user?.role === 'Housekeeping';

  const loadData = async () => {
    setLoading(true);
    try {
      const roomData = await adminApi.getRooms();
      setRooms(roomData);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the tai danh sach don phong');
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
      message.success('Da cap nhat trang thai don phong');
      loadData();
    } catch (err: any) {
      const statusCode = err.response?.status;
      const fallbackMessage =
        statusCode === 404
          ? 'Backend chua nap endpoint cleaning-status. Hay restart API.'
          : statusCode === 403
            ? 'Tai khoan hien tai khong duoc phep cap nhat don phong.'
            : 'Khong the cap nhat trang thai';
      message.error(err.response?.data?.message || fallbackMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={2} style={{ color: '#fff', marginBottom: 0 }}>
          {isHousekeeping ? 'Cong viec don phong' : 'Danh sach don phong'}
        </Typography.Title>
        <Typography.Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
          {isHousekeeping
            ? 'Nhan vien buong phong cap nhat tien do xu ly phong theo thoi gian thuc.'
            : 'Theo doi cac phong can don va cap nhat trang thai hoan tat.'}
        </Typography.Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Phong ban" value={summary.dirty} />
          </AntCard>
        </Col>
        <Col xs={24} md={8}>
          <AntCard className="glass-card">
            <Statistic title="Dang don" value={summary.cleaning} />
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
            { title: 'Phong', dataIndex: 'roomNumber', render: (value: string) => <strong style={{ color: '#fff' }}>{value}</strong> },
            { title: 'Hang', dataIndex: 'roomTypeName', render: (value: string) => <Tag color="blue">{value}</Tag> },
            { title: 'Tang', dataIndex: 'floor', render: (value?: number | null) => value ?? '-' },
            { title: 'Trang thai phong', dataIndex: 'status' },
            {
              title: 'Ve sinh',
              dataIndex: 'cleaningStatus',
              render: (value?: string | null) => (
                <Tag color={(value || '').toLowerCase() === 'dirty' ? 'red' : (value || '').toLowerCase() === 'clean' ? 'green' : 'gold'}>
                  {value || 'Chua cap nhat'}
                </Tag>
              ),
            },
            {
              title: 'Cap nhat',
              render: (_, record: RoomDto) => (
                <Space wrap>
                  <Button onClick={() => updateCleaning(record, 'Dirty', 'Cleaning')}>Danh dau ban</Button>
                  <Button onClick={() => updateCleaning(record, 'Inspecting', 'Cleaning')}>Dang don</Button>
                  <Button type="primary" onClick={() => updateCleaning(record, 'Clean', 'Available')}>
                    Hoan tat
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
