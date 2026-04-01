import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors relative"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-dark-navy">
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default NotificationBell;
