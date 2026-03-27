import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const serviceCategories = [
    {
      title: 'Fine Dining',
      description: 'Experience culinary excellence with our world-class chefs serving international and local delicacies.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Wellness & Spa',
      description: 'Rejuvenate your mind, body, and soul with our signature treatments and therapeutic massages.',
      image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46152?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Infinity Pool',
      description: 'Relax by our stunning infinity pool overlooking the city skyline with premium cocktail service.',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Business Center',
      description: 'State-of-the-art meeting rooms and business facilities for your professional needs.',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-[#F9F6F1] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Services" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display text-white mb-6"
          >
            World-Class Services
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-light">
            Every detail of your stay is meticulously crafted to ensure an unparalleled experience of luxury and comfort.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {serviceCategories.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-full md:w-1/2 h-80 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-3xl font-display font-bold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <button className="text-primary font-bold flex items-center space-x-2 hover:translate-x-2 transition-transform">
                  <span>LEARN MORE</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark-base py-20 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-display text-white mb-8">Ready to Experience KANT?</h2>
        <button className="btn-gold px-12 py-4 text-lg">
          BOOK YOUR STAY
        </button>
      </section>
    </div>
  );
};

export default Services;
