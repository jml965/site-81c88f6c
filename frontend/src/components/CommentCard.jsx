import React, { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Flag, Trash2, Edit3, Reply } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onDelete,
  onReport,
  auctionId,
  level = 0,
  canReply = true
}) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likesCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === comment.user.id;
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { 
    addSuffix: true, 
    locale: ar 
  });

  const handleLike = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول للإعجاب بالتعليقات');
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);
      const newLiked = !liked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;
      
      // Optimistic update
      setLiked(newLiked);
      setLikeCount(newCount);
      
      await onLike(comment.id, newLiked);
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!liked);
      setLikeCount(liked ? likeCount + 1 : likeCount - 1);
      console.error('Error liking comment:', error);
      toast.error('فشل في تسجيل الإعجاب');
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (replyData) => {
    try {
      await onReply(comment.id, replyData);
      setShowReplyForm(false);
      toast.success('تم إرسال الرد بنجاح');
    } catch (error) {
      console.error('Error replying to comment:', error);
      toast.error('فشل في إرسال الرد');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(comment.id);
      toast.success('تم حذف التعليق بنجاح');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('فشل في حذف التعليق');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = async () => {
    if (!user) {
      toast.error('يجب تسجيل الدخول للإبلاغ عن التعليقات');
      return;
    }

    try {
      await onReport(comment.id, {
        reason: 'inappropriate_content',
        description: 'تم الإبلاغ عن هذا التعليق'
      });
      toast.success('تم إرسال البلاغ بنجاح');
      setShowMenu(false);
    } catch (error) {
      console.error('Error reporting comment:', error);
      toast.error('فشل في إرسال البلاغ');
    }
  };

  const getLevelStyles = () => {
    const baseClasses = 'p-4 rounded-lg transition-all duration-200';
    switch (level) {
      case 0:
        return `${baseClasses} bg-white border border-gray-200`;
      case 1:
        return `${baseClasses} bg-gray-50 border border-gray-100`;
      case 2:
        return `${baseClasses} bg-blue-50/50 border border-blue-100`;
      default:
        return `${baseClasses} bg-yellow-50/50 border border-yellow-100`;
    }
  };

  const getUserRoleColor = () => {
    switch (comment.user.role) {
      case 'seller':
        return 'text-green-600 bg-green-100';
      case 'admin':
        return 'text-red-600 bg-red-100';
      case 'moderator':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getUserRoleLabel = () => {
    switch (comment.user.role) {
      case 'seller':
        return 'بائع';
      case 'admin':
        return 'مدير';
      case 'moderator':
        return 'مشرف';
      default:
        return null;
    }
  };

  return (
    <div className={getLevelStyles()}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <img
            src={comment.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=3b82f6&color=fff`}
            alt={comment.user.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          
          <div>
            {/* User Info */}
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
              
              {/* Role Badge */}
              {getUserRoleLabel() && (
                <span className={`px-2 py-1 text-xs rounded-full ${getUserRoleColor()}`}>
                  {getUserRoleLabel()}
                </span>
              )}
              
              {/* Verified Badge */}
              {comment.user.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            {/* Time */}
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
        </div>
        
        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      setShowEditForm(!showEditForm);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-right text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    تعديل
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'جاري الحذف...' : 'حذف'}
                  </button>
                </>
              )}
              
              {!isOwner && (
                <button
                  onClick={handleReport}
                  className="w-full px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  إبلاغ
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-4 text-sm">
        {/* Like */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
            liked 
              ? 'text-red-600 bg-red-50'
              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
          } ${isLiking ? 'opacity-50' : ''}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          {likeCount > 0 && <span>{likeCount}</span>}
          إعجاب
        </button>
        
        {/* Reply */}
        {canReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Reply className="w-4 h-4" />
            رد
          </button>
        )}
        
        {/* Reply Count */}
        {comment.repliesCount > 0 && (
          <div className="flex items-center gap-1 text-gray-500">
            <MessageCircle className="w-4 h-4" />
            {comment.repliesCount} رد
          </div>
        )}
      </div>
      
      {/* Edit Form */}
      {showEditForm && (
        <div className="mt-4">
          <CommentForm
            onSubmit={(data) => {
              // Handle edit logic here
              console.log('Edit comment:', data);
              setShowEditForm(false);
            }}
            onCancel={() => setShowEditForm(false)}
            placeholder="تعديل تعليقك..."
            submitLabel="حفظ التغييرات"
            showCancel
            autoFocus
          />
        </div>
      )}
      
      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4">
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`رد على @${comment.user.name}...`}
            submitLabel="إرسال الرد"
            showCancel
            autoFocus
            replyTo={comment}
          />
        </div>
      )}
    </div>
  );
}