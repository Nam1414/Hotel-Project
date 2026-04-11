import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { App, Tag } from 'antd';
import { Calendar, User } from 'lucide-react';
import { contentApi, type ArticleListItemDto, type ArticleCategoryDto } from '../../services/contentApi';

const Articles: React.FC = () => {
  const { message } = App.useApp();
  const [articles, setArticles] = useState<ArticleListItemDto[]>([]);
  const [categories, setCategories] = useState<ArticleCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesData, categoriesData] = await Promise.all([
          contentApi.getArticles(),
          contentApi.getCategories()
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (err: any) {
        message.error('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [message]);

  const filteredArticles = useMemo(() => {
    if (!activeCategoryId) return articles;
    return articles.filter(a => {
      const cat = categories.find(c => c.name === a.category);
      return cat?.id === activeCategoryId;
    });
  }, [articles, categories, activeCategoryId]);

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Hero Section */}
      <section className="relative h-[30vh] sm:h-[40vh] flex items-center justify-center bg-dark-base overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-c6a4d27160c7?auto=format&fit=crop&q=80"
            alt="News Hero"
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
            Tin tức
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-primary mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-xl mx-auto font-light text-lg tracking-wide"
          >
            Khám phá những câu chuyện, sự kiện và ưu đãi đặc quyền từ KANT.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm font-semibold tracking-wider uppercase ${
              activeCategoryId === null 
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-transparent border-primary/30 text-primary hover:bg-primary/5'
            }`}
          >
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategoryId(category.id)}
              className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm font-semibold tracking-wider uppercase ${
                activeCategoryId === category.id 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-transparent border-primary/30 text-primary hover:bg-primary/5'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-2xl h-96 animate-pulse p-4 flex flex-col justify-end">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5 flex flex-col"
              >
                <Link to={`/news/${article.slug}`} className="block relative w-full h-64 overflow-hidden bg-slate-100">
                  {article.thumbnailUrl ? (
                    <img 
                      src={article.thumbnailUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="font-display tracking-widest opacity-30 text-2xl">KANT</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Tag className="bg-white/90 backdrop-blur-sm border-none text-primary px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
                      {article.category}
                    </Tag>
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-xs text-gray-400 gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary"/>
                      {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-primary"/>
                      {article.author}
                    </div>
                  </div>
                  
                  <Link to={`/news/${article.slug}`}>
                    <h3 className="text-xl font-display font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-6">
                    <Link 
                      to={`/news/${article.slug}`}
                      className="inline-flex items-center text-primary font-bold text-sm tracking-wider uppercase group-hover:text-primary-dark transition-colors"
                    >
                      Đọc tiếp
                      <motion.span 
                        className="ml-2 inline-block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-black/5">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-400">Chưa có bài viết nào trong danh mục này.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Articles;
