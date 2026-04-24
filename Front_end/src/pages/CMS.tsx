import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Edit2, 
  Trash2, 
  Eye, 
  Globe, 
  Settings, 
  MoreVertical,
  ChevronRight,
  Calendar,
  User,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../components/ui';
import { mockPosts } from '../data/mockData';
import { Post } from '../types/index';

const CMS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = mockPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Content Management (CMS)</h1>
          <p className="text-text-muted">Manage your hotel's blog posts, articles, and SEO metadata.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">View Site</span>
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Button>
        </div>
      </div>

      {/* CMS Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Published Posts', value: '12', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Drafts', value: '4', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Views', value: '45,200', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center gap-4">
              <div className={cn('p-3 rounded-xl', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div>
                <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                <h3 className="text-xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Post List */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input 
              placeholder="Search articles by title..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="p-2">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">SEO Score</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-bold text-text-main max-w-xs truncate">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <User className="w-3.5 h-3.5" />
                      <span>{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.createdAt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={post.status === 'Published' ? 'success' : 'warning'}>{post.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-xs font-bold text-green-600">85%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-50 text-text-muted rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold line-clamp-1">{post.title}</h3>
                    <p className="text-xs text-text-muted">{post.author} • {post.createdAt}</p>
                  </div>
                </div>
                <Badge variant={post.status === 'Published' ? 'success' : 'warning'}>{post.status}</Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-border">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">1,240 views</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-green-600">SEO: 85%</span>
                  <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="secondary" className="flex-1 gap-2 text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1 gap-2 text-sm">
                  <Eye className="w-4 h-4 text-blue-500" />
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CMS;
