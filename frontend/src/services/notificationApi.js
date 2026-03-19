import api from './authApi';

export const notificationApi = {
  // Get notifications with pagination and filters
  async getNotifications(params = {}) {
    const {
      page = 1,
      limit = 20,
      type,
      is_read,
      sort = 'created_at:desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort
    });

    if (type) {
      queryParams.append('type', type);
    }

    if (typeof is_read === 'boolean') {
      queryParams.append('is_read', is_read.toString());
    }

    const response = await api.get(`/notifications?${queryParams}`);
    return response.data;
  },

  // Get unread notifications count
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Get notification by ID
  async getNotificationById(notificationId) {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark notification as unread
  async markAsUnread(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/unread`);
    return response.data;
  },

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds) {
    const response = await api.patch('/notifications/mark-multiple-read', {
      notification_ids: notificationIds
    });
    return response.data;
  },

  // Delete notification
  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Delete multiple notifications
  async deleteMultiple(notificationIds) {
    const response = await api.delete('/notifications/bulk-delete', {
      data: { notification_ids: notificationIds }
    });
    return response.data;
  },

  // Delete all read notifications
  async deleteAllRead() {
    const response = await api.delete('/notifications/delete-all-read');
    return response.data;
  },

  // Get notification preferences
  async getPreferences() {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  // Update notification preferences
  async updatePreferences(preferences) {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  },

  // Subscribe to push notifications
  async subscribeToPush(subscription) {
    const response = await api.post('/notifications/push/subscribe', subscription);
    return response.data;
  },

  // Unsubscribe from push notifications
  async unsubscribeFromPush(endpoint) {
    const response = await api.delete('/notifications/push/unsubscribe', {
      data: { endpoint }
    });
    return response.data;
  },

  // Send test notification (admin only)
  async sendTestNotification(userId, notification) {
    const response = await api.post('/notifications/test', {
      user_id: userId,
      ...notification
    });
    return response.data;
  },

  // Get notification statistics (admin only)
  async getStatistics(params = {}) {
    const {
      start_date,
      end_date,
      type,
      user_id
    } = params;

    const queryParams = new URLSearchParams();

    if (start_date) {
      queryParams.append('start_date', start_date);
    }

    if (end_date) {
      queryParams.append('end_date', end_date);
    }

    if (type) {
      queryParams.append('type', type);
    }

    if (user_id) {
      queryParams.append('user_id', user_id);
    }

    const response = await api.get(`/notifications/statistics?${queryParams}`);
    return response.data;
  },

  // Create notification (admin/system use)
  async createNotification(notification) {
    const response = await api.post('/notifications', notification);
    return response.data;
  },

  // Broadcast notification to multiple users (admin only)
  async broadcastNotification(notification, userIds = []) {
    const response = await api.post('/notifications/broadcast', {
      ...notification,
      user_ids: userIds
    });
    return response.data;
  },

  // Get notification templates (admin only)
  async getTemplates() {
    const response = await api.get('/notifications/templates');
    return response.data;
  },

  // Create notification template (admin only)
  async createTemplate(template) {
    const response = await api.post('/notifications/templates', template);
    return response.data;
  },

  // Update notification template (admin only)
  async updateTemplate(templateId, template) {
    const response = await api.put(`/notifications/templates/${templateId}`, template);
    return response.data;
  },

  // Delete notification template (admin only)
  async deleteTemplate(templateId) {
    const response = await api.delete(`/notifications/templates/${templateId}`);
    return response.data;
  },

  // Archive notifications
  async archiveNotifications(notificationIds) {
    const response = await api.patch('/notifications/archive', {
      notification_ids: notificationIds
    });
    return response.data;
  },

  // Unarchive notifications
  async unarchiveNotifications(notificationIds) {
    const response = await api.patch('/notifications/unarchive', {
      notification_ids: notificationIds
    });
    return response.data;
  },

  // Get archived notifications
  async getArchivedNotifications(params = {}) {
    const {
      page = 1,
      limit = 20,
      sort = 'archived_at:desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort
    });

    const response = await api.get(`/notifications/archived?${queryParams}`);
    return response.data;
  },

  // Export notifications (admin only)
  async exportNotifications(params = {}) {
    const {
      format = 'csv',
      start_date,
      end_date,
      type,
      user_id
    } = params;

    const queryParams = new URLSearchParams({ format });

    if (start_date) {
      queryParams.append('start_date', start_date);
    }

    if (end_date) {
      queryParams.append('end_date', end_date);
    }

    if (type) {
      queryParams.append('type', type);
    }

    if (user_id) {
      queryParams.append('user_id', user_id);
    }

    const response = await api.get(`/notifications/export?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default notificationApi;