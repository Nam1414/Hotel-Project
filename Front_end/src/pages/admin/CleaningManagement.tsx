import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Table, Tag, Button, Input, Select, Modal, Form, Progress, Avatar, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface CleaningTask {
  id: string;
  roomNumber: string;
  roomType: string;
  assignedStaff: string;
  status: 'CLEAN' | 'DIRTY' | 'CLEANING' | 'INSPECTED';
  progress: number;
  lastCleaned: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const CleaningManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const dummyData: CleaningTask[] = [
    {
      id: '1',
      roomNumber: '101',
      roomType: 'Deluxe Suite',
      assignedStaff: 'John Doe',
      status: 'CLEANING',
      progress: 65,
      lastCleaned: '2024-03-20 10:30',
      priority: 'HIGH',
    },
    {
      id: '2',
      roomNumber: '102',
      roomType: 'Standard Room',
      assignedStaff: 'Jane Smith',
      status: 'DIRTY',
      progress: 0,
      lastCleaned: '2024-03-19 14:00',
      priority: 'MEDIUM',
    },
    {
      id: '3',
      roomNumber: '201',
      roomType: 'Presidential Suite',
      assignedStaff: 'Mike Johnson',
      status: 'CLEAN',
      progress: 100,
      lastCleaned: '2024-03-20 09:00',
      priority: 'LOW',
    },
    {
      id: '4',
      roomNumber: '202',
      roomType: 'Deluxe Suite',
      assignedStaff: 'Sarah Wilson',
      status: 'INSPECTED',
      progress: 100,
      lastCleaned: '2024-03-20 11:30',
      priority: 'LOW',
    },
  ];

  const getStatusColor = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'clean') return 'green';
    if (s === 'dirty') return 'red';
    if (s === 'inspecting') return 'blue';
    return 'default';
  };

  const getProgress = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'clean') return 100;
    if (s === 'inspecting') return 50;
    if (s === 'dirty') return 0;
    return 0;
  };

  const updateCleaning = async (record: RoomDto, nextCleaningStatus: string, nextStatus?: string) => {
    try {
      await adminApi.updateRoomCleaningStatus(record.id, {
        cleaningStatus: nextCleaningStatus,
        status: nextStatus || record.status,
      });
      message.success('Đã cập nhật trạng thái phòng');
      loadData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const columns: ColumnsType<RoomDto> = [
    {
      title: 'Phòng',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (text) => <span className="font-bold text-primary">{text}</span>,
    },
    {
      title: 'Hạng phòng',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_, record) => (
        <div className="w-32">
          <Progress percent={getProgress(record.cleaningStatus)} size="small" strokeColor="#C6A96B" />
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'cleaningStatus',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)} className="uppercase font-bold">{status || 'CHƯA RÕ'}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Button size="small" onClick={() => updateCleaning(record, 'Dirty', 'Cleaning')}>Báo bận</Button>
          <Button size="small" onClick={() => updateCleaning(record, 'Inspecting', 'Cleaning')}>Đang dọn</Button>
          <Button size="small" type="primary" className="btn-gold" onClick={() => updateCleaning(record, 'Clean', 'Available')}>Hoàn tất</Button>
        </Space>
      ),
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl">Cleaning Management</h1>
          <p className="text-muted mt-1">Monitor and assign room cleaning tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              <ListIcon size={20} />
            </button>
          </div>
          <Button 
            type="primary" 
            icon={<Plus size={18} />} 
            onClick={() => setIsModalOpen(true)}
            className="btn-gold h-12"
          >
            Assign Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="admin-card border-l-4 border-l-red-500">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Dirty Rooms</p>
          <p className="text-3xl font-bold text-title mt-1">18</p>
        </div>
        <div className="admin-card border-l-4 border-l-blue-500">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Cleaning In Progress</p>
          <p className="text-3xl font-bold text-title mt-1">5</p>
        </div>
        <div className="admin-card border-l-4 border-l-green-500">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Clean & Ready</p>
          <p className="text-3xl font-bold text-title mt-1">42</p>
        </div>
        <div className="admin-card border-l-4 border-l-purple-500">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Awaiting Inspection</p>
          <p className="text-3xl font-bold text-title mt-1">8</p>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search by room number..." 
            className="max-w-md h-12 rounded-xl"
          />
          <Select 
            placeholder="Filter by Status" 
            className="w-48 h-12"
            options={[
              { value: 'DIRTY', label: 'Dirty' },
              { value: 'CLEANING', label: 'Cleaning' },
              { value: 'CLEAN', label: 'Clean' },
              { value: 'INSPECTED', label: 'Inspected' },
            ]}
          />
          <Select 
            placeholder="Filter by Priority" 
            className="w-48 h-12"
            options={[
              { value: 'HIGH', label: 'High' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'LOW', label: 'Low' },
            ]}
          />
        </div>

        {viewMode === 'table' ? (
          <Table 
            columns={columns} 
            dataSource={dummyData} 
            rowKey="id"
            className="custom-table"
          />
        ) : (
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dummyData.map((task) => (
              <motion.div 
                key={task.id}
                whileHover={{ y: -5 }}
                className="admin-card space-y-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-title">Room {task.roomNumber}</h3>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{task.roomType}</p>
                  </div>
                  <Tag color={getStatusColor(task.status)} className="m-0 font-bold text-[10px] uppercase px-2 rounded-md">{task.status}</Tag>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted">Progress</span>
                    <span className="font-bold text-title">{task.progress}%</span>
                  </div>
                  <Progress percent={task.progress} showInfo={false} strokeColor="#C6A96B" size="small" className="m-0" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Avatar size="small" icon={<User size={12} />} className="bg-primary/10 text-primary" />
                    <span className="text-xs font-bold text-title">{task.assignedStaff}</span>
                  </div>
                  <Tooltip title="Priority">
                    <Tag color={task.priority === 'HIGH' ? 'red' : 'blue'} className="text-[10px] font-bold uppercase m-0 px-2 rounded-md">
                      {task.priority}
                    </Tag>
                  </Tooltip>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button size="small" className="flex-1 h-10 rounded-xl font-bold tracking-wider text-[10px] uppercase">Update</Button>
                  <Button size="small" type="primary" className="flex-1 h-10 rounded-xl btn-gold">Finish</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title={<span className="text-2xl">Assign Cleaning Task</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" className="btn-gold">Assign Staff</Button>
        ]}
      >
        <Form form={form} layout="vertical" className="mt-8 space-y-4">
          <Form.Item label="Room Number" name="roomNumber" required>
            <Select placeholder="Select Room" options={[{ value: '101', label: 'Room 101' }, { value: '102', label: 'Room 102' }]} />
          </Form.Item>
          <Form.Item label="Assign Staff" name="staff" required>
            <Select placeholder="Select Staff Member" options={[{ value: '1', label: 'John Doe' }, { value: '2', label: 'Jane Smith' }]} />
          </Form.Item>
          <Form.Item label="Priority" name="priority" initialValue="MEDIUM">
            <Select options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }]} />
          </Form.Item>
          <Form.Item label="Special Instructions" name="notes">
            <Input.TextArea rows={3} placeholder="e.g. Extra towels, check minibar..." className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CleaningManagement;
