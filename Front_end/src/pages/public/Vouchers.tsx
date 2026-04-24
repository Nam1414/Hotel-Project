import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, Tag, ArrowRight } from 'lucide-react';

const Vouchers: React.FC = () => {
  const vouchers = [
    {
      id: 'SUMMER2024',
      title: 'Summer Luxury Escape',
      description: 'Get 20% off on all Suite rooms for stays longer than 3 nights.',
      discount: '20% OFF',
      expiry: 'Valid until Aug 31, 2024',
      code: 'SUMMER24',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'HONEYMOON',
      title: 'Honeymoon Special',
      description: 'Free spa treatment and champagne on arrival for newly married couples.',
      discount: 'SPECIAL GIFT',
      expiry: 'Valid until Dec 31, 2024',
      code: 'LOVEKANT',
      color: 'from-rose-500 to-pink-600'
    },
    {
      id: 'EARLYBIRD',
      title: 'Early Bird Discount',
      description: 'Book 30 days in advance and save 15% on your total booking value.',
      discount: '15% OFF',
      expiry: 'Ongoing Offer',
      code: 'EARLYKANT',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'WEEKEND',
      title: 'Weekend Getaway',
      description: 'Complimentary breakfast and late checkout for Friday-Sunday stays.',
      discount: 'FREE PERKS',
      expiry: 'Ongoing Offer',
      code: 'WEEKENDSTAY',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <div className="bg-dark-base min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4"
          >
            Exclusive Offers
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-medium text-white mb-6 italic"
          >
            Vouchers & Special Rates
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Enhance your stay with our curated selection of exclusive offers and limited-time vouchers designed for the discerning traveler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vouchers.map((voucher, index) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden luxury-card group"
            >
              <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${voucher.color}`} />
              <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${voucher.color} flex items-center justify-center text-white shadow-lg`}>
                    <Ticket size={40} />
                  </div>
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 className="text-2xl font-display font-bold text-white tracking-tight">{voucher.title}</h4>
                    <span className="text-primary font-black text-xl">{voucher.discount}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{voucher.description}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <div className="flex items-center text-gray-500 text-xs font-bold tracking-widest uppercase">
                      <Clock size={14} className="mr-2 text-primary" />
                      {voucher.expiry}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3">
                      <Tag size={14} className="text-primary" />
                      <span className="text-white font-mono font-bold tracking-widest">{voucher.code}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <button className="btn-gold w-full md:w-auto flex items-center justify-center group-hover:px-8 transition-all">
                    USE NOW <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-3xl font-display font-bold text-white mb-4">Never Miss an Offer</h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Subscribe to our newsletter to receive exclusive vouchers and member-only rates directly in your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input type="email" placeholder="Your email address" className="input-luxury flex-grow bg-white/5" />
              <button className="btn-gold px-10">SUBSCRIBE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vouchers;
