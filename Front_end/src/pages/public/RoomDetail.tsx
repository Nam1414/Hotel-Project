import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Wifi, Coffee, Wind, Tv, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { MOCK_ROOMS } from '../../constants/mockData';

const RoomDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = MOCK_ROOMS.find(r => r.id === id);

  if (!room) {
    return <div className="h-screen flex items-center justify-center text-white">Room not found</div>;
  }

  return (
    <div className="bg-dark-base min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh]">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-transparent to-transparent"></div>
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-dark-base/50 backdrop-blur-lg rounded-full text-white hover:text-primary transition-colors border border-white/10"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass-card p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{room.name}</h1>
                <div className="flex items-center text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.floor(room.rating) ? "currentColor" : "none"} />
                  ))}
                  <span className="ml-2 text-lg font-bold text-gray-400">{room.rating}</span>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-10">
                Experience luxury at its finest in our {room.name}. This meticulously appointed space offers a perfect blend of modern sophistication and timeless comfort. Every detail has been curated to ensure your stay is nothing short of extraordinary.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Wifi className="text-primary mb-3" size={28} />
                  <span className="text-sm text-gray-400">Free Wifi</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Coffee className="text-primary mb-3" size={28} />
                  <span className="text-sm text-gray-400">Breakfast</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Wind className="text-primary mb-3" size={28} />
                  <span className="text-sm text-gray-400">Air Cond</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Tv className="text-primary mb-3" size={28} />
                  <span className="text-sm text-gray-400">Smart TV</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-10">
              <h3 className="text-2xl font-display font-bold text-white mb-8">Room Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-gray-300">
                    <CheckCircle2 className="text-primary mr-3" size={20} />
                    <span>{amenity}</span>
                  </div>
                ))}
                <div className="flex items-center text-gray-300">
                  <Shield className="text-primary mr-3" size={20} />
                  <span>24/7 Room Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-24 border-primary/30">
              <div className="text-center mb-8">
                <span className="text-gray-400 text-sm uppercase tracking-widest">Starting from</span>
                <div className="text-5xl font-display font-bold text-primary mt-2">${room.price}</div>
                <span className="text-gray-500 text-sm">per night</span>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-gray-300 text-sm pb-4 border-b border-white/5">
                  <span>Max Guests</span>
                  <span className="font-bold">2 Adults, 1 Child</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm pb-4 border-b border-white/5">
                  <span>Room Size</span>
                  <span className="font-bold">45 m²</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm pb-4 border-b border-white/5">
                  <span>View</span>
                  <span className="font-bold">Ocean / City</span>
                </div>
              </div>

              {room.status === 'available' ? (
                <Link to={`/booking/${room.id}`} className="btn-gold w-full block text-center py-4 text-lg">
                  BOOK THIS ROOM
                </Link>
              ) : (
                <button disabled className="w-full bg-gray-700 text-gray-500 py-4 rounded-xl font-bold cursor-not-allowed">
                  CURRENTLY BOOKED
                </button>
              )}
              
              <p className="text-center text-gray-500 text-xs mt-6">
                No credit card required for reservation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
