import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, TrendingUp, Users, Clock } from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'سيارات',
      description: 'سيارات فاخرة وكلاسيكية',
      icon: '🚗',
      count: 156,
      activeAuctions: 23,
      averagePrice: 185000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      trending: true
    },
    {
      id: 2,
      name: 'مجوهرات',
      description: 'ذهب وألماس وأحجار كريمة',
      icon: '💎',
      count: 89,
      activeAuctions: 15,
      averagePrice: 75000,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
      gradient: 'from-purple-600 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      trending: false
    },
    {
      id: 3,
      name: 'فن ولوحات',
      description: 'أعمال فنية أصلية ونادرة',
      icon: '🎨',
      count: 67,
      activeAuctions: 12,
      averagePrice: 45000,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      gradient: 'from-orange-600 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      trending: true
    },
    {
      id: 4,
      name: 'تحف وأنتيكات',
      description: 'قطع تراثية وأثرية نادرة',
      icon: '🏺',
      count: 134,
      activeAuctions: 18,
      averagePrice: 32000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      gradient: 'from-amber-600 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-50',
      trending: false
    },
    {
      id: 5,
      name: 'ساعات فاخرة',
      description: 'ساعات سويسرية ومحدودة',
      icon: '⌚',
      count: 45,
      activeAuctions: 8,
      averagePrice: 95000,
      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=600&fit=crop',
      gradient: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      trending: true
    },
    {
      id: 6,
      name: 'إلكترونيات',
      description: 'أجهزة ذكية ومعدات تقنية',
      icon: '📱',
      count: 98,
      activeAuctions: 14,
      averagePrice: 28000,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
      gradient: 'from-indigo-600 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50',
      trending: false
    },
    {
      id: 7,
      name: 'خيول عربية',
      description: 'خيول أصيلة وعالية النسب',
      icon: '🐎',
      count: 23,
      activeAuctions: 5,
      averagePrice: 250000,
      image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
      gradient: 'from-teal-600 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50',
      trending: true
    },
    {
      id: 8,
      name: 'عقارات',
      description: 'فلل وعقارات استثمارية',
      icon: '🏠',
      count: 34,
      activeAuctions: 6,
      averagePrice: 1200000,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      gradient: 'from-gray-600 to-slate-600',
      bgGradient: 'from-gray-50 to-slate-50',
      trending: false
    }
  ];

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}م ر.س`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}ك ر.س`;
    }
    return `${price} ر.س`;
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 rounded-2xl mb-4">
            <div className="text-2xl">🏷️</div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            تصفح حسب الفئة
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من المزادات المصنفة حسب الفئات المختلفة
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/auctions?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <div className={`relative bg-gradient-to-br ${category.bgGradient} rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50`}>
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    loading="lazy"
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    {category.trending && (
                      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <TrendingUp className="w-4 h-4 text-green-600 ml-1" />
                        <span className="text-xs font-semibold text-green-600">رائج</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Title and Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4 opacity-90">
                    {category.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 ml-1" />
                        <span>{category.count} مزاد</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Clock className="w-4 h-4 ml-1" />
                        <span>{category.activeAuctions} نشط</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">متوسط السعر</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(category.averagePrice)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className={`inline-flex items-center justify-center w-full py-3 bg-gradient-to-r ${category.gradient} text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 transform group-hover:scale-105`}>
                    تصفح المزادات
                    <ChevronLeft className="w-5 h-5 mr-2" />
                  </div>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              الفئات الأكثر رواجاً هذا الأسبوع
            </h3>
            <p className="text-lg text-blue-100">
              اكتشف أكثر الفئات نشاطاً ومشاركة من المستخدمين
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.filter(cat => cat.trending).slice(0, 3).map((category, index) => (
              <div key={category.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h4 className="text-lg font-bold mb-2">{category.name}</h4>
                <div className="text-sm text-blue-100 mb-3">
                  {category.activeAuctions} مزاد نشط
                </div>
                <Link 
                  to={`/auctions?category=${encodeURIComponent(category.name)}`}
                  className="inline-flex items-center text-sm font-semibold hover:underline"
                >
                  مشاهدة الكل
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-12">
          <Link 
            to="/categories"
            className="inline-flex items-center px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            عرض جميع الفئات
            <div className="w-5 h-5 mr-2">🏷️</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;