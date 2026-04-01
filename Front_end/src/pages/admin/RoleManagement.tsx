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
          <span className="font-bold text-title tracking-widest">{name}</span>
        </div>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perms: string[]) => (
        <div className="flex flex-wrap gap-2">
          {perms.map(p => <Tag key={p} color="gold" className="text-[10px] uppercase font-bold tracking-widest">{p}</Tag>)}
        </div>
      ),
    },
    {
      title: 'Active Users',
      dataIndex: 'users',
      key: 'users',
      render: (val: number) => <span className="text-muted font-medium">{val} users</span>,
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
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl">Roles & Permissions</h1>
          <p className="text-muted mt-1">Define system access levels and user capabilities</p>
        </div>
        <Button type="primary" className="btn-gold h-12">Create New Role</Button>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={roles} 
          rowKey="id" 
          pagination={false}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default RoleManagement;
