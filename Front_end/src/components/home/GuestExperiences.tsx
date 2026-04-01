import React from 'react';
import { motion } from 'framer-motion';
import TestimonialCard from './TestimonialCard';

const GuestExperiences: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      rating: 5,
      review: 'An absolutely breathtaking experience. The attention to detail and personalized service made our anniversary truly special. KANT is the gold standard of luxury.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
    },
    {
      name: 'James Wilson',
      rating: 5,
      review: 'The most refined hotel I have ever stayed in. From the infinity pool to the world-class dining, everything was flawless. Highly recommended for business travelers.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
    },
    {
      name: 'Elena Rodriguez',
      rating: 5,
      review: 'A sanctuary of peace in the heart of the city. The staff went above and beyond to ensure our comfort. The Royal Suite is simply magnificent.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-24 px-4 bg-[var(--card-bg)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4"
          >
            Guest Experiences
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-medium text-[var(--text-title)] mb-6 italic"
          >
            What Our Guests Say
          </motion.h2>
          <div className="w-20 h-1 bg-primary/30 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuestExperiences;
