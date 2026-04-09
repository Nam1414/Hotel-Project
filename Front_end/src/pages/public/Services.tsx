import React from 'react';
import { motion } from 'framer-motion';
import { Car, ConciergeBell, Dumbbell, Sparkles, UtensilsCrossed, Waves } from 'lucide-react';

const services = [
  {
    icon: ConciergeBell,
    title: '24/7 Concierge',
    description: 'Personal assistance for transportation, tours, reservations, and special arrangements.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Signature Dining',
    description: 'Curated culinary experiences featuring local ingredients and refined international cuisine.',
  },
  {
    icon: Waves,
    title: 'Spa & Wellness',
    description: 'Relaxing treatments, sauna access, and wellness rituals designed for deep restoration.',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Studio',
    description: 'A modern workout space with premium equipment and flexible training hours.',
  },
  {
    icon: Car,
    title: 'Airport Transfer',
    description: 'Private transfer options for a seamless arrival and departure experience.',
  },
  {
    icon: Sparkles,
    title: 'Daily Housekeeping',
    description: 'Meticulous room care with attentive service standards throughout your stay.',
  },
];

const Services: React.FC = () => {
  return (
    <div className="bg-[var(--bg-main)] min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Hotel Services</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-title mb-6">Carefully Curated for Comfort</h1>
          <p className="text-muted text-lg">
            Every service is designed to make your stay smoother, warmer, and more memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-card"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-title mb-4">{service.title}</h3>
                <p className="text-muted leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;
