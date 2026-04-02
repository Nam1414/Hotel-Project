import React, { useState } from 'react';
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
  History,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Form, Input, Button, Switch, Tabs, Upload, message, Avatar, Badge } from 'antd';
import { useThemeStore } from '../../store/themeStore';

const Profile: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const user = {
    name: 'Admin User',
    email: 'admin@luxuryhotel.com',
    phone: '+1 234 567 890',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    lastLogin: '2026-03-31 09:45 AM',
    status: 'Active'
  };

  const activityLog = [
    { id: 1, action: 'Updated Room 101 status', time: '2 hours ago', icon: CheckCircle2, color: 'text-green-500' },
    { id: 2, action: 'Changed system settings', time: '5 hours ago', icon: AlertCircle, color: 'text-amber-500' },
    { id: 3, action: 'Logged in from New Device', time: 'Yesterday', icon: Shield, color: 'text-blue-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 pb-10"
    >
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column - Profile Summary */}
        <div className="w-full md:w-1/3 space-y-8">
          <div className="admin-card text-center">
            <div className="relative inline-block mb-8">
              <Avatar size={140} src={user.avatar} className="border-4 border-white dark:border-slate-800 shadow-2xl" />
              <button className="absolute bottom-1 right-1 p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>
            <h1 className="text-4xl mb-2">{user.name}</h1>
            <p className="text-muted font-medium tracking-wide uppercase text-xs mb-6">{user.role}</p>
            <Badge status="success" text={<span className="text-sm font-bold text-title">{user.status}</span>} />
            
            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-5 text-left">
              <div className="flex items-center space-x-4 text-body">
                <Mail size={18} className="text-primary" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center space-x-4 text-body">
                <Phone size={18} className="text-primary" />
                <span className="text-sm font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center space-x-4 text-body">
                <Shield size={18} className="text-primary" />
                <span className="text-sm font-medium">Last login: {user.lastLogin}</span>
              </div>
            </div>

            <Button block danger icon={<LogOut size={18} />} className="mt-10 h-14 rounded-xl flex items-center justify-center font-bold tracking-wider text-xs uppercase">
              Sign Out
            </Button>
          </div>

          <div className="admin-card">
            <h2 className="text-2xl mb-8 flex items-center space-x-3">
              <History size={24} className="text-primary" />
              <span>Recent Activity</span>
            </h2>
            <div className="space-y-8">
              {activityLog.map((log) => (
                <div key={log.id} className="flex space-x-4">
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0`}>
                    <log.icon size={18} className={`${log.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-title">{log.action}</p>
                    <p className="text-xs text-muted mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Settings Tabs */}
        <div className="w-full md:w-2/3">
          <div className="admin-card">
            <Tabs 
              defaultActiveKey="1"
              className="custom-tabs"
              items={[
                {
                  key: '1',
                  label: <span className="flex items-center space-x-2 px-2 py-1"><User size={18} /><span>General</span></span>,
                  children: (
                    <Form form={form} layout="vertical" className="mt-10 space-y-6" initialValues={user}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item label="Full Name" name="name" required>
                          <Input className="h-14 rounded-xl font-medium" />
                        </Form.Item>
                        <Form.Item label="Email Address" name="email" required>
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
                      <Form.Item label="Bio" name="bio">
                        <Input.TextArea rows={5} className="rounded-xl font-medium p-4" placeholder="Tell us about yourself..." />
                      </Form.Item>
                      <div className="pt-4">
                        <Button type="primary" icon={<Save size={18} />} className="btn-gold h-14 px-10">
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  )
                },
                {
                  key: '2',
                  label: <span className="flex items-center space-x-2 px-2 py-1"><Lock size={18} /><span>Security</span></span>,
                  children: (
                    <Form passwordForm={passwordForm} layout="vertical" className="mt-10 space-y-6">
                      <Form.Item label="Current Password" name="currentPassword" required>
                        <Input.Password className="h-14 rounded-xl" />
                      </Form.Item>
                      <Form.Item label="New Password" name="newPassword" required>
                        <Input.Password className="h-14 rounded-xl" />
                      </Form.Item>
                      <Form.Item label="Confirm New Password" name="confirmPassword" required>
                        <Input.Password className="h-14 rounded-xl" />
                      </Form.Item>
                      <div className="pt-4">
                        <Button type="primary" className="btn-gold h-14 px-10">
                          Update Password
                        </Button>
                      </div>
                    </Form>
                  )
                },
                {
                  key: '3',
                  label: <span className="flex items-center space-x-2 px-2 py-1"><Bell size={18} /><span>Preferences</span></span>,
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
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Notifications</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {[
                            { title: 'Email Notifications', desc: 'Receive daily reports and alerts via email' },
                            { title: 'Push Notifications', desc: 'Get real-time updates on your browser' },
                            { title: 'Booking Alerts', desc: 'Notify when new bookings are confirmed' },
                            { title: 'Inventory Alerts', desc: 'Notify when stock levels are low' },
                          ].map((pref, idx) => (
                            <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div>
                                <p className="font-bold text-title">{pref.title}</p>
                                <p className="text-xs text-muted mt-1">{pref.desc}</p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
