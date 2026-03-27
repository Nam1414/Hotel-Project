import React from 'react';
import { Table, Tag, Button, Space, Switch } from 'antd';
import { Shield, Edit2, ShieldAlert } from 'lucide-react';

const RoleManagement: React.FC = () => {
  const roles = [
    { id: '1', name: 'ADMIN', permissions: ['user.manage', 'room.manage', 'booking.manage', 'inventory.manage', 'role.manage'], users: 2 },
    { id: '2', name: 'STAFF', permissions: ['booking.manage', 'room.view', 'inventory.view'], users: 8 },
    { id: '3', name: 'USER', permissions: ['room.view', 'booking.create', 'profile.view'], users: 1240 },
  ];

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="flex items-center space-x-3">
          <Shield size={20} className="text-primary" />
          <span className="font-bold text-white tracking-widest">{name}</span>
        </div>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perms: string[]) => (
        <div className="flex flex-wrap gap-2">
          {perms.map(p => <Tag key={p} color="gold" className="text-[10px] uppercase font-bold">{p}</Tag>)}
        </div>
      ),
    },
    {
      title: 'Active Users',
      dataIndex: 'users',
      key: 'users',
      render: (val: number) => <span className="text-gray-400">{val} users</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<Edit2 size={16} className="text-primary" />} />
          <Button type="text" icon={<ShieldAlert size={16} className="text-red-400" />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="glass-card p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-white">Roles & Permissions</h2>
        <button className="btn-gold">CREATE NEW ROLE</button>
      </div>
      <Table columns={columns} dataSource={roles} rowKey="id" pagination={false} />
    </div>
  );
};

export default RoleManagement;
