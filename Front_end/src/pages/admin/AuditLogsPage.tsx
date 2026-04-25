import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Empty, Input, Select, Space, Spin, Tag, Typography, message, Table, ConfigProvider } from 'antd';
import { Download, History, User as UserIcon, Calendar, Filter, Search, RefreshCw } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { adminApi } from '../../services/adminApi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

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
  const [searchText, setSearchText] = useState('');
  const [userFilter, setUserFilter] = useState<string | undefined>();
  const [entityType, setEntityType] = useState<string | undefined>();
  const [actionType, setActionType] = useState<string | undefined>();
  const [usersList, setUsersList] = useState<any[]>([]);
  // Default to last 7 days
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')]);

  const load = async () => {
    setLoading(true);
    try {
      const query: any = {};
      const finalSearch = [userFilter, searchText].filter(Boolean).join(' ').trim();
      if (finalSearch) query.search = finalSearch;
      if (entityType) query.entityType = entityType;
      if (actionType) query.actionType = actionType;
      
      // Ensure "To" date includes the full day (23:59:59)
      if (range?.[0]) query.from = range[0].startOf('day').toISOString();
      if (range?.[1]) query.to = range[1].endOf('day').toISOString();
      
      const [result, usersResult] = await Promise.allSettled([
        adminApi.getAuditLogs(query),
        adminApi.getUsers()
      ]);

      if (result.status === 'rejected') {
        throw result.reason;
      }

      const users = usersResult.status === 'fulfilled' ? usersResult.value : [];

      // Handle both PascalCase and camelCase response from backend
      const normalized = {
        totalEvents: (result.value as any).totalEvents ?? (result.value as any).TotalEvents ?? 0,
        events: (result.value as any).events ?? (result.value as any).Events ?? []
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

  const resetFilters = () => {
    setSearchText('');
    setUserFilter(undefined);
    setEntityType(undefined);
    setActionType(undefined);
    setRange([dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')]);
    message.info('Đã đặt lại bộ lọc');
  };

  // Reactive loading
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 400); // Debounce
    return () => clearTimeout(timer);
  }, [searchText, userFilter, entityType, actionType, range]);

  const eventsList = Array.isArray(data?.events) ? data.events : [];

  const groupedData = useMemo<GroupedRow[]>(() => {
    const map = new Map<string, AuditLogEvent[]>();
    
    [...eventsList].sort((a, b) => new Date(b.timestamp.endsWith('Z') ? b.timestamp : `${b.timestamp}Z`).getTime() - new Date(a.timestamp.endsWith('Z') ? a.timestamp : `${a.timestamp}Z`).getTime()).forEach(event => {
      const utcTimestamp = event.timestamp.endsWith('Z') ? event.timestamp : `${event.timestamp}Z`;
      const date = dayjs(utcTimestamp).format('DD/MM/YYYY');
      const user = event.userName || 'System';
      const key = `${date}-${user}`;
      
      const existing = map.get(key) || [];
      existing.push({ ...event, timestamp: utcTimestamp });
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
      { 
        title: 'Giờ', 
        dataIndex: 'timestamp', 
        key: 'time', 
        render: (t: string) => {
          const utcTime = t.endsWith('Z') ? t : `${t}Z`;
          return (
            <div className="flex flex-col">
              <span className="font-medium text-title">{dayjs(utcTime).format('HH:mm:ss')}</span>
              <span className="text-[10px] text-muted">{dayjs(utcTime).fromNow()}</span>
            </div>
          );
        }, 
        width: 150 
      },
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
        <Card className="glass-card !border-none !shadow-sm" styles={{ body: { padding: '16px 20px' } }}>
          <div className="flex flex-col gap-4">
            {/* Top Row: Main Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Input
                placeholder="Tìm kiếm nội dung..."
                style={{ width: 260 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="custom-input-luxury"
                prefix={<Search size={16} className="text-muted" />}
              />

              <Select
                placeholder="Nhân viên thực hiện"
                style={{ width: 220 }}
                allowClear
                value={userFilter}
                onChange={setUserFilter}
                options={[
                  { label: 'Tất cả nhân viên', value: undefined },
                  ...usersList.map(u => ({ label: u.fullName || u.email, value: u.fullName }))
                ]}
                className="custom-select-luxury"
              />

              <Select
                placeholder="Hành động"
                style={{ width: 160 }}
                allowClear
                value={actionType}
                onChange={setActionType}
                options={[
                  { label: 'Tạo (CREATE)', value: 'CREATE' },
                  { label: 'Cập nhật (UPDATE)', value: 'UPDATE' },
                  { label: 'Xóa (DELETE)', value: 'DELETE' },
                  { label: 'Đăng nhập (LOGIN)', value: 'LOGIN' },
                ]}
                className="custom-select-luxury"
              />

              <Select
                placeholder="Phân loại đối tượng"
                style={{ width: 180 }}
                allowClear
                value={entityType}
                onChange={setEntityType}
                options={[
                  { label: 'Phòng (Room)', value: 'Room' },
                  { label: 'Loại phòng', value: 'RoomType' },
                  { label: 'Đơn đặt phòng', value: 'Booking' },
                  { label: 'Hóa đơn', value: 'Invoice' },
                  { label: 'Vật tư/Thiết bị', value: 'Equipment' },
                  { label: 'Tài khoản (User)', value: 'User' },
                  { label: 'Dịch vụ', value: 'Service' },
                ]}
                className="custom-select-luxury"
              />

              <Button 
                type="text" 
                icon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />} 
                onClick={resetFilters} 
                className="text-primary hover:bg-primary/5 font-bold ml-auto flex items-center gap-2"
              >
                Đặt lại & Làm mới
              </Button>
            </div>

            {/* Bottom Row: Time Filters */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-luxury/30">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-xl border border-primary/20">
                <Calendar size={14} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Khoảng thời gian:</span>
                <RangePicker
                  variant="borderless"
                  value={range as unknown as [Dayjs, Dayjs] | null}
                  onChange={(values) => setRange(values as [Dayjs | null, Dayjs | null] | null)}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  className="audit-range-picker !w-[220px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select
                  placeholder="Tháng"
                  style={{ width: 110 }}
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
                  style={{ width: 100 }}
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
              </div>

              <div className="ml-auto text-[11px] text-muted font-medium italic">
                * Tự động cập nhật sau 0.4s khi thay đổi bộ lọc
              </div>
            </div>
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
