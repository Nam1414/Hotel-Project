import React, { useEffect, useRef, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Moon,
  Sun,
  Camera,
  Lock,
  Save,
  LogOut,
  Loader2,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Switch, Tabs, message, Avatar, Badge, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { userProfileApi, UserProfileDto } from '../../services/userProfileApi';
import { useAppDispatch } from '../../hooks/useAppStore';
import { logout, updateUser } from '../../store/slices/authSlice';
import { bookingApi, type BookingResponseDto, type BookingDetailDto } from '../../services/bookingApi';
import { serviceOrderApi, type ServiceDto, type ServiceCategoryDto } from '../../services/serviceOrderApi';

type GeneralFormValues = {
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const MyBookingsTab = () => {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Service Order Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponseDto | null>(null);
  const [selectedBookingDetailId, setSelectedBookingDetailId] = useState<number | null>(null);
  
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryDto[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [orderingService, setOrderingService] = useState(false);

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(setBookings)
      .catch(err => message.error('Không thể tải danh sách đặt phòng'))
      .finally(() => setLoading(false));

    // Load services quietly for potential use
    serviceOrderApi.getCategories().then(setCategories).catch(console.error);
    serviceOrderApi.getServices().then(setServices).catch(console.error);
  }, []);

  const handleOpenServiceModal = (booking: BookingResponseDto) => {
    setSelectedBooking(booking);
    setSelectedBookingDetailId(booking.details[0]?.id || null);
    setCart({});
    setIsServiceModalOpen(true);
  };

  const handleAddToCart = (serviceId: number, change: number) => {
    setCart(prev => {
      const newVal = (prev[serviceId] || 0) + change;
      if (newVal <= 0) {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      }
      return { ...prev, [serviceId]: newVal };
    });
  };

  const handleOrderService = async () => {
    if (!selectedBookingDetailId || Object.keys(cart).length === 0) {
      return message.warning('Vui lòng chọn phòng và ít nhất một dịch vụ');
    }

    setOrderingService(true);
    try {
      await serviceOrderApi.createOrder({
        bookingDetailId: selectedBookingDetailId,
        items: Object.entries(cart).map(([serviceId, qty]) => ({
          serviceId: Number(serviceId),
          quantity: qty,
        })),
      });
      message.success('Đã gửi yêu cầu dịch vụ thành công!');
      setIsServiceModalOpen(false);
      setCart({});
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi gọi dịch vụ');
    } finally {
      setOrderingService(false);
    }
  };

  const cartTotal = Object.entries(cart).reduce((total, [serviceId, qty]) => {
    const s = services.find(x => x.id === Number(serviceId));
    return total + (s?.price || 0) * qty;
  }, 0);

  const getStatusTag = (status: number | string) => {
    const s = String(status);
    switch (s) {
      case '0': case 'Pending': return <Tag color="orange">Chờ xác nhận</Tag>;
      case '1': case 'Confirmed': return <Tag color="blue">Đã xác nhận</Tag>;
      case '2': case 'CheckedIn': return <Tag color="green">Đang lưu trú</Tag>;
      case '3': case 'CheckedOut': return <Tag color="default">Đã trả phòng</Tag>;
      case '4': case 'Cancelled': return <Tag color="red">Đã hủy</Tag>;
      default: return <Tag>{s}</Tag>;
    }
  };

  if (loading) return <div className="py-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-10">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-[var(--text-muted)]">Bạn chưa có đặt phòng nào.</p>
        <Button onClick={() => window.location.href = '/rooms'} type="primary" className="btn-gold mt-4 px-6 h-10">
          Khám phá phòng ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {bookings.map(b => (
        <div key={b.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-lg text-[var(--text-title)]">{b.bookingCode}</span>
              {getStatusTag(b.status)}
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              {b.details.length} phòng • {b.details[0]?.checkInDate.split('T')[0]} đến {b.details[b.details.length-1]?.checkOutDate.split('T')[0]}
            </div>
            <div className="text-sm">
              <span className="text-[var(--text-muted)]">Tiền cọc: </span><span className="font-semibold text-amber-600">{b.depositAmount?.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
          <div className="flex gap-2">
            {(b.status === 'CheckedIn' || String(b.status) === '2') && ( // CheckedIn
              <Button type="primary" className="rounded-xl font-medium btn-gold" onClick={() => handleOpenServiceModal(b)}>
                Gọi Dịch Vụ
              </Button>
            )}
            <Button type="default" className="rounded-xl font-medium" onClick={() => window.location.href = `/profile`}>
              Chi tiết
            </Button>
          </div>
        </div>
      ))}

      {/* Service Modal */}
      {selectedBooking && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all ${isServiceModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-title">Gọi Dịch Vụ Tại Phòng</h3>
                <p className="text-sm text-muted">Booking {selectedBooking.bookingCode}</p>
              </div>
              <button onClick={() => setIsServiceModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900/50">
              {selectedBooking.details.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-title mb-2">Chọn phòng nhận dịch vụ:</label>
                  <select 
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-title"
                    value={selectedBookingDetailId || ''}
                    onChange={e => setSelectedBookingDetailId(Number(e.target.value))}
                  >
                    {selectedBooking.details.map(d => (
                      <option key={d.id} value={d.id}>Phòng {d.roomId || '(Chưa xếp phòng)'} (Từ {d.checkInDate.split('T')[0]} đến {d.checkOutDate.split('T')[0]})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-8">
                {categories.map(cat => {
                  const catServices = services.filter(s => s.categoryId === cat.id);
                  if (catServices.length === 0) return null;
                  return (
                    <div key={cat.id}>
                      <h4 className="font-bold text-primary mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">{cat.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {catServices.map(service => (
                          <div key={service.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-title text-sm">{service.name}</div>
                              <div className="text-primary font-semibold text-sm">{service.price.toLocaleString('vi-VN')}đ {service.unit ? `/ ${service.unit}` : ''}</div>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
                              <button type="button" onClick={() => handleAddToCart(service.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 shadow-sm">-</button>
                              <span className="w-6 text-center font-bold text-sm text-title">{cart[service.id] || 0}</span>
                              <button type="button" onClick={() => handleAddToCart(service.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-500 shadow-sm">+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Tổng tạm tính</p>
                <p className="text-xl font-bold text-primary">{cartTotal.toLocaleString('vi-VN')}đ</p>
              </div>
              <Button type="primary" className="btn-gold h-12 px-8 rounded-xl text-sm" loading={orderingService} onClick={handleOrderService} disabled={cartTotal === 0}>
                Xác nhận đặt ({Object.values(cart).reduce((a, b) => a + b, 0)} món)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm<GeneralFormValues>();
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userProfileApi.getProfile();
        setProfile(data);
        form.setFieldsValue({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone ?? '',
          role: data.role ?? '',
        });
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Khong tai duoc thong tin tai khoan');
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [form]);

  const handleSaveProfile = async (values: GeneralFormValues) => {
    setSavingProfile(true);

    try {
      await userProfileApi.updateProfile({
        fullName: values.fullName.trim(),
        phone: values.phone?.trim() || '',
      });

      const nextProfile = {
        ...profile,
        fullName: values.fullName.trim(),
        phone: values.phone?.trim() || '',
      } as UserProfileDto;

      setProfile(nextProfile);
      dispatch(updateUser({ fullName: nextProfile.fullName, name: nextProfile.fullName }));
      message.success('Đã cập nhật thông tin cá nhân');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (values: PasswordFormValues) => {
    setSavingPassword(true);

    try {
      await userProfileApi.changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.resetFields();
      message.success('Da doi mat khau thanh cong');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the doi mat khau');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setUploadingAvatar(true);

    try {
      const response = await userProfileApi.uploadAvatar(file);
      const nextProfile = {
        ...profile,
        avatarUrl: response.url,
      } as UserProfileDto;

      setProfile(nextProfile);
      dispatch(updateUser({ avatar: response.url }));
      message.success('Đã cập nhật ảnh đại diện');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 pb-10"
    >
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3 space-y-8">
          <div className="admin-card text-center">
            <div className="relative inline-block mb-8">
              <Avatar
                size={140}
                src={profile?.avatarUrl || undefined}
                className="border-4 border-white dark:border-slate-800 shadow-2xl"
              >
                {profile?.fullName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-1 right-1 p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-60 disabled:hover:scale-100"
              >
                <Camera size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <h1 className="text-4xl mb-2">{profile?.fullName}</h1>
            <p className="text-muted font-medium tracking-wide uppercase text-xs mb-6">{profile?.role || 'User'}</p>
            <Badge status="success" text={<span className="text-sm font-bold text-title">Active</span>} />

            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-5 text-left">
              <div className="flex items-center space-x-4 text-body">
                <Mail size={18} className="text-primary" />
                <span className="text-sm font-medium">{profile?.email}</span>
              </div>
              <div className="flex items-center space-x-4 text-body">
                <Phone size={18} className="text-primary" />
                <span className="text-sm font-medium">{profile?.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center space-x-4 text-body">
                <Shield size={18} className="text-primary" />
                <span className="text-sm font-medium">{profile?.role || 'User'}</span>
              </div>
            </div>

            <Button
              block
              danger
              icon={<LogOut size={18} />}
              onClick={handleLogout}
              className="mt-10 h-14 rounded-xl flex items-center justify-center font-bold tracking-wider text-xs uppercase"
            >
              Dang xuat
            </Button>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="admin-card">
            <Tabs
              defaultActiveKey="1"
              className="custom-tabs"
              items={[
                {
                  key: '1',
                  label: (
                    <span className="flex items-center space-x-2 px-2 py-1">
                      <User size={18} />
                      <span>General</span>
                    </span>
                  ),
                  children: (
                    <Form form={form} layout="vertical" className="mt-10 space-y-6" onFinish={handleSaveProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                          label="Full Name"
                          name="fullName"
                          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                        >
                          <Input className="h-14 rounded-xl font-medium" />
                        </Form.Item>
                        <Form.Item label="Email Address" name="email">
                          <Input className="h-14 rounded-xl font-medium" disabled />
                        </Form.Item>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item label="Phone Number" name="phone">
                          <Input className="h-14 rounded-xl font-medium" />
                        </Form.Item>
                        <Form.Item label="Position" name="role">
                          <Input className="h-14 rounded-xl font-medium" disabled />
                        </Form.Item>
                      </div>
                      <div className="pt-4">
                        <Button
                          htmlType="submit"
                          type="primary"
                          icon={<Save size={18} />}
                          loading={savingProfile}
                          className="btn-gold h-14 px-10"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <span className="flex items-center space-x-2 px-2 py-1">
                      <Lock size={18} />
                      <span>Security</span>
                    </span>
                  ),
                  children: (
                    <Form form={passwordForm} layout="vertical" className="mt-10 space-y-6" onFinish={handleChangePassword}>
                      <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                      >
                        <Input.Password className="h-14 rounded-xl" />
                      </Form.Item>
                      <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                          { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                          { min: 6, message: 'Mat khau moi phai co it nhat 6 ky tu' },
                        ]}
                      >
                        <Input.Password className="h-14 rounded-xl" />
                      </Form.Item>
                      <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                          { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                              }

                              return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password className="h-14 rounded-xl" />
                      </Form.Item>
                      <div className="pt-4">
                        <Button htmlType="submit" type="primary" loading={savingPassword} className="btn-gold h-14 px-10">
                          Update Password
                        </Button>
                      </div>
                    </Form>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <span className="flex items-center space-x-2 px-2 py-1">
                      <Bell size={18} />
                      <span>Preferences</span>
                    </span>
                  ),
                  children: (
                    <div className="mt-10 space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Appearance</h4>
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                              {isDarkMode ? <Moon size={24} className="text-primary" /> : <Sun size={24} className="text-primary" />}
                            </div>
                            <div>
                              <p className="font-bold text-title">Dark Mode</p>
                              <p className="text-xs text-muted">Switch between light and dark themes</p>
                            </div>
                          </div>
                          <Switch checked={isDarkMode} onChange={toggleTheme} />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Avatar</h4>
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                              <Camera size={24} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-title">Cloudinary Upload</p>
                              <p className="text-xs text-muted">Cập nhật ảnh đại diện trực tiếp từ trang hồ sơ</p>
                            </div>
                          </div>
                          <Button onClick={() => fileInputRef.current?.click()} loading={uploadingAvatar} className="rounded-xl">
                            Tải ảnh
                          </Button>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: '4',
                  label: (
                    <span className="flex items-center space-x-2 px-2 py-1">
                      <Calendar size={18} />
                      <span>My Bookings</span>
                    </span>
                  ),
                  children: (
                    <MyBookingsTab />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
