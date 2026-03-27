import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Space, Tag, Modal, Form, Input, Select, Popconfirm, App } from 'antd';
import { Edit2, Trash2, Bed, Plus } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const { message } = App.useApp();
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsData, typesData]: any = await Promise.all([
        axiosClient.get('/api/Rooms'),
        axiosClient.get('/api/RoomTypes')
      ]);
      setRooms(roomsData);
      setRoomTypes(typesData);
    } catch (err) {
      message.error('Không thể tải dữ liệu phòng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingRoom(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRoom(record);
    form.setFieldsValue({
      roomNumber: record.roomNumber,
      roomTypeId: record.roomTypeId,
      status: record.status,
      isActive: record.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/api/Rooms/${id}`);
      message.success('Đã xóa phòng thành công');
      fetchData();
    } catch (err) {
      message.error('Không thể xóa phòng');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingRoom) {
        await axiosClient.put(`/api/Rooms/${editingRoom.id}`, values);
        message.success('Cập nhật phòng thành công');
      } else {
        await axiosClient.post('/api/Rooms', values);
        message.success('Thêm phòng mới thành công');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Room Number',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (text: string) => <span className="font-bold text-white text-lg">{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
      render: (type: string) => <Tag color="blue" className="uppercase font-medium">{type}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Available') color = 'success';
        if (status === 'Occupied') color = 'error';
        if (status === 'Cleaning') color = 'warning';
        if (status === 'Maintenance') color = 'processing';
        return <Badge status={color as any} text={<span className="text-gray-300 capitalize">{status}</span>} />;
      },
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'YES' : 'NO'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button type="text" icon={<Edit2 size={16} className="text-primary" />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa phòng này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" icon={<Trash2 size={16} className="text-red-400" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="glass-card p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-white tracking-widest">ROOM MANAGEMENT</h2>
        <button className="btn-gold flex items-center space-x-2" onClick={handleAdd}>
          <Plus size={20} />
          <span>ADD NEW ROOM</span>
        </button>
      </div>
      <Table columns={columns} dataSource={rooms} rowKey="id" loading={loading} />

      <Modal
        title={<span className="text-white font-display text-xl">{editingRoom ? 'EDIT ROOM' : 'ADD NEW ROOM'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="luxury-modal"
        centered
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'Available', isActive: true }}>
          <Form.Item label="Room Number" name="roomNumber" rules={[{ required: true }]}>
            <Input className="input-luxury w-full" placeholder="e.g. 101" />
          </Form.Item>
          
          <Form.Item label="Room Type" name="roomTypeId" rules={[{ required: true }]}>
            <Select 
              className="luxury-select"
              options={roomTypes.map(t => ({ value: t.id, label: `${t.name} ($${t.basePrice})` }))}
            />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select 
              className="luxury-select"
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'Occupied', label: 'Occupied' },
                { value: 'Cleaning', label: 'Cleaning' },
                { value: 'Maintenance', label: 'Maintenance' }
              ]}
            />
          </Form.Item>

          {editingRoom && (
            <Form.Item label="Is Active" name="isActive">
              <Select 
                className="luxury-select"
                options={[
                  { value: true, label: 'Active' },
                  { value: false, label: 'Inactive' }
                ]}
              />
            </Form.Item>
          )}
          
          <div className="flex justify-end space-x-4 mt-8">
            <Button onClick={() => setIsModalOpen(false)} className="bg-transparent text-white border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="btn-gold">
              {editingRoom ? 'SAVE CHANGES' : 'CREATE ROOM'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManagement;
