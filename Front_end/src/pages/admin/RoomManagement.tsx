import React from 'react';
import { Table, Badge, Button, Space, Tag } from 'antd';
import { Edit2, Trash2, Bed, CheckCircle2, XCircle } from 'lucide-react';
import { MOCK_ROOMS } from '../../constants/mockData';

const RoomManagement: React.FC = () => {
  const columns = [
    {
      title: 'Room',
      key: 'room',
      render: (record: any) => (
        <div className="flex items-center space-x-4">
          <img src={record.image} alt={record.name} className="w-16 h-12 object-cover rounded-lg" />
          <div>
            <div className="font-bold text-white">{record.name}</div>
            <div className="text-xs text-primary uppercase tracking-tighter">{record.type}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span className="font-bold text-white">${price}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'available' ? 'success' : 'error'} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<Edit2 size={16} className="text-primary" />} />
          <Button type="text" icon={<Trash2 size={16} className="text-red-400" />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="glass-card p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-white">Room Inventory</h2>
        <button className="btn-gold flex items-center space-x-2">
          <Bed size={20} />
          <span>ADD NEW ROOM</span>
        </button>
      </div>
      <Table columns={columns} dataSource={MOCK_ROOMS} rowKey="id" />
    </div>
  );
};

export default RoomManagement;
