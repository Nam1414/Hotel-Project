import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { App, Button, Form, Input, Modal, Select, Table, Tabs, Tag, Upload } from 'antd';
import { Edit3, FileText, FolderTree, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { contentApi, type ArticleCategoryDto, type ArticleListItemDto } from '../../services/contentApi';
import { usePermission } from '../../hooks/useAppStore';

const CMS: React.FC = () => {
  const { message } = App.useApp();
  const canManageContent = usePermission('MANAGE_CONTENT');
  const [articles, setArticles] = useState<ArticleListItemDto[]>([]);
  const [categories, setCategories] = useState<ArticleCategoryDto[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleListItemDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<ArticleCategoryDto | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [articleForm] = Form.useForm();
  const [categoryForm] = Form.useForm();

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      setCategories(await contentApi.getCategories());
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the tai danh muc bai viet');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadArticles = async () => {
    setLoadingArticles(true);
    try {
      setArticles(await contentApi.getArticles());
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the tai danh sach bai viet');
    } finally {
      setLoadingArticles(false);
    }
  };

  useEffect(() => {
    void Promise.all([loadArticles(), loadCategories()]);
  }, []);

  const articleStats = useMemo(
    () => ({
      total: articles.length,
      categories: categories.length,
      withThumbnail: articles.filter((item) => item.thumbnailUrl).length,
    }),
    [articles, categories],
  );

  const openCreateArticle = () => {
    setEditingArticle(null);
    setThumbnailFile(null);
    articleForm.resetFields();
    setArticleModalOpen(true);
  };

  const openEditArticle = async (record: ArticleListItemDto) => {
    try {
      const detail = await contentApi.getArticleBySlug(record.slug);
      setEditingArticle(record);
      setThumbnailFile(null);
      articleForm.setFieldsValue({
        title: detail.title,
        content: detail.content,
        categoryId: detail.category.id,
      });
      setArticleModalOpen(true);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the tai chi tiet bai viet');
    }
  };

  const submitArticle = async (values: { title: string; content: string; categoryId: number }) => {
    try {
      if (editingArticle) {
        await contentApi.updateArticle(editingArticle.id, values);
        if (thumbnailFile) await contentApi.uploadThumbnail(editingArticle.id, thumbnailFile);
        message.success('Da cap nhat bai viet');
      } else {
        const created = await contentApi.createArticle(values);
        if (thumbnailFile) await contentApi.uploadThumbnail(created.id, thumbnailFile);
        message.success('Da tao bai viet moi');
      }

      setArticleModalOpen(false);
      setThumbnailFile(null);
      articleForm.resetFields();
      await loadArticles();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the luu bai viet');
    }
  };

  const removeArticle = async (record: ArticleListItemDto) => {
    try {
      await contentApi.deleteArticle(record.id);
      message.success('Da xoa bai viet');
      await loadArticles();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the xoa bai viet');
    }
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    categoryForm.resetFields();
    setCategoryModalOpen(true);
  };

  const openEditCategory = (record: ArticleCategoryDto) => {
    setEditingCategory(record);
    categoryForm.setFieldsValue({ name: record.name });
    setCategoryModalOpen(true);
  };

  const submitCategory = async (values: { name: string }) => {
    try {
      if (editingCategory) {
        await contentApi.updateCategory(editingCategory.id, values);
        message.success('Da cap nhat danh muc');
      } else {
        await contentApi.createCategory(values);
        message.success('Da tao danh muc');
      }

      setCategoryModalOpen(false);
      categoryForm.resetFields();
      await loadCategories();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the luu danh muc');
    }
  };

  const removeCategory = async (record: ArticleCategoryDto) => {
    try {
      await contentApi.deleteCategory(record.id);
      message.success('Da vo hieu hoa danh muc');
      await loadCategories();
      await loadArticles();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Khong the xoa danh muc');
    }
  };

  const articleColumns: ColumnsType<ArticleListItemDto> = [
    { title: 'Title', dataIndex: 'title', render: (value: string) => <span className="font-bold text-primary">{value}</span> },
    { title: 'Category', dataIndex: 'category' },
    { title: 'Author', dataIndex: 'author' },
    { title: 'Published', dataIndex: 'publishedAt', render: (value: string) => new Date(value).toLocaleDateString('vi-VN') },
    { title: 'Status', render: (_, record) => <Tag color="green">{record.thumbnailUrl ? 'Published + image' : 'Published'}</Tag> },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {canManageContent ? <Button type="text" icon={<Edit3 size={16} className="text-blue-500" />} onClick={() => openEditArticle(record)} /> : null}
          {canManageContent ? <Button type="text" icon={<Trash2 size={16} className="text-red-500" />} onClick={() => removeArticle(record)} /> : null}
        </div>
      ),
    },
  ];

  const categoryColumns: ColumnsType<ArticleCategoryDto> = [
    { title: 'Category', dataIndex: 'name', render: (value: string) => <span className="font-bold text-title">{value}</span> },
    { title: 'Articles', dataIndex: 'articleCount', render: (value?: number) => <Tag color="blue">{value || 0}</Tag> },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {canManageContent ? <Button type="text" icon={<Edit3 size={16} className="text-blue-500" />} onClick={() => openEditCategory(record)} /> : null}
          {canManageContent ? <Button type="text" icon={<Trash2 size={16} className="text-red-500" />} onClick={() => removeCategory(record)} /> : null}
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl">Content Management</h1>
          <p className="text-muted mt-1">Quan ly bai viet va danh muc bai viet tu backend hien co</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {canManageContent ? (
          <Button icon={<FolderTree size={16} />} onClick={openCreateCategory} className="h-12 rounded-xl">New Category</Button>
          ) : null}
          {canManageContent ? (
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreateArticle} className="btn-gold h-12">New Article</Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="admin-card"><p className="text-xs font-bold uppercase tracking-widest text-muted">Articles</p><p className="text-3xl font-bold text-title mt-2">{articleStats.total}</p></div>
        <div className="admin-card"><p className="text-xs font-bold uppercase tracking-widest text-muted">Categories</p><p className="text-3xl font-bold text-title mt-2">{articleStats.categories}</p></div>
        <div className="admin-card"><p className="text-xs font-bold uppercase tracking-widest text-muted">With Thumbnail</p><p className="text-3xl font-bold text-title mt-2">{articleStats.withThumbnail}</p></div>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <Tabs
          defaultActiveKey="articles"
          items={[
            {
              key: 'articles',
              label: <span className="flex items-center gap-2"><FileText size={16} />Articles</span>,
              children: <Table rowKey="id" columns={articleColumns} dataSource={articles} loading={loadingArticles} className="custom-table" />,
            },
            {
              key: 'categories',
              label: <span className="flex items-center gap-2"><FolderTree size={16} />Categories</span>,
              children: <Table rowKey="id" columns={categoryColumns} dataSource={categories} loading={loadingCategories} className="custom-table" />,
            },
          ]}
        />
      </div>

      <Modal title={editingArticle ? 'Cap nhat bai viet' : 'Tao bai viet moi'} open={articleModalOpen} onCancel={() => setArticleModalOpen(false)} footer={null} width={840}>
        <Form form={articleForm} layout="vertical" onFinish={submitArticle} className="mt-6">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Nhap tieu de bai viet' }]}><Input className="h-12 rounded-xl" /></Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Chon danh muc' }]}><Select className="h-12" options={categories.map((category) => ({ value: category.id, label: category.name }))} /></Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Nhap noi dung bai viet' }]}><Input.TextArea rows={10} className="rounded-xl" /></Form.Item>
          <Form.Item label="Thumbnail">
            <Upload.Dragger beforeUpload={(file) => { setThumbnailFile(file); return false; }} maxCount={1} accept="image/*">
              <p className="ant-upload-drag-icon"><ImageIcon size={36} className="mx-auto text-primary" /></p>
              <p className="font-bold text-title">Click or drag image here</p>
              <p className="text-muted text-sm">Optional cover image for article thumbnail</p>
            </Upload.Dragger>
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setArticleModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="btn-gold">{editingArticle ? 'Save Changes' : 'Publish Article'}</Button>
          </div>
        </Form>
      </Modal>

      <Modal title={editingCategory ? 'Cap nhat danh muc' : 'Tao danh muc moi'} open={categoryModalOpen} onCancel={() => setCategoryModalOpen(false)} footer={null}>
        <Form form={categoryForm} layout="vertical" onFinish={submitCategory} className="mt-6">
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Nhap ten danh muc' }]}><Input className="h-12 rounded-xl" /></Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="btn-gold">{editingCategory ? 'Save' : 'Create'}</Button>
          </div>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default CMS;
