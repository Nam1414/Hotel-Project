import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-display font-bold text-primary tracking-widest mb-6 block">KANT</Link>
            <p className="text-gray-500 max-w-md leading-relaxed mb-8">
              Experience the pinnacle of luxury and comfort at KANT Hotel. Our world-class amenities and personalized service ensure an unforgettable stay in the heart of the city.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary hover:scale-110 transition-all duration-300">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary hover:scale-110 transition-all duration-300">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary hover:scale-110 transition-all duration-300">
                <Twitter size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-[0.2em] mb-8">Navigation</h3>
            <ul className="space-y-4">
              <li><Link to="/rooms" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Rooms</Link></li>
              <li><Link to="/services" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Services</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-[0.2em] mb-8">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase font-bold mb-1">Address</span>
                123 Luxury Ave, Paradise City
              </li>
              <li className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase font-bold mb-1">Phone</span>
                +1 (555) 123-4567
              </li>
              <li className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase font-bold mb-1">Email</span>
                contact@kant.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] font-bold tracking-widest uppercase">
          <p>© 2026 KANT HOTEL ERP. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
