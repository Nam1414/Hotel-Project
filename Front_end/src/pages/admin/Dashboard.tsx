// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Col, List, Row, Statistic, Table, Tag, Typography } from 'antd';
import { BellRing, BedDouble, Boxes, CircleAlert } from 'lucide-react';
import { adminApi, NotificationDto, RoomDto } from '../../services/adminApi';

const Dashboard: React.FC = () => {
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [stockSummary, setStockSummary] = useState<{
    overall: { total: number; inUse: number; damaged: number; inStock: number };
  }>({
    overall: { total: 0, inUse: 0, damaged: 0, inStock: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const result = await adminApi.getDashboardSummary();
        setRooms(result.rooms);
        setNotifications(result.notifications);
        setStockSummary(result.stockSummary);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const summary = useMemo(() => {
    const active = rooms.filter((room) => room.isActive);
    const occupied = active.filter((room) => room.status === 'Occupied').length;
    const dirty = active.filter((room) => (room.cleaningStatus || '').toLowerCase() === 'dirty').length;
    const maintenance = active.filter((room) => room.status === 'Maintenance').length;

    return {
      totalRooms: active.length,
      occupied,
      dirty,
      maintenance,
      occupancyRate: active.length ? Math.round((occupied / active.length) * 100) : 0,
    };
  }, [rooms]);

  const attentionRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.status === 'Maintenance' ||
          room.status === 'Cleaning' ||
          (room.cleaningStatus || '').toLowerCase() === 'dirty'
      ),
    [rooms]
  );

  return (
    <div className="space-y-6">
      <Typography.Title level={2} style={{ color: '#fff', marginBottom: 0 }}>
        Dashboard vận hành
      </Typography.Title>
      <Typography.Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
        Tổng quan nhanh về phòng, vệ sinh, vật tư và thông báo mới nhất.
      </Typography.Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card" loading={loading}>
            <Statistic title="Tổng phòng hoạt động" value={summary.totalRooms} prefix={<BedDouble size={18} />} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card" loading={loading}>
            <Statistic title="Tỉ lệ lấp đầy" value={summary.occupancyRate} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card" loading={loading}>
            <Statistic title="Phòng cần dọn" value={summary.dirty} prefix={<CircleAlert size={18} />} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="glass-card" loading={loading}>
            <Statistic title="Vật tư trong kho" value={stockSummary.overall.inStock} prefix={<Boxes size={18} />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <Card className="glass-card" title={<span style={{ color: '#fff' }}>Phòng cần chú ý</span>}>
            <Table
              rowKey="id"
              loading={loading}
              dataSource={attentionRooms}
              pagination={{ pageSize: 6 }}
              scroll={{ x: 720 }}
              columns={[
                {
                  title: 'Số phòng',
                  dataIndex: 'roomNumber',
                  render: (value: string) => <strong style={{ color: '#fff' }}>{value}</strong>,
                },
                {
                  title: 'Hạng',
                  dataIndex: 'roomTypeName',
                  render: (value: string) => <Tag color="blue">{value}</Tag>,
                },
                {
                  title: 'Tầng',
                  dataIndex: 'floor',
                  render: (value?: number | null) => value ?? '-',
                },
                {
                  title: 'Trạng thái phòng',
                  dataIndex: 'status',
                  render: (value: string) => <Badge status={value === 'Maintenance' ? 'error' : 'processing'} text={value} />,
                },
                {
                  title: 'Vệ sinh',
                  dataIndex: 'cleaningStatus',
                  render: (value?: string | null) => (
                    <Tag color={(value || '').toLowerCase() === 'dirty' ? 'red' : 'gold'}>
                      {value || 'Chưa cập nhật'}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Card className="glass-card" title={<span style={{ color: '#fff' }}>Thông báo gần đây</span>}>
            <List
              loading={loading}
              dataSource={notifications.slice(0, 8)}
              locale={{ emptyText: 'Chưa có thông báo' }}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<BellRing size={18} color="#C6A96B" />}
                    title={<span style={{ color: '#fff' }}>{item.title}</span>}
                    description={
                      <div>
                        <div style={{ color: '#9ca3af', marginBottom: 4 }}>{item.content}</div>
                        <small style={{ color: '#6b7280' }}>
                          {new Date(item.createdAt).toLocaleString('vi-VN')}
                        </small>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
