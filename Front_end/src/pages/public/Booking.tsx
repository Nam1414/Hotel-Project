import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_ROOMS } from '../../constants/mockData';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Booking: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const room = MOCK_ROOMS.find(r => r.id === roomId);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
  });

  if (!room) return null;

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep(3);
    }, 1500);
  };

  return (
    <div className="bg-dark-base min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                step >= s ? 'bg-primary text-dark-base shadow-lg shadow-primary/30' : 'bg-dark-navy text-gray-500 border border-white/10'
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
              className="glass-card p-10"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-8">Reservation Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input 
                      type="date" 
                      className="input-luxury w-full pl-12"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input 
                      type="date" 
                      className="input-luxury w-full pl-12"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <select 
                      className="input-luxury w-full pl-12 appearance-none"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={handleNext} className="btn-gold w-full py-4 text-lg flex items-center justify-center">
                CONTINUE TO PAYMENT <ArrowRight size={20} className="ml-2" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-10"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-8">Payment Information</h2>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-10 flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Secure Payment</h4>
                  <p className="text-gray-400 text-sm">Your payment is encrypted and secured. We accept all major credit cards.</p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Card Number</label>
                  <input type="text" placeholder="**** **** **** ****" className="input-luxury w-full" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="input-luxury w-full" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">CVV</label>
                    <input type="text" placeholder="***" className="input-luxury w-full" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handlePrev} className="btn-outline-gold flex-grow py-4">BACK</button>
                <button onClick={handleSubmit} className="btn-gold flex-grow py-4">CONFIRM BOOKING</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-dark-base mx-auto mb-8 shadow-xl shadow-primary/20">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-4">Booking Confirmed!</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                Thank you for choosing KANT. Your reservation for <strong>{room.name}</strong> has been successfully processed.
              </p>
              <div className="bg-white/5 rounded-2xl p-6 mb-10 text-left space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Booking ID:</span> <span className="text-primary font-bold">#BK-9921</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Check-in:</span> <span className="text-white">{formData.checkIn}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Check-out:</span> <span className="text-white">{formData.checkOut}</span></div>
              </div>
              <button onClick={() => navigate('/profile')} className="btn-gold px-10 py-4">VIEW MY BOOKINGS</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Booking;
