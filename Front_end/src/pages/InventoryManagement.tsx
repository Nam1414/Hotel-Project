import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Upload,
  MoreVertical,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../components/ui';
import { mockInventory } from '../data/mockData';
import { InventoryItem } from '../types/index';

const InventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = mockInventory.filter(item => item.inStock < 50);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Inventory Warehouse</h1>
          <p className="text-text-muted">Manage hotel supplies, stock levels, and damage reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-800">Low Stock Alert</h3>
            <p className="text-sm text-red-700">The following items are running low on stock: {lowStockItems.map(i => i.name).join(', ')}.</p>
          </div>
          <Button variant="danger" size="sm">Restock Now</Button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Items', value: '1,240', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'In Stock', value: '850', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'In Use', value: '340', icon: ArrowUpRight, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Damaged/Lost', value: '50', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
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

      {/* Inventory List */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input 
              placeholder="Search inventory items..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="gap-2">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">In Use</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Damaged</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Comp. Price</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-gray-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-text-main">{item.name}</p>
                        <p className="text-xs text-text-muted">Unit: {item.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.inStock}</span>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={cn('h-full rounded-full', item.inStock < 50 ? 'bg-red-500' : 'bg-green-500')} 
                          style={{ width: `${(item.inStock / item.totalQuantity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-muted">{item.inUse} {item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={item.damaged > 0 ? 'error' : 'neutral'}>{item.damaged} {item.unit}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary">${item.compensationPrice}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
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
          {filteredInventory.map((item) => (
            <Card key={item.id} className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-border overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-text-muted">Unit: {item.unit}</p>
                  </div>
                </div>
                <Badge variant={item.inStock < 50 ? 'error' : 'success'}>
                  {item.inStock < 50 ? 'Low Stock' : 'In Stock'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                <div className="text-center">
                  <p className="text-xs text-text-muted uppercase font-bold">Stock</p>
                  <p className="font-bold">{item.inStock}</p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-xs text-text-muted uppercase font-bold">In Use</p>
                  <p className="font-bold">{item.inUse}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-muted uppercase font-bold">Damaged</p>
                  <p className="font-bold text-red-500">{item.damaged}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-muted">Comp. Price</span>
                <span className="font-bold text-primary">${item.compensationPrice}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="secondary" className="flex-1 gap-2 text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1 gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Damage
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InventoryManagement;
