import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturedAuctions from '../components/FeaturedAuctions';
import StatsSection from '../components/StatsSection';
import CategoryGrid from '../components/CategoryGrid';
import { Gavel, TrendingUp, Users, Calendar, Clock, Star } from 'lucide-react';

const Home = () => {
  const upcomingAuctions = [
    {
      id: 1,
      title: 'مزاد السيارات الفاخرة',
      description: 'أفخم السيارات الأوروبية والأمريكية',
      startingPrice: 50000,
      currentBid: 75000,
      startTime: '2025-01-15T14:00:00',
      endTime: '2025-01-15T16:00:00',
      status: 'upcoming',
      participants: 34,
      views: 1250,
      likes: 89,
      coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      seller: 'معرض النخبة للسيارات',
      category: 'سيارات'
    },
    {
      id: 2,
      title: 'مزاد المجوهرات الشرقية',
      description: 'قطع نادرة من الذهب والألماس',
      startingPrice: 15000,
      currentBid: 22000,
      startTime: '2025-01-15T19:00:00',
      endTime: '2025-01-15T21:00:00',
      status: 'upcoming',
      participants: 67,
      views: 2100,
      likes: 156,
      coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
      seller: 'بيت المجوهرات الملكية',
      category: 'مجوهرات'
    },
    {
      id: 3,
      title: 'مزاد التحف والأنتيكات',
      description: 'قطع أثرية نادرة من العصر العثماني',
      startingPrice: 8000,
      currentBid: 12500,
      startTime: '2025-01-16T15:00:00',
      endTime: '2025-01-16T17:00:00',
      status: 'upcoming',
      participants: 23,
      views: 890,
      likes: 45,
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      seller: 'دار التراث العربي',
      category: 'تحف'
    }
  ];

  const topAuctions = [
    {
      id: 4,
      title: 'مزاد اللوحات الفنية',
      description: 'أعمال فنية من أشهر الرسامين العرب',
      startingPrice: 25000,
      currentBid: 95000,
      endTime: '2025-01-14T20:30:00',
      status: 'active',
      participants: 89,
      views: 3400,
      likes: 234,
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      seller: 'غاليري الفن المعاصر',
      category: 'فن'
    },
    {
      id: 5,
      title: 'مزاد الخيول العربية',
      description: 'خيول أصيلة من أفضل السلالات',
      startingPrice: 100000,
      currentBid: 185000,
      endTime: '2025-01-14T22:00:00',
      status: 'active',
      participants: 45,
      views: 2800,
      likes: 167,
      coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
      seller: 'مربط الأصالة',
      category: 'خيول'
    },
    {
      id: 6,
      title: 'مزاد الساعات الفاخرة',
      description: 'ساعات سويسرية فاخرة ومحدودة الإصدار',
      startingPrice: 30000,
      currentBid: 68000,
      endTime: '2025-01-14T23:45:00',
      status: 'active',
      participants: 56,
      views: 1900,
      likes: 123,
      coverImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=600&fit=crop',
      seller: 'متجر الزمن الراقي',
      category: 'ساعات'
    }
  ];

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

  const formatStartTime = (startTime) => {
    const date = new Date(startTime);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <StatsSection />
      
      <CategoryGrid />

      {/* المزادات النشطة */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-4">
              <Gavel className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              المزادات النشطة الآن
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              شارك الآن في المزادات الجارية واحصل على أفضل العروض
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topAuctions.map((auction) => (
              <div key={auction.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <img 
                    src={auction.coverImage} 
                    alt={auction.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      نشط الآن
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {auction.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 ml-1" />
                      {getTimeRemaining(auction.endTime)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {auction.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {auction.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">السعر الحالي</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(auction.currentBid)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 ml-1" />
                        {auction.participants} مشارك
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 ml-1" />
                        {auction.views} مشاهدة
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/auction/${auction.id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    دخول المزاد
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/auctions?status=active"
              className="inline-flex items-center px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              عرض جميع المزادات النشطة
              <TrendingUp className="w-5 h-5 mr-2" />
            </Link>
          </div>
        </div>
      </section>

      <FeaturedAuctions />

      {/* المزادات القادمة */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              المزادات القادمة
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              احجز موعدك مع أهم المزادات القادمة ولا تفوت الفرصة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingAuctions.map((auction) => (
              <div key={auction.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
                <div className="relative">
                  <img 
                    src={auction.coverImage} 
                    alt={auction.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      قريباً
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {auction.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 ml-1" />
                      قريباً
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {auction.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {auction.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">سعر البداية</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(auction.startingPrice)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">موعد البداية</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatStartTime(auction.startTime)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 ml-1" />
                        {auction.participants} متابع
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 ml-1" />
                        {auction.views} مشاهدة
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      to={`/auction/${auction.id}`}
                      className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                    >
                      عرض التفاصيل
                    </Link>
                    <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                      تذكيرني
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/auctions?status=upcoming"
              className="inline-flex items-center px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              عرض جميع المزادات القادمة
              <Calendar className="w-5 h-5 mr-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* شريط الدعوة للعمل */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            هل تريد بيع شيء؟
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            انشئ مزادك الخاص واعرض منتجاتك لآلاف المشترين المهتمين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/seller/create-auction"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              <Gavel className="w-6 h-6 ml-2" />
              إنشاء مزاد جديد
            </Link>
            <Link 
              to="/seller"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              تسجيل كبائع
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;