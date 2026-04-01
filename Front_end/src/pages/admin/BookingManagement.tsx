import React from 'react';
import { Table, Badge, Button, Space, Input } from 'antd';
import { Search, Eye, Check, X, Calendar } from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_ROOMS } from '../../constants/mockData';

const BookingManagement: React.FC = () => {
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="text-primary font-bold">{text}</span>,
    },
    {
      title: 'Room',
      dataIndex: 'roomId',
      key: 'roomId',
      render: (id: string) => MOCK_ROOMS.find(r => r.id === id)?.name || 'Unknown',
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'confirmed' ? 'success' : status === 'completed' ? 'default' : 'processing'} 
          text={<span className="text-white capitalize">{status}</span>} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button type="text" icon={<Eye size={16} className="text-primary" />} />
          {record.status === 'confirmed' && (
            <>
              <Button type="text" icon={<Check size={16} className="text-green-400" />} />
              <Button type="text" icon={<X size={16} className="text-red-400" />} />
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl">Booking Management</h1>
          <p className="text-muted mt-1">Manage all guest reservations and check-ins</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            icon={<Calendar size={20} />} 
            className="h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold tracking-wider text-xs uppercase"
          >
            Calendar View
          </Button>
          <Button type="primary" className="btn-gold h-12">New Booking</Button>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search bookings..." 
            className="max-w-md h-12 rounded-xl"
          />
        </div>
        <Table 
          columns={columns} 
          dataSource={MOCK_BOOKINGS} 
          rowKey="id" 
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default BookingManagement;
