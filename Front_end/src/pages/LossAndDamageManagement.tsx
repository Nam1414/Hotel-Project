import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Card, Button, Input, Badge, Table } from '../components/ui';
import { mockLossAndDamages } from '../data/mockData';

const LossAndDamageManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLossAndDamages = mockLossAndDamages.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Unresolved':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Loss and Damage Management</h1>
          <p className="text-text-muted">Track and manage loss and damage cases in the hotel.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Case</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />
      </div>

      <Table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Room</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLossAndDamages.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.room}</td>
              <td>
                <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
              </td>
              <td className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default LossAndDamageManagement;
