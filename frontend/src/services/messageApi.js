import { api } from '../utils/api';

export const messageApi = {
  // Get all conversations for the current user
  getConversations: async (params = {}) => {
    const queryString = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 20,
      type: params.type || 'all', // all, direct, auction, archived
      search: params.search || '',
      ...(params.unreadOnly && { unreadOnly: true })
    }).toString();
    
    return api.get(`/messages/conversations?${queryString}`);
  },

  // Get a specific conversation by ID
  getConversation: async (conversationId) => {
    return api.get(`/messages/conversations/${conversationId}`);
  },

  // Get messages for a conversation
  getMessages: async (conversationId, params = {}) => {
    const queryString = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 50,
      ...(params.before && { before: params.before }),
      ...(params.after && { after: params.after })
    }).toString();
    
    return api.get(`/messages/conversations/${conversationId}/messages?${queryString}`);
  },

  // Send a new message
  sendMessage: async (messageData) => {
    const payload = {
      conversationId: messageData.conversationId,
      content: messageData.content,
      type: messageData.type || 'text',
      metadata: messageData.metadata || {},
      ...(messageData.parentMessageId && { parentMessageId: messageData.parentMessageId }) // For replies
    };
    
    return api.post('/messages/send', payload);
  },

  // Create a new conversation
  createConversation: async (conversationData) => {
    const payload = {
      participantIds: conversationData.participantIds,
      type: conversationData.type || 'direct', // direct, auction, group
      title: conversationData.title,
      ...(conversationData.auctionId && { auctionId: conversationData.auctionId }),
      ...(conversationData.metadata && { metadata: conversationData.metadata })
    };
    
    return api.post('/messages/conversations', payload);
  },

  // Mark messages as read
  markAsRead: async (conversationId, messageIds = null) => {
    const payload = {
      conversationId,
      ...(messageIds && { messageIds }) // If null, marks all unread messages as read
    };
    
    return api.post('/messages/mark-read', payload);
  },

  // Delete a message
  deleteMessage: async (messageId, deleteForEveryone = false) => {
    return api.delete(`/messages/${messageId}`, {
      data: { deleteForEveryone }
    });
  },

  // Edit a message
  editMessage: async (messageId, newContent) => {
    return api.patch(`/messages/${messageId}`, {
      content: newContent
    });
  },

  // Archive/unarchive conversation
  archiveConversation: async (conversationId, archived = true) => {
    return api.patch(`/messages/conversations/${conversationId}/archive`, {
      archived
    });
  },

  // Block/unblock user
  blockUser: async (userId, blocked = true) => {
    return api.post('/messages/block', {
      userId,
      blocked
    });
  },

  // Report a message or conversation
  reportMessage: async (messageId, reason, description = '') => {
    return api.post('/messages/report', {
      messageId,
      reason,
      description
    });
  },

  reportConversation: async (conversationId, reason, description = '') => {
    return api.post('/messages/conversations/report', {
      conversationId,
      reason,
      description
    });
  },

  // Upload file/media for messages
  uploadMessageMedia: async (file, conversationId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);
    
    return api.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get conversation participants
  getConversationParticipants: async (conversationId) => {
    return api.get(`/messages/conversations/${conversationId}/participants`);
  },

  // Add participants to group conversation
  addParticipants: async (conversationId, userIds) => {
    return api.post(`/messages/conversations/${conversationId}/participants`, {
      userIds
    });
  },

  // Remove participant from group conversation
  removeParticipant: async (conversationId, userId) => {
    return api.delete(`/messages/conversations/${conversationId}/participants/${userId}`);
  },

  // Leave conversation
  leaveConversation: async (conversationId) => {
    return api.post(`/messages/conversations/${conversationId}/leave`);
  },

  // Update conversation settings
  updateConversationSettings: async (conversationId, settings) => {
    return api.patch(`/messages/conversations/${conversationId}/settings`, settings);
  },

  // Search messages
  searchMessages: async (query, params = {}) => {
    const queryString = new URLSearchParams({
      q: query,
      page: params.page || 1,
      limit: params.limit || 20,
      ...(params.conversationId && { conversationId: params.conversationId }),
      ...(params.type && { type: params.type }),
      ...(params.dateFrom && { dateFrom: params.dateFrom }),
      ...(params.dateTo && { dateTo: params.dateTo })
    }).toString();
    
    return api.get(`/messages/search?${queryString}`);
  },

  // Get message thread (replies)
  getMessageThread: async (messageId) => {
    return api.get(`/messages/${messageId}/thread`);
  },

  // Pin/unpin message
  pinMessage: async (messageId, pinned = true) => {
    return api.patch(`/messages/${messageId}/pin`, {
      pinned
    });
  },

  // React to message (like, love, etc.)
  reactToMessage: async (messageId, reaction) => {
    return api.post(`/messages/${messageId}/react`, {
      reaction // 'like', 'love', 'laugh', 'angry', 'sad', etc.
    });
  },

  // Remove reaction from message
  removeReaction: async (messageId, reaction) => {
    return api.delete(`/messages/${messageId}/react`, {
      data: { reaction }
    });
  },

  // Forward message to another conversation
  forwardMessage: async (messageId, targetConversationIds) => {
    return api.post(`/messages/${messageId}/forward`, {
      targetConversationIds
    });
  },

  // Get message delivery/read receipts
  getMessageReceipts: async (messageId) => {
    return api.get(`/messages/${messageId}/receipts`);
  },

  // Update typing status
  updateTypingStatus: async (conversationId, isTyping = true) => {
    return api.post(`/messages/conversations/${conversationId}/typing`, {
      isTyping
    });
  },

  // Get unread count
  getUnreadCount: async () => {
    return api.get('/messages/unread-count');
  },

  // Export conversation
  exportConversation: async (conversationId, format = 'json') => {
    return api.get(`/messages/conversations/${conversationId}/export?format=${format}`, {
      responseType: 'blob'
    });
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    return api.delete(`/messages/conversations/${conversationId}`);
  },

  // Clear conversation history
  clearConversationHistory: async (conversationId) => {
    return api.delete(`/messages/conversations/${conversationId}/messages`);
  }
};