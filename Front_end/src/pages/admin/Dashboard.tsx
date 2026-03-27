import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Bell,
  Clock
} from 'lucide-react';
import { Table, Badge } from 'antd';
import { MOCK_BOOKINGS, MOCK_ROOMS } from '../../constants/mockData';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$124,500', icon: DollarSign, trend: '+12.5%', isUp: true },
    { label: 'Active Bookings', value: '42', icon: CalendarCheck, trend: '+5.2%', isUp: true },
    { label: 'Total Guests', value: '1,280', icon: Users, trend: '-2.4%', isUp: false },
    { label: 'Occupancy Rate', value: '88%', icon: TrendingUp, trend: '+8.1%', isUp: true },
  ];

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-bold text-primary">{text}</span>,
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
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (val: number) => <span className="font-bold">${val}</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.trend} {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-display font-bold text-white">Recent Bookings</h3>
            <button className="text-sm text-primary font-bold hover:underline">View All</button>
          </div>
          <Table 
            columns={columns} 
            dataSource={MOCK_BOOKINGS} 
            pagination={false}
            rowKey="id"
          />
        </div>

        {/* Notifications / Activity */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-display font-bold text-white mb-8">Live Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'New Booking', desc: 'John Doe booked Deluxe King', time: '2 mins ago', icon: Bell },
              { title: 'Check-out', desc: 'Room 102 has been vacated', time: '15 mins ago', icon: Clock },
              { title: 'System Update', desc: 'Inventory sync completed', time: '1 hour ago', icon: TrendingUp },
            ].map((activity, idx) => (
              <div key={idx} className="flex space-x-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-primary shrink-0">
                  <activity.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{activity.title}</h4>
                  <p className="text-xs text-gray-400 mb-1">{activity.desc}</p>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
