import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Space, Input, Modal, Form, Popconfirm, App } from 'antd';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data: any = await axiosClient.get('/api/Minibar/items');
      setItems(data);
    } catch (err) {
      message.error('Không thể tải danh sách kho');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/api/Minibar/items/${id}`); // Assuming delete exists or using status update
      message.success('Đã xóa vật tư thành công');
      fetchItems();
    } catch (err) {
      message.error('Không thể xóa vật tư');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingItem) {
        await axiosClient.put(`/api/Minibar/items/${editingItem.id}`, values);
        message.success('Cập nhật thành công');
      } else {
        await axiosClient.post('/api/Minibar/items', values);
        message.success('Thêm vật tư mới thành công');
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-bold text-white uppercase tracking-wider">{text}</span>,
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
      render: (val: number) => <span className="text-primary font-bold">${val.toFixed(2)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Badge 
          status={isActive ? 'success' : 'error'} 
          text={<span className="text-white">{isActive ? 'In Stock' : 'Out of Stock'}</span>} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button type="text" icon={<Edit2 size={16} className="text-primary" />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa vật tư này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" icon={<Trash2 size={16} className="text-red-400" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="glass-card p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <Input 
            placeholder="Search inventory..." 
            className="input-luxury pl-12" 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <button className="btn-gold flex items-center space-x-2" onClick={handleAdd}>
          <Plus size={20} />
          <span>ADD ITEM</span>
        </button>
      </div>
      <Table columns={columns} dataSource={filteredItems} rowKey="id" loading={loading} />

      <Modal
        title={<span className="text-white font-display text-xl">{editingItem ? 'EDIT ITEM' : 'ADD NEW ITEM'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="luxury-modal"
        centered
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true }}>
          <Form.Item label="Item Name" name="name" rules={[{ required: true }]}>
            <input className="input-luxury w-full" placeholder="e.g. Coca Cola" />
          </Form.Item>
          <Form.Item label="Price ($)" name="price" rules={[{ required: true }]}>
            <input type="number" step="0.01" className="input-luxury w-full" placeholder="0.00" />
          </Form.Item>
          <Form.Item label="Status" name="isActive" valuePropName="checked">
            <Badge status={form.getFieldValue('isActive') ? 'success' : 'error'} />
            <span className="text-gray-400 ml-2">Active in Inventory</span>
          </Form.Item>
          <div className="flex justify-end space-x-4 mt-8">
            <Button onClick={() => setIsModalOpen(false)} className="bg-transparent text-white border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="btn-gold">
              {editingItem ? 'SAVE CHANGES' : 'CREATE ITEM'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;
