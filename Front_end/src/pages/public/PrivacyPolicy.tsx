import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-dark-base min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6 italic">Privacy Policy</h1>
          <p className="text-gray-500 uppercase tracking-[0.2em] font-bold text-xs">Last Updated: April 24, 2026</p>
        </motion.div>

        <div className="glass-card p-10 md:p-16 space-y-12 text-gray-400 leading-relaxed">
          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">Introduction</h2>
            </div>
            <p>
              At KANT Luxury Hotel, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website or stay at our properties. We are committed to protecting your personal data and ensuring it is handled in a secure and responsible manner.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">Data We Collect</h2>
            </div>
            <p className="mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-3">
              <li>Personal identification information (Name, email address, phone number, physical address).</li>
              <li>Payment and financial information for bookings and services.</li>
              <li>Reservation details and preferences to personalize your stay.</li>
              <li>Information provided through surveys, feedback forms, or guest reviews.</li>
              <li>Passport or ID information as required by regional security regulations.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">How We Protect Your Data</h2>
            </div>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights and are required to keep the information confidential. We use SSL (Secure Sockets Layer) technology to ensure that your sensitive information is encrypted during transmission.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-wide">Third-Party Disclosure</h2>
            </div>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties unless we provide you with advance notice or as required by law. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-sm">For any questions regarding this policy, please contact us at <span className="text-primary font-bold">privacy@kant.com</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
