import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-[var(--bg-main)] min-h-screen py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
          >
            Liên hệ với chúng tôi
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-title mb-8 leading-tight"
          >
            Chúng tôi luôn sẵn lòng <span className="text-primary italic font-serif">hỗ trợ bạn</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg font-light leading-relaxed"
          >
            Cho dù bạn muốn đặt phòng, yêu cầu dịch vụ đặc biệt hay chỉ đơn giản là tìm hiểu thêm về KANT, 
            đội ngũ của chúng tôi luôn sẵn sàng lắng nghe.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 space-y-10 border border-luxury shadow-2xl"
            >
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-title mb-2">Địa chỉ</h3>
                  <p className="text-muted font-light leading-relaxed">
                    123 Ocean Avenue, Quận 1,<br /> Thành phố Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-title mb-2">Điện thoại</h3>
                  <p className="text-muted font-light tracking-wide">+84 28 1234 5678</p>
                  <p className="text-muted font-light tracking-wide">+84 90 9876 5432</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-title mb-2">Email</h3>
                  <p className="text-muted font-light">hello@kanthotel.vn</p>
                  <p className="text-muted font-light">reservations@kanthotel.vn</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <Clock3 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-title mb-2">Thời gian phục vụ</h3>
                  <p className="text-muted font-light">Lễ tân & Hỗ trợ đặt phòng: 24/7</p>
                  <p className="text-muted font-light">Dịch vụ Spa & Gym: 06:00 - 22:00</p>
                </div>
              </div>
            </motion.div>

            {/* Social Links placeholder */}
            <div className="flex justify-between items-center px-4">
              <h4 className="text-xs font-bold text-muted uppercase tracking-[0.2em]">Theo dõi chúng tôi</h4>
              <div className="flex gap-6">
                {['FB', 'IG', 'TW', 'LI'].map(s => (
                  <button key={s} className="text-muted hover:text-primary font-bold text-xs transition-colors">{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-10 md:p-12 border border-luxury shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} className="text-primary" />
              </div>
              
              <h2 className="text-3xl font-display font-bold text-title mb-10">Gửi lời nhắn cho chúng tôi</h2>
              
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-muted uppercase tracking-widest">Họ và tên</label>
                    <input className="input-luxury w-full" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-muted uppercase tracking-widest">Địa chỉ Email</label>
                    <input className="input-luxury w-full" placeholder="email@vi-du.com" type="email" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest">Chủ đề</label>
                  <input className="input-luxury w-full" placeholder="Yêu cầu đặt phòng, thắc mắc..." />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-muted uppercase tracking-widest">Nội dung lời nhắn</label>
                  <textarea className="input-luxury w-full min-h-[160px] resize-none py-4" placeholder="Chúng tôi có thể giúp gì cho bạn?" />
                </div>
                
                <div className="pt-4">
                  <button type="button" className="btn-gold w-full md:w-auto px-12 py-4 flex items-center justify-center gap-3 group">
                    GỬI LỜI NHẮN
                    <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 rounded-3xl overflow-hidden h-[500px] border border-luxury relative shadow-2xl group"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2034&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-var(--bg-main) to-transparent opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card p-6 border border-luxury text-center backdrop-blur-xl">
              <MapPin size={40} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-title mb-2">Vị trí của chúng tôi</h3>
              <p className="text-muted text-sm mb-6">Mở trong Google Maps để xem chỉ đường</p>
              <button className="btn-gold px-8 py-2 text-xs">XEM BẢN ĐỒ</button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Contact;
