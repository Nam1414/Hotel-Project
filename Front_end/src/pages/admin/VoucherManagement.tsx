import React, { useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Percent,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Table, Tag, Button, Input, Select, Modal, Form, DatePicker, message, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface VoucherRecord {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minSpend: number;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
  usageCount: number;
  maxUsage: number;
}

const VoucherManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const dummyData: VoucherRecord[] = [
    {
      id: '1',
      code: 'SUMMER2024',
      type: 'PERCENTAGE',
      value: 20,
      minSpend: 500,
      expiryDate: '2024-08-31',
      status: 'ACTIVE',
      usageCount: 150,
      maxUsage: 500,
    },
    {
      id: '2',
      code: 'WELCOME100',
      type: 'FIXED',
      value: 100,
      minSpend: 1000,
      expiryDate: '2024-12-31',
      status: 'ACTIVE',
      usageCount: 45,
      maxUsage: 100,
    },
    {
      id: '3',
      code: 'EXPIRED10',
      type: 'PERCENTAGE',
      value: 10,
      minSpend: 200,
      expiryDate: '2023-12-31',
      status: 'EXPIRED',
      usageCount: 200,
      maxUsage: 200,
    },
  ];

  const columns: ColumnsType<VoucherRecord> = [
    {
      title: 'Voucher Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <span className="font-bold text-primary tracking-wider">{text}</span>
          <Button type="text" size="small" icon={<Copy size={14} className="text-slate-400" />} />
        </div>
      ),
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, record) => (
        <span className="font-semibold">
          {record.type === 'PERCENTAGE' ? `${record.value}%` : `$${record.value}`}
        </span>
      ),
    },
    {
      title: 'Min Spend',
      dataIndex: 'minSpend',
      key: 'minSpend',
      render: (val) => `$${val}`,
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{record.usageCount} / {record.maxUsage}</span>
          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${(record.usageCount / record.maxUsage) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'EXPIRED') color = 'red';
        if (status === 'INACTIVE') color = 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div className="flex items-center space-x-2">
          <Button type="text" icon={<Edit3 size={18} className="text-blue-500" />} />
          <Button type="text" icon={<Trash2 size={18} className="text-red-500" />} />
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
          <h1 className="text-4xl">Voucher Management</h1>
          <p className="text-muted mt-1">Create and manage promotional discount codes</p>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={() => setIsModalOpen(true)}
          className="btn-gold h-12"
        >
          Create Voucher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Active Vouchers</p>
            <p className="text-3xl font-bold text-title mt-1">15</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <Ticket size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Total Redemptions</p>
            <p className="text-3xl font-bold text-title mt-1">1,240</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <Percent size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Avg. Discount</p>
            <p className="text-3xl font-bold text-title mt-1">18%</p>
          </div>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search by code..." 
            className="max-w-md h-12 rounded-xl"
          />
          <Select 
            placeholder="Filter by Status" 
            className="w-48 h-12"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'EXPIRED', label: 'Expired' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />
        </div>
        <Table 
          columns={columns} 
          dataSource={dummyData} 
          rowKey="id"
          className="custom-table"
        />
      </div>

      <Modal
        title={<span className="text-2xl">Create New Voucher</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" className="btn-gold">Generate Voucher</Button>
        ]}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-8">
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Voucher Code" name="code" required>
              <Input placeholder="e.g. SUMMER2024" className="uppercase font-bold tracking-widest h-12 rounded-xl" />
            </Form.Item>
            <Form.Item label="Voucher Type" name="type" initialValue="PERCENTAGE">
              <Select options={[{ value: 'PERCENTAGE', label: 'Percentage (%)' }, { value: 'FIXED', label: 'Fixed Amount ($)' }]} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Discount Value" name="value" required>
              <InputNumber className="w-full" min={1} />
            </Form.Item>
            <Form.Item label="Min Spend ($)" name="minSpend">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Expiry Date" name="expiryDate" required>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Max Usage" name="maxUsage" required>
              <InputNumber className="w-full" min={1} />
            </Form.Item>
          </div>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Briefly describe the voucher terms..." className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default VoucherManagement;
