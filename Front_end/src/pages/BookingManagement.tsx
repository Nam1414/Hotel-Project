import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Ticket, 
  Users, 
  Bed, 
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, Button, Input, Badge, cn } from '../components/ui';
import { mockBookings } from '../data/mockData';
import { Booking } from '../types';

const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CheckedIn': return 'success';
      case 'Confirmed': return 'info';
      case 'Pending': return 'warning';
      case 'CheckedOut': return 'neutral';
      case 'Cancelled': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Booking & Voucher</h1>
          <p className="text-text-muted">Manage guest reservations, availability, and promotional vouchers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="gap-2">
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">Create Voucher</span>
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Button>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: '1,240', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Check-ins Today', value: '12', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Check-outs Today', value: '8', icon: ArrowRight, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Active Vouchers', value: '24', icon: Ticket, color: 'text-purple-500', bg: 'bg-purple-50' },
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

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-semibold text-sm">All Bookings</button>
        <button className="px-4 py-2 text-text-muted hover:text-text-main font-medium text-sm">Vouchers</button>
        <button className="px-4 py-2 text-text-muted hover:text-text-main font-medium text-sm">Availability</button>
      </div>

      {/* Booking List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  placeholder="Search guest name or booking ID..." 
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
            {mockBookings.map((booking) => (
              <Card key={booking.id} className="p-5 hover:shadow-md transition-shadow group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-primary text-lg">
                      {booking.guestName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{booking.guestName}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Bed className="w-3.5 h-3.5" />
                        <span>Room {booking.roomNumber}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{booking.checkIn} to {booking.checkOut}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                    <p className="text-sm font-bold text-primary">${booking.totalAmount}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Details</Button>
                    <Button variant="secondary" size="sm" className="p-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Availability & Vouchers */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Quick Availability</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Single', available: 12, total: 40 },
                { type: 'Double', available: 5, total: 30 },
                { type: 'Suite', available: 2, total: 10 },
                { type: 'Deluxe', available: 0, total: 20 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.type}</span>
                    <span className={cn('font-bold', item.available === 0 ? 'text-red-500' : 'text-text-main')}>
                      {item.available}/{item.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full', item.available === 0 ? 'bg-red-500' : 'bg-primary')} 
                      style={{ width: `${(item.available / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 gap-2">
              <Calendar className="w-4 h-4" />
              Full Calendar
            </Button>
          </Card>

          <Card className="p-6 bg-amber-50 border-amber-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-600" />
              Active Vouchers
            </h3>
            <div className="space-y-4">
              {[
                { code: 'SUMMER20', discount: '20% OFF', expiry: 'Ends in 2 days' },
                { code: 'WELCOME10', discount: '$10 OFF', expiry: 'Ends in 15 days' },
              ].map((voucher, idx) => (
                <div key={idx} className="p-3 bg-white border border-amber-200 rounded-lg border-dashed">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{voucher.code}</span>
                    <span className="text-sm font-bold text-text-main">{voucher.discount}</span>
                  </div>
                  <p className="text-[10px] text-text-muted uppercase font-bold">{voucher.expiry}</p>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-6 gap-2 border-amber-200 text-amber-700 hover:bg-amber-100">
              Manage Vouchers
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
