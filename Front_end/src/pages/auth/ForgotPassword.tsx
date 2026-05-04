import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await axiosClient.post('/api/Auth/forgot-password', { email: values.email });
      setIsSuccess(true);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
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
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại Đăng nhập
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20">
            <Mail className="text-black" size={32} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-wide">Quên Mật Khẩu</h2>
          <p className="text-gray-400">
            {isSuccess ? 'Kiểm tra hộp thư của bạn' : 'Nhập email để nhận link đặt lại mật khẩu'}
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <p className="text-green-400 text-sm">
                Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi một đường dẫn đặt lại mật khẩu. Vui lòng kiểm tra email (bao gồm cả thư mục Spam).
              </p>
            </div>
            <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-medium">
              Quay lại trang Đăng nhập
            </Link>
          </div>
        ) : (
          <Form layout="vertical" onFinish={handleFinish} className="space-y-6">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<Mail className="text-gray-400 mr-2" size={18} />}
                placeholder="Email của bạn"
                className="h-14 bg-white/5 border-white/10 text-white hover:border-yellow-500/50 focus:border-yellow-500 focus:bg-white/10 transition-all rounded-xl text-lg"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 border-none text-black font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'GỬI YÊU CẦU'}
            </Button>
          </Form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
