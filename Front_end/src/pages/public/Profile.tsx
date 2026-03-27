import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, Edit3, Key } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { MOCK_BOOKINGS, MOCK_ROOMS } from '../../constants/mockData';
import { Table, Badge } from 'antd';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);


  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="text-primary font-bold">{text}</span>,
    },
    {
      title: 'Room',
      dataIndex: 'roomId',
      key: 'roomId',
      render: (id: string) => MOCK_ROOMS.find(r => r.id === id)?.name || 'Unknown',
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'confirmed' ? 'success' : status === 'completed' ? 'default' : 'processing'} 
          text={<span className="text-white capitalize">{status}</span>} 
        />
      ),
    },
  ];

  return (
    <div className="bg-dark-base min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 text-center">
              <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary mx-auto mb-6 relative">
                <User size={64} />
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-dark-base rounded-full shadow-lg">
                  <Edit3 size={16} />
                </button>
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">{user?.name}</h2>
              <p className="text-primary font-medium text-sm mb-6">{user?.role}</p>
              
              <div className="space-y-4 text-left border-t border-white/5 pt-6">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail size={18} className="text-primary" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone size={18} className="text-primary" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Calendar size={18} className="text-primary" />
                  <span className="text-sm">Member since 2024</span>
                </div>
              </div>

              <button className="btn-outline-gold w-full mt-8 flex items-center justify-center space-x-2">
                <Key size={18} />
                <span>CHANGE PASSWORD</span>
              </button>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center">
                <Shield size={20} className="text-primary mr-2" />
                Security Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Two-Factor Auth</span>
                  <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded">Disabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Email Verified</span>
                  <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10">
              <h2 className="text-3xl font-display font-bold text-white mb-8">Booking History</h2>
              <Table 
                columns={columns} 
                dataSource={MOCK_BOOKINGS} 
                pagination={false}
                rowKey="id"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h4 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Total Spent</h4>
                <p className="text-3xl font-display font-bold text-primary">$1,420.00</p>
              </div>
              <div className="glass-card p-8">
                <h4 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Nights Stayed</h4>
                <p className="text-3xl font-display font-bold text-primary">6 Nights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
