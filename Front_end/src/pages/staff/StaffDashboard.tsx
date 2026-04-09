import React from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateRoomStatus, confirmCheckIn, RoomStatus } from '../../store/slices/staffSlice';
import RoomCard from '../../components/staff/RoomCard';
import ArrivalCard from '../../components/staff/ArrivalCard';
import { RefreshCw, FileText, BarChart3, Info } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';

const StaffDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { rooms, arrivals } = useSelector((state: RootState) => state.staff);
  const { notify, requestPermission } = useNotification();

  const handleUpdateStatus = (roomId: string, currentStatus: RoomStatus) => {
    const statuses: RoomStatus[] = ['VACANT', 'OCCUPIED', 'CLEANING'];
    const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];
    
    dispatch(updateRoomStatus({ roomId, status: nextStatus }));
    notify({
      title: 'Room Updated',
      content: `Room status changed to ${nextStatus}`,
      type: 'update',
    });
  };

  const handleConfirmCheckIn = (arrival: any) => {
    dispatch(confirmCheckIn(arrival.id));
    dispatch(updateRoomStatus({ roomId: rooms.find(r => r.number === arrival.roomNumber)?.id || '', status: 'OCCUPIED' }));
    notify({
      title: 'Check-in Confirmed',
      content: `${arrival.guestName} has checked into Room ${arrival.roomNumber}`,
      type: 'booking',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-800">Staff Operations</h1>
          <p className="text-gray-500 mt-1">Manage daily check-ins, room status, and guest services</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => requestPermission()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={18} />
            <span className="font-semibold text-sm">Refresh Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
            <FileText size={18} />
            <span className="font-semibold text-sm">Create Invoice</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/20">
            <BarChart3 size={18} />
            <span className="font-bold text-sm">DAILY REPORT</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column: Room Map (70%) */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-800">Room Map</h2>
            <div className="flex items-center space-x-6 text-xs font-bold tracking-wider">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-500">VACANT</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-500">OCCUPIED</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-500">CLEANING</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard 
                key={room.id}
                number={room.number}
                type={room.type}
                status={room.status}
                onUpdateStatus={() => handleUpdateStatus(room.id, room.status)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Today's Arrivals (30%) */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-800">Today's Arrivals</h2>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold">
              {arrivals.length} PENDING
            </span>
          </div>

          <div className="space-y-4">
            {arrivals.length > 0 ? (
              arrivals.map((arrival) => (
                <ArrivalCard 
                  key={arrival.id}
                  guestName={arrival.guestName}
                  roomNumber={arrival.roomNumber}
                  bookingId={arrival.bookingId}
                  time={arrival.checkInTime}
                  onConfirm={() => handleConfirmCheckIn(arrival)}
                />
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                  <Info size={24} />
                </div>
                <p className="text-gray-400 text-sm">No more arrivals for today</p>
              </div>
            )}
          </div>

          {/* Quick Stats Widget */}
          <div className="mt-8 bg-dark-base p-6 rounded-2xl text-white">
            <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-4">Occupancy Rate</h4>
            <div className="flex items-end space-x-2 mb-2">
              <span className="text-4xl font-display font-bold">78%</span>
              <span className="text-green-400 text-xs mb-1">+5% from yesterday</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[78%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
