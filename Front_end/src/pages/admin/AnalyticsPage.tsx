import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, Skeleton } from 'antd';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Bed, Activity, 
  ArrowUpRight, PieChart as PieIcon 
} from 'lucide-react';
import { adminApi, DashboardAnalyticsDto } from '../../services/adminApi';

const COLORS = ['#C6A96B', '#1d4ed8', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f43f5e'];

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminApi.getDashboardAnalytics();
        setData(result);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4].map(i => (
            <Col key={i} xs={24} sm={12} lg={6}><Skeleton.Button active block style={{ height: 120, borderRadius: 16 }} /></Col>
          ))}
        </Row>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-[var(--bg-main)] min-h-screen">
      <div className="flex flex-col gap-2">
        <Typography.Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Thống kê chuyên sâu
        </Typography.Title>
        <Typography.Paragraph className="text-muted text-base">
          Phân tích doanh thu, tỷ lệ lấp đầy và hiệu quả vận hành khách sạn trong 30 ngày qua.
        </Typography.Paragraph>
      </div>

      {/* Top Stats */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            <Statistic
              title={<span className="flex items-center gap-2 text-muted font-medium mb-1"><DollarSign size={16} /> Tổng doanh thu</span>}
              value={data?.totalRevenue}
              formatter={(val) => formatCurrency(Number(val))}
              valueStyle={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}
            />
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 w-fit px-2 py-1 rounded-full">
              <ArrowUpRight size={14} /> <span>12.5% tăng trưởng</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            <Statistic
              title={<span className="flex items-center gap-2 text-muted font-medium mb-1"><Users size={16} /> Tỷ lệ lấp đầy</span>}
              value={data?.occupancyRate}
              suffix="%"
              valueStyle={{ color: '#1d4ed8', fontWeight: 800, fontSize: '1.5rem' }}
            />
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 w-fit px-2 py-1 rounded-full">
              <Activity size={14} /> <span>Vận hành ổn định</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            <Statistic
              title={<span className="flex items-center gap-2 text-muted font-medium mb-1"><TrendingUp size={16} /> Chỉ số ADR</span>}
              value={data?.adr}
              formatter={(val) => formatCurrency(Number(val))}
              valueStyle={{ color: '#10b981', fontWeight: 800, fontSize: '1.5rem' }}
            />
            <div className="mt-3 text-xs text-muted font-medium">Giá phòng TB mỗi đêm</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
            <Statistic
              title={<span className="flex items-center gap-2 text-muted font-medium mb-1"><Bed size={16} /> Chỉ số RevPAR</span>}
              value={data?.revPAR}
              formatter={(val) => formatCurrency(Number(val))}
              valueStyle={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.5rem' }}
            />
            <div className="mt-3 text-xs text-muted font-medium">Doanh thu / phòng trống</div>
          </Card>
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row gutter={[24, 24]}>
        <Col span={24} lg={16}>
          <Card title={<span className="font-bold">Biểu đồ doanh thu 30 ngày</span>} className="glass-card border-none shadow-sm rounded-2xl overflow-hidden">
            <div style={{ width: '100%', height: 350, marginTop: 20 }}>
              <ResponsiveContainer>
                <AreaChart data={data?.revenueChart30Days} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(val) => `${val/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24} lg={8}>
          <Card title={<span className="font-bold">Doanh thu / Hạng phòng</span>} className="glass-card border-none shadow-sm rounded-2xl h-full">
            <div style={{ width: '100%', height: 350, marginTop: 20 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data?.revenueByRoomType}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {data?.revenueByRoomType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Charts Row */}
      <Row gutter={[24, 24]}>
        <Col span={24} lg={12}>
          <Card title={<span className="font-bold">Phân bổ trạng thái Đặt phòng</span>} className="glass-card border-none shadow-sm rounded-2xl">
            <div style={{ width: '100%', height: 350, marginTop: 20 }}>
              <ResponsiveContainer>
                <BarChart 
                  data={data?.bookingStatusDistribution} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={100}
                    tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--text-main)' }} 
                  />
                  <Tooltip cursor={{ fill: 'rgba(var(--primary-rgb), 0.05)' }} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24} lg={12}>
          <Card title={<span className="font-bold">Dịch vụ sử dụng nhiều nhất</span>} className="glass-card border-none shadow-sm rounded-2xl">
            <div style={{ width: '100%', height: 350, marginTop: 20 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data?.serviceUsage}
                    cx="50%"
                    cy="45%"
                    innerRadius={0}
                    outerRadius={100}
                    dataKey="value"
                    labelLine={true}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {data?.serviceUsage.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" iconType="rect" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsPage;
