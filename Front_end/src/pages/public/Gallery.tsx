import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Camera } from 'lucide-react';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const images = [
    { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', category: 'exterior', title: 'Hotel Exterior' },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', category: 'rooms', title: 'Penthouse View' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', category: 'rooms', title: 'Luxury Suite Interior' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', category: 'amenities', title: 'Infinity Pool' },
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', category: 'dining', title: 'Signature Restaurant' },
    { url: 'https://images.unsplash.com/photo-1544161515-4ae6ce6ca8b8', category: 'amenities', title: 'Luxury Spa' },
    { url: 'https://images.unsplash.com/photo-1551882547-ff43c6163345', category: 'dining', title: 'Wine Cellar' },
    { url: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972', category: 'rooms', title: 'Deluxe Suite' },
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', category: 'amenities', title: 'Garden Terrace' },
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'rooms', label: 'Rooms & Suites' },
    { id: 'dining', label: 'Dining' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'exterior', label: 'Exterior' },
  ];

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

  return (
    <div className="bg-dark-base min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6"
          >
            <Camera size={32} />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4"
          >
            Visual Journey
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-medium text-white mb-6 italic"
          >
            A Glimpse of Perfection
          </motion.h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${
                filter === cat.id 
                  ? 'bg-primary text-dark-base shadow-lg shadow-primary/20' 
                  : 'bg-white/5 text-gray-500 hover:text-primary hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.url}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group cursor-pointer aspect-[4/3] overflow-hidden rounded-2xl border border-white/5"
                onClick={() => setSelectedImage(image.url)}
              >
                <img 
                  src={`${image.url}?auto=format&fit=crop&q=80&w=800`} 
                  alt={image.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-dark-base/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                    <Maximize2 size={24} />
                  </div>
                  <h4 className="text-xl font-display font-bold text-white mb-1 uppercase tracking-wider">{image.title}</h4>
                  <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">{image.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-dark-base/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-[110]"
                onClick={() => setSelectedImage(null)}
              >
                <X size={32} />
              </button>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-6xl w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={`${selectedImage}?auto=format&fit=crop&q=100&w=1920`} 
                  alt="Gallery Item Full" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
