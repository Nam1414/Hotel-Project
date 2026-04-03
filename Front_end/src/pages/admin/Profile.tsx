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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Switch, Tabs, message, Avatar, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { userProfileApi, UserProfileDto } from '../../services/userProfileApi';
import { useAppDispatch } from '../../hooks/useAppStore';
import { logout, updateUser } from '../../store/slices/authSlice';

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
              ]}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
