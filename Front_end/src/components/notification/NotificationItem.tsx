import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { markAsRead } from '../../store/slices/notificationSlice';
import { Bell, CheckCircle2, Info, AlertCircle, MessageSquare, Clock } from 'lucide-react';

const NotificationItem: React.FC<{ notification: any }> = ({ notification }) => {
  const dispatch = useDispatch();
  
  const icons = {
    booking: <CheckCircle2 className="text-green-500" size={18} />,
    reminder: <Clock size={18} className="text-blue-500" />,
    update: <Info className="text-yellow-500" size={18} />,
    message: <MessageSquare className="text-primary" size={18} />,
  };

  return (
    <div 
      onClick={() => dispatch(markAsRead(notification.id))}
      className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-primary/5' : ''}`}
    >
      <div className="flex space-x-3">
        <div className="mt-1">
          {icons[notification.type as keyof typeof icons] || <AlertCircle size={18} />}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] text-gray-400">{notification.time}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {notification.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
