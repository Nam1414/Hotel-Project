import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="bg-dark-base min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <Gavel size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6 italic">Terms of Service</h1>
          <p className="text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">Effective Date: April 24, 2026</p>
        </motion.div>

        <div className="glass-card p-10 md:p-16 space-y-12 text-gray-400 leading-relaxed">
          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">Agreement to Terms</h2>
            </div>
            <p>
              By accessing or using the KANT Luxury Hotel website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These terms govern your use of our reservation system, your stay at our property, and all related services provided by KANT.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">Reservations & Payments</h2>
            </div>
            <p className="mb-4">Standard reservation and payment conditions include:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>All guests must be at least 18 years old to make a reservation.</li>
              <li>A valid credit card is required to secure your booking.</li>
              <li>Full payment or a deposit may be processed depending on the selected rate plan.</li>
              <li>Taxes and service charges are typically included unless otherwise stated.</li>
              <li>Reservations are subject to specific cancellation windows as noted during booking.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">Guest Responsibilities</h2>
            </div>
            <p>
              Guests are responsible for their conduct during their stay. KANT Luxury Hotel reserves the right to terminate our services to any guest who violates hotel policies, engages in illegal activities, or causes significant disturbance or damage to other guests or property. Guests will be liable for any costs related to damage caused to hotel facilities or property.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Gavel size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">Limitation of Liability</h2>
            </div>
            <p>
              While we strive to provide the highest quality service, KANT Luxury Hotel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or stay at our property, except as required by law.
            </p>
          </section>

          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-sm">If you have any questions about these Terms, please contact <span className="text-primary font-bold">legal@kant.com</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
