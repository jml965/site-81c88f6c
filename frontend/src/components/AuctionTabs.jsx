import React, { useState } from 'react';
import { Info, Image, MessageCircle, Clock, User, Star, ChevronDown, ChevronUp } from 'lucide-react';

export default function AuctionTabs({ auction, activeTab, setActiveTab }) {
  const [expandedComment, setExpandedComment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const tabs = [
    { id: 'details', label: 'التفاصيل', icon: Info },
    { id: 'gallery', label: 'الصور', icon: Image },
    { id: 'comments', label: 'التعليقات', icon: MessageCircle, count: auction?.comments?.length },
    { id: 'history', label: 'سجل المزايدات', icon: Clock, count: auction?.bidHistory?.length },
    { id: 'seller', label: 'البائع', icon: User }
  ];

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      // API call to submit comment
      console.log('Submitting comment:', newComment);
      setNewComment('');
      // Refresh comments or add to local state
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentLike = (commentId) => {
    // API call to like/unlike comment
    console.log('Toggling like for comment:', commentId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('ar-SA') + ' ريال';
  };

  const renderDetails = () => (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">الوصف</h3>
        <p className="text-gray-700 leading-relaxed">{auction.description}</p>
      </div>

      {/* Specifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المواصفات</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auction.condition && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">الحالة</div>
              <div className="font-medium text-gray-900">{auction.condition}</div>
            </div>
          )}
          {auction.material && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">المادة</div>
              <div className="font-medium text-gray-900">{auction.material}</div>
            </div>
          )}
          {auction.dimensions && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">الأبعاد</div>
              <div className="font-medium text-gray-900">{auction.dimensions}</div>
            </div>
          )}
          {auction.weight && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">الوزن</div>
              <div className="font-medium text-gray-900">{auction.weight}</div>
            </div>
          )}
          {auction.origin && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">المنشأ</div>
              <div className="font-medium text-gray-900">{auction.origin}</div>
            </div>
          )}
          {auction.age && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">العمر</div>
              <div className="font-medium text-gray-900">{auction.age}</div>
            </div>
          )}
        </div>
      </div>

      {/* Rules */}
      {auction.rules && auction.rules.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">شروط وقواعد المزاد</h3>
          <ul className="space-y-3">
            {auction.rules.map((rule, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 ml-3 mt-1">•</span>
                <span className="text-gray-700">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderGallery = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">معرض الصور</h3>
      {auction.images && auction.images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {auction.images.map((image, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow cursor-pointer">
              <img
                src={image}
                alt={`${auction.title} - صورة ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد صور إضافية متاحة</p>
        </div>
      )}
    </div>
  );

  const renderComments = () => (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <form onSubmit={handleCommentSubmit} className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أضف تعليقاً</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="اكتب تعليقك هنا..."
          required
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={isSubmittingComment || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmittingComment ? 'جاري الإرسال...' : 'نشر التعليق'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {auction.comments && auction.comments.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            التعليقات ({auction.comments.length})
          </h3>
          {auction.comments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 space-x-reverse">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                      <span className="text-sm text-gray-500">{formatDate(comment.timestamp)}</span>
                    </div>
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <span className="text-sm">{comment.likes}</span>
                      <Star className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد تعليقات حتى الآن</p>
          <p className="text-sm text-gray-400">كن أول من يعلق على هذا المزاد</p>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        سجل المزايدات ({auction.bidHistory?.length || 0})
      </h3>
      {auction.bidHistory && auction.bidHistory.length > 0 ? (
        <div className="space-y-3">
          {auction.bidHistory.map((bid, index) => (
            <div
              key={bid.id}
              className={`border rounded-lg p-4 transition-all ${
                bid.isWinning
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    bid.isWinning
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{bid.bidder}</div>
                    <div className="text-sm text-gray-500">{formatDate(bid.timestamp)}</div>
                  </div>
                </div>
                <div className="text-left">
                  <div className={`text-lg font-bold ${
                    bid.isWinning ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {formatPrice(bid.amount)}
                  </div>
                  {bid.isWinning && (
                    <div className="text-xs text-green-600 font-medium">المزايدة الرابحة</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد مزايدات حتى الآن</p>
          <p className="text-sm text-gray-400">كن أول من يزايد على هذا المزاد</p>
        </div>
      )}
    </div>
  );

  const renderSeller = () => (
    <div className="space-y-6">
      {/* Seller Profile */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <img
            src={auction.seller.avatar}
            alt={auction.seller.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 space-x-reverse mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{auction.seller.name}</h3>
              {auction.seller.isVerified && (
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  ✓ موثق
                </div>
              )}
            </div>
            <p className="text-gray-600">@{auction.seller.username}</p>
            <div className="flex items-center space-x-1 space-x-reverse mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">{auction.seller.rating}</span>
              <span className="text-sm text-gray-500">({auction.seller.reviewCount} تقييم)</span>
            </div>
          </div>
        </div>
        <p className="text-gray-700">{auction.seller.description}</p>
      </div>

      {/* Seller Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">{auction.seller.totalAuctions}</div>
          <div className="text-sm text-gray-600">مزاد منشور</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{auction.seller.successfulSales}</div>
          <div className="text-sm text-gray-600">عملية بيع</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{auction.seller.rating}</div>
          <div className="text-sm text-gray-600">تقييم</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-gray-900 mb-1">{auction.seller.responseTime}</div>
          <div className="text-sm text-gray-600">وقت الرد</div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">معلومات إضافية</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">الموقع:</span>
            <span className="font-medium text-gray-900">{auction.seller.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">تاريخ التسجيل:</span>
            <span className="font-medium text-gray-900">
              {new Date(auction.seller.joinDate).toLocaleDateString('ar-SA')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">معدل النجاح:</span>
            <span className="font-medium text-green-600">
              {Math.round((auction.seller.successfulSales / auction.seller.totalAuctions) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Contact Seller */}
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          إرسال رسالة
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
          متابعة البائع
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return renderDetails();
      case 'gallery':
        return renderGallery();
      case 'comments':
        return renderComments();
      case 'history':
        return renderHistory();
      case 'seller':
        return renderSeller();
      default:
        return renderDetails();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}