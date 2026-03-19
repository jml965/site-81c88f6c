import React, { useState, useEffect, useRef } from 'react';
import { useBidding } from '../hooks/useBidding';
import { TrendingUp, User, Clock, Crown, Zap, Activity, Eye } from 'lucide-react';

const LiveBids = ({ auctionId, currentUserId }) => {
  const { bids, isLoading, stats } = useBidding(auctionId);
  const [filter, setFilter] = useState('all'); // all, recent, mine, top
  const [animate, setAnimate] = useState(null);
  const scrollRef = useRef(null);
  const prevBidsLength = useRef(0);

  useEffect(() => {
    // Auto-scroll to latest bid when new bid arrives
    if (bids.length > prevBidsLength.current) {
      setAnimate(bids[0]?.id);
      setTimeout(() => setAnimate(null), 1000);
      
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }
    prevBidsLength.current = bids.length;
  }, [bids]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - bidTime) / 1000);
    
    if (diffInSeconds < 60) {
      return `منذ ${diffInSeconds} ثانية`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `منذ ${minutes} دقيقة`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `منذ ${hours} ساعة`;
    }
  };

  const getFilteredBids = () => {
    switch (filter) {
      case 'recent':
        return bids.slice(0, 10);
      case 'mine':
        return bids.filter(bid => bid.userId === currentUserId);
      case 'top':
        return [...bids].sort((a, b) => b.amount - a.amount).slice(0, 10);
      default:
        return bids;
    }
  };

  const filteredBids = getFilteredBids();
  const highestBid = bids[0];
  const userBids = bids.filter(bid => bid.userId === currentUserId);
  const userHighestBid = userBids[0];

  const getBidRank = (bidAmount) => {
    const sortedAmounts = [...new Set(bids.map(bid => bid.amount))].sort((a, b) => b - a);
    return sortedAmounts.indexOf(bidAmount) + 1;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">المزايدات المباشرة</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>{bids.length} مزايدة</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {highestBid ? formatCurrency(highestBid.amount) : '0 ريال'}
            </div>
            <div className="text-xs text-gray-500">أعلى مزايدة</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {stats?.participantCount || 0}
            </div>
            <div className="text-xs text-gray-500">مشارك</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {userBids.length}
            </div>
            <div className="text-xs text-gray-500">مزايداتي</div>
          </div>
        </div>

        {/* User Status */}
        {currentUserId && userHighestBid && (
          <div className="mt-3 bg-white rounded-lg p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مزايدتك الأعلى:</span>
              <div className="text-right">
                <span className="font-bold text-green-600">
                  {formatCurrency(userHighestBid.amount)}
                </span>
                <span className="block text-xs text-gray-500">
                  المرتبة #{getBidRank(userHighestBid.amount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { key: 'all', label: 'الكل', icon: Activity },
            { key: 'recent', label: 'الأحدث', icon: Clock },
            { key: 'mine', label: 'مزايداتي', icon: User },
            { key: 'top', label: 'الأعلى', icon: Crown }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
                ${filter === key 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
              {key === 'mine' && userBids.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {userBids.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bids List */}
      <div 
        ref={scrollRef}
        className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {filteredBids.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-lg font-medium mb-2">لا توجد مزايدات</p>
            <p className="text-sm text-center">
              {filter === 'mine' 
                ? 'لم تقم بأي مزايدات بعد' 
                : 'كن أول من يزايد على هذا المنتج'
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredBids.map((bid, index) => {
              const isCurrentUser = bid.userId === currentUserId;
              const isHighest = index === 0 && filter === 'all';
              const isAnimating = animate === bid.id;
              const rank = getBidRank(bid.amount);
              
              return (
                <div
                  key={bid.id}
                  className={`
                    relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-500
                    ${isCurrentUser 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                    }
                    ${isHighest ? 'ring-2 ring-green-500 shadow-lg' : ''}
                    ${isAnimating ? 'scale-105 shadow-xl ring-2 ring-yellow-400' : ''}
                  `}
                >
                  {/* User Avatar */}
                  <div className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${isCurrentUser ? 'bg-blue-600' : 'bg-gray-600'}
                  `}>
                    <User className="w-5 h-5" />
                    {isHighest && (
                      <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                    )}
                  </div>

                  {/* Bid Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`
                        text-sm font-medium truncate
                        ${isCurrentUser ? 'text-blue-800' : 'text-gray-800'}
                      `}>
                        {isCurrentUser ? 'أنت' : bid.userName || `مزايد ${bid.id.slice(-4)}`}
                      </span>
                      {rank <= 3 && (
                        <span className={`
                          px-2 py-0.5 text-xs font-bold rounded-full
                          ${rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            rank === 2 ? 'bg-gray-100 text-gray-800' :
                            'bg-orange-100 text-orange-800'
                          }
                        `}>
                          #{rank}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(bid.timestamp)}</span>
                      {isAnimating && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <Zap className="w-3 h-3" />
                          جديد
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className={`
                      text-lg font-bold
                      ${isHighest ? 'text-green-600' : 
                        isCurrentUser ? 'text-blue-600' : 'text-gray-800'
                      }
                    `}>
                      {formatCurrency(bid.amount)}
                    </div>
                    {index > 0 && (
                      <div className="text-xs text-gray-500">
                        +{formatCurrency(bid.amount - (filteredBids[index + 1]?.amount || 0))}
                      </div>
                    )}
                  </div>

                  {/* Animation overlay */}
                  {isAnimating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent animate-pulse rounded-lg" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {bids.length > 0 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>آخر تحديث: {formatTime(bids[0]?.timestamp)}</span>
            <span>إجمالي المزايدات: {bids.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveBids;