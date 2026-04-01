import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Bed, 
  Layers, 
  Package, 
  Edit2, 
  Trash2, 
  Copy,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../components/ui';
import { mockRooms } from '../data/mockData';
import { Room, RoomStatus, RoomType } from '../types';

const RoomManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<RoomType | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'All'>('All');

  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || room.type === filterType;
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Occupied': return 'info';
      case 'Cleaning': return 'warning';
      case 'Maintenance': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Room Management</h1>
          <p className="text-text-muted">Manage your hotel rooms, types, and inventory sync.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Create</span>
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Room</span>
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input 
              placeholder="Search room number..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-lg px-3 py-2">
              <Layers className="w-4 h-4 text-text-muted" />
              <select 
                className="bg-transparent text-sm outline-none cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="All">All Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-border rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-text-muted" />
              <select 
                className="bg-transparent text-sm outline-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Floor</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Bed className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-bold text-text-main">Room {room.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-muted">{room.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-muted">Floor {room.floor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(room.status)}>{room.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-muted">{room.inventory.length} items</span>
                    </div>
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
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Bed className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Room {room.number}</h3>
                  <p className="text-xs text-text-muted">{room.type} • Floor {room.floor}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(room.status)}>{room.status}</Badge>
            </div>
            
            <div className="flex items-center justify-between py-3 border-y border-border">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted">{room.inventory.length} Inventory Items</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-medium">
                <ImageIcon className="w-4 h-4" />
                <span>{room.images.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button variant="secondary" className="flex-1 gap-2 text-sm">
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="outline" className="p-2">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Sticky Mobile Action */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default RoomManagement;
