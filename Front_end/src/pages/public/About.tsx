import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Award, Heart, Users } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { label: 'Rooms & Suites', value: '120+' },
    { label: 'Happy Guests', value: '15k+' },
    { label: 'Expert Staff', value: '80+' },
    { label: 'Awards Won', value: '25+' },
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop" 
          alt="About KANT" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-primary/50" />
            <span className="text-xs font-bold text-primary tracking-[0.4em] uppercase">Est. 1998</span>
            <div className="w-12 h-[1px] bg-primary/50" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-9xl font-serif italic text-white mb-8 tracking-tighter"
          >
            The Kant Legacy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-lg md:text-xl font-light tracking-widest uppercase max-w-xl mx-auto"
          >
            Crafting Unforgettable Experiences Through Elegance and Precision
          </motion.p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-32 px-4 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-black text-[var(--text-title)] mb-10 leading-tight">
            "We don't just host guests; we curate <span className="text-primary italic font-serif">masterpieces of time</span>."
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">
              Founded on the principles of elegance, sophistication, and unparalleled service, 
              KANT Hotel has been a beacon of luxury for over two decades. We believe that 
              true luxury lies in the details—the subtle nuances that transform a stay into 
              an unforgettable experience.
            </p>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">
              Our mission is to provide a sanctuary for the discerning traveler, a place where 
              modern design meets timeless hospitality. From our meticulously designed suites 
              to our world-class amenities, every aspect of KANT is crafted to exceed expectations 
              and create lasting memories.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary/5 border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-6xl font-display font-black text-primary mb-2 italic">{stat.value}</div>
              <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-[0.3em] uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                <Star size={16} />
                Our Vision
              </h3>
              <h4 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-title)] mb-6 leading-tight">
                To be the global benchmark for boutique luxury hospitality.
              </h4>
              <p className="text-[var(--text-muted)] leading-relaxed text-lg">
                We envision a world where every journey is enriched by authentic experiences 
                and refined comfort. KANT aims to lead the industry through innovation, 
                sustainability, and a relentless commitment to excellence.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
                <Heart size={16} />
                Our Mission
              </h3>
              <h4 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-title)] mb-6 leading-tight">
                Creating timeless moments through personalized service.
              </h4>
              <p className="text-[var(--text-muted)] leading-relaxed text-lg">
                Our mission is to anticipate and fulfill the unspoken needs of our guests. 
                We empower our staff to deliver personalized service that makes every 
                guest feel valued, respected, and truly at home.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop" alt="Staff" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-base/80 to-transparent flex items-end p-12">
                <div className="text-white">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-primary text-primary" />)}
                  </div>
                  <p className="text-xl italic font-serif mb-4">"The service here isn't just about needs; it's about anticipation. A truly royal experience."</p>
                  <p className="text-sm font-bold tracking-widest uppercase text-primary">— Jonathan Reeves, Guest</p>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/10 rounded-full -z-10 animate-spin-slow" />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-[var(--card-bg)] border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4">Core Principles</h3>
            <h2 className="text-4xl md:text-6xl font-serif italic text-[var(--text-title)]">Values That Define Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Authenticity', icon: Award, desc: 'We believe in genuine connections and staying true to our heritage while embracing the future.' },
              { title: 'Excellence', icon: Shield, desc: 'A relentless pursuit of perfection in every service, every room, and every guest interaction.' },
              { title: 'Community', icon: Users, desc: 'We value our people and the local communities we serve, fostering growth and shared prosperity.' }
            ].map(value => (
              <div key={value.title} className="p-10 border border-[var(--border-color)] rounded-3xl hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-dark-base transition-all">
                  <value.icon size={28} />
                </div>
                <h4 className="text-2xl font-display font-bold text-[var(--text-title)] mb-4">{value.title}</h4>
                <p className="text-[var(--text-muted)] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
