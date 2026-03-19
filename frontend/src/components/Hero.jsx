import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Play, TrendingUp, Clock, Users, Gavel } from 'lucide-react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredAuctions = [
    {
      id: 1,
      title: 'مزاد السيارات الكلاسيكية النادرة',
      description: 'مجموعة استثنائية من السيارات الكلاسيكية والنادرة من أشهر الماركات العالمية',
      currentBid: 125000,
      participants: 89,
      endTime: '2025-01-14T20:30:00',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=800&fit=crop',
      category: 'سيارات',
      seller: 'معرض النخبة للسيارات'
    },
    {
      id: 2,
      title: 'مزاد اللوحات الفنية المعاصرة',
      description: 'أعمال فنية أصيلة من أشهر الفنانين العرب والعالميين',
      currentBid: 85000,
      participants: 67,
      endTime: '2025-01-14T22:00:00',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop',
      category: 'فن',
      seller: 'غاليري الفن المعاصر'
    },
    {
      id: 3,
      title: 'مزاد المجوهرات والألماس',
      description: 'مجموعة مختارة من أفخم المجوهرات والقطع النادرة',
      currentBid: 95000,
      participants: 134,
      endTime: '2025-01-14T23:45:00',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop',
      category: 'مجوهرات',
      seller: 'بيت المجوهرات الملكية'
    }
  ];

  const quickCategories = [
    { name: 'سيارات', icon: '🚗', count: 45 },
    { name: 'مجوهرات', icon: '💎', count: 23 },
    { name: 'فن', icon: '🎨', count: 18 },
    { name: 'تحف', icon: '🏺', count: 31 },
    { name: 'ساعات', icon: '⌚', count: 12 },
    { name: 'إلكترونيات', icon: '📱', count: 27 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredAuctions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredAuctions.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const timeLeft = end - now;
    
    if (timeLeft <= 0) return 'انتهى';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/auctions?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const currentAuction = featuredAuctions[currentSlide];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={currentAuction.image}
          alt={currentAuction.title}
          className="w-full h-full object-cover transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse"></div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium">
                  <div className="w-3 h-3 bg-red-500 rounded-full ml-2 animate-pulse"></div>
                  مزاد نشط الآن
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    مزاد موشن
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl lg:text-4xl font-normal text-blue-200">
                    المزادات المرئية الذكية
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                  شارك في مزادات فيديو حقيقية ومثيرة، زايد بذكاء، واربح أفضل العروض من راحة منزلك
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="w-full max-w-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن المزادات، الفئات، أو المنتجات..."
                    className="w-full py-4 pr-14 pl-6 text-lg bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 left-0 flex items-center px-6 bg-blue-600 text-white rounded-l-2xl hover:bg-blue-700 transition-colors duration-300"
                  >
                    بحث
                  </button>
                </div>
              </form>

              {/* Quick Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">الفئات الشائعة</h3>
                <div className="flex flex-wrap gap-3">
                  {quickCategories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/auctions?category=${encodeURIComponent(category.name)}`}
                      className="inline-flex items-center bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                    >
                      <span className="ml-2">{category.icon}</span>
                      {category.name}
                      <span className="mr-2 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to={`/auction/${currentAuction.id}`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <Play className="w-6 h-6 ml-2" />
                  شاهد المزاد النشط
                </Link>
                <Link 
                  to="/auctions"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
                >
                  <Gavel className="w-6 h-6 ml-2" />
                  تصفح جميع المزادات
                </Link>
              </div>
            </div>

            {/* Right Content - Featured Auction Card */}
            <div className="lg:flex justify-end hidden">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                  <div className="relative mb-6">
                    <img 
                      src={currentAuction.image} 
                      alt={currentAuction.title}
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        نشط الآن
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70 transition-colors duration-300 cursor-pointer">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-200 font-medium bg-blue-500/20 px-3 py-1 rounded-full">
                        {currentAuction.category}
                      </span>
                      <div className="flex items-center text-sm text-blue-200">
                        <Clock className="w-4 h-4 ml-1" />
                        {getTimeRemaining(currentAuction.endTime)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold leading-tight line-clamp-2">
                      {currentAuction.title}
                    </h3>
                    
                    <p className="text-blue-100 text-sm line-clamp-2">
                      {currentAuction.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-200">السعر الحالي</span>
                        <span className="text-2xl font-bold text-green-400">
                          {formatPrice(currentAuction.currentBid)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-blue-200">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 ml-1" />
                          {currentAuction.participants} مشارك
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 ml-1" />
                          مزايدة نشطة
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/auction/${currentAuction.id}`}
                      className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      دخول المزاد
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredAuctions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-blue-300">1,250+</div>
              <div className="text-sm text-blue-100">مزاد نشط</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-green-300">45,600+</div>
              <div className="text-sm text-green-100">مستخدم مسجل</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-purple-300">2.8M+</div>
              <div className="text-sm text-purple-100">ريال تداول يومي</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-yellow-300">98%</div>
              <div className="text-sm text-yellow-100">معدل الرضا</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;