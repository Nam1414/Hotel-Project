import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Coffee, Wifi, MapPin } from 'lucide-react';
import { MOCK_ROOMS } from '../../constants/mockData';

import WhyChooseKant from '../../components/home/WhyChooseKant';
import GuestExperiences from '../../components/home/GuestExperiences';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-base/60 via-dark-base/40 to-dark-base"></div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl py-20 sm:py-24">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 sm:mb-6 block"
          >
            Welcome to KANT Luxury Hotel
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-6 sm:mb-8 leading-tight"
          >
            Elegance in Every <span className="text-primary italic">Detail</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Discover a world of refined luxury, where exceptional service meets timeless design. Your sanctuary of comfort awaits.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link to="/rooms" className="btn-gold px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
              EXPLORE ROOMS
            </Link>
            <Link to="/about" className="btn-outline-gold px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
              OUR STORY
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose KANT */}
      <WhyChooseKant />

      {/* Featured Rooms */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-dark-navy transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 sm:mb-16">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Our Selection</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text-title)]">Featured Rooms</h2>
            </div>
            <Link to="/rooms" className="hidden md:flex items-center text-primary font-bold hover:text-gold-light transition-colors">
              VIEW ALL <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {MOCK_ROOMS.slice(0, 3).map((room) => (
              <motion.div 
                key={room.id}
                whileHover={{ y: -10 }}
                className="group relative bg-[var(--card-bg)] rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-sm"
              >
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1 rounded-full font-bold text-sm">
                    ${room.price}/night
                  </div>
                </div>
                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="flex items-center text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(room.rating) ? "currentColor" : "none"} />
                    ))}
                    <span className="ml-2 text-xs font-bold text-[var(--text-muted)]">{room.rating} Rating</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-title)] mb-4">{room.name}</h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-[var(--text-muted)] text-sm mb-6 sm:mb-8">
                    <span className="flex items-center"><Wifi size={14} className="mr-1" /> Wifi</span>
                    <span className="flex items-center"><Coffee size={14} className="mr-1" /> Breakfast</span>
                  </div>
                  <Link to={`/rooms/${room.id}`} className="btn-outline-gold w-full block text-center">
                    VIEW DETAILS
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Experiences */}
      <GuestExperiences />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1920" 
            alt="Pool" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-dark-base/80"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-white mb-6 sm:mb-8">Ready for an Unforgettable Experience?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 sm:mb-12">Book your stay today and enjoy exclusive benefits and the best rates guaranteed.</p>
          <Link to="/rooms" className="btn-gold px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl inline-flex">
            BOOK YOUR STAY NOW
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
