import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Clock, Users, TrendingUp, Gavel, Star, Eye } from 'lucide-react';

const AuctionSlider = ({ title, auctions, autoPlay = true, showControls = true }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [itemsPerView, setItemsPerView] = useState(3);
  const slideInterval = useRef(null);
  const sliderRef = useRef(null);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerView(3);
      } else if (width >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlide = Math.max(0, auctions.length - itemsPerView);

  // Auto play functionality
  useEffect(() => {
    if (isAutoPlaying && auctions.length > itemsPerView) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
      }, 4000);
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isAutoPlaying, maxSlide, auctions.length, itemsPerView]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(Math.min(slideIndex, maxSlide));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      setIsAutoPlaying(true);
    }
  };

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

  const getStatusBadge = (auction) => {
    if (auction.status === 'active') {
      const timeLeft = new Date(auction.endTime).getTime() - new Date().getTime();
      const hoursLeft = timeLeft / (1000 * 60 * 60);
      
      if (hoursLeft <= 2) {
        return { text: 'ينتهي قريباً', color: 'bg-red-500' };
      }
      return { text: 'نشط الآن', color: 'bg-green-500' };
    }
    if (auction.status === 'upcoming') {
      return { text: 'قريباً', color: 'bg-blue-500' };
    }
    return { text: 'انتهى', color: 'bg-gray-500' };
  };

  if (!auctions || auctions.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">لا توجد مزادات متاحة حالياً</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              {title}
            </h3>
            {showControls && auctions.length > itemsPerView && (
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentSlide === 0}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentSlide >= maxSlide}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Slider Container */}
        <div 
          ref={sliderRef}
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
              width: `${(auctions.length / itemsPerView) * 100}%`
            }}
          >
            {auctions.map((auction, index) => {
              const statusBadge = getStatusBadge(auction);
              
              return (
                <div 
                  key={auction.id || index}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / auctions.length}%` }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    {/* Image Container */}
                    <div className="relative">
                      <img 
                        src={auction.coverImage || auction.image} 
                        alt={auction.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`${statusBadge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                          {statusBadge.text}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                          <Star className="w-4 h-4 text-yellow-500" />
                        </button>
                        <button className="bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-colors duration-300">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      {/* Category and Time */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                          {auction.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 ml-1" />
                          {getTimeRemaining(auction.endTime)}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {auction.title}
                      </h4>
                      
                      {/* Price */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">السعر الحالي</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatPrice(auction.currentBid || auction.startingPrice)}
                          </span>
                        </div>
                        
                        {auction.startingPrice && auction.currentBid !== auction.startingPrice && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">سعر البداية</span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(auction.startingPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 ml-1" />
                          {auction.participants || 0}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-3 h-3 ml-1" />
                          {auction.views || 0}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <Link 
                        to={`/auction/${auction.id}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <Gavel className="w-4 h-4 inline ml-1" />
                        دخول المزاد
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        {auctions.length > itemsPerView && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AuctionSlider;