import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Loader2, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { publicHotelApi, PublicRoomType } from '../../services/publicHotelApi';
import { bookingApi } from '../../services/bookingApi';

const Booking: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [room, setRoom] = useState<PublicRoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [bookingCode, setBookingCode] = useState('');
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    const id = Number(roomId);
    if (!id) {
      setError('Loai phong khong hop le');
      setLoading(false);
      return;
    }

    const loadRoom = async () => {
      try {
        const data = await publicHotelApi.getRoomTypeById(id);
        setRoom(data);
        setFormData((current) => ({
          ...current,
          guests: Math.max(1, Math.min(data.capacityAdults || 1, current.guests)),
        }));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Khong the tai thong tin phong');
      } finally {
        setLoading(false);
      }
    };

    void loadRoom();
  }, [roomId]);

  const canContinue = useMemo(() => {
    return Boolean(formData.checkIn && formData.checkOut && room);
  }, [formData.checkIn, formData.checkOut, room]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!room) return;

    setSubmitting(true);
    setError(null);

    try {
      const booking = await bookingApi.create({
        userId: user?.id && Number(user.id) > 0 ? Number(user.id) : undefined,
        guestName: user?.fullName || user?.name || '',
        guestEmail: user?.email || '',
        details: [
          {
            roomTypeId: room.id,
            checkInDate: new Date(formData.checkIn).toISOString(),
            checkOutDate: new Date(formData.checkOut).toISOString(),
            pricePerNight: room.displayPrice,
          },
        ],
      });

      setBookingCode(booking.bookingCode);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Khong the tao booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
        Dang tai phong...
      </div>
    );
  }

  if (!room || error && step === 1) {
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
    <div className="bg-[var(--bg-main)] min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--border-color)] -translate-y-1/2 z-0" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                step >= s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}
            >
              {step > s ? <CheckCircle2 size={24} /> : s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card"
            >
              <h2 className="text-3xl font-display font-bold text-title mb-2">Reservation Details</h2>
              <p className="text-muted mb-8">
                You are booking <span className="font-semibold text-title">{room?.name}</span> from the live hotel system.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted uppercase tracking-widest">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input
                      type="date"
                      className="input-luxury w-full pl-12"
                      value={formData.checkIn}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted uppercase tracking-widest">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input
                      type="date"
                      className="input-luxury w-full pl-12"
                      value={formData.checkOut}
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted uppercase tracking-widest">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <select
                      className="input-luxury w-full pl-12 appearance-none"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    >
                      {Array.from({ length: Math.max(room?.capacityAdults || 1, 1) }, (_, idx) => idx + 1).map((guest) => (
                        <option key={guest} value={guest}>
                          {guest} Guest{guest > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!canContinue}
                className="btn-gold w-full py-4 text-lg flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
              >
                CONTINUE <ArrowRight size={20} className="ml-2" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card"
              onSubmit={handleSubmit}
            >
              <h2 className="text-3xl font-display font-bold text-title mb-8">Confirm Booking</h2>
              <div className="admin-card !p-6 mb-10">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted">Room</span>
                  <span className="font-semibold text-title">{room?.name}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted">Check-in</span>
                  <span className="font-semibold text-title">{formData.checkIn}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-muted">Check-out</span>
                  <span className="font-semibold text-title">{formData.checkOut}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Price / night</span>
                  <span className="font-semibold text-primary">{room?.displayPrice.toLocaleString('vi-VN')} d</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="btn-outline-gold flex-grow py-4">
                  BACK
                </button>
                <button type="submit" disabled={submitting} className="btn-gold flex-grow py-4">
                  {submitting ? 'CREATING BOOKING...' : 'CONFIRM BOOKING'}
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card text-center"
            >
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-primary/20">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-display font-bold text-title mb-4">Booking Confirmed</h2>
              <p className="text-muted text-lg mb-10 max-w-md mx-auto">
                Reservation for <strong>{room?.name}</strong> has been created successfully in the backend system.
              </p>
              <div className="admin-card !p-6 mb-10 text-left space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted">Booking Code:</span> <span className="text-primary font-bold">{bookingCode}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Check-in:</span> <span className="text-title">{formData.checkIn}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Check-out:</span> <span className="text-title">{formData.checkOut}</span></div>
              </div>
              <button onClick={() => navigate('/profile')} className="btn-gold px-10 py-4">VIEW MY PROFILE</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booking;
