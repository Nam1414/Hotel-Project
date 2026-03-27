import React from 'react';
import { Table, Badge, Button, Space, Input } from 'antd';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

const Inventory: React.FC = () => {
  const inventoryData = [
    { id: '1', name: 'Minibar - Coke', quantity: 50, status: 'In Stock' },
    { id: '2', name: 'Towel - Large', quantity: 120, status: 'In Stock' },
    { id: '3', name: 'Soap - Premium', quantity: 15, status: 'Low Stock' },
    { id: '4', name: 'Minibar - Wine', quantity: 20, status: 'In Stock' },
  ];

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-bold text-white">{text}</span>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (val: number) => <span className="text-gray-300">{val}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'In Stock' ? 'success' : 'warning'} 
          text={<span className="text-white">{status}</span>} 
        />
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <Input placeholder="Search inventory..." className="input-luxury pl-12" />
        </div>
        <button className="btn-gold flex items-center space-x-2">
          <Plus size={20} />
          <span>ADD ITEM</span>
        </button>
      </div>
      <Table columns={columns} dataSource={inventoryData} rowKey="id" />
    </div>
  );
};

export default Inventory;
