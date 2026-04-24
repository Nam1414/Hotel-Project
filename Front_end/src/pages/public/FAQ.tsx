import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ChevronRight } from 'lucide-react';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What are the check-in and check-out times?',
      answer: 'Standard check-in time is from 2:00 PM onwards, and check-out time is until 12:00 PM. Early check-in or late check-out may be available upon request and subject to availability and additional charges.'
    },
    {
      question: 'Is breakfast included in the room rate?',
      answer: 'Many of our packages include a complimentary gourmet breakfast at our signature restaurant. Please check your reservation details to confirm if breakfast is included in your stay.'
    },
    {
      question: 'Do you offer airport transfer services?',
      answer: 'Yes, we provide luxury private transfers to and from the international airport. You can arrange this service through our concierge or during the booking process on our website.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Our standard cancellation policy allows for free cancellation up to 48 hours before arrival. However, some special rates and holiday periods may have more restrictive policies. Please refer to your booking confirmation for specific details.'
    },
    {
      question: 'Are pets allowed in the hotel?',
      answer: 'We love animals! We have specifically designated pet-friendly rooms. A small additional cleaning fee applies, and we provide special amenities for your furry friends. Please notify us in advance if you are traveling with a pet.'
    },
    {
      question: 'Is there high-speed internet in the rooms?',
      answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the entire hotel, including all guest rooms, suites, and public areas.'
    }
  ];

  return (
    <div className="bg-dark-base min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6"
          >
            <HelpCircle size={32} />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4"
          >
            Assistance
          </motion.h3>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-medium text-white mb-6 italic"
          >
            Common Questions
          </motion.h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Everything you need to know about your stay at KANT. If you have more questions, feel free to contact our concierge.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`overflow-hidden border transition-all duration-300 ${
                activeIndex === index 
                  ? 'border-primary bg-primary/5 rounded-2xl' 
                  : 'border-white/5 bg-white/5 rounded-xl hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className={`text-lg font-display font-bold tracking-wide transition-colors ${
                  activeIndex === index ? 'text-primary' : 'text-white'
                }`}>
                  {faq.question}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  activeIndex === index ? 'bg-primary text-dark-base rotate-180' : 'bg-white/10 text-gray-500 group-hover:text-primary group-hover:bg-primary/10'
                }`}>
                  {activeIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-gray-400 leading-relaxed text-base border-t border-primary/10 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 luxury-card text-center">
          <h4 className="text-2xl font-display font-bold text-white mb-2">Still Have Questions?</h4>
          <p className="text-gray-400 mb-8">Our dedicated concierge team is available 24/7 to assist you with any inquiries or special requests.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="btn-gold px-10">CONTACT US</button>
            <button className="btn-outline-gold px-10">LIVE CHAT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
