import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Empty, Input, Select, Space, Spin, Tag, Typography, message, Table, ConfigProvider } from 'antd';
import { Download, History, User as UserIcon, Calendar, Filter } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import { adminApi } from '../../services/adminApi';

interface AuditLogEvent {
  eventId: string;
  timestamp: string;
  actionType: string;
  entityType: string;
  context: Record<string, unknown> | null;
  changes: Record<string, unknown> | null;
  message: string;
  userId?: number | null;
  userName?: string | null;
  ipAddress?: string | null;
}

interface AuditLogExport {
  totalEvents: number;
  events: AuditLogEvent[];
}

const { RangePicker } = DatePicker;

const actionColor = (action: string) => {
  if (action === 'DELETE') return 'error';
  if (action === 'UPDATE') return 'warning';
  if (action === 'CREATE') return 'success';
  return 'default';
};

interface GroupedRow {
  key: string;
  date: string;
  userName: string;
  summary: string;
  events: AuditLogEvent[];
}

const AuditLogsPage: React.FC = () => {
  const [data, setData] = useState<AuditLogExport>({ totalEvents: 0, events: [] });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState<string | undefined>();
  const [actionType, setActionType] = useState<string | undefined>();
  const [usersList, setUsersList] = useState<any[]>([]);
  // Default to last 7 days
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')]);

  const load = async () => {
    setLoading(true);
    try {
      const query: any = {};
      if (search) query.search = search;
      if (entityType) query.entityType = entityType;
      if (actionType) query.actionType = actionType;
      
      // Ensure "To" date includes the full day (23:59:59)
      if (range?.[0]) query.from = range[0].toISOString();
      if (range?.[1]) query.to = range[1].endOf('day').toISOString();
      
      const [result, users] = await Promise.all([
        adminApi.getAuditLogs(query),
        adminApi.getUsers()
      ]);

      // Handle both PascalCase and camelCase response from backend
      const normalized = {
        totalEvents: (result as any).totalEvents ?? (result as any).TotalEvents ?? 0,
        events: (result as any).events ?? (result as any).Events ?? []
      };
      setData(normalized);
      setUsersList(users);
    } catch (err) {
      console.error('AuditLog load error:', err);
      message.error('Không thể tải nhật ký hoạt động');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const eventsList = Array.isArray(data?.events) ? data.events : [];

  const groupedData = useMemo<GroupedRow[]>(() => {
    const map = new Map<string, AuditLogEvent[]>();
    
    [...eventsList].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).forEach(event => {
      const date = dayjs(event.timestamp).format('DD/MM/YYYY');
      const user = event.userName || 'System';
      const key = `${date}-${user}`;
      
      const existing = map.get(key) || [];
      existing.push(event);
      map.set(key, existing);
    });

    return Array.from(map.entries()).map(([key, list]) => {
      const first = list[0];
      const otherCount = list.length - 1;
      const summaryText = otherCount > 0 
        ? `${first.message} (và ${otherCount} sự kiện khác)`
        : first.message;

      return {
        key,
        date: dayjs(first.timestamp).format('DD/MM/YYYY'),
        userName: first.userName || 'System',
        summary: summaryText,
        events: list
      };
    });
  }, [eventsList]);

  const exportJson = async (all = false) => {
    try {
      const query: any = {};
      if (range?.[0]) query.from = range[0].toISOString();
      if (range?.[1]) query.to = range[1].endOf('day').toISOString();
      
      const result = all ? (await adminApi.exportAuditLogs()) : (await adminApi.getAuditLogs(query));
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `auditlogs-${all ? 'full' : 'filtered'}-${dayjs().format('YYYY-MM-DD')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      message.success('Đã xuất dữ liệu thành công');
    } catch {
      message.error('Lỗi khi xuất dữ liệu');
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 150,
    },
    {
      title: 'Nhân viên',
      dataIndex: 'userName',
      key: 'userName',
      width: 250,
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <UserIcon size={14} className="text-muted" />
          <span className="font-medium text-title">{text}</span>
          <Tag color={text === 'System' ? 'blue' : 'gold'} className="m-0 border-none px-2 rounded font-bold text-[10px] uppercase">
            {text === 'System' ? 'System' : 'Admin'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Tóm tắt hoạt động',
      dataIndex: 'summary',
      key: 'summary',
      render: (text: string) => <span className="text-body">{text}</span>,
    },
  ];

  const expandedRowRender = (record: GroupedRow) => {
    const subColumns = [
      { title: 'Giờ', dataIndex: 'timestamp', key: 'time', render: (t: string) => dayjs(t).format('HH:mm:ss'), width: 150 },
      { 
        title: 'Hành động', 
        dataIndex: 'actionType', 
        key: 'action', 
        width: 150,
        render: (a: string) => <Tag color={actionColor(a)} className="font-bold border-none">{a}</Tag>
      },
      { title: 'Đối tượng (Bảng)', dataIndex: 'entityType', key: 'entity', width: 200 },
      { title: 'Nội dung', dataIndex: 'message', key: 'msg' },
    ];

    return (
      <Table
        columns={subColumns}
        dataSource={record.events}
        pagination={false}
        rowKey="eventId"
        className="nested-audit-table"
        size="middle"
      />
    );
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: 'transparent',
            headerColor: 'var(--text-secondary)',
            headerSplitColor: 'transparent',
            rowHoverBg: 'rgba(var(--primary-rgb), 0.05)',
          },
        },
      }}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <History size={24} className="text-primary" />
            </div>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Nhật ký hoạt động
            </Typography.Title>
          </div>

          <Space wrap>
            <Button icon={<Download size={16} />} onClick={() => exportJson(false)} className="rounded-xl h-10 px-6">
              Xuất theo bộ lọc
            </Button>
            <Button type="primary" icon={<Download size={16} />} onClick={() => exportJson(true)} className="btn-gold rounded-xl h-10 px-6">
              Xuất toàn bộ (Server)
            </Button>
          </Space>
        </div>

        {/* Filter Bar */}
        <Card className="glass-card !border-none !shadow-sm" styles={{ body: { padding: 16 } }}>
          <div className="flex flex-wrap items-center gap-4">
            <Select
              placeholder="Lọc theo nhân viên"
              style={{ width: 200 }}
              allowClear
              value={search || undefined}
              onChange={setSearch}
              options={[
                { label: 'Tất cả nhân viên', value: '' },
                ...usersList.map(u => ({ label: u.fullName || u.userName, value: u.userName }))
              ]}
              className="custom-select-luxury"
            />

            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-xl border border-luxury">
              <Calendar size={16} className="text-muted" />
              <Typography.Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Lọc theo ngày:</Typography.Text>
              <RangePicker
                variant="borderless"
                value={range as unknown as [Dayjs, Dayjs] | null}
                onChange={(values) => setRange(values as [Dayjs | null, Dayjs | null] | null)}
                placeholder={['Từ ngày', 'Đến ngày']}
                className="audit-range-picker"
              />
            </div>

            <Select
              placeholder="Tháng"
              style={{ width: 140 }}
              className="custom-select-luxury"
              value={range?.[0] ? dayjs(range[0]).month() + 1 : undefined}
              options={Array.from({ length: 12 }, (_, i) => ({ label: `Tháng ${i + 1}`, value: i + 1 }))}
              onChange={(month) => {
                const currentYear = range?.[0] ? dayjs(range[0]).year() : dayjs().year();
                const start = dayjs().year(currentYear).month(month - 1).startOf('month');
                const end = start.endOf('month');
                setRange([start, end]);
              }}
            />

            <Select
              placeholder="Năm"
              style={{ width: 120 }}
              className="custom-select-luxury"
              value={range?.[0] ? dayjs(range[0]).year() : dayjs().year()}
              options={[2024, 2025, 2026].map(y => ({ label: y.toString(), value: y }))}
              onChange={(year) => {
                const currentMonth = range?.[0] ? dayjs(range[0]).month() : dayjs().month();
                const start = dayjs().year(year).month(currentMonth).startOf('month');
                const end = start.endOf('month');
                setRange([start, end]);
              }}
            />
            
            <Button type="text" icon={<Filter size={16} />} onClick={load} className="text-primary hover:bg-primary/5 font-bold">
              Áp dụng
            </Button>
          </div>
        </Card>

        {/* Main Table */}
        <Card className="glass-card !border-none !shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
          <Table
            columns={columns}
            dataSource={groupedData}
            loading={loading}
            expandable={{
              expandedRowRender,
              expandRowByClick: true,
              columnWidth: 50,
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              className: "px-6 py-4",
            }}
            className="audit-main-table"
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu nhật ký" /> }}
          />
        </Card>
      </div>

      <style>{`
        .audit-main-table .ant-table-thead > tr > th {
          border-bottom: 1px solid var(--border-color);
          font-weight: 600;
          padding: 16px 24px;
        }
        .audit-main-table .ant-table-tbody > tr > td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .nested-audit-table {
          margin: 8px 0;
          background: var(--bg-subtle) !important;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        .nested-audit-table .ant-table {
          background: transparent !important;
        }
        .nested-audit-table .ant-table-thead > tr > th {
          background: rgba(var(--primary-rgb), 0.05) !important;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px 24px;
        }
        .nested-audit-table .ant-table-tbody > tr > td {
          font-size: 13px;
          padding: 12px 24px;
        }
        .audit-range-picker {
          padding: 0 !important;
          width: 240px;
        }
        .audit-range-picker .ant-picker-input > input {
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default AuditLogsPage;
