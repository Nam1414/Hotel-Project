import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Bed, Loader2, Maximize, Users } from 'lucide-react';
import { publicHotelApi, PublicRoomType } from '../../services/publicHotelApi';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<PublicRoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await publicHotelApi.getRoomTypes();
        setRooms(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Khong the tai danh sach phong');
      } finally {
        setLoading(false);
      }
    };

    void loadRooms();
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="py-24 flex items-center justify-center text-[var(--text-muted)]">
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
          Dang tai danh sach phong...
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-card flex items-center gap-3 text-red-500">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-[var(--border-color)]"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={room.primaryImage}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full">
                <span className="text-primary font-bold">
                  {room.displayPrice.toLocaleString('vi-VN')} d
                </span>
                <span className="text-gray-500 text-xs ml-1">/ dem</span>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-title mb-4">{room.name}</h3>
              <p className="text-sm text-muted mb-6 line-clamp-3">
                {room.description || 'Khong gian nghi duong duoc thiet ke tinh te va thoai mai.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  {room.capacityLabel}
                </span>
                <span className="flex items-center gap-2">
                  <Bed size={16} className="text-primary" />
                  {room.bedType || 'Luxury bed'}
                </span>
                <span className="flex items-center gap-2">
                  <Maximize size={16} className="text-primary" />
                  {room.sizeSqm ? `${room.sizeSqm} m2` : 'Spacious'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Link
                  to={`/rooms/${room.id}`}
                  className="text-title font-bold text-sm hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span>VIEW DETAILS</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to={`/booking/${room.id}`} className="btn-gold px-6 py-2 text-xs">
                  BOOK NOW
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }, [error, loading, rooms]);

  return (
    <div className="bg-[var(--bg-main)] min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Rooms"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white mb-6"
          >
            Our Accommodations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto font-light"
          >
            Explore room types synced from the current hotel system and choose the stay that fits you best.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">{content}</section>
    </div>
  );
};

export default Rooms;
