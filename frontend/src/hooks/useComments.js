import { useState, useEffect, useCallback } from 'react';
import { commentApi } from '../services/commentApi';
import { useAuth } from './useAuth';
import { useSocket } from './useSocket';
import { toast } from 'react-hot-toast';

export function useComments(auctionId, options = {}) {
  const { user } = useAuth();
  const socket = useSocket();
  const { 
    sortBy = 'newest', 
    filterBy = 'all',
    limit = 10,
    autoRefresh = true
  } = options;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  // Load comments
  const loadComments = useCallback(async (page = 1, append = false) => {
    if (!auctionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await commentApi.getComments(auctionId, {
        page,
        limit,
        sortBy,
        filterBy: filterBy === 'my_comments' ? user?.id : filterBy
      });
      
      const { comments: newComments, pagination } = response;
      
      setComments(prev => append ? [...prev, ...newComments] : newComments);
      setHasMore(pagination.hasNext);
      setCurrentPage(page);
      setTotalComments(pagination.total);
      
    } catch (err) {
      console.error('Error loading comments:', err);
      setError(err.message || 'فشل في تحميل التعليقات');
      if (!append) {
        setComments([]);
      }
    } finally {
      setLoading(false);
    }
  }, [auctionId, limit, sortBy, filterBy, user?.id]);

  // Load more comments (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadComments(currentPage + 1, true);
  }, [hasMore, loading, currentPage, loadComments]);

  // Add new comment
  const addComment = useCallback(async (commentData) => {
    if (!user || !auctionId) {
      throw new Error('يجب تسجيل الدخول للتعليق');
    }
    
    try {
      const newComment = await commentApi.createComment(auctionId, {
        ...commentData,
        userId: user.id
      });
      
      // Add comment to the beginning of the list
      setComments(prev => [newComment, ...prev]);
      setTotalComments(prev => prev + 1);
      
      // Emit socket event for real-time updates
      if (socket) {
        socket.emit('comment:new', {
          auctionId,
          comment: newComment
        });
      }
      
      return newComment;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw new Error(err.message || 'فشل في إضافة التعليق');
    }
  }, [user, auctionId, socket]);

  // Update comment (edit)
  const updateComment = useCallback(async (commentId, updates) => {
    if (!user) {
      throw new Error('يجب تسجيل الدخول لتعديل التعليق');
    }
    
    try {
      const updatedComment = await commentApi.updateComment(commentId, updates);
      
      // Update comment in the list
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, ...updatedComment };
        }
        // Update nested replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId ? { ...reply, ...updatedComment } : reply
            )
          };
        }
        return comment;
      }));
      
      return updatedComment;
    } catch (err) {
      console.error('Error updating comment:', err);
      throw new Error(err.message || 'فشل في تعديل التعليق');
    }
  }, [user]);

  // Delete comment
  const deleteComment = useCallback(async (commentId) => {
    if (!user) {
      throw new Error('يجب تسجيل الدخول لحذف التعليق');
    }
    
    try {
      await commentApi.deleteComment(commentId);
      
      // Remove comment from the list
      setComments(prev => prev.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        // Filter nested replies
        if (comment.replies) {
          comment.replies = comment.replies.filter(reply => reply.id !== commentId);
        }
        return true;
      }));
      
      setTotalComments(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw new Error(err.message || 'فشل في حذف التعليق');
    }
  }, [user]);

  // Like/Unlike comment
  const likeComment = useCallback(async (commentId, liked) => {
    if (!user) {
      throw new Error('يجب تسجيل الدخول للإعجاب بالتعليق');
    }
    
    try {
      if (liked) {
        await commentApi.likeComment(commentId);
      } else {
        await commentApi.unlikeComment(commentId);
      }
      
      // Update like status and count in the list
      setComments(prev => prev.map(comment => {
        const updateLikes = (c) => {
          if (c.id === commentId) {
            return {
              ...c,
              isLiked: liked,
              likesCount: liked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 0) - 1)
            };
          }
          return c;
        };
        
        let updatedComment = updateLikes(comment);
        
        // Update nested replies
        if (updatedComment.replies) {
          updatedComment.replies = updatedComment.replies.map(updateLikes);
        }
        
        return updatedComment;
      }));
      
    } catch (err) {
      console.error('Error liking comment:', err);
      throw new Error(err.message || 'فشل في تسجيل الإعجاب');
    }
  }, [user]);

  // Report comment
  const reportComment = useCallback(async (commentId, reportData) => {
    if (!user) {
      throw new Error('يجب تسجيل الدخول للإبلاغ عن التعليق');
    }
    
    try {
      await commentApi.reportComment(commentId, reportData);
      toast.success('تم إرسال البلاغ بنجاح');
    } catch (err) {
      console.error('Error reporting comment:', err);
      throw new Error(err.message || 'فشل في إرسال البلاغ');
    }
  }, [user]);

  // Refresh comments
  const refreshComments = useCallback(() => {
    setCurrentPage(1);
    loadComments(1, false);
  }, [loadComments]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket || !auctionId || !autoRefresh) return;

    const handleNewComment = (data) => {
      if (data.auctionId === auctionId && data.comment.user.id !== user?.id) {
        setComments(prev => {
          // Avoid duplicates
          const exists = prev.some(c => c.id === data.comment.id);
          if (exists) return prev;
          return [data.comment, ...prev];
        });
        setTotalComments(prev => prev + 1);
      }
    };

    const handleCommentUpdate = (data) => {
      if (data.auctionId === auctionId) {
        setComments(prev => prev.map(comment => 
          comment.id === data.commentId 
            ? { ...comment, ...data.updates }
            : comment
        ));
      }
    };

    const handleCommentDelete = (data) => {
      if (data.auctionId === auctionId) {
        setComments(prev => prev.filter(comment => comment.id !== data.commentId));
        setTotalComments(prev => Math.max(0, prev - 1));
      }
    };

    const handleCommentLike = (data) => {
      if (data.auctionId === auctionId) {
        setComments(prev => prev.map(comment => 
          comment.id === data.commentId 
            ? { 
                ...comment, 
                likesCount: data.likesCount,
                isLiked: data.userId === user?.id ? data.liked : comment.isLiked
              }
            : comment
        ));
      }
    };

    socket.on('comment:new', handleNewComment);
    socket.on('comment:update', handleCommentUpdate);
    socket.on('comment:delete', handleCommentDelete);
    socket.on('comment:like', handleCommentLike);

    return () => {
      socket.off('comment:new', handleNewComment);
      socket.off('comment:update', handleCommentUpdate);
      socket.off('comment:delete', handleCommentDelete);
      socket.off('comment:like', handleCommentLike);
    };
  }, [socket, auctionId, user?.id, autoRefresh]);

  // Load comments on mount and when dependencies change
  useEffect(() => {
    refreshComments();
  }, [auctionId, sortBy, filterBy]);

  return {
    comments,
    loading,
    error,
    hasMore,
    totalComments,
    currentPage,
    
    // Actions
    loadMore,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    reportComment,
    refreshComments
  };
}