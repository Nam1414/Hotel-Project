import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Globe
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[var(--bg-main)] text-[var(--text-body)] border-t border-[var(--border-color)] transition-colors duration-300">
      {/* Subtle Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          
          {/* 1. BRAND */}
          <div className="flex flex-col space-y-3 text-center md:text-left">
            <Link to="/" className="text-2xl font-display font-black text-primary tracking-widest hover:opacity-80 transition-opacity">
              KANT
            </Link>
            <p className="text-xs leading-relaxed max-w-xs mx-auto md:mx-0 opacity-80">
              The ultimate luxury hotel management system. Elevating hospitality standards through precision and elegant technology.
            </p>
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary/70">
              Luxury & Premium Service
            </span>
          </div>

          {/* 2. QUICK LINKS */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-[var(--text-title)] uppercase tracking-[0.2em] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Our Rooms', path: '/rooms' },
                { name: 'Special Offers', path: '/vouchers' },
                { name: 'FAQ', path: '/faq' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Services', path: '/services' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-xs font-bold text-[var(--text-muted)] hover:text-primary tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center md:justify-start group"
                  >
                    <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2">
                      <ArrowRight size={10} />
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. CONTACT */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-[var(--text-title)] uppercase tracking-[0.2em] mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <div className="p-1.5 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <MapPin size={12} className="text-primary" />
                </div>
                <span className="text-xs font-bold text-[var(--text-muted)] tracking-[0.1em] uppercase">123 Luxury Ave, Paradise City</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <div className="p-1.5 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Phone size={12} className="text-primary" />
                </div>
                <span className="text-xs font-bold text-[var(--text-muted)] tracking-[0.1em] uppercase">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3 group">
                <div className="p-1.5 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Mail size={12} className="text-primary" />
                </div>
                <span className="text-xs font-bold text-[var(--text-muted)] tracking-[0.1em] uppercase">contact@kant.com</span>
              </li>
            </ul>
          </div>

          {/* 4. SOCIAL / ACTION */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-xs font-bold text-[var(--text-title)] uppercase tracking-[0.2em]">
              Connect With Us
            </h3>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, name: 'Facebook' },
                { icon: Instagram, name: 'Instagram' },
                { icon: Twitter, name: 'Twitter' },
                { icon: Linkedin, name: 'Linkedin' },
              ].map((social) => (
                <a 
                  key={social.name}
                  href="#" 
                  className="p-1.5 bg-primary/5 rounded-lg text-[var(--text-muted)] hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  aria-label={social.name}
                >
                  <social.icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <button className="btn-gold w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest group">
              <span>GET SUPPORT</span>
              <Globe size={12} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] text-center md:text-left">
            © 2026 KANT HOTEL ERP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

