import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Shield, Star, Users } from 'lucide-react';
import { publicHotelApi, PublicRoomType } from '../../services/publicHotelApi';

const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<PublicRoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const roomId = Number(id);
    if (!roomId) {
      setError('Loai phong khong hop le');
      setLoading(false);
      return;
    }

    const loadRoom = async () => {
      try {
        const data = await publicHotelApi.getRoomTypeById(roomId);
        setRoom(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Khong tim thay thong tin phong');
      } finally {
        setLoading(false);
      }
    };

    void loadRoom();
  }, [id]);

  const amenities = useMemo(
    () =>
      room?.amenities?.map((amenity) => amenity.name) ?? [
        'Premium bedding',
        'Daily housekeeping',
        'Complimentary bottled water',
      ],
    [room],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
        Dang tai thong tin phong...
      </div>
    );
  }

  if (!room || error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="admin-card max-w-xl w-full flex items-center gap-3 text-red-500">
          <AlertCircle size={20} />
          <span>{error || 'Khong tim thay phong'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pb-20">
      <div className="relative h-[60vh]">
        <img
          src={room.primaryImage}
          alt={room.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-8 left-8">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-black/40 backdrop-blur-lg rounded-full text-white hover:text-primary transition-colors border border-white/10"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="glass-card">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-title">{room.name}</h1>
                <div className="flex items-center text-primary">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={20} fill={index < 4 ? 'currentColor' : 'none'} />
                  ))}
                  <span className="ml-2 text-lg font-bold text-muted">4.8</span>
                </div>
              </div>

              <p className="text-body text-lg leading-relaxed mb-10">
                {room.description || 'Room details are being updated. Please contact the front desk for more information.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="admin-card !p-4 text-center">
                  <Users className="text-primary mx-auto mb-3" size={28} />
                  <span className="text-sm text-muted">{room.capacityLabel}</span>
                </div>
                <div className="admin-card !p-4 text-center">
                  <Shield className="text-primary mx-auto mb-3" size={28} />
                  <span className="text-sm text-muted">{room.viewType || 'Premium view'}</span>
                </div>
                <div className="admin-card !p-4 text-center">
                  <CheckCircle2 className="text-primary mx-auto mb-3" size={28} />
                  <span className="text-sm text-muted">{room.bedType || 'Luxury bed'}</span>
                </div>
                <div className="admin-card !p-4 text-center">
                  <CheckCircle2 className="text-primary mx-auto mb-3" size={28} />
                  <span className="text-sm text-muted">{room.sizeSqm ? `${room.sizeSqm} m2` : 'Spacious suite'}</span>
                </div>
              </div>
            </div>

            <div className="glass-card">
              <h3 className="text-2xl font-display font-bold text-title mb-8">Room Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center text-body">
                    <CheckCircle2 className="text-primary mr-3" size={20} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card sticky top-24 border-primary/30">
              <div className="text-center mb-8">
                <span className="text-muted text-sm uppercase tracking-widest">Starting from</span>
                <div className="text-5xl font-display font-bold text-primary mt-2">
                  {room.displayPrice.toLocaleString('vi-VN')} d
                </div>
                <span className="text-muted text-sm">per night</span>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-body text-sm pb-4 border-b border-[var(--border-color)]">
                  <span>Max Guests</span>
                  <span className="font-bold">{room.capacityLabel}</span>
                </div>
                <div className="flex justify-between text-body text-sm pb-4 border-b border-[var(--border-color)]">
                  <span>Room Size</span>
                  <span className="font-bold">{room.sizeSqm ? `${room.sizeSqm} m2` : 'Spacious'}</span>
                </div>
                <div className="flex justify-between text-body text-sm pb-4 border-b border-[var(--border-color)]">
                  <span>View</span>
                  <span className="font-bold">{room.viewType || 'City / Ocean'}</span>
                </div>
              </div>

              <Link to={`/booking/${room.id}`} className="btn-gold w-full block text-center py-4 text-lg">
                BOOK THIS ROOM
              </Link>

              <p className="text-center text-muted text-xs mt-6">Reservation will be created directly in the current backend system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
