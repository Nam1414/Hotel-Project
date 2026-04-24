import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ROOMS } from '../../constants/mockData';
import { Link } from 'react-router-dom';
import { Users, Bed, Maximize, ArrowRight, Search, Filter, SlidersHorizontal } from 'lucide-react';

const Rooms: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const roomTypes = useMemo(() => {
    const types = new Set(MOCK_ROOMS.map(room => room.type));
    return ['All', ...Array.from(types)];
  }, []);

  const filteredRooms = useMemo(() => {
    return MOCK_ROOMS.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || room.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  return (
    <div className="bg-[var(--bg-main)] min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Rooms" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-primary tracking-[0.4em] uppercase mb-4"
          >
            Luxurious Stays
          </motion.h3>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-serif italic text-white mb-6"
          >
            Rooms & Suites
          </motion.h1>
          <div className="w-24 h-1 bg-primary mx-auto opacity-50" />
        </div>
      </section>

      {/* Control Bar */}
      <section className="sticky top-20 z-40 bg-[var(--card-bg)]/80 backdrop-blur-xl border-b border-[var(--border-color)] py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              placeholder="Search by room name or feature..." 
              className="input-luxury w-full pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            <div className="flex items-center text-[var(--text-muted)] mr-2 shrink-0">
              <Filter size={16} className="mr-2" />
              <span className="text-xs font-bold tracking-widest uppercase">FILTER:</span>
            </div>
            {roomTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all shrink-0 ${
                  selectedType === type 
                    ? 'bg-primary text-dark-base shadow-lg shadow-primary/20' 
                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-primary/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Room Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                      <span className="text-primary font-bold tracking-tighter text-xl">${room.price}</span>
                      <span className="text-gray-500 text-[10px] uppercase font-bold ml-1">/ night</span>
                    </div>
                    {room.type && (
                      <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full shadow-lg">
                        <span className="text-dark-base font-bold text-[10px] uppercase tracking-widest">{room.type}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-display font-bold text-[var(--text-title)] mb-4">{room.name}</h3>
                    
                    <div className="flex items-center space-x-6 mb-8 text-[var(--text-muted)] text-[11px] font-bold uppercase tracking-widest">
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-primary" />
                        <span>{room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bed size={14} className="text-primary" />
                        <span>King Bed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Maximize size={14} className="text-primary" />
                        <span>45 m²</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <Link 
                        to={`/rooms/${room.id}`}
                        className="text-[var(--text-title)] font-bold text-[10px] tracking-widest uppercase hover:text-primary transition-colors flex items-center space-x-2 border border-[var(--border-color)] px-4 py-3 rounded-xl flex-grow justify-center"
                      >
                        <span>VIEW DETAILS</span>
                        <ArrowRight size={14} />
                      </Link>
                      <Link 
                        to={`/booking/${room.id}`}
                        className="btn-gold px-8 py-3.5 text-[10px] font-bold tracking-widest uppercase flex-grow text-center"
                      >
                        BOOK NOW
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--text-muted)] mx-auto mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-display font-bold text-[var(--text-title)] mb-2">No Rooms Found</h3>
            <p className="text-[var(--text-muted)] mb-8">Try adjusting your search query or filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedType('All'); }}
              className="btn-outline-gold px-8"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Rooms;
