import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-[var(--bg-main)] min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Contact Us</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-title mb-6">We Are Here to Help</h1>
          <p className="text-muted text-lg">
            Reach out for reservations, support, or tailored hospitality requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-8">
            <div className="flex gap-4">
              <MapPin className="text-primary mt-1" />
              <div>
                <h3 className="text-xl font-display font-bold text-title">Address</h3>
                <p className="text-muted">123 Ocean Avenue, District 1, Ho Chi Minh City</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="text-primary mt-1" />
              <div>
                <h3 className="text-xl font-display font-bold text-title">Phone</h3>
                <p className="text-muted">+84 28 1234 5678</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="text-primary mt-1" />
              <div>
                <h3 className="text-xl font-display font-bold text-title">Email</h3>
                <p className="text-muted">hello@kanthotel.vn</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock3 className="text-primary mt-1" />
              <div>
                <h3 className="text-xl font-display font-bold text-title">Availability</h3>
                <p className="text-muted">Reception and reservation support available 24/7.</p>
              </div>
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card space-y-6">
            <div>
              <label className="block text-sm font-bold text-muted uppercase tracking-widest mb-3">Full Name</label>
              <input className="input-luxury w-full" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted uppercase tracking-widest mb-3">Email</label>
              <input className="input-luxury w-full" placeholder="name@example.com" type="email" />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted uppercase tracking-widest mb-3">Message</label>
              <textarea className="input-luxury w-full min-h-40" placeholder="How can we help you?" />
            </div>
            <button type="button" className="btn-gold px-8 py-3">SEND MESSAGE</button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
