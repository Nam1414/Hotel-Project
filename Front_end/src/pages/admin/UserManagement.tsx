import React, { useState } from 'react';
import { Table, Badge, Button, Input, Modal, Form, Select, Space, Tag } from 'antd';
import { Search, Plus, Edit2, Lock, Unlock, Mail, Phone } from 'lucide-react';
import { MOCK_USERS } from '../../constants/mockData';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {record.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-title">{record.name}</div>
            <div className="text-xs text-muted">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'gold' : role === 'STAFF' ? 'blue' : 'default'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'active' ? 'success' : 'error'} text={<span className="text-gray-400 capitalize">{status}</span>} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button type="text" icon={<Edit2 size={16} className="text-primary" />} />
          <Button 
            type="text" 
            icon={record.status === 'active' ? <Lock size={16} className="text-red-400" /> : <Unlock size={16} className="text-green-400" />} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl">User Management</h1>
          <p className="text-muted mt-1">Manage staff accounts and system permissions</p>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={() => setIsModalOpen(true)}
          className="btn-gold h-12"
        >
          Add New User
        </Button>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search by name, email..." 
            className="max-w-md h-12 rounded-xl"
          />
        </div>
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="custom-table"
        />
      </div>

      <Modal
        title={<span className="text-2xl">Add New User</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={500}
      >
        <Form form={form} layout="vertical" className="mt-8">
          <div className="space-y-6">
            <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Enter full name" className="h-12 rounded-xl" />
            </Form.Item>
            <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Enter email" className="h-12 rounded-xl" />
            </Form.Item>
            <Form.Item label="Role" name="role" rules={[{ required: true }]}>
              <Select 
                placeholder="Select role"
                className="h-12"
                options={[
                  { value: 'USER', label: 'USER' },
                  { value: 'STAFF', label: 'STAFF' },
                  { value: 'ADMIN', label: 'ADMIN' },
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex gap-4 mt-10">
            <Button onClick={() => setIsModalOpen(false)} className="flex-grow h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold tracking-wider text-xs uppercase">Cancel</Button>
            <Button type="primary" className="flex-grow h-12 btn-gold">Create User</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
