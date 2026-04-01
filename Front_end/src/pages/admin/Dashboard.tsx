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
  Clock,
  Home,
  Package,
  UserCheck,
  Plus,
  LogIn,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Table, Badge, Button, Progress, Tooltip } from 'antd';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$124,500', icon: DollarSign, trend: '+12.5%', isUp: true, color: 'blue' },
    { label: 'Active Bookings', value: '42', icon: CalendarCheck, trend: '+5.2%', isUp: true, color: 'green' },
    { label: 'Occupancy Rate', value: '88%', icon: TrendingUp, trend: '+8.1%', isUp: true, color: 'amber' },
    { label: 'Staff Active', value: '18/24', icon: UserCheck, trend: 'Stable', isUp: true, color: 'purple' },
  ];

  const revenueData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  const roomStatusData = [
    { name: 'Available', value: 45, color: '#10b981' },
    { name: 'Occupied', value: 38, color: '#3b82f6' },
    { name: 'Cleaning', value: 12, color: '#f59e0b' },
    { name: 'Maintenance', value: 5, color: '#ef4444' },
  ];

  const recentBookings = [
    { id: 'BK-001', guest: 'John Doe', room: '101 - Deluxe King', status: 'Confirmed', amount: 250 },
    { id: 'BK-002', guest: 'Jane Smith', room: '204 - Suite', status: 'Pending', amount: 450 },
    { id: 'BK-003', guest: 'Robert Fox', room: '305 - Villa', status: 'Completed', amount: 850 },
  ];

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-bold text-primary">{text}</span>,
    },
    {
      title: 'Guest',
      dataIndex: 'guest',
      key: 'guest',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'Confirmed' ? 'success' : status === 'Completed' ? 'default' : 'processing'} 
          text={<span className="capitalize">{status}</span>} 
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => <span className="font-bold">${val}</span>,
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl">Admin Dashboard</h1>
          <p className="text-muted mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button icon={<Plus size={18} />} className="h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold tracking-wider text-xs uppercase">New Booking</Button>
          <Button type="primary" icon={<LogIn size={18} />} className="btn-gold h-12">Check-in</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="admin-card"
          >
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600`}>
                <stat.icon size={28} />
              </div>
              <div className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${stat.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.trend} {stat.isUp ? <ArrowUpRight size={12} className="ml-1" /> : <ArrowDownRight size={12} className="ml-1" />}
              </div>
            </div>
            <h3 className="text-muted text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
            <p className="text-3xl font-bold text-title">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 admin-card">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl">Revenue Overview</h2>
            <Select defaultValue="week" className="w-40 h-12" options={[{ value: 'week', label: 'This Week' }, { value: 'month', label: 'This Month' }]} />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card-bg)', color: 'var(--text-body)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#C5A059" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Status */}
        <div className="admin-card">
          <h2 className="text-2xl mb-10">Room Status</h2>
          <div className="h-[280px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomStatusData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-6">
            {roomStatusData.map((status, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-sm font-bold text-body">{status.name}</span>
                </div>
                <span className="text-lg font-bold text-title">{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 admin-card !p-0 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl">Recent Bookings</h2>
            <Button type="link" className="text-primary font-bold hover:text-primary-dark">View All <ChevronRight size={16} className="inline ml-1" /></Button>
          </div>
          <Table 
            columns={columns} 
            dataSource={recentBookings} 
            pagination={false}
            rowKey="id"
            className="custom-table"
          />
        </div>

        {/* Inventory & Staff */}
        <div className="space-y-10">
          <div className="admin-card">
            <h3 className="text-xl font-bold mb-8">Inventory Status</h3>
            <div className="space-y-10">
              <div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted font-bold uppercase tracking-widest text-xs">Linens & Towels</span>
                  <span className="font-bold text-title">85%</span>
                </div>
                <Progress percent={85} strokeColor="#C5A059" showInfo={false} strokeWidth={10} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted font-bold uppercase tracking-widest text-xs">Toiletries</span>
                  <span className="font-bold text-red-500">15%</span>
                </div>
                <Progress percent={15} strokeColor="#ef4444" showInfo={false} strokeWidth={10} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted font-bold uppercase tracking-widest text-xs">Food & Beverage</span>
                  <span className="font-bold text-title">62%</span>
                </div>
                <Progress percent={62} strokeColor="#3b82f6" showInfo={false} strokeWidth={10} />
              </div>
            </div>
            <Button block className="mt-12 h-14 rounded-xl border-slate-200 dark:border-slate-700 font-bold tracking-wider text-xs uppercase">Manage Inventory</Button>
          </div>

          <div className="admin-card">
            <h3 className="text-xl font-bold mb-8">Live Activity</h3>
            <div className="space-y-10">
              {[
                { title: 'New Booking', desc: 'John Doe booked Deluxe King', time: '2 mins ago', icon: Bell },
                { title: 'Check-out', desc: 'Room 102 has been vacated', time: '15 mins ago', icon: Clock },
                { title: 'Cleaning Done', desc: 'Room 305 is now ready', time: '1 hour ago', icon: UserCheck },
              ].map((activity, idx) => (
                <div key={idx} className="flex space-x-5">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <activity.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-title">{activity.title}</h4>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">{activity.desc}</p>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-3 block">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for Select component
const Select = ({ defaultValue, className, options }: any) => (
  <div className={`relative ${className}`}>
    <select defaultValue={defaultValue} className="w-full h-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm outline-none appearance-none">
      {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <ArrowDownRight size={14} />
    </div>
  </div>
);

export default Dashboard;
