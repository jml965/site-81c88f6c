import api from './authApi';

class CommentApi {
  constructor() {
    this.baseUrl = '/api/comments';
  }

  // Get comments for an auction
  async getComments(auctionId, params = {}) {
    try {
      const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'newest',
        ...(params.filterBy && params.filterBy !== 'all' && { filterBy: params.filterBy })
      }).toString();

      const response = await api.get(`${this.baseUrl}/auction/${auctionId}?${queryString}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل التعليقات');
    }
  }

  // Get single comment with replies
  async getComment(commentId) {
    try {
      const response = await api.get(`${this.baseUrl}/${commentId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل التعليق');
    }
  }

  // Create new comment
  async createComment(auctionId, data) {
    try {
      const response = await api.post(`${this.baseUrl}`, {
        ...data,
        auctionId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في إضافة التعليق');
    }
  }

  // Update comment
  async updateComment(commentId, data) {
    try {
      const response = await api.put(`${this.baseUrl}/${commentId}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تعديل التعليق');
    }
  }

  // Delete comment
  async deleteComment(commentId) {
    try {
      await api.delete(`${this.baseUrl}/${commentId}`);
      return true;
    } catch (error) {
      throw this.handleError(error, 'فشل في حذف التعليق');
    }
  }

  // Like comment
  async likeComment(commentId) {
    try {
      const response = await api.post(`${this.baseUrl}/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في الإعجاب بالتعليق');
    }
  }

  // Unlike comment
  async unlikeComment(commentId) {
    try {
      const response = await api.delete(`${this.baseUrl}/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في إلغاء الإعجاب');
    }
  }

  // Reply to comment
  async replyToComment(parentCommentId, data) {
    try {
      const response = await api.post(`${this.baseUrl}/${parentCommentId}/replies`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في الرد على التعليق');
    }
  }

  // Get comment replies
  async getCommentReplies(commentId, params = {}) {
    try {
      const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'oldest'
      }).toString();

      const response = await api.get(`${this.baseUrl}/${commentId}/replies?${queryString}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل ردود التعليق');
    }
  }

  // Report comment
  async reportComment(commentId, reportData) {
    try {
      const response = await api.post(`${this.baseUrl}/${commentId}/report`, reportData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في إرسال البلاغ');
    }
  }

  // Get user's comments
  async getUserComments(userId, params = {}) {
    try {
      const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'newest'
      }).toString();

      const response = await api.get(`/api/users/${userId}/comments?${queryString}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل تعليقات المستخدم');
    }
  }

  // Get auction info (for comment page)
  async getAuctionInfo(auctionId) {
    try {
      const response = await api.get(`/api/auctions/${auctionId}/info`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل معلومات المزاد');
    }
  }

  // Search comments
  async searchComments(auctionId, query, params = {}) {
    try {
      const queryString = new URLSearchParams({
        q: query,
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'relevance'
      }).toString();

      const response = await api.get(`${this.baseUrl}/auction/${auctionId}/search?${queryString}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في البحث في التعليقات');
    }
  }

  // Get comment statistics
  async getCommentStats(auctionId) {
    try {
      const response = await api.get(`${this.baseUrl}/auction/${auctionId}/stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل إحصائيات التعليقات');
    }
  }

  // Pin/Unpin comment (admin/moderator)
  async pinComment(commentId, pinned = true) {
    try {
      const response = await api.patch(`${this.baseUrl}/${commentId}/pin`, { pinned });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تثبيت التعليق');
    }
  }

  // Hide/Unhide comment (admin/moderator)
  async hideComment(commentId, hidden = true) {
    try {
      const response = await api.patch(`${this.baseUrl}/${commentId}/hide`, { hidden });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في إخفاء التعليق');
    }
  }

  // Get moderation queue
  async getModerationQueue(params = {}) {
    try {
      const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'pending',
        sortBy: params.sortBy || 'newest'
      }).toString();

      const response = await api.get(`${this.baseUrl}/moderation?${queryString}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل قائمة المراجعة');
    }
  }

  // Moderate comment
  async moderateComment(commentId, action, reason = '') {
    try {
      const response = await api.post(`${this.baseUrl}/${commentId}/moderate`, {
        action, // 'approve', 'reject', 'hide', 'delete'
        reason
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في مراجعة التعليق');
    }
  }

  // Get comment notifications
  async getCommentNotifications(params = {}) {
    try {
      const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        unreadOnly: params.unreadOnly || false
      }).toString();

      const response = await api.get(`/api/notifications/comments?${queryString}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحميل إشعارات التعليقات');
    }
  }

  // Mark comment notifications as read
  async markNotificationsRead(notificationIds) {
    try {
      const response = await api.patch('/api/notifications/comments/read', {
        notificationIds
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في تحديث حالة الإشعارات');
    }
  }

  // Upload comment attachment (if supported)
  async uploadAttachment(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'فشل في رفع المرفق');
    }
  }

  // Handle API errors
  handleError(error, defaultMessage) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.response?.status === 401) {
      return new Error('يجب تسجيل الدخول للمتابعة');
    }
    if (error.response?.status === 403) {
      return new Error('ليس لديك صلاحية لتنفيذ هذا الإجراء');
    }
    if (error.response?.status === 404) {
      return new Error('التعليق غير موجود');
    }
    if (error.response?.status === 429) {
      return new Error('تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً');
    }
    if (error.response?.status >= 500) {
      return new Error('خطأ في الخادم، يرجى المحاولة لاحقاً');
    }
    return new Error(defaultMessage || 'حدث خطأ غير متوقع');
  }
}

export const commentApi = new CommentApi();
export default commentApi;