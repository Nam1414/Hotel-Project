import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      message.error('Đường dẫn không hợp lệ!');
      navigate('/login');
    }
  }, [token, email, navigate]);

  const handleFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu không khớp!');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/api/Auth/reset-password', {
        email,
        token,
        newPassword: values.password
      });
      message.success('Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.');
      navigate('/login');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra hoặc link đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-c6a4d27ce66b?auto=format&fit=crop&q=80"
          alt="Hotel Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20">
            <Lock className="text-black" size={32} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-wide">Mật Khẩu Mới</h2>
          <p className="text-gray-400">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <Form layout="vertical" onFinish={handleFinish} className="space-y-6">
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<Lock className="text-gray-400 mr-2" size={18} />}
              placeholder="Mật khẩu mới"
              className="h-14 bg-white/5 border-white/10 text-white hover:border-yellow-500/50 focus:border-yellow-500 focus:bg-white/10 transition-all rounded-xl text-lg"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' }
            ]}
          >
            <Input.Password
              prefix={<Lock className="text-gray-400 mr-2" size={18} />}
              placeholder="Xác nhận mật khẩu"
              className="h-14 bg-white/5 border-white/10 text-white hover:border-yellow-500/50 focus:border-yellow-500 focus:bg-white/10 transition-all rounded-xl text-lg"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 border-none text-black font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'ĐỔI MẬT KHẨU'}
          </Button>
        </Form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
