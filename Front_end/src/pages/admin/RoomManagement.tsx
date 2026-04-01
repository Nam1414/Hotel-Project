import React, { useState } from 'react';
import { 
  Bed, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Copy, 
  Layers, 
  Building, 
  LayoutGrid, 
  List as ListIcon,
  CheckCircle2,
  XCircle,
  Package,
  RefreshCw,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, Tag, Button, Input, Select, Modal, Form, Upload, message, Tabs, InputNumber, Checkbox, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface RoomInventoryItem {
  id: string;
  name: string;
  quantity: number;
  status: 'GOOD' | 'DAMAGED' | 'MISSING';
}

interface RoomRecord {
  id: string;
  roomNumber: string;
  floor: string;
  type: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  price: number;
  image: string;
  inventory: RoomInventoryItem[];
}

const RoomManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomRecord | null>(null);
  const [form] = Form.useForm();

  const dummyRooms: RoomRecord[] = [
    {
      id: '1',
      roomNumber: '101',
      floor: '1',
      type: 'Deluxe Suite',
      status: 'AVAILABLE',
      price: 250,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
      inventory: [
        { id: 'i1', name: 'Smart TV', quantity: 1, status: 'GOOD' },
        { id: 'i2', name: 'Coffee Maker', quantity: 1, status: 'GOOD' },
        { id: 'i3', name: 'Mini Fridge', quantity: 1, status: 'GOOD' },
      ]
    },
    {
      id: '2',
      roomNumber: '102',
      floor: '1',
      type: 'Standard Room',
      status: 'OCCUPIED',
      price: 150,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      inventory: [
        { id: 'i1', name: 'Smart TV', quantity: 1, status: 'GOOD' },
        { id: 'i4', name: 'Kettle', quantity: 1, status: 'GOOD' },
      ]
    },
    {
      id: '3',
      roomNumber: 'V-01',
      floor: 'G',
      type: 'Villa',
      status: 'MAINTENANCE',
      price: 850,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      inventory: [
        { id: 'i1', name: 'Smart TV', quantity: 3, status: 'GOOD' },
        { id: 'i5', name: 'Private Pool Pump', quantity: 1, status: 'GOOD' },
        { id: 'i6', name: 'Wine Cooler', quantity: 1, status: 'GOOD' },
      ]
    },
  ];

  const columns: ColumnsType<RoomRecord> = [
    {
      title: 'Room',
      key: 'room',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <img src={record.image} alt={record.roomNumber} className="w-12 h-12 rounded-lg object-cover" />
          <div>
            <p className="font-bold text-primary">Room {record.roomNumber}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{record.type}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Floor',
      dataIndex: 'floor',
      key: 'floor',
      render: (floor) => <Tag className="rounded-full px-3">Floor {floor}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span className="font-semibold">${price}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'OCCUPIED') color = 'blue';
        if (status === 'CLEANING') color = 'orange';
        if (status === 'MAINTENANCE') color = 'red';
        return <Tag color={color} className="rounded-md">{status}</Tag>;
      },
    },
    {
      title: 'Inventory',
      key: 'inventory',
      render: (_, record) => (
        <span className="text-xs text-slate-500">{record.inventory.length} items</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Button type="text" icon={<Edit3 size={18} className="text-blue-500" />} onClick={() => { setSelectedRoom(record); setIsModalOpen(true); }} />
          <Button type="text" icon={<Copy size={18} className="text-slate-400" />} title="Clone" />
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
          <h1 className="text-4xl">Room Management</h1>
          <p className="text-muted mt-1">Manage rooms, villas, and their internal inventory</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              <ListIcon size={20} />
            </button>
          </div>
          <Button 
            icon={<Layers size={18} />} 
            onClick={() => setIsBulkModalOpen(true)}
            className="h-12 rounded-xl border-primary text-primary hover:bg-primary/5 font-bold tracking-wider text-xs uppercase"
          >
            Bulk Create
          </Button>
          <Button 
            type="primary" 
            icon={<Plus size={18} />} 
            onClick={() => { setSelectedRoom(null); setIsModalOpen(true); }}
            className="btn-gold h-12"
          >
            Add Room
          </Button>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search by room number..." 
            className="max-w-md h-12 rounded-xl"
          />
          <Select 
            placeholder="Room Type" 
            className="w-48 h-12"
            options={[
              { value: 'Deluxe Suite', label: 'Deluxe Suite' },
              { value: 'Standard Room', label: 'Standard Room' },
              { value: 'Villa', label: 'Villa' },
            ]}
          />
          <Select 
            placeholder="Floor" 
            className="w-32 h-12"
            options={[
              { value: 'G', label: 'Ground' },
              { value: '1', label: 'Floor 1' },
              { value: '2', label: 'Floor 2' },
            ]}
          />
        </div>

        {viewMode === 'table' ? (
          <Table 
            columns={columns} 
            dataSource={dummyRooms} 
            rowKey="id"
            className="custom-table"
          />
        ) : (
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {dummyRooms.map((room) => (
              <motion.div 
                key={room.id}
                whileHover={{ y: -5 }}
                className="admin-card !p-0 overflow-hidden"
              >
                <div className="relative h-48">
                  <img src={room.image} alt={room.roomNumber} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4">
                    <Tag color={room.status === 'AVAILABLE' ? 'green' : 'blue'} className="m-0 shadow-sm font-bold px-3 py-0.5 rounded-full">
                      {room.status}
                    </Tag>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-title">Room {room.roomNumber}</h3>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">{room.type}</p>
                    </div>
                    <span className="text-xl font-bold text-title">${room.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted font-medium">
                    <span className="flex items-center"><Building size={14} className="mr-2 text-primary" /> Floor {room.floor}</span>
                    <span className="flex items-center"><Package size={14} className="mr-2 text-primary" /> {room.inventory.length} Items</span>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button className="flex-1 h-10 rounded-xl font-bold tracking-wider text-[10px] uppercase" onClick={() => { setSelectedRoom(room); setIsModalOpen(true); }}>Edit</Button>
                    <Button type="primary" className="flex-1 h-10 rounded-xl btn-gold">View</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Room Modal */}
      <Modal
        title={<span className="text-2xl">{selectedRoom ? 'Edit Room' : 'Add New Room'}</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" className="btn-gold">Save Changes</Button>
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" className="mt-8" initialValues={selectedRoom || {}}>
          <Tabs defaultActiveKey="basic" className="custom-tabs">
            <Tabs.TabPane tab="Basic Info" key="basic">
              <div className="grid grid-cols-2 gap-6 pt-6">
                <Form.Item label="Room Number" name="roomNumber" required>
                  <Input placeholder="e.g. 101" />
                </Form.Item>
                <Form.Item label="Room Type" name="type" required>
                  <Select options={[{ value: 'Deluxe Suite', label: 'Deluxe Suite' }, { value: 'Standard Room', label: 'Standard Room' }, { value: 'Villa', label: 'Villa' }]} />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Form.Item label="Floor" name="floor" required>
                  <Input placeholder="e.g. 1" />
                </Form.Item>
                <Form.Item label="Price per Night ($)" name="price" required>
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </div>
              <Form.Item label="Room Images">
                <Upload.Dragger className="rounded-2xl">
                  <p className="ant-upload-drag-icon">
                    <ImageIcon size={40} className="mx-auto text-primary" />
                  </p>
                  <p className="ant-upload-text font-bold text-title">Upload room photos</p>
                  <p className="ant-upload-hint text-muted">Click or drag files to this area to upload</p>
                </Upload.Dragger>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Inventory" key="inventory">
              <div className="pt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-title">Room Inventory</h3>
                  <div className="flex gap-3">
                    <Button size="small" icon={<RefreshCw size={14} />} className="rounded-lg font-bold text-[10px] uppercase">Sync with Warehouse</Button>
                    <Button size="small" icon={<Copy size={14} />} className="rounded-lg font-bold text-[10px] uppercase">Clone from Template</Button>
                  </div>
                </div>
                <div className="admin-card !p-0 overflow-hidden border border-slate-100 dark:border-slate-800">
                  <Table 
                    size="small"
                    pagination={false}
                    columns={[
                      { title: 'Item Name', dataIndex: 'name', key: 'name', render: (t) => <span className="font-bold text-title">{t}</span> },
                      { title: 'Qty', dataIndex: 'quantity', key: 'quantity', render: (q) => <span className="font-medium">{q}</span> },
                      { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'GOOD' ? 'green' : 'red'} className="font-bold text-[10px] uppercase px-2 rounded-md">{s}</Tag> },
                      { title: '', key: 'action', render: () => <Button type="text" size="small" icon={<Trash2 size={14} className="text-red-500" />} /> }
                    ]}
                    dataSource={selectedRoom?.inventory || []}
                  />
                </div>
                <Button type="dashed" block icon={<Plus size={14} />} className="h-12 rounded-xl font-bold text-xs uppercase">Add Item to Room</Button>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>

      {/* Bulk Create Modal */}
      <Modal
        title={<span className="text-2xl">Bulk Create Rooms</span>}
        open={isBulkModalOpen}
        onCancel={() => setIsBulkModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsBulkModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" className="btn-gold">Generate Rooms</Button>
        ]}
      >
        <Form layout="vertical" className="mt-8 space-y-4">
          <Form.Item label="Prefix" name="prefix" initialValue="R-">
            <Input placeholder="e.g. R-" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-6">
            <Form.Item label="Start Number" name="start" initialValue={101}>
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item label="End Number" name="end" initialValue={110}>
              <InputNumber className="w-full" />
            </Form.Item>
          </div>
          <Form.Item label="Room Type" name="type" required>
            <Select options={[{ value: 'Deluxe Suite', label: 'Deluxe Suite' }, { value: 'Standard Room', label: 'Standard Room' }]} />
          </Form.Item>
          <Form.Item label="Floor" name="floor" required>
            <Input placeholder="e.g. 1" />
          </Form.Item>
          <Divider orientation="left"><span className="text-xs font-bold uppercase tracking-widest text-muted">Template Settings</span></Divider>
          <Form.Item name="cloneInventory" valuePropName="checked" initialValue={true}>
            <Checkbox className="font-medium text-body">Clone inventory from default template</Checkbox>
          </Form.Item>
          <Form.Item name="syncWarehouse" valuePropName="checked" initialValue={true}>
            <Checkbox className="font-medium text-body">Auto-sync with warehouse stock</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default RoomManagement;
