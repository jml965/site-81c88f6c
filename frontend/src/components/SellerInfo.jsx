import React, { useState } from 'react';
import { Star, MapPin, Calendar, Shield, Clock, TrendingUp, MessageCircle, UserPlus } from 'lucide-react';

export default function SellerInfo({ seller }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!seller) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // API call to follow/unfollow seller
  };

  const handleMessage = () => {
    // Navigate to messages or open chat
    console.log('Opening chat with seller:', seller.id);
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getSuccessRate = () => {
    if (!seller.totalAuctions) return 0;
    return Math.round((seller.successfulSales / seller.totalAuctions) * 100);
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
        
        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        
        <span className="mr-2 text-sm text-gray-600">({seller.reviewCount})</span>
      </div>
    );
  };

  const truncatedDescription = seller.description?.length > 150 
    ? seller.description.substring(0, 150) + '...'
    : seller.description;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center space-x-4 space-x-reverse">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white ring-opacity-50"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 space-x-reverse mb-1">
              <h3 className="text-lg font-bold">{seller.name}</h3>
              {seller.isVerified && (
                <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full flex items-center">
                  <Shield className="h-3 w-3 ml-1" />
                  <span className="text-xs font-medium">موثق</span>
                </div>
              )}
            </div>
            <p className="text-purple-100 text-sm mb-2">@{seller.username}</p>
            <div className="flex items-center space-x-1 space-x-reverse">
              {getRatingStars(seller.rating)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600 mb-1">{seller.totalAuctions}</div>
            <div className="text-sm text-gray-600">مزاد</div>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 mb-1">{getSuccessRate()}%</div>
            <div className="text-sm text-gray-600">نجاح</div>
          </div>
        </div>

        {/* Description */}
        {seller.description && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">نبذة</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {showFullDescription ? seller.description : truncatedDescription}
              {seller.description?.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 hover:text-blue-700 mr-1 font-medium"
                >
                  {showFullDescription ? 'أقل' : 'المزيد'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 ml-2 text-gray-400" />
            <span>{seller.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 ml-2 text-gray-400" />
            <span>عضو منذ {formatJoinDate(seller.joinDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 ml-2 text-gray-400" />
            <span>يرد خلال {seller.responseTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 ml-2 text-gray-400" />
            <span>{seller.successfulSales} عملية بيع ناجحة</span>
          </div>
        </div>

        {/* Success Rate Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">معدل النجاح</span>
            <span className="font-semibold text-gray-900">{getSuccessRate()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getSuccessRate()}%` }}
            ></div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">التقييمات</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl font-bold text-gray-900">{seller.rating}</span>
              <div>
                {getRatingStars(seller.rating)}
                <div className="text-xs text-gray-500 mt-1">{seller.reviewCount} تقييم</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-gray-600">ممتاز</div>
              <div className="text-xs text-gray-500">من 5 نجوم</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleMessage}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4 ml-2" />
            إرسال رسالة
          </button>
          
          <button
            onClick={handleFollow}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
              isFollowing
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UserPlus className="h-4 w-4 ml-2" />
            {isFollowing ? 'إلغاء المتابعة' : 'متابعة البائع'}
          </button>
        </div>

        {/* Trust Badges */}
        {seller.isVerified && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <Shield className="h-5 w-5 ml-2" />
              <span className="font-semibold">بائع موثق</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              تم التحقق من هوية هذا البائع وموثوقيته من قبل إدارة المنصة
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          آخر نشاط منذ يومين
        </div>
      </div>
    </div>
  );
}