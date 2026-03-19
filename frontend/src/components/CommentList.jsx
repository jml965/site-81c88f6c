import React, { useState } from 'react';
import CommentCard from './CommentCard';
import LoadingSpinner from './common/LoadingSpinner';
import EmptyState from './common/EmptyState';
import { MessageCircle, ChevronDown } from 'lucide-react';

export default function CommentList({
  comments,
  loading,
  hasMore,
  onLoadMore,
  onLike,
  onReply,
  onDelete,
  onReport,
  auctionId,
  showReplies = true,
  maxLevel = 3
}) {
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedComments, setExpandedComments] = useState(new Set());

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment, level = 0) => {
    const isExpanded = expandedComments.has(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const shouldShowReplies = showReplies && level < maxLevel;

    return (
      <div key={comment.id} className={`${level > 0 ? 'mr-8 mt-4' : ''}`}>
        <CommentCard
          comment={comment}
          onLike={onLike}
          onReply={onReply}
          onDelete={onDelete}
          onReport={onReport}
          auctionId={auctionId}
          level={level}
          canReply={level < maxLevel}
        />
        
        {/* Show Replies Toggle */}
        {hasReplies && shouldShowReplies && (
          <div className="mt-3 mr-12">
            <button
              onClick={() => toggleCommentExpansion(comment.id)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              {isExpanded ? 'إخفاء' : 'عرض'} الردود ({comment.replies.length})
            </button>
          </div>
        )}
        
        {/* Replies */}
        {hasReplies && shouldShowReplies && isExpanded && (
          <div className="mt-4">
            {comment.replies.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
        
        {/* Nested Replies Indicator */}
        {hasReplies && level >= maxLevel && (
          <div className="mt-3 mr-12">
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
              يوجد {comment.replies.length} رد إضافي. 
              <button className="text-blue-600 hover:text-blue-700 mr-1">
                عرض المزيد
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading && comments.length === 0) {
    return (
      <div className="p-8">
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && comments.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          icon={MessageCircle}
          title="لا توجد تعليقات بعد"
          description="كن أول من يعلق على هذا المزاد"
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {/* Comments */}
      <div className="p-6 space-y-6">
        {comments.map(comment => renderComment(comment))}
      </div>
      
      {/* Load More Button */}
      {(hasMore || loadingMore) && (
        <div className="p-6 border-t border-gray-200 text-center">
          {loadingMore ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-gray-600">جاري تحميل المزيد...</span>
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              تحميل المزيد من التعليقات
            </button>
          )}
        </div>
      )}
      
      {/* Loading Indicator for Infinite Scroll */}
      {loading && comments.length > 0 && (
        <div className="p-6 text-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
}