import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Award, Eye, Calendar, Filter, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBids = ({ profile, stats, isOwnProfile }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, won, outbid, active
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - في التطبيق الحقيقي سيتم جلبها من API
  useEffect(() => {
    const mockBids = [
      {
        id: '1',
        auctionId: 'auction_1',
        auctionTitle: 'سيارة مرسيدس C200 موديل 2020',
        auctionImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
        bidAmount: 85000,
        currentHighest: 90000,
        status: 'outbid', // won, outbid, active
        timestamp: '2024-01-15T10:30:00Z',
        auctionEndTime: '2024-01-20T15:00:00Z',
        totalBids: 45,
        isWinning: false,
        category: 'سيارات'
      },
      {
        id: '2',
        auctionId: 'auction_2',
        auctionTitle: 'لوحة فنية أصلية للفنان أحمد مادون',
        auctionImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        bidAmount: 12500,
        currentHighest: 12500,
        status: 'won',
        timestamp: '2024-01-10T14:20:00Z',
        auctionEndTime: '2024-01-12T18:00:00Z',
        totalBids: 23,
        isWinning: true,
        category: 'فنون'
      },
      {
        id: '3',
        auctionId: 'auction_3',
        auctionTitle: 'ساعة رولكس كلاسيكية',
        auctionImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
        bidAmount: 45000,
        currentHighest: 45000,
        status: 'active',
        timestamp: '2024-01-18T09:15:00Z',
        auctionEndTime: '2024-01-25T20:00:00Z',
        totalBids: 12,
        isWinning: true,
        category: 'مجوهرات'
      },
      {
        id: '4',
        auctionId: 'auction_4',
        auctionTitle: 'جهاز MacBook Pro M3 جديد',
        auctionImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        bidAmount: 8500,
        currentHighest: 9200,
        status: 'outbid',
        timestamp: '2024-01-16T16:45:00Z',
        auctionEndTime: '2024-01-19T22:00:00Z',
        totalBids: 28,
        isWinning: false,
        category: 'إلكترونيات'
      },
      {
        id: '5',
        auctionId: 'auction_5',
        auctionTitle: 'دراجة نارية هارلي ديفيدسون',
        auctionImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        bidAmount: 125000,
        currentHighest: 125000,
        status: 'active',
        timestamp: '2024-01-17T11:30:00Z',
        auctionEndTime: '2024-01-30T17:00:00Z',
        totalBids: 8,
        isWinning: true,
        category: 'مركبات'
      },
      {
        id: '6',
        auctionId: 'auction_6',
        auctionTitle: 'كتاب نادر من القرن التاسع عشر',
        auctionImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        bidAmount: 3200,
        currentHighest: 3800,
        status: 'outbid',
        timestamp: '2024-01-14T13:20:00Z',
        auctionEndTime: '2024-01-16T19:00:00Z',
        totalBids: 15,
        isWinning: false,
        category: 'كتب'
      }
    ];

    setTimeout(() => {
      setBids(mockBids);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusInfo = (status, isWinning) => {
    switch (status) {
      case 'won':
        return {
          label: 'فائز',
          color: 'text-green-600 bg-green-100',
          icon: Award
        };
      case 'outbid':
        return {
          label: 'تم تجاوزها',
          color: 'text-red-600 bg-red-100',
          icon: TrendingDown
        };
      case 'active':
        return {
          label: isWinning ? 'مزايدة رائدة' : 'نشط',
          color: isWinning ? 'text-blue-600 bg-blue-100' : 'text-orange-600 bg-orange-100',
          icon: isWinning ? TrendingUp : Clock
        };
      default:
        return {
          label: 'غير معروف',
          color: 'text-gray-600 bg-gray-100',
          icon: Clock
        };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'انتهى';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} يوم`;
    if (hours > 0) return `${hours} ساعة`;
    return 'أقل من ساعة';
  };

  // Filter and sort bids
  const filteredBids = bids.filter(bid => {
    const matchesFilter = filter === 'all' || bid.status === filter;
    const matchesSearch = bid.auctionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedBids = filteredBids.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'highest':
        return b.bidAmount - a.bidAmount;
      case 'lowest':
        return a.bidAmount - b.bidAmount;
      default:
        return 0;
    }
  });

  const filterCounts = {
    all: bids.length,
    won: bids.filter(b => b.status === 'won').length,
    outbid: bids.filter(b => b.status === 'outbid').length,
    active: bids.filter(b => b.status === 'active').length
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-full md:w-32 animate-pulse"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">مزايداتي</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المزايدات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
            />
          </div>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="highest">الأعلى سعراً</option>
            <option value="lowest">الأقل سعراً</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'الكل', color: 'text-gray-600' },
          { key: 'active', label: 'نشط', color: 'text-orange-600' },
          { key: 'won', label: 'فائز', color: 'text-green-600' },
          { key: 'outbid', label: 'تم تجاوزها', color: 'text-red-600' }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all flex-shrink-0 ${
              filter === key
                ? `bg-blue-600 text-white shadow-lg`
                : `${color} hover:bg-gray-100`
            }`}
          >
            <Filter className="w-4 h-4" />
            {label}
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              filter === key
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {filterCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Bids List */}
      {sortedBids.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            {searchTerm ? 'لا توجد نتائج' : 'لا توجد مزايدات'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'لم نجد أي مزايدات تطابق البحث'
              : 'لم تقم بأي مزايدة بعد، ابدأ الآن واكتشف المزادات المتاحة'
            }
          </p>
          {!searchTerm && (
            <Link
              to="/auctions"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              استكشف المزادات
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBids.map(bid => {
            const statusInfo = getStatusInfo(bid.status, bid.isWinning);
            const StatusIcon = statusInfo.icon;
            const timeRemaining = getTimeRemaining(bid.auctionEndTime);
            
            return (
              <div key={bid.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {/* Auction Image */}
                  <Link to={`/auction/${bid.auctionId}`} className="flex-shrink-0">
                    <img
                      src={bid.auctionImage}
                      alt={bid.auctionTitle}
                      className="w-24 h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  
                  {/* Bid Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <Link 
                        to={`/auction/${bid.auctionId}`}
                        className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors truncate"
                      >
                        {bid.auctionTitle}
                      </Link>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                          <StatusIcon className="w-3 h-3 inline ml-1" />
                          {statusInfo.label}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {bid.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Bid Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">مزايدتي</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(bid.bidAmount)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">السعر الحالي</div>
                        <div className={`text-lg font-bold ${
                          bid.bidAmount === bid.currentHighest ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPrice(bid.currentHighest)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">الوقت المتبقي</div>
                        <div className="text-lg font-bold text-gray-800">
                          {timeRemaining}
                        </div>
                      </div>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {bid.totalBids} مزايدة
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(bid.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/auction/${bid.auctionId}`}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          عرض المزاد
                        </Link>
                        
                        {bid.status === 'active' && (
                          <Link
                            to={`/auction/${bid.auctionId}/room`}
                            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                          >
                            <TrendingUp className="w-3 h-3" />
                            دخول غرفة المزاد
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Summary Stats */}
      {sortedBids.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص المزايدات</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filterCounts.all}</div>
              <div className="text-sm text-blue-700">إجمالي المزايدات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filterCounts.won}</div>
              <div className="text-sm text-green-700">مزايدة فائزة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{filterCounts.active}</div>
              <div className="text-sm text-orange-700">مزايدة نشطة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatPrice(sortedBids.reduce((sum, bid) => sum + bid.bidAmount, 0))}
              </div>
              <div className="text-sm text-purple-700">إجمالي المبلغ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;