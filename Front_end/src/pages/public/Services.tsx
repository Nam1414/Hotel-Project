import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Sparkles, Waves, Briefcase, ChevronRight } from 'lucide-react';

const Services: React.FC = () => {
  const serviceCategories = [
    {
      title: 'Fine Dining',
      icon: Coffee,
      description: 'Experience culinary excellence with our world-class chefs serving international and local delicacies. Our signature restaurant offers a rotation of seasonal tasting menus.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Wellness & Spa',
      icon: Sparkles,
      description: 'Rejuvenate your mind, body, and soul with our signature treatments and therapeutic massages in a tranquil environment designed for ultimate peace.',
      image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46152?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Infinity Pool',
      icon: Waves,
      description: 'Relax by our stunning infinity pool overlooking the city skyline with premium cocktail service and private cabanas available for full-day bookings.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Business Center',
      icon: Briefcase,
      description: 'State-of-the-art meeting rooms and business facilities for your professional needs, complete with high-speed presentation tech and dedicated support.',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Services" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center text-primary mx-auto mb-6 border border-primary/30"
          >
            <Sparkles size={32} />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-primary tracking-[0.4em] uppercase mb-4"
          >
            Excellence in every detail
          </motion.h3>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic text-white mb-6"
          >
            Our Services
          </motion.h1>
          <div className="w-24 h-1 bg-primary mx-auto opacity-50" />
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {serviceCategories.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col gap-10 group ${index % 2 !== 0 ? 'lg:translate-y-16' : ''}`}
            >
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl luxury-card border-none">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl text-dark-base shadow-lg">
                    <service.icon size={24} />
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white uppercase tracking-wider">{service.title}</h4>
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-center gap-2 text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                  <service.icon size={14} />
                  <span>Category {index + 1}</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-[var(--text-title)] mb-4">{service.title}</h3>
                <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8 max-w-lg">
                  {service.description}
                </p>
                <button className="group flex items-center gap-3 text-xs font-black tracking-[0.2em] uppercase text-primary hover:text-primary-dark transition-colors">
                  <span>DISCOVER EXPERIENCE</span>
                  <div className="w-10 h-10 border border-primary/30 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-dark-base transition-all">
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden bg-dark-base">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-white mb-10 italic"
          >
            Elevate Your Journey to New Heights
          </motion.h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="btn-gold px-12 py-5 text-sm">
              BOOK YOUR LUXURY STAY
            </button>
            <button className="btn-outline-gold px-12 py-5 text-sm">
              VIEW ALL AMENITIES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
