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
            <div className="font-bold text-white">{record.name}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
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
    <div className="glass-card p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <Input placeholder="Search by name, email..." className="input-luxury pl-12" />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-gold flex items-center space-x-2">
          <Plus size={20} />
          <span>ADD NEW USER</span>
        </button>
      </div>

      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={<span className="text-white font-display text-xl">Add New User</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="luxury-modal"
        centered
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item label={<span className="text-gray-400">Full Name</span>} name="name" rules={[{ required: true }]}>
            <Input className="input-luxury" placeholder="Enter full name" />
          </Form.Item>
          <Form.Item label={<span className="text-gray-400">Email Address</span>} name="email" rules={[{ required: true, type: 'email' }]}>
            <Input className="input-luxury" placeholder="Enter email" />
          </Form.Item>
          <Form.Item label={<span className="text-gray-400">Role</span>} name="role" rules={[{ required: true }]}>
            <Select 
              className="luxury-select"
              options={[
                { value: 'USER', label: 'USER' },
                { value: 'STAFF', label: 'STAFF' },
                { value: 'ADMIN', label: 'ADMIN' },
              ]}
            />
          </Form.Item>
          <div className="flex gap-4 mt-8">
            <Button onClick={() => setIsModalOpen(false)} className="flex-grow h-12 border-white/10 text-white hover:bg-white/5">CANCEL</Button>
            <Button type="primary" className="flex-grow h-12 bg-primary border-none text-dark-base font-bold">CREATE USER</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
