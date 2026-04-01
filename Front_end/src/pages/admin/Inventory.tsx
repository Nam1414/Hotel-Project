import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Download, 
  Upload as UploadIcon,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Table, Tag, Button, Input, Select, Modal, Form, Upload, message, InputNumber, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface InventoryItem {
  id: string;
  image: string;
  name: string;
  unit: string;
  total: number;
  inStock: number;
  inUse: number;
  damaged: number;
  compensationPrice: number;
  category: string;
}

const Inventory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();

  const dummyData: InventoryItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200',
      name: 'Premium White Towel',
      unit: 'pcs',
      total: 500,
      inStock: 350,
      inUse: 140,
      damaged: 10,
      compensationPrice: 15,
      category: 'Linens',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=200',
      name: 'Smart TV Remote',
      unit: 'pcs',
      total: 50,
      inStock: 10,
      inUse: 38,
      damaged: 2,
      compensationPrice: 45,
      category: 'Electronics',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?auto=format&fit=crop&q=80&w=200',
      name: 'Mini Bar - Red Wine',
      unit: 'bottle',
      total: 100,
      inStock: 85,
      inUse: 15,
      damaged: 0,
      compensationPrice: 35,
      category: 'Food & Beverage',
    },
  ];

  const columns: ColumnsType<InventoryItem> = [
    {
      title: 'Item',
      key: 'item',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img src={record.image} alt={record.name} className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <p className="font-bold text-primary">{record.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{record.category}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (val) => <span className="font-bold">{val}</span>,
    },
    {
      title: 'In Stock',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (val, record) => (
        <Tag color={val < record.total * 0.2 ? 'red' : 'green'} className="rounded-full px-3">
          {val}
        </Tag>
      ),
    },
    {
      title: 'In Use',
      dataIndex: 'inUse',
      key: 'inUse',
    },
    {
      title: 'Damaged',
      dataIndex: 'damaged',
      key: 'damaged',
      render: (val) => <span className={val > 0 ? 'text-red-500 font-bold' : ''}>{val}</span>,
    },
    {
      title: 'Comp. Price',
      dataIndex: 'compensationPrice',
      key: 'compensationPrice',
      render: (val) => <span className="font-semibold text-amber-600">${val}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button type="text" icon={<Edit3 size={18} className="text-blue-500" />} onClick={() => { setSelectedItem(record); setIsModalOpen(true); }} />
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
          <h1 className="text-4xl">Warehouse Inventory</h1>
          <p className="text-muted mt-1">Manage hotel supplies, assets, and stock levels</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button icon={<Download size={18} />} className="h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold tracking-wider text-[10px] uppercase">Export</Button>
          <Button icon={<UploadIcon size={18} />} className="h-12 rounded-xl border-slate-200 dark:border-slate-700 font-bold tracking-wider text-[10px] uppercase">Import</Button>
          <Button 
            type="primary" 
            icon={<Plus size={18} />} 
            onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
            className="btn-gold h-12"
          >
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <Package size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Total Items</p>
            <p className="text-3xl font-bold text-title mt-1">1,240</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Low Stock</p>
            <p className="text-3xl font-bold text-title mt-1">12</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            <ArrowUpRight size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Inbound (MoM)</p>
            <p className="text-3xl font-bold text-title mt-1">+15%</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <Bell size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Pending Orders</p>
            <p className="text-3xl font-bold text-title mt-1">5</p>
          </div>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search items..." 
            className="max-w-md h-12 rounded-xl"
          />
          <Select 
            placeholder="Category" 
            className="w-48 h-12"
            options={[
              { value: 'Linens', label: 'Linens' },
              { value: 'Electronics', label: 'Electronics' },
              { value: 'Food & Beverage', label: 'Food & Beverage' },
              { value: 'Toiletries', label: 'Toiletries' },
            ]}
          />
          <Select 
            placeholder="Stock Status" 
            className="w-48 h-12"
            options={[
              { value: 'IN_STOCK', label: 'In Stock' },
              { value: 'LOW_STOCK', label: 'Low Stock' },
              { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
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
        title={<span className="text-2xl">{selectedItem ? 'Edit Item' : 'Add New Item'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" className="btn-gold">Save Item</Button>
        ]}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-8 space-y-4" initialValues={selectedItem || {}}>
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Item Name" name="name" required>
              <Input placeholder="e.g. Premium Towel" />
            </Form.Item>
            <Form.Item label="Category" name="category" required>
              <Select options={[{ value: 'Linens', label: 'Linens' }, { value: 'Electronics', label: 'Electronics' }]} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Form.Item label="Unit" name="unit" required>
              <Input placeholder="e.g. pcs" />
            </Form.Item>
            <Form.Item label="Total Qty" name="total" required>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="Comp. Price ($)" name="compensationPrice" required>
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Form.Item label="In Stock" name="inStock">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="In Use" name="inUse">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label="Damaged" name="damaged">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
          </div>
          <Form.Item label="Item Image">
            <Upload.Dragger className="rounded-2xl">
              <p className="ant-upload-drag-icon">
                <ImageIcon size={40} className="mx-auto text-primary" />
              </p>
              <p className="ant-upload-text font-bold text-title">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint text-muted">Support for a single or bulk upload</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default Inventory;
