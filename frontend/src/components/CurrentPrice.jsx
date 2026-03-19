import React, { useMemo, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Crown, Gavel, Users, Eye, DollarSign } from 'lucide-react';

export default function CurrentPrice({ 
  currentPrice = 0,
  startingPrice = 0,
  currency = 'ر.س',
  timeLeft = 0,
  status = 'active',
  highestBidder = null,
  totalBids = 0,
  previousPrice = 0,
  viewersCount = 0,
  className = ''
}) {
  const [animatePrice, setAnimatePrice] = useState(false);
  const [priceChange, setPriceChange] = useState(0);

  // Calculate price change percentage and trend
  const priceAnalysis = useMemo(() => {
    const changeAmount = currentPrice - startingPrice;
    const changePercentage = startingPrice > 0 ? (changeAmount / startingPrice) * 100 : 0;
    const trend = changeAmount > 0 ? 'up' : changeAmount < 0 ? 'down' : 'neutral';
    
    return { changeAmount, changePercentage, trend };
  }, [currentPrice, startingPrice]);

  // Animate price changes
  useEffect(() => {
    if (previousPrice > 0 && currentPrice !== previousPrice) {
      setAnimatePrice(true);
      setPriceChange(currentPrice - previousPrice);
      const timer = setTimeout(() => setAnimatePrice(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPrice, previousPrice]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA').format(price);
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return 'انتهى الوقت';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active': return timeLeft <= 300 ? 'text-red-600' : 'text-green-600'; // 5 minutes warning
      case 'ended': return 'text-red-600';
      case 'upcoming': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'active': 
        return (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            timeLeft <= 300 
              ? 'bg-red-100 text-red-600 animate-pulse' 
              : 'bg-green-100 text-green-600'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              timeLeft <= 300 ? 'bg-red-500' : 'bg-green-500'
            }`} />
            {timeLeft <= 300 ? 'اللحظات الأخيرة' : 'نشط الآن'}
          </div>
        );
      case 'ended':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            انتهى المزاد
          </div>
        );
      case 'upcoming':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
            قريباً
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`} dir="rtl">
      {/* Header with Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">السعر الحالي</h3>
          {getStatusBadge()}
        </div>
      </div>

      {/* Main Price Display */}
      <div className="px-6 py-8 text-center">
        <div className={`transition-all duration-500 ${animatePrice ? 'scale-110' : 'scale-100'}`}>
          <div className="text-4xl lg:text-6xl font-bold text-gray-800 mb-2">
            <span className={animatePrice && priceChange > 0 ? 'text-green-600' : ''}>
              {formatPrice(currentPrice)}
            </span>
            <span className="text-2xl lg:text-3xl text-gray-500 mr-2">{currency}</span>
          </div>
          
          {/* Price Change Animation */}
          {animatePrice && priceChange > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-bounce">
                +{formatPrice(priceChange)} {currency}
              </div>
            </div>
          )}
        </div>

        {/* Price Change from Starting Price */}
        {priceAnalysis.changeAmount !== 0 && (
          <div className="flex items-center justify-center space-x-2 space-x-reverse mt-3">
            {priceAnalysis.trend === 'up' ? (
              <TrendingUp size={20} className="text-green-500" />
            ) : (
              <TrendingDown size={20} className="text-red-500" />
            )}
            <span className={`text-lg font-medium ${
              priceAnalysis.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceAnalysis.trend === 'up' ? '+' : ''}{formatPrice(priceAnalysis.changeAmount)} {currency}
            </span>
            <span className="text-gray-500 text-sm">
              ({priceAnalysis.changePercentage.toFixed(1)}%)
            </span>
          </div>
        )}

        {/* Starting Price Reference */}
        <div className="text-sm text-gray-500 mt-2">
          السعر الافتتاحي: {formatPrice(startingPrice)} {currency}
        </div>
      </div>

      {/* Time Left */}
      {status === 'active' && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-3 space-x-reverse">
            <Clock size={20} className={getStatusColor()} />
            <div className="text-center">
              <div className="text-sm text-gray-600">الوقت المتبقي</div>
              <div className={`text-xl font-bold ${getStatusColor()}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
          {/* Progress Bar for Time */}
          {timeLeft > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    timeLeft <= 300 ? 'bg-red-500' : timeLeft <= 900 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, (timeLeft / 3600) * 100))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Highest Bidder Info */}
      {highestBidder && status === 'active' && (
        <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Crown size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">أعلى مزايد</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-800">{highestBidder.name}</div>
              <div className="text-xs text-gray-500">منذ {highestBidder.timeAgo}</div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1 space-x-reverse text-blue-600 mb-1">
              <Gavel size={16} />
              <span className="text-xs font-medium">المزايدات</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{totalBids.toLocaleString()}</div>
          </div>
          
          {viewersCount > 0 && (
            <div>
              <div className="flex items-center justify-center space-x-1 space-x-reverse text-green-600 mb-1">
                <Eye size={16} />
                <span className="text-xs font-medium">المشاهدون</span>
              </div>
              <div className="text-lg font-bold text-gray-800">{viewersCount.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Winner Display for Ended Auctions */}
      {status === 'ended' && highestBidder && (
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200">
          <div className="text-center">
            <Crown size={24} className="text-yellow-500 mx-auto mb-2" />
            <h4 className="text-lg font-bold text-gray-800 mb-1">الفائز</h4>
            <p className="text-gray-600">{highestBidder.name}</p>
            <p className="text-sm text-gray-500 mt-1">بمبلغ {formatPrice(currentPrice)} {currency}</p>
          </div>
        </div>
      )}
    </div>
  );
}