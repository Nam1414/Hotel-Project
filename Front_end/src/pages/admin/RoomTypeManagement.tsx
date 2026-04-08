// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { App, Button, Card, Col, Form, Image, Input, InputNumber, Modal, Row, Space, Table, Tag, Typography } from 'antd';
import { Edit2, ImagePlus, Plus, Star, Trash2 } from 'lucide-react';
import { adminApi, RoomTypeDto } from '../../services/adminApi';

const RoomTypeManagement: React.FC = () => {
  const { message } = App.useApp();
  const [roomTypes, setRoomTypes] = useState<RoomTypeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<RoomTypeDto | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<RoomTypeDto | null>(null);
  const [form] = Form.useForm();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const loadRoomTypes = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getRoomTypes();
      setRoomTypes(data);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tải danh sách hạng phòng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoomTypes();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ capacityAdults: 2, capacityChildren: 0, basePrice: 0 });
    setOpenForm(true);
  };

  const openEdit = (record: RoomTypeDto) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpenForm(true);
  };

  const submitForm = async (values: any) => {
    try {
      if (editing) {
        await adminApi.updateRoomType(editing.id, { ...editing, ...values });
        message.success('Đã cập nhật hạng phòng');
      } else {
        await adminApi.createRoomType(values);
        message.success('Đã tạo hạng phòng');
      }

      setOpenForm(false);
      loadRoomTypes();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const removeRoomType = async (record: RoomTypeDto) => {
    try {
      await adminApi.deleteRoomType(record.id);
      message.success('Đã vô hiệu hóa hạng phòng');
      loadRoomTypes();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể xóa hạng phòng');
    }
  };

  const handleUploadImage = async (file?: File) => {
    if (!galleryTarget || !file) return;

    try {
      await adminApi.uploadRoomTypeImage(galleryTarget.id, file);
      message.success('Đã tải ảnh lên');
      loadRoomTypes();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Upload ảnh thất bại');
    }
  };

  const setPrimaryImage = async (imageId: number) => {
    try {
      await adminApi.setPrimaryRoomTypeImage(imageId);
      message.success('Đã đặt ảnh chính');
      loadRoomTypes();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể đổi ảnh chính');
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      await adminApi.deleteRoomTypeImage(imageId);
      message.success('Đã xóa ảnh');
      loadRoomTypes();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể xóa ảnh');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Hạng phòng
          </Typography.Title>
          <Typography.Paragraph style={{ color: '#9ca3af', marginTop: 8 }}>
            Quản lý danh mục hạng phòng, giá, sức chứa và gallery ảnh.
          </Typography.Paragraph>
        </div>

        <Button type="primary" className="btn-gold" icon={<Plus size={16} />} onClick={openCreate}>
          Thêm hạng phòng
        </Button>
      </div>

      <Card className="glass-card">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={roomTypes}
          scroll={{ x: 900 }}
          columns={[
            {
              title: 'Hạng phòng',
              dataIndex: 'name',
              render: (value: string) => <strong>{value}</strong>,
            },
            {
              title: 'Giá cơ bản',
              dataIndex: 'basePrice',
              render: (value: number) => value.toLocaleString('vi-VN') + ' đ',
            },
            {
              title: 'Sức chứa',
              render: (_, record: RoomTypeDto) => `${record.capacityAdults} NL / ${record.capacityChildren} TE`,
            },
            {
              title: 'Thông tin',
              render: (_, record: RoomTypeDto) => (
                <Space wrap>
                  {record.bedType ? <Tag>{record.bedType}</Tag> : null}
                  {record.viewType ? <Tag color="blue">{record.viewType}</Tag> : null}
                  {record.sizeSqm ? <Tag color="purple">{record.sizeSqm} m2</Tag> : null}
                </Space>
              ),
            },
            {
              title: 'Ảnh',
              render: (_, record: RoomTypeDto) => `${record.images?.length || 0} ảnh`,
            },
            {
              title: 'Trạng thái',
              dataIndex: 'isActive',
              render: (value: boolean) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đang dùng' : 'Tạm ẩn'}</Tag>,
            },
            {
              title: 'Thao tác',
              render: (_, record: RoomTypeDto) => (
                <Space wrap>
                  <Button icon={<Edit2 size={16} />} onClick={() => openEdit(record)}>
                    Sửa
                  </Button>
                  <Button icon={<ImagePlus size={16} />} onClick={() => setGalleryTarget(record)}>
                    Ảnh
                  </Button>
                  <Button danger icon={<Trash2 size={16} />} onClick={() => removeRoomType(record)}>
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={openForm}
        title={editing ? 'Cập nhật hạng phòng' : 'Thêm hạng phòng'}
        onCancel={() => setOpenForm(false)}
        footer={null}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={submitForm}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Tên hạng phòng" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="basePrice" label="Giá cơ bản" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="capacityAdults" label="Người lớn" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="capacityChildren" label="Trẻ em" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="sizeSqm" label="Diện tích (m2)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="bedType" label="Kiểu giường">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="viewType" label="Hướng nhìn">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="slug" label="Slug">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="content" label="Nội dung chi tiết">
                <Input.TextArea rows={5} />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpenForm(false)}>Hủy</Button>
            <Button htmlType="submit" type="primary">
              {editing ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={!!galleryTarget}
        title={`Ảnh hạng phòng: ${galleryTarget?.name || ''}`}
        onCancel={() => setGalleryTarget(null)}
        footer={null}
        width={900}
      >
        <div className="space-y-4">
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(event) => handleUploadImage(event.target.files?.[0])}
          />
          <Button icon={<ImagePlus size={16} />} onClick={() => fileRef.current?.click()}>
            Tải ảnh mới
          </Button>

          <Row gutter={[16, 16]}>
            {(galleryTarget?.images || []).map((image) => (
              <Col xs={24} md={12} lg={8} key={image.id}>
                <Card>
                  <Image src={image.imageUrl} alt="room type" style={{ width: '100%', borderRadius: 12 }} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button icon={<Star size={14} />} type={image.isPrimary ? 'primary' : 'default'} onClick={() => setPrimaryImage(image.id)}>
                      {image.isPrimary ? 'Ảnh chính' : 'Đặt chính'}
                    </Button>
                    <Button danger icon={<Trash2 size={14} />} onClick={() => deleteImage(image.id)}>
                      Xóa
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default RoomTypeManagement;
