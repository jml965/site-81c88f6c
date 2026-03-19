import React, { useState } from 'react';
import { Clock, TrendingUp, Award, User, ChevronDown, ChevronUp, Activity } from 'lucide-react';

export default function BidHistory({ bidHistory = [] }) {
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first, 'asc' for oldest first

  const formatPrice = (price) => {
    return price?.toLocaleString('ar-SA') + ' ريال';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // If within last hour, show minutes ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes === 0 ? 'الآن' : `منذ ${minutes} دقيقة`;
    }
    
    // If within last day, show hours ago
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `منذ ${hours} ساعة`;
    }
    
    // Otherwise show date and time
    return date.toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedBids = [...bidHistory].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const displayedBids = showAll ? sortedBids : sortedBids.slice(0, 5);
  const hasMoreBids = sortedBids.length > 5;

  const getHighestBid = () => {
    if (!bidHistory.length) return null;
    return Math.max(...bidHistory.map(bid => bid.amount));
  };

  const getLowestBid = () => {
    if (!bidHistory.length) return null;
    return Math.min(...bidHistory.map(bid => bid.amount));
  };

  const getAverageBid = () => {
    if (!bidHistory.length) return null;
    const total = bidHistory.reduce((sum, bid) => sum + bid.amount, 0);
    return Math.round(total / bidHistory.length);
  };

  if (!bidHistory || bidHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مزايدات</h3>
          <p className="text-gray-600">لم يتم تسجيل أي مزايدة على هذا المزاد بعد</p>
          <p className="text-sm text-gray-500 mt-1">كن أول من يزايد!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center">
            <Clock className="h-5 w-5 ml-2" />
            سجل المزايدات
          </h3>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
            {bidHistory.length} مزايدة
          </span>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatPrice(getHighestBid())}</div>
            <div className="text-sm opacity-90">أعلى مزايدة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatPrice(getAverageBid())}</div>
            <div className="text-sm opacity-90">متوسط المزايدات</div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{bidHistory.length}</div>
            <div className="text-xs text-gray-600">مزايدة</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{formatPrice(getHighestBid() - getLowestBid())}</div>
            <div className="text-xs text-gray-600">فرق السعر</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {new Set(bidHistory.map(bid => bid.bidder)).size}
            </div>
            <div className="text-xs text-gray-600">مزايد</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <TrendingUp className="h-4 w-4 ml-1" />
            {sortOrder === 'desc' ? 'الأحدث أولاً' : 'الأقدم أولاً'}
          </button>
          {hasMoreBids && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center"
            >
              {showAll ? 'عرض أقل' : `عرض الكل (${bidHistory.length})`}
              {showAll ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bid List */}
      <div className="max-h-96 overflow-y-auto">
        {displayedBids.map((bid, index) => {
          const isHighest = bid.amount === getHighestBid();
          const isWinning = bid.isWinning;
          const position = sortOrder === 'desc' ? index + 1 : displayedBids.length - index;
          
          return (
            <div
              key={bid.id}
              className={`p-4 border-b border-gray-100 transition-all hover:bg-gray-50 ${
                isWinning ? 'bg-green-50 border-green-200' : ''
              } ${isHighest && !isWinning ? 'bg-yellow-50 border-yellow-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                {/* Bidder Info */}
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isWinning 
                      ? 'bg-green-100 text-green-700'
                      : isHighest
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isWinning ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-medium text-gray-900">{bid.bidder}</span>
                      {isWinning && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          رابح حالياً
                        </span>
                      )}
                      {isHighest && !isWinning && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                          أعلى مزايدة
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{formatTime(bid.timestamp)}</div>
                  </div>
                </div>

                {/* Bid Amount */}
                <div className="text-left">
                  <div className={`text-lg font-bold ${
                    isWinning 
                      ? 'text-green-600'
                      : isHighest
                      ? 'text-yellow-600'
                      : 'text-gray-900'
                  }`}>
                    {formatPrice(bid.amount)}
                  </div>
                  <div className="text-sm text-gray-500">مزايدة #{position}</div>
                </div>
              </div>

              {/* Bid Details */}
              {(isWinning || isHighest) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    {isWinning && (
                      <span className="text-green-600 font-medium">المزايدة الرابحة الحالية</span>
                    )}
                    {isHighest && !isWinning && (
                      <span className="text-yellow-600 font-medium">أعلى مزايدة مسجلة</span>
                    )}
                    
                    {index === 0 && sortOrder === 'desc' && (
                      <span className="text-blue-600 font-medium">آخر مزايدة</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMoreBids && !showAll && (
        <div className="p-4 text-center border-t">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center w-full py-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            عرض {bidHistory.length - 5} مزايدة إضافية
            <ChevronDown className="h-4 w-4 mr-1" />
          </button>
        </div>
      )}

      {/* Footer Stats */}
      <div className="p-4 bg-gray-50 text-center">
        <div className="text-sm text-gray-600">
          المجموع: {bidHistory.length} مزايدة من {new Set(bidHistory.map(bid => bid.bidder)).size} مزايدين مختلفين
        </div>
        <div className="text-xs text-gray-500 mt-1">
          آخر تحديث: {formatTime(bidHistory[0]?.timestamp)}
        </div>
      </div>
    </div>
  );
}