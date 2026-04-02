import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Empty, Form, Input, InputNumber, Modal, Switch, message } from 'antd';
import { Camera, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminApi, AttractionDto } from '../../services/adminApi';

type AttractionFormValues = {
  name: string;
  distanceKm?: number;
  description?: string;
  mapEmbedLink?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
};

const AttractionsPage: React.FC = () => {
  const [form] = Form.useForm<AttractionFormValues>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attractions, setAttractions] = useState<AttractionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [selectedAttractionId, setSelectedAttractionId] = useState<number | null>(null);
  const [editingAttraction, setEditingAttraction] = useState<AttractionDto | null>(null);
  const [open, setOpen] = useState(false);

  const loadAttractions = async () => {
    try {
      const data = await adminApi.getAttractions();
      setAttractions(data);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong tai duoc danh sach diem tham quan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAttractions();
  }, []);

  const sortedAttractions = useMemo(
    () => [...attractions].sort((a, b) => a.name.localeCompare(b.name)),
    [attractions]
  );

  const openCreateModal = () => {
    setEditingAttraction(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setOpen(true);
  };

  const openEditModal = (attraction: AttractionDto) => {
    setEditingAttraction(attraction);
    form.setFieldsValue({
      name: attraction.name,
      distanceKm: attraction.distanceKm ?? undefined,
      description: attraction.description ?? '',
      mapEmbedLink: attraction.mapEmbedLink ?? '',
      latitude: attraction.latitude ?? undefined,
      longitude: attraction.longitude ?? undefined,
      isActive: attraction.isActive,
    });
    setOpen(true);
  };

  const handleSubmit = async (values: AttractionFormValues) => {
    setSubmitting(true);

    try {
      const payload = {
        name: values.name.trim(),
        distanceKm: values.distanceKm,
        description: values.description?.trim() || undefined,
        mapEmbedLink: values.mapEmbedLink?.trim() || undefined,
        latitude: values.latitude,
        longitude: values.longitude,
        imageUrl: editingAttraction?.imageUrl,
      };

      if (editingAttraction) {
        await adminApi.updateAttraction(editingAttraction.id, {
          ...payload,
          isActive: values.isActive ?? true,
        });
        message.success('Da cap nhat diem tham quan');
      } else {
        await adminApi.createAttraction(payload);
        message.success('Da tao diem tham quan moi');
      }

      setOpen(false);
      form.resetFields();
      await loadAttractions();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the luu diem tham quan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (attraction: AttractionDto) => {
    try {
      await adminApi.deleteAttraction(attraction.id);
      message.success('Da xoa diem tham quan');
      await loadAttractions();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the xoa diem tham quan');
    }
  };

  const handleChooseImage = (attractionId: number) => {
    setSelectedAttractionId(attractionId);
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !selectedAttractionId) {
      return;
    }

    setUploadingId(selectedAttractionId);

    try {
      await adminApi.uploadAttractionImage(selectedAttractionId, file);
      message.success('Da tai anh diem tham quan');
      await loadAttractions();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the tai anh diem tham quan');
    } finally {
      setUploadingId(null);
      setSelectedAttractionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Diem tham quan</h2>
          <p className="mt-2 text-sm text-gray-400">Quan ly danh sach diem tham quan va upload anh len Cloudinary.</p>
        </div>
        <Button type="primary" icon={<Plus size={16} />} className="btn-gold" onClick={openCreateModal}>
          Them diem tham quan
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelected}
      />

      {sortedAttractions.length === 0 && !loading ? (
        <div className="admin-card">
          <Empty description="Chua co diem tham quan nao" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {sortedAttractions.map((attraction) => (
            <div key={attraction.id} className="admin-card overflow-hidden">
              <div className="relative h-56 overflow-hidden rounded-2xl bg-slate-900">
                {attraction.imageUrl ? (
                  <img src={attraction.imageUrl} alt={attraction.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Chua co anh
                  </div>
                )}
                <div className="absolute right-4 top-4 rounded-full bg-dark-base/80 px-3 py-1 text-xs font-semibold text-primary">
                  {attraction.isActive ? 'Dang hien thi' : 'Da an'}
                </div>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{attraction.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={16} className="text-primary" />
                    {attraction.distanceKm != null ? `${attraction.distanceKm} km` : 'Chua co khoang cach'}
                  </p>
                </div>
              </div>

              <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-300">
                {attraction.description || 'Chua co mo ta cho diem tham quan nay.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button icon={<Camera size={16} />} loading={uploadingId === attraction.id} onClick={() => handleChooseImage(attraction.id)}>
                  Tai anh
                </Button>
                <Button icon={<Pencil size={16} />} onClick={() => openEditModal(attraction)}>
                  Chinh sua
                </Button>
                <Button danger icon={<Trash2 size={16} />} onClick={() => void handleDelete(attraction)}>
                  Xoa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editingAttraction ? 'Cap nhat diem tham quan' : 'Them diem tham quan'}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ isActive: true }}>
          <Form.Item
            label="Ten diem tham quan"
            name="name"
            rules={[{ required: true, message: 'Vui long nhap ten diem tham quan' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Khoang cach (km)" name="distanceKm">
            <InputNumber className="w-full" min={0} step={0.1} />
          </Form.Item>

          <Form.Item label="Mo ta" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Map embed link" name="mapEmbedLink">
            <Input />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item label="Latitude" name="latitude">
              <InputNumber className="w-full" step={0.000001} />
            </Form.Item>
            <Form.Item label="Longitude" name="longitude">
              <InputNumber className="w-full" step={0.000001} />
            </Form.Item>
          </div>

          {editingAttraction ? (
            <Form.Item label="Trang thai" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
          ) : null}

          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpen(false)}>Huy</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {editingAttraction ? 'Luu thay doi' : 'Tao moi'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AttractionsPage;
