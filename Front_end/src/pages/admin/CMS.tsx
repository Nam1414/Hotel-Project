import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  Globe, 
  Search as SearchIcon,
  LayoutGrid,
  List as ListIcon,
  Image as ImageIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Table, Tag, Button, Input, Select, Modal, Form, Upload, message, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface PostRecord {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED';
  views: number;
  seoScore: number;
}

const CMS: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const dummyData: PostRecord[] = [
    {
      id: '1',
      title: 'Top 10 Luxury Hotels in Vietnam',
      category: 'Travel Guide',
      author: 'Admin',
      date: '2024-03-20',
      status: 'PUBLISHED',
      views: 1250,
      seoScore: 85,
    },
    {
      id: '2',
      title: 'Our New Presidential Suite is Now Open',
      category: 'News',
      author: 'Marketing',
      date: '2024-03-18',
      status: 'PUBLISHED',
      views: 850,
      seoScore: 92,
    },
    {
      id: '3',
      title: 'Summer Promotion 2024',
      category: 'Promotion',
      author: 'Admin',
      date: '2024-04-01',
      status: 'SCHEDULED',
      views: 0,
      seoScore: 78,
    },
  ];

  const columns: ColumnsType<PostRecord> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-bold text-primary">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'SEO Score',
      dataIndex: 'seoScore',
      key: 'seoScore',
      render: (score) => (
        <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>
          {score}%
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'PUBLISHED') color = 'green';
        if (status === 'SCHEDULED') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div className="flex items-center space-x-2">
          <Button type="text" icon={<Eye size={18} className="text-slate-400" />} />
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
          <h1 className="text-4xl">Content Management</h1>
          <p className="text-muted mt-1">Manage blog posts, news, and promotions</p>
        </div>
        <Button 
          type="primary" 
          icon={<Plus size={18} />} 
          onClick={() => setIsModalOpen(true)}
          className="btn-gold h-12"
        >
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Published Posts</p>
            <p className="text-3xl font-bold text-title mt-1">42</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Scheduled Posts</p>
            <p className="text-3xl font-bold text-title mt-1">8</p>
          </div>
        </div>
        <div className="admin-card flex items-center space-x-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-600">
            <Eye size={28} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Total Views</p>
            <p className="text-3xl font-bold text-title mt-1">12.5k</p>
          </div>
        </div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <Input 
            prefix={<Search size={18} className="text-slate-400" />} 
            placeholder="Search posts..." 
            className="max-w-md h-12 rounded-xl"
          />
          <Select 
            placeholder="Filter by Category" 
            className="w-48 h-12"
            options={[
              { value: 'Travel Guide', label: 'Travel Guide' },
              { value: 'News', label: 'News' },
              { value: 'Promotion', label: 'Promotion' },
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
        title={<span className="text-2xl">Create New Article</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="draft" className="btn-outline-gold">Save Draft</Button>,
          <Button key="submit" type="primary" className="btn-gold">Publish Now</Button>
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" className="mt-8">
          <Tabs defaultActiveKey="content" className="custom-tabs">
            <Tabs.TabPane tab={<span><FileText size={16} className="inline mr-2" />Content</span>} key="content">
              <div className="space-y-6 pt-6">
                <Form.Item label="Article Title" name="title" required>
                  <Input placeholder="Enter a catchy title..." className="h-14 text-xl font-bold rounded-xl" />
                </Form.Item>
                <div className="grid grid-cols-2 gap-6">
                  <Form.Item label="Category" name="category" required>
                    <Select placeholder="Select Category" options={[{ value: 'News', label: 'News' }, { value: 'Travel Guide', label: 'Travel Guide' }]} />
                  </Form.Item>
                  <Form.Item label="Author" name="author" initialValue="Admin">
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item label="Content" name="content">
                  <Input.TextArea rows={10} placeholder="Write your article content here..." className="rounded-xl" />
                </Form.Item>
                <Form.Item label="Featured Image">
                  <Upload.Dragger className="rounded-2xl">
                    <p className="ant-upload-drag-icon">
                      <ImageIcon size={40} className="mx-auto text-primary" />
                    </p>
                    <p className="ant-upload-text font-bold text-title">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint text-muted">Recommended size: 1200x630px</p>
                  </Upload.Dragger>
                </Form.Item>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span><Globe size={16} className="inline mr-2" />SEO Settings</span>} key="seo">
              <div className="space-y-6 pt-6">
                <Form.Item label="SEO Title" name="seoTitle">
                  <Input placeholder="Title for search engines..." />
                </Form.Item>
                <Form.Item label="Meta Description" name="metaDescription">
                  <Input.TextArea rows={3} placeholder="Brief summary for search results..." className="rounded-xl" />
                </Form.Item>
                <Form.Item label="Keywords" name="keywords">
                  <Input placeholder="luxury, hotel, travel, etc. (comma separated)" />
                </Form.Item>
                <Form.Item label="Canonical URL" name="canonicalUrl">
                  <Input prefix="https://" placeholder="your-hotel.com/blog/article-title" />
                </Form.Item>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CMS;
