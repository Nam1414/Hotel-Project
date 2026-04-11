import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Form, Input, Popconfirm, Select, Checkbox, Divider, App } from 'antd';
import { Shield, Edit2, ShieldAlert, Plus, Key } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const { message } = App.useApp();
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data: any = await axiosClient.get('/api/Roles');
      setRoles(data);
    } catch (err) {
      message.error('Không thể tải danh sách quyền');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const data: any = await axiosClient.get('/api/Roles/permissions');
      setAllPermissions(data);
    } catch (err) {
      console.error('Lỗi tải danh sách quyền hệ thống', err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchAllPermissions();
  }, []);

  const handleAddRole = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRole = (record: any) => {
    setEditingRole(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description
    });
    setIsModalVisible(true);
  };

  const handleOpenPermissions = (record: any) => {
    setSelectedRole(record);
    setIsPermModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/api/Roles/${id}`);
      message.success('Đã xóa vai trò thành công');
      fetchRoles();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể xóa vai trò');
    }
  };

  const handleTogglePermission = async (permissionId: number, hasPermission: boolean) => {
    try {
      if (!hasPermission) {
        // Gán quyền
        await axiosClient.post('/api/Roles/assign-permission', {
          roleId: selectedRole.id,
          permissionId: permissionId
        });
        message.success('Đã gán quyền thành công');
      } else {
        // Gỡ quyền
        await axiosClient.delete('/api/Roles/remove-permission', {
          data: {
            roleId: selectedRole.id,
            permissionId: permissionId
          }
        });
        message.success('Đã gỡ quyền thành công');
      }
      // Cập nhật local state để UI phản hồi nhanh
      fetchRoles(); // Reload to get updated permissions list
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingRole) {
        await axiosClient.put(`/api/Roles/${editingRole.id}`, values);
        message.success('Cập nhật vai trò thành công');
      } else {
        await axiosClient.post('/api/Roles', values);
        message.success('Thêm vai trò mới thành công');
      }
      setIsModalVisible(false);
      fetchRoles();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="flex items-center space-x-3">
          <Shield size={20} className="text-primary" />
          <span className="font-bold text-title tracking-widest uppercase">{name}</span>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => <span className="text-gray-400">{desc || 'No description'}</span>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perms: string[]) => (
        <div className="flex flex-wrap gap-2">
          {perms && perms.length > 0 ? (
            perms.slice(0, 3).map(p => <Tag key={p} color="gold" className="text-[10px] uppercase font-bold">{p}</Tag>)
          ) : (
            <span className="text-gray-600 text-xs italic">No permissions</span>
          )}
          {perms && perms.length > 3 && <Tag color="default">+{perms.length - 3}</Tag>}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="text" 
            title="Manage Permissions"
            icon={<Key size={16} className="text-yellow-500" />} 
            onClick={() => handleOpenPermissions(record)}
          />
          <Button 
            type="text" 
            icon={<Edit2 size={16} className="text-primary" />} 
            onClick={() => handleEditRole(record)}
          />
          <Popconfirm
            title="Xóa vai trò này?"
            description="Lưu ý: Bạn không thể xóa Role Admin hoặc Role đang có người dùng."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<ShieldAlert size={16} className="text-red-400" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="glass-card p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-title">Roles & Permissions</h2>
        <button 
          className="btn-gold flex items-center space-x-2"
          onClick={handleAddRole}
        >
          <Plus size={20} />
          <span>CREATE NEW ROLE</span>
        </button>
      </div>
      <Table 
        columns={columns} 
        dataSource={roles} 
        rowKey="id" 
        loading={loading}
        pagination={false} 
      />

      {/* Role Add/Edit Modal */}
      <Modal
        title={<span className="text-title font-display text-xl">{editingRole ? 'EDIT ROLE' : 'CREATE ROLE'}</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="luxury-modal"
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Role Name" name="name" rules={[{ required: true }]}>
            <Input className="input-luxury w-full" placeholder="e.g. MANAGER" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea className="input-luxury w-full bg-transparent border-[var(--border-color)] rounded-xl p-3 text-title focus:border-primary transition-colors h-24" placeholder="Enter role description..." />
          </Form.Item>
          
          <div className="flex justify-end space-x-4 mt-8">
            <Button onClick={() => setIsModalVisible(false)} className="border-[var(--border-color)] text-title hover:bg-black/5 dark:hover:bg-white/5">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="btn-gold">
              {editingRole ? 'SAVE CHANGES' : 'CREATE ROLE'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Permissions Management Modal */}
      <Modal
        title={
          <div className="text-title font-display">
            <div className="text-xl uppercase tracking-widest">MANAGE PERMISSIONS</div>
            <div className="text-xs text-primary mt-1">Role: {selectedRole?.name}</div>
          </div>
        }
        open={isPermModalOpen}
        onCancel={() => {
          setIsPermModalOpen(false);
          fetchRoles(); // Refresh permissions list in main table
        }}
        footer={null}
        className="luxury-modal"
        width={600}
      >
        <div className="mt-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPermissions.map(perm => {
              const isChecked = selectedRole?.permissions?.includes(perm.name);
              return (
                <div 
                  key={perm.id} 
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    isChecked ? 'border-primary/50 bg-primary/5' : 'border-white/5 bg-white/5 hover:border-white/10'
                  }`}
                  onClick={() => handleTogglePermission(perm.id, isChecked)}
                >
                  <div>
                    <div className="text-title font-bold text-sm">{perm.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase">System Permission</div>
                  </div>
                  <Checkbox checked={isChecked} className="luxury-checkbox" />
                </div>
              );
            })}
          </div>
        </div>
        <Divider className="border-white/10" />
        <div className="text-center text-gray-500 text-xs italic">
          Các thay đổi sẽ có hiệu lực ngay lập tức cho người dùng thuộc nhóm này.
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;
