import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="bg-[#F9F6F1] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop" 
          alt="About KANT" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-display text-white mb-4 tracking-widest"
          >
            THE KANT STORY
          </motion.h1>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-display text-gray-800 mb-10 italic">"Redefining Modern Luxury"</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Founded on the principles of elegance, sophistication, and unparalleled service, 
          KANT Hotel has been a beacon of luxury since its inception. We believe that 
          true luxury lies in the details—the subtle nuances that transform a stay into 
          an unforgettable experience.
        </p>
        <p className="text-gray-600 text-lg leading-relaxed">
          Our mission is to provide a sanctuary for the discerning traveler, a place where 
          modern design meets timeless hospitality. From our meticulously designed suites 
          to our world-class amenities, every aspect of KANT is crafted to exceed expectations.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4">Our Vision</h3>
            <h4 className="text-4xl font-display font-bold text-gray-800 mb-6">To be the global benchmark for boutique luxury hospitality.</h4>
            <p className="text-gray-500 leading-relaxed">
              We envision a world where every journey is enriched by authentic experiences 
              and refined comfort. KANT aims to lead the industry through innovation, 
              sustainability, and a relentless commitment to excellence.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4">Our Mission</h3>
            <h4 className="text-4xl font-display font-bold text-gray-800 mb-6">Creating timeless moments through personalized service.</h4>
            <p className="text-gray-500 leading-relaxed">
              Our mission is to anticipate and fulfill the unspoken needs of our guests. 
              We empower our staff to deliver personalized service that makes every 
              guest feel valued, respected, and truly at home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop" alt="Interior" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4df85b?q=80&w=2070&auto=format&fit=crop" alt="Lobby" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
