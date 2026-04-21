import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, Loader2, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { publicHotelApi, PublicRoomType } from '../../services/publicHotelApi';
import { bookingApi } from '../../services/bookingApi';
import { voucherApi, VoucherResponseDto } from '../../services/voucherApi';

const Booking: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [allRoomTypes, setAllRoomTypes] = useState<PublicRoomType[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<{ roomTypeId: number; quantity: number }[]>([{ roomTypeId: Number(roomId), quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [bookingCode, setBookingCode] = useState('');
  const [vouchers, setVouchers] = useState<VoucherResponseDto[]>([]);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1, // Overall guests per room or global? Let's leave it as global per room avg or remove it. We'll keep it for API validation if needed.
    depositAmount: 0,
    voucherId: null as number | null,
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  });

  const nights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [formData.checkIn, formData.checkOut]);

  const totalRoomPrice = useMemo(() => {
    let total = 0;
    for (const sr of selectedRooms) {
       const rt = allRoomTypes.find(x => x.id === sr.roomTypeId);
       if (rt) {
           total += nights * sr.quantity * (rt.displayPrice || 0);
       }
    }
    return total;
  }, [nights, selectedRooms, allRoomTypes]);

  const totalRoomsCount = useMemo(() => selectedRooms.reduce((acc, curr) => acc + curr.quantity, 0), [selectedRooms]);

  const discountAmount = useMemo(() => {
    if (!formData.voucherId || !vouchers.length) return 0;
    const v = vouchers.find(x => x.id === formData.voucherId);
    if (!v) return 0;
    if (totalRoomPrice < v.minBookingAmount) return 0;
    
    let discount = 0;
    if (v.discountType === 'Percentage') {
      discount = (totalRoomPrice * v.discountValue) / 100;
      if (v.maxDiscountAmount && discount > v.maxDiscountAmount) discount = v.maxDiscountAmount;
    } else {
      discount = v.discountValue;
    }
    return discount;
  }, [formData.voucherId, vouchers, totalRoomPrice]);

  const finalTotal = useMemo(() => Math.max(0, totalRoomPrice - discountAmount), [totalRoomPrice, discountAmount]);
  const remainingAmount = useMemo(() => Math.max(0, finalTotal - formData.depositAmount), [finalTotal, formData.depositAmount]);

  useEffect(() => {
    const id = Number(roomId);
    if (!id) {
      setError('Loai phong khong hop le');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [roomsData, vList] = await Promise.all([
          publicHotelApi.getRoomTypes(),
          voucherApi.getAll().catch(() => [])
        ]);
        setAllRoomTypes(roomsData);
        
        // Ensure the initial roomId exists or fallback
        const validInitial = roomsData.find(r => r.id === id) ? id : roomsData[0]?.id || 0;
        setSelectedRooms([{ roomTypeId: validInitial, quantity: 1 }]);

        setFormData((current) => ({
          ...current,
          guests: Math.max(1, current.guests),
        }));
        
        const activeVouchers = vList.filter(x => x.isActive && new Date(x.endDate).getTime() >= new Date().getTime());
        setVouchers(activeVouchers);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải thông tin phòng');
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [roomId]);

  const canContinue = useMemo(() => {
    return Boolean(
      formData.checkIn &&
      formData.checkOut &&
      nights > 0 &&
      formData.fullName &&
      formData.email &&
      formData.phone &&
      selectedRooms.length > 0 && selectedRooms.every(sr => sr.roomTypeId && sr.quantity > 0)
    );
  }, [formData, nights, selectedRooms]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedRooms.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const detailsPayload = selectedRooms.flatMap(sr => {
        const rt = allRoomTypes.find(x => x.id === sr.roomTypeId);
        return Array.from({ length: sr.quantity }).map(() => ({
          roomTypeId: sr.roomTypeId,
          checkInDate: new Date(formData.checkIn).toISOString(),
          checkOutDate: new Date(formData.checkOut).toISOString(),
          pricePerNight: rt?.displayPrice || 0,
        }));
      });

      const booking = await bookingApi.create({
        userId: user?.id && Number(user.id) > 0 ? Number(user.id) : undefined,
        guestName: formData.fullName,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        voucherId: formData.voucherId || undefined,
        depositAmount: formData.depositAmount,
        details: detailsPayload,
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

  if (allRoomTypes.length === 0 || error && step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="admin-card max-w-xl w-full flex items-center gap-3 text-red-500">
          <AlertCircle size={20} />
          <span>{error || 'Không tìm thấy loại phòng nào phù hợp'}</span>
        </div>
      </div>
    );
  }

  const primaryRoomType = allRoomTypes.find(rt => rt.id === selectedRooms[0]?.roomTypeId) || allRoomTypes[0];

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
                You are booking multiple rooms from the live hotel system.
              </p>

              <div className="flex flex-col lg:flex-row gap-10 mb-10">
                <div className="lg:w-1/3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={primaryRoomType?.primaryImage}
                      alt={primaryRoomType?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">Avg Price / Night</span>
                      <span className="text-primary font-bold">{primaryRoomType?.displayPrice.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-2/3 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted uppercase tracking-widest">Check-in Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <input
                          type="date"
                          className="input-luxury w-full pl-12"
                          value={formData.checkIn}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            const newCheckIn = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              checkIn: newCheckIn,
                              checkOut: prev.checkOut && prev.checkOut <= newCheckIn ? '' : prev.checkOut
                            }));
                          }}
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
                          min={formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
                    <label className="text-sm font-bold text-muted uppercase tracking-widest">Select Rooms</label>
                    {selectedRooms.map((sr, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--bg-main)] p-3 rounded-lg border border-[var(--border-color)] relative">
                        <select
                          className="input-luxury flex-1 w-full"
                          value={sr.roomTypeId}
                          onChange={(e) => {
                            const newArr = [...selectedRooms];
                            newArr[index].roomTypeId = Number(e.target.value);
                            setSelectedRooms(newArr);
                          }}
                        >
                          {allRoomTypes.map(rt => (
                            <option key={rt.id} value={rt.id}>{rt.name} - {rt.displayPrice.toLocaleString('vi-VN')}₫/night</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <select
                            className="input-luxury w-full sm:w-32"
                            value={sr.quantity}
                            onChange={(e) => {
                              const newArr = [...selectedRooms];
                              newArr[index].quantity = Number(e.target.value);
                              setSelectedRooms(newArr);
                            }}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>)}
                          </select>
                          {selectedRooms.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => setSelectedRooms(selectedRooms.filter((_, i) => i !== index))} 
                              className="text-red-500 font-bold p-3 hover:bg-red-50 rounded-lg shrink-0"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => setSelectedRooms([...selectedRooms, { roomTypeId: allRoomTypes[0]?.id || 0, quantity: 1 }])} 
                      className="text-primary font-bold text-sm hover:underline flex items-center"
                    >
                      + Add another room type
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--border-color)]">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted uppercase tracking-widest">Voucher / Promo Code</label>
                      <select
                        className="input-luxury w-full"
                        value={formData.voucherId || ''}
                        onChange={(e) => setFormData({ ...formData, voucherId: e.target.value ? Number(e.target.value) : null })}
                      >
                        <option value="">No voucher applied</option>
                        {vouchers.map(v => (
                          <option key={v.id} value={v.id} disabled={totalRoomPrice < v.minBookingAmount}>
                            {v.code} - {v.discountType === 'Percentage' ? `${v.discountValue}%` : `${v.discountValue.toLocaleString('vi-VN')}₫`} {totalRoomPrice < v.minBookingAmount ? '(Đơn chưa đủ ĐK)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-muted uppercase tracking-widest">Deposit Amount (VND)</label>
                      <input
                        type="number"
                        className="input-luxury w-full"
                        min={0}
                        max={finalTotal}
                        value={formData.depositAmount}
                        onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
                    <h3 className="text-xl font-bold text-title">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted uppercase">Full Name</label>
                        <input
                          type="text"
                          className="input-luxury w-full"
                          placeholder="Your Name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted uppercase">Email Address</label>
                        <input
                          type="email"
                          className="input-luxury w-full"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-muted uppercase">Phone Number</label>
                        <input
                          type="tel"
                          className="input-luxury w-full"
                          placeholder="e.g. +84 123 456 789"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canContinue}
                className="btn-gold w-full py-4 text-lg flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
              >
                CONTINUE TO CONFIRMATION <ArrowRight size={20} className="ml-2" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="admin-card !p-6">
                    <h3 className="text-sm font-bold text-muted uppercase mb-4 tracking-widest">Guest Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Name</span>
                        <span className="font-semibold text-title">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Email</span>
                        <span className="font-semibold text-title">{formData.email}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Phone</span>
                        <span className="font-semibold text-title">{formData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-card !p-6">
                    <h3 className="text-sm font-bold text-muted uppercase mb-4 tracking-widest">Stay Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Check-in</span>
                        <span className="font-semibold text-title">{formData.checkIn}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Check-out</span>
                        <span className="font-semibold text-title">{formData.checkOut}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Total Nights</span>
                        <span className="font-semibold text-primary">{nights} Night{nights > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Total Rooms</span>
                        <span className="font-semibold text-primary">{totalRoomsCount} Room{totalRoomsCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="admin-card !p-6 bg-primary/5 border-primary/20">
                    <h3 className="text-sm font-bold text-muted uppercase mb-4 tracking-widest text-primary">Price Summary</h3>
                    <div className="space-y-4">
                      {selectedRooms.map((sr, idx) => {
                        const rt = allRoomTypes.find(x => x.id === sr.roomTypeId);
                        if (!rt) return null;
                        const lineTotal = nights * sr.quantity * rt.displayPrice;
                        return (
                          <div key={idx} className="flex justify-between text-sm border-b border-[var(--border-color)] pb-2">
                            <span className="text-muted">{rt.name} x {nights} nights x {sr.quantity} rooms</span>
                            <span className="font-semibold text-title">{lineTotal.toLocaleString('vi-VN')} ₫</span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between text-sm pt-2">
                        <span className="font-bold text-title">Rooms Total</span>
                        <span className="font-bold text-title">{totalRoomPrice.toLocaleString('vi-VN')} ₫</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Voucher Discount</span>
                          <span className="font-semibold">-{discountAmount.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-amber-600">
                        <span>Deposit Paid</span>
                        <span className="font-semibold">-{formData.depositAmount.toLocaleString('vi-VN')} ₫</span>
                      </div>
                      <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                        <span className="text-lg font-bold text-title">Amount Due</span>
                        <span className="text-2xl font-display font-bold text-primary">
                          {remainingAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      <p className="text-[10px] text-muted text-center italic">
                        Prices include taxes and fees. You will pay the remaining amount at the hotel.
                      </p>
                    </div>
                  </div>
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
                Reservation for <strong>{totalRoomsCount} rooms</strong> has been created successfully in the backend system.
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
