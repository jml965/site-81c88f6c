import React, { useState, useEffect } from 'react';
import { Heart, User, Tag, Eye, Calendar, TrendingUp, Search, Filter, UserPlus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyFollows = ({ profile, stats, isOwnProfile }) => {
  const [follows, setFollows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('auctions'); // auctions, sellers, categories
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - في التطبيق الحقيقي سيتم جلبها من API
  useEffect(() => {
    const mockFollows = {
      auctions: [
        {
          id: '1',
          auctionId: 'auction_1',
          title: 'سيارة مرسيدس C200 موديل 2020',
          image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
          currentPrice: 90000,
          status: 'active', // active, ended, upcoming
          endTime: '2024-01-25T15:00:00Z',
          totalBids: 45,
          totalViews: 1250,
          category: 'سيارات',
          followedAt: '2024-01-10T12:00:00Z',
          seller: {
            id: 'seller_1',
            name: 'محمد أحمد',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
          }
        },
        {
          id: '2',
          auctionId: 'auction_2',
          title: 'لوحة فنية أصلية للفنان أحمد مادون',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
          currentPrice: 15000,
          status: 'ended',
          endTime: '2024-01-12T18:00:00Z',
          totalBids: 23,
          totalViews: 890,
          category: 'فنون',
          followedAt: '2024-01-08T09:30:00Z',
          seller: {
            id: 'seller_2',
            name: 'سارة محمود',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
          }
        },
        {
          id: '3',
          auctionId: 'auction_3',
          title: 'ساعة رولكس كلاسيكية نادرة',
          image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
          currentPrice: 45000,
          status: 'upcoming',
          endTime: '2024-02-01T20:00:00Z',
          totalBids: 0,
          totalViews: 450,
          category: 'مجوهرات',
          followedAt: '2024-01-15T14:20:00Z',
          seller: {
            id: 'seller_3',
            name: 'عبدالله السالم',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
          }
        }
      ],
      sellers: [
        {
          id: 'seller_1',
          name: 'محمد أحمد',
          username: 'mohammed_ahmed',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          bio: 'متخصص في بيع السيارات الفاخرة والكلاسيكية',
          totalAuctions: 45,
          activeAuctions: 3,
          rating: 4.8,
          totalReviews: 156,
          followedAt: '2024-01-05T10:15:00Z',
          isVerified: true,
          specialties: ['سيارات', 'مركبات']
        },
        {
          id: 'seller_2',
          name: 'سارة محمود',
          username: 'sarah_art',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
          bio: 'فنانة ومجمعة للوحات الفنية الأصلية',
          totalAuctions: 28,
          activeAuctions: 2,
          rating: 4.9,
          totalReviews: 89,
          followedAt: '2024-01-07T16:30:00Z',
          isVerified: true,
          specialties: ['فنون', 'لوحات']
        },
        {
          id: 'seller_3',
          name: 'عبدالله السالم',
          username: 'luxury_watches',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          bio: 'خبير في الساعات الفاخرة والمجوهرات النادرة',
          totalAuctions: 67,
          activeAuctions: 5,
          rating: 4.7,
          totalReviews: 203,
          followedAt: '2024-01-12T11:45:00Z',
          isVerified: false,
          specialties: ['ساعات', 'مجوهرات']
        }
      ],
      categories: [
        {
          id: 'cars',
          name: 'سيارات',
          icon: '🚗',
          description: 'سيارات فاخرة وكلاسيكية ونادرة',
          totalAuctions: 245,
          activeAuctions: 12,
          followedAt: '2024-01-01T00:00:00Z',
          avgPrice: 75000,
          topSellers: 5
        },
        {
          id: 'art',
          name: 'فنون',
          icon: '🎨',
          description: 'لوحات فنية ومنحوتات وأعمال فنية أصلية',
          totalAuctions: 156,
          activeAuctions: 8,
          followedAt: '2024-01-03T00:00:00Z',
          avgPrice: 12500,
          topSellers: 3
        },
        {
          id: 'jewelry',
          name: 'مجوهرات',
          icon: '💎',
          description: 'ساعات فاخرة ومجوهرات نادرة',
          totalAuctions: 89,
          activeAuctions: 6,
          followedAt: '2024-01-06T00:00:00Z',
          avgPrice: 25000,
          topSellers: 4
        }
      ]
    };

    setTimeout(() => {
      setFollows(mockFollows);
      setLoading(false);
    }, 1000);
  }, []);

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
      day: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { label: 'نشط', color: 'text-green-600 bg-green-100' };
      case 'ended':
        return { label: 'انتهى', color: 'text-gray-600 bg-gray-100' };
      case 'upcoming':
        return { label: 'قريباً', color: 'text-blue-600 bg-blue-100' };
      default:
        return { label: 'غير معروف', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const getFilteredAndSortedData = () => {
    if (!follows[activeTab]) return [];
    
    let data = follows[activeTab].filter(item => {
      const searchableText = (
        (item.title || item.name || '') + 
        (item.category || '') + 
        (item.description || '')
      ).toLowerCase();
      return searchableText.includes(searchTerm.toLowerCase());
    });

    return data.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.followedAt) - new Date(a.followedAt);
        case 'oldest':
          return new Date(a.followedAt) - new Date(b.followedAt);
        case 'name':
          return (a.title || a.name).localeCompare(b.title || b.name, 'ar');
        default:
          return 0;
      }
    });
  };

  const tabs = [
    { id: 'auctions', label: 'المزادات', icon: TrendingUp, count: follows.auctions?.length || 0 },
    { id: 'sellers', label: 'البائعون', icon: User, count: follows.sellers?.length || 0 },
    { id: 'categories', label: 'التصنيفات', icon: Tag, count: follows.categories?.length || 0 }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          ))}
        </div>
        <div className="flex gap-4 mb-6">
          <div className="h-10 bg-gray-200 rounded-lg flex-1 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
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

  const filteredData = getFilteredAndSortedData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">متابعاتي</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المتابعات..."
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
            <option value="name">حسب الاسم</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            {searchTerm ? 'لا توجد نتائج' : 'لا توجد متابعات'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'لم نجد أي متابعات تطابق البحث'
              : `لم تتابع أي ${activeTab === 'auctions' ? 'مزادات' : activeTab === 'sellers' ? 'بائعين' : 'تصنيفات'} بعد`
            }
          </p>
          {!searchTerm && (
            <Link
              to={activeTab === 'sellers' ? '/sellers' : '/auctions'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {activeTab === 'auctions' ? 'استكشف المزادات' : 'استكشف البائعين'}
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Auctions */}
          {activeTab === 'auctions' && filteredData.map(auction => {
            const statusInfo = getStatusInfo(auction.status);
            
            return (
              <div key={auction.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <Link to={`/auction/${auction.auctionId}`} className="flex-shrink-0">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-24 h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <Link 
                        to={`/auction/${auction.auctionId}`}
                        className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors truncate"
                      >
                        {auction.title}
                      </Link>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {auction.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">السعر الحالي</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(auction.currentPrice)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">المزايدات</div>
                        <div className="text-lg font-bold text-gray-800">
                          {auction.totalBids}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">المشاهدات</div>
                        <div className="text-lg font-bold text-gray-800">
                          {auction.totalViews}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {auction.seller.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          تمت المتابعة: {formatDate(auction.followedAt)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/auction/${auction.auctionId}`}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          عرض المزاد
                        </Link>
                        
                        {auction.status === 'active' && (
                          <Link
                            to={`/auction/${auction.auctionId}/room`}
                            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                          >
                            <TrendingUp className="w-3 h-3" />
                            دخول المزاد
                          </Link>
                        )}
                        
                        <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                          <Heart className="w-3 h-3 fill-current" />
                          إلغاء المتابعة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Sellers */}
          {activeTab === 'sellers' && filteredData.map(seller => (
            <div key={seller.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <Link to={`/seller/${seller.id}`} className="flex-shrink-0">
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-16 h-16 object-cover rounded-full hover:opacity-90 transition-opacity"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/seller/${seller.id}`}
                          className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
                        >
                          {seller.name}
                        </Link>
                        {seller.isVerified && (
                          <span className="text-blue-500" title="حساب موثق">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">@{seller.username}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-bold">{seller.rating}</span>
                        <span className="text-sm text-gray-600">({seller.totalReviews})</span>
                      </div>
                    </div>
                  </div>
                  
                  {seller.bio && (
                    <p className="text-gray-700 mb-3 line-clamp-2">{seller.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {seller.specialties.map(specialty => (
                      <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">إجمالي المزادات</div>
                      <div className="text-lg font-bold text-gray-800">
                        {seller.totalAuctions}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">المزادات النشطة</div>
                      <div className="text-lg font-bold text-green-600">
                        {seller.activeAuctions}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">تمت المتابعة</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(seller.followedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/seller/${seller.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      عرض الملف الشخصي
                    </Link>
                    
                    <button className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                      <UserPlus className="w-4 h-4" />
                      إلغاء المتابعة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Categories */}
          {activeTab === 'categories' && filteredData.map(category => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{category.icon}</div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <Link 
                      to={`/auctions?category=${category.id}`}
                      className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">إجمالي المزادات</div>
                      <div className="text-lg font-bold text-gray-800">
                        {category.totalAuctions}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">المزادات النشطة</div>
                      <div className="text-lg font-bold text-green-600">
                        {category.activeAuctions}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">متوسط السعر</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(category.avgPrice)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">أفضل البائعين</div>
                      <div className="text-lg font-bold text-purple-600">
                        {category.topSellers}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Link
                        to={`/auctions?category=${category.id}`}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        عرض المزادات
                      </Link>
                      
                      <Link
                        to={`/sellers?category=${category.id}`}
                        className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        عرض البائعين
                      </Link>
                    </div>
                    
                    <button className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                      <Tag className="w-4 h-4" />
                      إلغاء المتابعة
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-2">
                    تمت المتابعة: {formatDate(category.followedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Summary Stats */}
      {filteredData.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص المتابعات</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{follows.auctions?.length || 0}</div>
              <div className="text-sm text-blue-700">مزاد</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{follows.sellers?.length || 0}</div>
              <div className="text-sm text-green-700">بائع</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{follows.categories?.length || 0}</div>
              <div className="text-sm text-purple-700">تصنيف</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFollows;