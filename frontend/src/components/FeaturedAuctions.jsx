import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Users, Clock, Eye, Heart, Play, Gavel, ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedAuctions = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const featuredAuctions = {
    trending: [
      {
        id: 7,
        title: 'مزاد الساعات السويسرية الفاخرة',
        description: 'مجموعة استثنائية من الساعات السويسرية الأصلية من أشهر الماركات العالمية',
        startingPrice: 25000,
        currentBid: 78000,
        endTime: '2025-01-15T18:30:00',
        status: 'active',
        participants: 156,
        views: 4200,
        likes: 289,
        coverImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1594534783008-7538240c9b65?w=400&h=300&fit=crop',
        seller: 'متجر الزمن الراقي',
        category: 'ساعات',
        badge: 'الأكثر مشاهدة',
        badgeColor: 'bg-red-500',
        trending: true
      },
      {
        id: 8,
        title: 'مزاد الهواتف الذكية المحدودة',
        description: 'هواتف ذكية نادرة ومحدودة الإصدار من أفضل الشركات التقنية',
        startingPrice: 15000,
        currentBid: 45000,
        endTime: '2025-01-15T20:00:00',
        status: 'active',
        participants: 234,
        views: 5800,
        likes: 412,
        coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        seller: 'تك ستور برو',
        category: 'إلكترونيات',
        badge: 'إقبال مرتفع',
        badgeColor: 'bg-orange-500',
        trending: true
      },
      {
        id: 9,
        title: 'مزاد الكتب النادرة والمخطوطات',
        description: 'كتب تراثية نادرة ومخطوطات أصلية من مكتبات خاصة',
        startingPrice: 8000,
        currentBid: 28000,
        endTime: '2025-01-16T16:00:00',
        status: 'active',
        participants: 67,
        views: 2100,
        likes: 145,
        coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        seller: 'دار المخطوطات العربية',
        category: 'كتب',
        badge: 'تراث أصيل',
        badgeColor: 'bg-amber-600',
        trending: true
      },
      {
        id: 10,
        title: 'مزاد الدراجات النارية الرياضية',
        description: 'دراجات نارية رياضية فاخرة من أشهر الماركات الأوروبية واليابانية',
        startingPrice: 35000,
        currentBid: 89000,
        endTime: '2025-01-16T19:30:00',
        status: 'active',
        participants: 123,
        views: 3600,
        likes: 267,
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&h=300&fit=crop',
        seller: 'عالم الدراجات',
        category: 'مركبات',
        badge: 'عروض حصرية',
        badgeColor: 'bg-blue-500',
        trending: true
      }
    ],
    premium: [
      {
        id: 11,
        title: 'مزاد العقارات الفاخرة',
        description: 'عقارات استثمارية وفلل فاخرة في أرقى المناطق',
        startingPrice: 500000,
        currentBid: 850000,
        endTime: '2025-01-17T15:00:00',
        status: 'active',
        participants: 45,
        views: 1800,
        likes: 78,
        coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
        seller: 'عقارات النخبة',
        category: 'عقارات',
        badge: 'فئة VIP',
        badgeColor: 'bg-purple-600',
        premium: true
      },
      {
        id: 12,
        title: 'مزاد الأحجار الكريمة النادرة',
        description: 'أحجار كريمة طبيعية نادرة ومعتمدة من مختبرات عالمية',
        startingPrice: 75000,
        currentBid: 145000,
        endTime: '2025-01-17T20:00:00',
        status: 'active',
        participants: 89,
        views: 2400,
        likes: 167,
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop',
        seller: 'بيت الأحجار الكريمة',
        category: 'مجوهرات',
        badge: 'معتمد دولياً',
        badgeColor: 'bg-emerald-600',
        premium: true
      },
      {
        id: 13,
        title: 'مزاد الآلات الموسيقية التراثية',
        description: 'آلات موسيقية تراثية أصلية وآلات كلاسيكية عالمية',
        startingPrice: 12000,
        currentBid: 35000,
        endTime: '2025-01-18T17:30:00',
        status: 'active',
        participants: 56,
        views: 1650,
        likes: 98,
        coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
        seller: 'دار الموسيقى التراثية',
        category: 'موسيقى',
        badge: 'تراث أصيل',
        badgeColor: 'bg-amber-600',
        premium: true
      }
    ],
    ending: [
      {
        id: 14,
        title: 'مزاد الكاميرات الاحترافية',
        description: 'كاميرات تصوير احترافية ومعدات استوديو متقدمة',
        startingPrice: 18000,
        currentBid: 42000,
        endTime: '2025-01-14T23:59:00',
        status: 'active',
        participants: 78,
        views: 2300,
        likes: 134,
        coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
        seller: 'عدسة المحترف',
        category: 'إلكترونيات',
        badge: 'ينتهي قريباً',
        badgeColor: 'bg-red-600',
        ending: true
      },
      {
        id: 15,
        title: 'مزاد الأثاث العتيق',
        description: 'قطع أثاث عتيقة نادرة وتحف منزلية استثنائية',
        startingPrice: 6000,
        currentBid: 18500,
        endTime: '2025-01-15T01:30:00',
        status: 'active',
        participants: 45,
        views: 1200,
        likes: 67,
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop',
        seller: 'بيت التحف العتيقة',
        category: 'أثاث',
        badge: 'آخر ساعات',
        badgeColor: 'bg-red-600',
        ending: true
      }
    ]
  };

  const tabs = [
    { id: 'trending', label: 'الأكثر رواجاً', icon: TrendingUp, count: featuredAuctions.trending.length },
    { id: 'premium', label: 'المزادات المميزة', icon: Star, count: featuredAuctions.premium.length },
    { id: 'ending', label: 'ينتهي قريباً', icon: Clock, count: featuredAuctions.ending.length }
  ];

  const currentAuctions = featuredAuctions[activeTab] || [];
  const totalPages = Math.ceil(currentAuctions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedAuctions = currentAuctions.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const timeLeft = end - now;
    
    if (timeLeft <= 0) return 'انتهى';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}ي ${hours}س`;
    }
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 rounded-2xl mb-4">
            <Star className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            المزادات المميزة
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل المزادات وأكثرها إقبالاً من المستخدمين حول العالم
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <IconComponent className="w-5 h-5 ml-2" />
                {tab.label}
                <span className={`mr-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedAuctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Image and Video Thumbnail */}
              <div className="relative">
                <img 
                  src={auction.coverImage} 
                  alt={auction.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`${auction.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                    {auction.badge}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 hover:bg-black/70 transition-colors duration-300">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Video Thumbnail */}
                <div className="absolute bottom-4 right-4">
                  <div className="w-20 h-14 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                    <img 
                      src={auction.videoThumbnail} 
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Category and Time */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                    {auction.category}
                  </span>
                  <div className={`flex items-center text-sm font-medium ${
                    auction.ending ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <Clock className="w-4 h-4 ml-1" />
                    {getTimeRemaining(auction.endTime)}
                  </div>
                </div>
                
                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {auction.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {auction.description}
                </p>
                
                {/* Price Information */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">السعر الحالي</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(auction.currentBid)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">سعر البداية</span>
                    <span className="text-gray-700 font-medium">
                      {formatPrice(auction.startingPrice)}
                    </span>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 ml-1" />
                    {auction.participants} مشارك
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 ml-1" />
                    {auction.views} مشاهدة
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 ml-1" />
                    {auction.likes} إعجاب
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link 
                    to={`/auction/${auction.id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <Gavel className="w-5 h-5 inline ml-2" />
                    دخول المزاد
                  </Link>
                  <div className="flex gap-2">
                    <button className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300">
                      متابعة
                    </button>
                    <button className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300">
                      مشاركة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className="w-5 h-5 ml-1" />
              السابق
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === index
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                currentPage === totalPages - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              التالي
              <ChevronLeft className="w-5 h-5 mr-1" />
            </button>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to={`/auctions?filter=${activeTab}`}
            className="inline-flex items-center px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            عرض جميع المزادات
            <TrendingUp className="w-5 h-5 mr-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuctions;