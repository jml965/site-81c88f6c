import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Flag, Eye, Users, Clock, AlertCircle } from 'lucide-react';
import AuctionInfo from '../components/AuctionInfo';
import AuctionGallery from '../components/AuctionGallery';
import AuctionTabs from '../components/AuctionTabs';
import SellerInfo from '../components/SellerInfo';
import BidHistory from '../components/BidHistory';

export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockAuction = {
        id: parseInt(id),
        title: 'سجادة فارسية أثرية نادرة من القرن الثامن عشر',
        description: 'سجادة فارسية أصلية مصنوعة يدوياً من الحرير الخالص، تعود للقرن الثامن عشر. قطعة نادرة للغاية بحالة ممتازة، مع تفاصيل دقيقة وألوان زاهية لم تتأثر بالزمن.',
        category: 'التحف والأثريات',
        status: 'active',
        startingPrice: 5000,
        currentPrice: 12500,
        minIncrement: 250,
        startTime: '2024-12-20T18:00:00Z',
        endTime: '2024-12-20T22:00:00Z',
        duration: 240, // minutes
        bidCount: 47,
        viewCount: 1250,
        participantCount: 23,
        likeCount: 89,
        watchersCount: 156,
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        videoUrl: 'https://videos.unsplash.com/video-1234567',
        seller: {
          id: 1,
          name: 'أحمد الأنطاكي',
          username: 'ahmad_antiques',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face',
          rating: 4.8,
          reviewCount: 127,
          location: 'دمشق، سوريا',
          joinDate: '2022-03-15',
          totalAuctions: 45,
          successfulSales: 42,
          isVerified: true,
          responseTime: 'خلال ساعة',
          description: 'تاجر تحف وأثريات معتمد منذ أكثر من 20 عاماً. متخصص في القطع النادرة والسجاد الشرقي الأصيل.'
        },
        location: 'دمشق، سوريا',
        condition: 'ممتاز',
        material: 'حرير خالص',
        dimensions: '200 × 150 سم',
        weight: '8 كيلو',
        origin: 'إصفهان، إيران',
        age: '250 سنة تقريباً',
        rarity: 'نادر جداً',
        authentication: 'معتمد من جمعية التحف الشرقية',
        shippingInfo: {
          available: true,
          cost: 'حسب المنطقة',
          time: '3-7 أيام عمل',
          insurance: 'متوفر',
          packaging: 'تغليف احترافي مضمون'
        },
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586023492135-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586023492145-27b2c045efd7?w=800&h=600&fit=crop'
        ],
        rules: [
          'الدفع خلال 24 ساعة من انتهاء المزاد',
          'الشحن على نفقة المشتري',
          'لا يمكن إرجاع القطعة بعد البيع',
          'معاينة القطعة متاحة في دمشق فقط'
        ],
        comments: [
          {
            id: 1,
            user: {
              name: 'محمد العلي',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&face'
            },
            content: 'قطعة رائعة! هل يمكن معاينتها قبل المزاد؟',
            timestamp: '2024-12-20T16:30:00Z',
            likes: 3
          },
          {
            id: 2,
            user: {
              name: 'فاطمة النجار',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&face'
            },
            content: 'السعر عالي بس القطعة تستاهل، شكلها أصلي',
            timestamp: '2024-12-20T15:45:00Z',
            likes: 7
          },
          {
            id: 3,
            user: {
              name: 'عمر الشامي',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&face'
            },
            content: 'لديك شهادة الأصالة؟',
            timestamp: '2024-12-20T14:20:00Z',
            likes: 2
          }
        ],
        bidHistory: [
          {
            id: 1,
            bidder: 'المزايد #23',
            amount: 12500,
            timestamp: '2024-12-20T17:45:00Z',
            isWinning: true
          },
          {
            id: 2,
            bidder: 'المزايد #15',
            amount: 12250,
            timestamp: '2024-12-20T17:43:00Z',
            isWinning: false
          },
          {
            id: 3,
            bidder: 'المزايد #8',
            amount: 12000,
            timestamp: '2024-12-20T17:40:00Z',
            isWinning: false
          },
          {
            id: 4,
            bidder: 'المزايد #12',
            amount: 11750,
            timestamp: '2024-12-20T17:35:00Z',
            isWinning: false
          },
          {
            id: 5,
            bidder: 'المزايد #23',
            amount: 11500,
            timestamp: '2024-12-20T17:30:00Z',
            isWinning: false
          }
        ]
      };
      
      setAuction(mockAuction);
    } catch (error) {
      console.error('Error fetching auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // API call to follow/unfollow auction
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // API call to like/unlike auction
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: auction.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  const handleJoinAuction = () => {
    navigate(`/auction/${id}/room`);
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      alert('يرجى اختيار سبب البلاغ');
      return;
    }

    try {
      // API call to submit report
      console.log('Submitting report:', {
        auctionId: id,
        reason: reportReason,
        description: reportDescription
      });
      
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      alert('تم إرسال البلاغ بنجاح');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('حدث خطأ أثناء إرسال البلاغ');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'قادم';
      case 'active':
        return 'نشط';
      case 'ended':
        return 'منتهي';
      default:
        return 'غير محدد';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="animate-pulse">
                  <div className="h-64 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">المزاد غير موجود</h2>
          <p className="text-gray-600">لم نتمكن من العثور على المزاد المطلوب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Title and Category */}
          <div className="mb-6">
            <div className="flex flex-wrap items-start gap-3 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                {auction.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
                {getStatusText(auction.status)}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{auction.description}</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">{auction.category}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">📍 {auction.location}</span>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Eye className="h-5 w-5 text-gray-400 ml-1" />
                <span className="text-lg font-bold text-gray-900">{auction.viewCount?.toLocaleString()}</span>
              </div>
              <span className="text-sm text-gray-600">مشاهدة</span>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-5 w-5 text-gray-400 ml-1" />
                <span className="text-lg font-bold text-gray-900">{auction.participantCount}</span>
              </div>
              <span className="text-sm text-gray-600">مشارك</span>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Heart className="h-5 w-5 text-gray-400 ml-1" />
                <span className="text-lg font-bold text-gray-900">{auction.likeCount}</span>
              </div>
              <span className="text-sm text-gray-600">إعجاب</span>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-5 w-5 text-gray-400 ml-1" />
                <span className="text-lg font-bold text-gray-900">{auction.bidCount}</span>
              </div>
              <span className="text-sm text-gray-600">مزايدة</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleJoinAuction}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              دخول المزاد
            </button>
            <button
              onClick={handleFollow}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isFollowing
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isFollowing ? 'متابَع' : 'متابعة'}
            </button>
            <button
              onClick={handleLike}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isLiked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <AuctionGallery 
              images={auction.images}
              title={auction.title}
              videoUrl={auction.videoUrl}
            />
            
            {/* Tabs */}
            <AuctionTabs 
              auction={auction}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Auction Info */}
            <AuctionInfo auction={auction} />
            
            {/* Seller Info */}
            <SellerInfo seller={auction.seller} />
            
            {/* Bid History */}
            <BidHistory bidHistory={auction.bidHistory} />
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">الإبلاغ عن المزاد</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سبب البلاغ
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">اختر السبب</option>
                <option value="fake">منتج مزيف</option>
                <option value="inappropriate">محتوى غير مناسب</option>
                <option value="misleading">معلومات مضللة</option>
                <option value="spam">رسائل مزعجة</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تفاصيل إضافية (اختياري)
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="اكتب تفاصيل إضافية عن البلاغ..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleReport}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                إرسال البلاغ
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}