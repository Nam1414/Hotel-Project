import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Input, Modal, Form, Select, Space, Tag, Popconfirm, App } from 'antd';
import { Search, Plus, Edit2, Lock, Unlock, Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { usePermission, useAppSelector } from '../../hooks/useAppStore';

const UserManagement: React.FC = () => {
  const canManageUsers = usePermission('MANAGE_USERS');
  const [users, setUsers] = useState<any[]>([]);
  const { message } = App.useApp();
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data: any = await axiosClient.get('/api/UserManagement');
      setUsers(data);
    } catch (err) {
      message.error('Không thể lấy danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data: any = await axiosClient.get('/api/Roles');
      setRoles(data);
    } catch (err) {
      console.error('Lỗi lấy danh sách Roles', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleSaveUser = async (values: any) => {
    try {
      if (editingUser) {
        await axiosClient.put(`/api/UserManagement/${editingUser.id}`, {
          fullName: values.fullName,
          phone: values.phone,
          status: values.status,
          password: values.password || undefined
        });
        
        if (values.roleId && values.roleId !== editingUser.roleId) {
            await axiosClient.put(`/api/UserManagement/${editingUser.id}/change-role`, {
                roleId: values.roleId
            });
        }
        
        message.success('Cập nhật người dùng thành công');
      } else {
        await axiosClient.post('/api/UserManagement', {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          roleId: values.roleId,
        });
        message.success('Tạo người dùng và gửi email thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean, fullName: string, phone: string) => {
    try {
      await axiosClient.put(`/api/UserManagement/${id}`, {
        fullName,
        phone,
        status: !currentStatus
      });
      message.success(`${!currentStatus ? 'Mở khóa' : 'Khóa'} tài khoản thành công`);
      fetchUsers();
    } catch (err) {
      message.error('Lỗi khi thay đổi trạng thái');
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response: any = await axiosClient.delete(`/api/UserManagement/${id}`);
      message.success(response?.message || 'Đã khóa tài khoản thành công');
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể khóa tài khoản');
    }
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (record: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {record.fullName?.charAt(0) || '?'}
          </div>
          <div>
            <div className="font-bold text-white">{record.fullName}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (roleName: string) => (
        <Tag color={roleName === 'Admin' ? 'gold' : roleName === 'Staff' ? 'blue' : 'default'}>
          {roleName}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Badge status={status ? 'success' : 'error'} text={<span className="text-gray-400 capitalize">{status ? 'Active' : 'Locked'}</span>} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="text" 
            icon={<Edit2 size={16} className="text-primary" />} 
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <Button 
            type="text" 
            disabled={record.id.toString() === currentUserId?.toString()}
            onClick={() => handleToggleStatus(record.id, record.status, record.fullName, record.phone)}
            icon={record.status ? <Lock size={16} className={record.id.toString() === currentUserId?.toString() ? 'text-gray-600' : 'text-red-400'} /> : <Unlock size={16} className={record.id.toString() === currentUserId?.toString() ? 'text-gray-600' : 'text-green-400'} />} 
          />
          <Popconfirm title="Khoa tai khoan nay?" onConfirm={() => handleDeleteUser(record.id)} disabled={record.id.toString() === currentUserId?.toString()}>
              <Button type="text" disabled={record.id.toString() === currentUserId?.toString()} icon={<Trash2 size={16} className={record.id.toString() === currentUserId?.toString() ? 'text-gray-600' : 'text-gray-500 hover:text-red-500'} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="glass-card p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <Input placeholder="Search by name, email..." className="input-luxury pl-12" />
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setIsModalOpen(true);
          }} 
          className="btn-gold flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <Plus size={20} />
          <span>ADD NEW USER</span>
        </button>
      </div>

      <Table
        className="responsive-table"
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 840 }}
      />

      <Modal
        title={<span className="text-white font-display text-xl">{editingUser ? 'Edit User' : 'Add New User'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="luxury-modal"
        centered
        forceRender
      >
        <Form form={form} layout="vertical" className="mt-6" onFinish={handleSaveUser}>
          <Form.Item label={<span className="text-gray-400">Full Name</span>} name="fullName" rules={[{ required: true }]}>
            <Input className="input-luxury" placeholder="Enter full name" />
          </Form.Item>
          
          {!editingUser && (
            <Form.Item label={<span className="text-gray-400">Email Address</span>} name="email" rules={[{ required: true, type: 'email' }]}>
              <Input className="input-luxury" placeholder="Enter email" />
            </Form.Item>
          )}

          <Form.Item label={<span className="text-gray-400">Password</span>} name="password" rules={[{ required: !editingUser, min: 6 }]}>
            <Input.Password className="input-luxury" placeholder={editingUser ? "Enter new password (leave blank to keep current)" : "Enter password (min 6 chars)"} />
          </Form.Item>

          <Form.Item label={<span className="text-gray-400">Phone Number</span>} name="phone">
            <Input className="input-luxury" placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item label={<span className="text-gray-400">Role</span>} name="roleId" rules={[{ required: true }]}>
            <Select 
              className="luxury-select"
              placeholder="Select a role"
              options={roles.map(r => ({ value: r.id, label: r.name }))}
            />
          </Form.Item>

          {editingUser && (
            <Form.Item label={<span className="text-gray-400">Status</span>} name="status">
              <Select 
                className="luxury-select"
                disabled={editingUser.id.toString() === currentUserId?.toString()}
                options={[
                  { value: true, label: 'Active' },
                  { value: false, label: 'Locked' }
                ]}
              />
            </Form.Item>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <Button onClick={() => setIsModalOpen(false)} className="flex-grow h-12 border-white/10 text-white hover:bg-white/5">CANCEL</Button>
            <Button type="primary" htmlType="submit" className="flex-grow h-12 bg-primary border-none text-dark-base font-bold">
              {editingUser ? 'SAVE CHANGES' : 'CREATE USER'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;

