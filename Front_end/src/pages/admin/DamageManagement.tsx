import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Table, Tag, Button, Input, Select, Modal, Form, Upload, message, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DamageRecord {
  id: string;
  roomNumber: string;
  itemName: string;
  reportedBy: string;
  date: string;
  status: 'PENDING' | 'COMPENSATED' | 'CANCELLED';
  price: number;
  image?: string;
  description: string;
}

const DamageManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const dummyData: DamageRecord[] = [
    {
      id: '1',
      roomNumber: '101',
      itemName: 'Crystal Vase',
      reportedBy: 'John Staff',
      date: '2024-03-20',
      status: 'PENDING',
      price: 150,
      description: 'Broken during cleaning',
    },
    {
      id: '2',
      roomNumber: 'V-02',
      itemName: 'Smart TV Remote',
      reportedBy: 'Sarah Staff',
      date: '2024-03-18',
      status: 'COMPENSATED',
      price: 45,
      description: 'Lost by guest',
    },
  ];

  const columns: ColumnsType<DamageRecord> = [
    {
      title: 'Room',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (text) => <span className="font-bold text-primary">{text}</span>,
    },
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Reported By',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span className="font-semibold text-red-500">${price}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'COMPENSATED') color = 'green';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button type="text" icon={<CheckCircle2 size={18} className="text-green-500" />} title="Compensate" />
          <Button type="text" icon={<RefreshCw size={18} className="text-blue-500" />} title="Return to Room" />
          <Button type="text" icon={<XCircle size={18} className="text-red-500" />} title="Cancel" />
        </div>
      ),
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl">Damage & Compensation</h1>
          <p className="text-muted mt-1">Track and manage damaged or lost hotel assets</p>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={() => setIsModalOpen(true)}
          className="btn-gold h-12"
        >
          Report Damage
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Pending Reports</p>
            <p className="text-3xl font-bold text-title mt-1">12</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Total Compensation</p>
            <p className="text-3xl font-bold text-title mt-1">$2,450</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <RefreshCw size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Restored Items</p>
            <p className="text-3xl font-bold text-title mt-1">45</p>
          </div>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search by room or item..." 
            className="max-w-md h-12 rounded-xl"
          />
          <Select 
            placeholder="Filter by Status" 
            className="w-48 h-12"
            options={[
              { value: 'PENDING', label: 'Pending' },
              { value: 'COMPENSATED', label: 'Compensated' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>
        <Table 
          columns={columns} 
          dataSource={dummyData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="custom-table"
        />
      </div>

      <Modal
        title={<span className="text-2xl">Report Damage / Loss</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" className="btn-gold">Submit Report</Button>
        ]}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Room Number" name="roomNumber" required>
              <Input placeholder="e.g. 101" />
            </Form.Item>
            <Form.Item label="Item Name" name="itemName" required>
              <Input placeholder="e.g. TV Remote" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Compensation Price" name="price">
              <InputNumber prefix="$" min={0} step={0.01} className="w-full" />
            </Form.Item>
            <Form.Item label="Date" name="date">
              <Input type="date" />
            </Form.Item>
          </div>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Describe the damage or loss..." className="rounded-xl" />
          </Form.Item>
          <Form.Item label="Evidence Image">
            <Upload.Dragger className="rounded-2xl">
              <p className="ant-upload-drag-icon">
                <ImageIcon size={40} className="mx-auto text-primary" />
              </p>
              <p className="ant-upload-text font-bold text-title">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint text-muted">Support for high-quality images</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default DamageManagement;
