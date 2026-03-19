import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, AlertCircle, Users, Clock } from 'lucide-react';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { useComments } from '../hooks/useComments';
import { commentApi } from '../services/commentApi';

export default function Comments() {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [auctionInfo, setAuctionInfo] = useState(null);
  const [loadingAuction, setLoadingAuction] = useState(true);

  const {
    comments,
    loading,
    error,
    hasMore,
    loadMore,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    reportComment,
    refreshComments
  } = useComments(auctionId, { sortBy, filterBy });

  // Load auction info
  useEffect(() => {
    const loadAuctionInfo = async () => {
      try {
        setLoadingAuction(true);
        const auction = await commentApi.getAuctionInfo(auctionId);
        setAuctionInfo(auction);
      } catch (err) {
        console.error('Error loading auction info:', err);
      } finally {
        setLoadingAuction(false);
      }
    };

    if (auctionId) {
      loadAuctionInfo();
    }
  }, [auctionId]);

  const handleAddComment = async (content) => {
    try {
      await addComment(content);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    refreshComments();
  };

  const handleFilterChange = (newFilter) => {
    setFilterBy(newFilter);
    refreshComments();
  };

  const sortOptions = [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'most_liked', label: 'الأكثر إعجاباً' },
    { value: 'most_replied', label: 'الأكثر ردوداً' }
  ];

  const filterOptions = [
    { value: 'all', label: 'جميع التعليقات' },
    { value: 'my_comments', label: 'تعليقاتي' },
    { value: 'replies_to_me', label: 'الردود عليّ' }
  ];

  if (loadingAuction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!auctionInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <EmptyState
            icon={AlertCircle}
            title="المزاد غير موجود"
            description="عذراً، لم نتمكن من العثور على هذا المزاد"
            action={
              <button
                onClick={() => navigate('/auctions')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                العودة للمزادات
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(`/auction/${auctionId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للمزاد
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4" />
              التعليقات
            </div>
          </div>

          {/* Auction Info */}
          <div className="flex items-start gap-4">
            <img
              src={auctionInfo.coverImage || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=80&fit=crop`}
              alt={auctionInfo.title}
              className="w-20 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{auctionInfo.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {auctionInfo.participantsCount} مشارك
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {auctionInfo.commentsCount} تعليق
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {auctionInfo.status === 'active' ? 'نشط الآن' : 
                   auctionInfo.status === 'upcoming' ? 'قريباً' : 'منتهٍ'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Sort Controls */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">ترتيب حسب:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">فلترة:</label>
              <select
                value={filterBy}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Comment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إضافة تعليق جديد</h2>
          <CommentForm
            onSubmit={handleAddComment}
            placeholder="شاركنا رأيك في هذا المزاد..."
            submitLabel="إرسال التعليق"
          />
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              التعليقات ({comments.length})
            </h2>
          </div>

          {error && (
            <div className="p-6 border-b border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                حدث خطأ في تحميل التعليقات. يرجى المحاولة مرة أخرى.
              </div>
            </div>
          )}

          <CommentList
            comments={comments}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onLike={likeComment}
            onReply={updateComment}
            onDelete={deleteComment}
            onReport={reportComment}
            auctionId={auctionId}
          />
        </div>
      </div>
    </div>
  );
}