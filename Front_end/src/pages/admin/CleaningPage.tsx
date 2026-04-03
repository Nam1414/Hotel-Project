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

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={2} style={{ color: '#fff', marginBottom: 0 }}>
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
                  <Button onClick={() => updateCleaning(record, 'Dirty', 'Cleaning')}>Dánh dấu bận</Button>
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
