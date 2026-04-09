import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { App, Button, Form, Input, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { amenityApi, type AmenityDto } from '../../services/amenityApi';
import { usePermission } from '../../hooks/useAppStore';

const AmenitiesPage: React.FC = () => {
  const { message } = App.useApp();
  const canManageAmenities = usePermission('MANAGE_ROOMS');
  const [amenities, setAmenities] = useState<AmenityDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AmenityDto | null>(null);
  const [form] = Form.useForm();

  const loadAmenities = async () => {
    setLoading(true);
    try {
      setAmenities(await amenityApi.getAll());
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the tai danh sach tien nghi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAmenities();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record: AmenityDto) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const submit = async (values: { name: string; iconUrl?: string }) => {
    try {
      if (editing) {
        await amenityApi.update(editing.id, values);
        message.success('Da cap nhat tien nghi');
      } else {
        await amenityApi.create(values);
        message.success('Da tao tien nghi');
      }
      setOpen(false);
      form.resetFields();
      await loadAmenities();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the luu tien nghi');
    }
  };

  const removeAmenity = async (record: AmenityDto) => {
    try {
      await amenityApi.delete(record.id);
      message.success('Da xoa tien nghi');
      await loadAmenities();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the xoa tien nghi');
    }
  };

  const columns: ColumnsType<AmenityDto> = [
    { title: 'Name', dataIndex: 'name', render: (value: string) => <span className="font-bold text-title">{value}</span> },
    { title: 'Icon URL', dataIndex: 'iconUrl', render: (value?: string | null) => value || '-' },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {canManageAmenities ? <Button type="text" icon={<Edit3 size={16} className="text-blue-500" />} onClick={() => openEdit(record)} /> : null}
          {canManageAmenities ? <Button type="text" icon={<Trash2 size={16} className="text-red-500" />} onClick={() => removeAmenity(record)} /> : null}
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl">Amenities</h1>
          <p className="text-muted mt-1">Quan ly danh muc tien nghi cua phong tu backend</p>
        </div>
        {canManageAmenities ? <Button type="primary" className="btn-gold h-12" icon={<Plus size={16} />} onClick={openCreate}>
          New Amenity
        </Button> : null}
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <Table rowKey="id" columns={columns} dataSource={amenities} loading={loading} className="custom-table" />
      </div>

      <Modal open={open} title={editing ? 'Cap nhat tien nghi' : 'Tao tien nghi moi'} onCancel={() => setOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={submit} className="mt-6">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Nhap ten tien nghi' }]}>
            <Input className="h-12 rounded-xl" />
          </Form.Item>
          <Form.Item name="iconUrl" label="Icon URL">
            <Input className="h-12 rounded-xl" />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="btn-gold">
              {editing ? 'Save' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default AmenitiesPage;
