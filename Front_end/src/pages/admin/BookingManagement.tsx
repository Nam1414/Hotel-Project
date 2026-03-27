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
    <div className="glass-card p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <Input placeholder="Search bookings..." className="input-luxury pl-12" />
        </div>
        <div className="flex items-center space-x-4">
          <button className="btn-outline-gold flex items-center space-x-2">
            <Calendar size={20} />
            <span>CALENDAR VIEW</span>
          </button>
        </div>
      </div>
      <Table columns={columns} dataSource={MOCK_BOOKINGS} rowKey="id" />
    </div>
  );
};

export default BookingManagement;
