import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { App, Spin } from 'antd';
import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import { adminApi, type AttractionDto } from '../../services/adminApi';

const CATEGORIES = ['Tất cả', 'Lịch sử - Văn hóa', 'Thiên nhiên', 'Ẩm thực - Trải nghiệm', 'Tâm linh'];

const Attractions: React.FC = () => {
  const { message } = App.useApp();
  const [attractions, setAttractions] = useState<AttractionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getAttractions();
        setAttractions(data.filter((a: any) => a.isActive));
      } catch {
        message.error('Không thể tải danh sách điểm tham quan.');
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, [message]);

  const filtered = useMemo(() => {
    if (activeCategory === 'Tất cả') return attractions;
    return attractions.filter((a: any) => a.category === activeCategory);
  }, [attractions, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Hero */}
      <section className="relative h-[35vh] sm:h-[45vh] flex items-center justify-center bg-dark-base overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80"
            alt="Attractions Hero"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold text-white tracking-widest uppercase mb-4"
          >
            Điểm tham quan
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-primary mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-xl mx-auto font-light text-lg tracking-wide"
          >
            Khám phá những địa điểm hấp dẫn xung quanh Kant Hotel — Biên Hòa, Đồng Nai
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        {/* Category filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full border transition-all duration-300 text-sm font-semibold tracking-wider ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-transparent border-primary/30 text-primary hover:bg-primary/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((attraction: any, idx) => (
              <motion.div
                key={attraction.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {attraction.imageUrl ? (
                    <img
                      src={attraction.imageUrl}
                      alt={attraction.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <MapPin size={40} className="opacity-30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Category badge */}
                  {attraction.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full font-semibold text-[10px] uppercase tracking-widest">
                        {attraction.category}
                      </span>
                    </div>
                  )}

                  {/* Distance badge */}
                  {attraction.distanceKm && (
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
                        <Navigation size={12} />
                        {attraction.distanceKm} km
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-display font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors mb-2">
                    {attraction.name}
                  </h3>

                  {attraction.address && (
                    <p className="text-gray-400 text-sm flex items-start gap-1.5 mb-3">
                      <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                      {attraction.address}
                    </p>
                  )}

                  {attraction.description && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                      {attraction.description}
                    </p>
                  )}

                  {/* Map embed */}
                  {attraction.mapEmbedLink && (
                    <div className="mt-auto">
                      <div
                        className="w-full h-36 rounded-xl overflow-hidden border border-gray-100"
                        dangerouslySetInnerHTML={{
                          __html: attraction.mapEmbedLink.replace(
                            /width="[^"]*"/,
                            'width="100%"'
                          ).replace(
                            /height="[^"]*"/,
                            'height="144"'
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-black/5">
            <MapPin size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy địa điểm</h3>
            <p className="text-gray-400">Chưa có địa điểm nào trong danh mục này.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-10 md:p-14 text-white">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Sẵn sàng khám phá Biên Hòa?
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            Đặt phòng tại Kant Hotel để trải nghiệm sự thoải mái trọn vẹn sau mỗi hành trình khám phá.
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold tracking-wider uppercase text-sm transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50"
          >
            Xem phòng & Đặt ngay
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Attractions;
