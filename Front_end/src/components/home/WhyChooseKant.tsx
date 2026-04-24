import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseKant: React.FC = () => {
  const features = [
    {
      title: 'Exceptional Quality',
      description: 'Every detail is carefully crafted to deliver excellence in every aspect of your stay.'
    },
    {
      title: 'Luxury Experience',
      description: 'A perfect blend of elegance, comfort, and sophistication designed for the elite.'
    },
    {
      title: 'Personalized Service',
      description: 'Tailored experiences designed around your unique needs and preferences.'
    },
    {
      title: 'Prime Location',
      description: 'Located in the heart of the city for your ultimate convenience and accessibility.'
    }
  ];

  return (
    <section className="py-24 px-4 bg-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4"
            >
              The KANT Distinction
            </motion.h3>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-title mb-8 leading-tight"
            >
              Why Choose KANT?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted text-lg leading-relaxed mb-10 max-w-xl"
            >
              Experience refined luxury and exceptional service that goes beyond the ordinary. 
              We create moments that last a lifetime.
            </motion.p>
            <div className="w-20 h-1 bg-primary/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="w-10 h-[1px] bg-primary/40 mb-4 group-hover:w-full transition-all duration-500" />
                <h4 className="text-xl font-display font-bold text-title mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h4>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseKant;
