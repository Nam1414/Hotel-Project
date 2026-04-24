import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  User, 
  Bed, 
  MoreVertical,
  Calendar,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../components/ui';
import { mockCleaningTasks, mockRooms } from '../data/mockData';
import { CleaningTask } from '../types/index';

const CleaningManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Pending': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Cleaning Management</h1>
          <p className="text-text-muted">Monitor room cleaning status and assign staff tasks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule</span>
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Assign Task</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Pending', value: '8', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'In Progress', value: '5', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Completed Today', value: '12', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center gap-4">
              <div className={cn('p-3 rounded-xl', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div>
                <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                <h3 className="text-xl font-bold">{stat.value} Rooms</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  placeholder="Search room or staff..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" className="p-2">
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            {mockCleaningTasks.map((task) => (
              <Card key={task.id} className="p-5 hover:shadow-md transition-shadow group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Bed className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Room {task.roomNumber}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <User className="w-3.5 h-3.5" />
                        <span>Staff: {task.staffName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                    {task.startTime && (
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Started at {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Update</Button>
                    <Button variant="secondary" size="sm" className="p-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Staff Availability Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Staff Availability</h3>
            <div className="space-y-4">
              {[
                { name: 'Alice Johnson', status: 'Busy', tasks: 3 },
                { name: 'Bob Wilson', status: 'Available', tasks: 0 },
                { name: 'Charlie Davis', status: 'Busy', tasks: 2 },
                { name: 'Diana Prince', status: 'Available', tasks: 0 },
              ].map((staff, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-primary text-xs">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{staff.name}</p>
                      <p className="text-xs text-text-muted">{staff.tasks} tasks assigned</p>
                    </div>
                  </div>
                  <Badge variant={staff.status === 'Available' ? 'success' : 'warning'}>
                    {staff.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 gap-2">
              <User className="w-4 h-4" />
              Manage Staff
            </Button>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-bold text-lg mb-2">Cleaning Progress</h3>
            <p className="text-sm text-text-muted mb-4">Overall cleaning progress for today.</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">65% Complete</span>
                <span className="text-text-muted">12/25 Rooms</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CleaningManagement;
