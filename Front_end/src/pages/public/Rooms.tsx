import React from 'react';
import { motion } from 'framer-motion';
import { MOCK_ROOMS } from '../../constants/mockData';
import { Link } from 'react-router-dom';
import { Users, Bed, Maximize, ArrowRight } from 'lucide-react';

const Rooms: React.FC = () => {
  return (
    <div className="bg-[#F9F6F1] min-h-screen">
      {/* Hero Section */}
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
            Experience the pinnacle of luxury in our carefully curated rooms and suites, 
            designed for your ultimate comfort and relaxation.
          </motion.p>
        </div>
      </section>

      {/* Room Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_ROOMS.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full">
                  <span className="text-primary font-bold">${room.price}</span>
                  <span className="text-gray-500 text-xs ml-1">/ night</span>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">{room.name}</h3>
                
                <div className="flex items-center space-x-6 mb-8 text-gray-500 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-primary" />
                    <span>{room.capacity} Guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bed size={16} className="text-primary" />
                    <span>King Bed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Maximize size={16} className="text-primary" />
                    <span>45 m²</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to={`/rooms/${room.id}`}
                    className="text-gray-800 font-bold text-sm hover:text-primary transition-colors flex items-center space-x-2"
                  >
                    <span>VIEW DETAILS</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link 
                    to={`/booking/${room.id}`}
                    className="btn-gold px-6 py-2 text-xs"
                  >
                    BOOK NOW
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rooms;
