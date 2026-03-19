/**
 * Message type definitions and interfaces
 */

/**
 * Message status constants
 */
export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

/**
 * Message type constants
 */
export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  SYSTEM: 'system',
  NOTIFICATION: 'notification'
};

/**
 * Conversation type constants
 */
export const CONVERSATION_TYPE = {
  PRIVATE: 'private',
  GROUP: 'group',
  AUCTION: 'auction',
  SUPPORT: 'support',
  SYSTEM: 'system'
};

/**
 * Message priority levels
 */
export const MESSAGE_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Message interface
 * @typedef {Object} Message
 * @property {string} id - Unique message identifier
 * @property {string} conversationId - Conversation identifier
 * @property {string} senderId - Sender user ID
 * @property {Object} sender - Sender information
 * @property {string} sender.id - Sender ID
 * @property {string} sender.name - Sender display name
 * @property {string} sender.avatar - Sender avatar URL
 * @property {string} sender.role - Sender role
 * @property {string} type - Message type from MESSAGE_TYPE
 * @property {string} status - Message status from MESSAGE_STATUS
 * @property {string} priority - Message priority level
 * @property {Object} content - Message content
 * @property {string} content.text - Text content
 * @property {string} content.html - HTML formatted content
 * @property {Object} content.media - Media attachments
 * @property {Array<Object>} content.attachments - File attachments
 * @property {Object} content.metadata - Additional content metadata
 * @property {Object} delivery - Delivery information
 * @property {Array<Object>} delivery.recipients - Message recipients
 * @property {Date} delivery.sentAt - Sent timestamp
 * @property {Date} delivery.deliveredAt - Delivered timestamp
 * @property {Date} delivery.readAt - Read timestamp
 * @property {Array<string>} delivery.readBy - Users who read the message
 * @property {Object} thread - Thread information for replies
 * @property {string} thread.parentId - Parent message ID
 * @property {Array<string>} thread.replyIds - Reply message IDs
 * @property {number} thread.replyCount - Number of replies
 * @property {Object} reactions - Message reactions
 * @property {Array<Object>} reactions.likes - Like reactions
 * @property {Array<Object>} reactions.emojis - Emoji reactions
 * @property {number} reactions.totalCount - Total reaction count
 * @property {Object} system - System message data
 * @property {string} system.event - System event type
 * @property {Object} system.data - Event-specific data
 * @property {string} system.template - Message template
 * @property {Object} moderation - Moderation information
 * @property {boolean} moderation.isReported - Whether message is reported
 * @property {boolean} moderation.isHidden - Whether message is hidden
 * @property {string} moderation.reason - Moderation reason
 * @property {Date} moderation.actionDate - Moderation action date
 * @property {Date} createdAt - Message creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} deletedAt - Deletion timestamp (soft delete)
 */

/**
 * Conversation interface
 * @typedef {Object} Conversation
 * @property {string} id - Unique conversation identifier
 * @property {string} type - Conversation type from CONVERSATION_TYPE
 * @property {string} title - Conversation title
 * @property {string} description - Conversation description
 * @property {Array<Object>} participants - Conversation participants
 * @property {string} participants[].userId - Participant user ID
 * @property {string} participants[].role - Participant role in conversation
 * @property {Date} participants[].joinedAt - When user joined
 * @property {Date} participants[].lastReadAt - Last read timestamp
 * @property {boolean} participants[].isMuted - Whether notifications are muted
 * @property {Object} lastMessage - Last message in conversation
 * @property {string} lastMessage.id - Last message ID
 * @property {string} lastMessage.text - Last message text
 * @property {string} lastMessage.senderId - Last message sender ID
 * @property {Date} lastMessage.timestamp - Last message timestamp
 * @property {Object} stats - Conversation statistics
 * @property {number} stats.messageCount - Total message count
 * @property {number} stats.participantCount - Number of participants
 * @property {number} stats.unreadCount - Unread messages count
 * @property {Date} stats.lastActivity - Last activity timestamp
 * @property {Object} settings - Conversation settings
 * @property {boolean} settings.allowNewMessages - Allow new messages
 * @property {boolean} settings.allowAttachments - Allow file attachments
 * @property {boolean} settings.isArchived - Whether conversation is archived
 * @property {boolean} settings.isPinned - Whether conversation is pinned
 * @property {Array<string>} settings.mutedBy - Users who muted conversation
 * @property {Object} related - Related entities
 * @property {string} related.auctionId - Related auction ID
 * @property {string} related.orderId - Related order ID
 * @property {string} related.reportId - Related report ID
 * @property {Date} createdAt - Conversation creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Message creation data
 * @typedef {Object} CreateMessageData
 * @property {string} conversationId - Target conversation ID
 * @property {string} type - Message type
 * @property {Object} content - Message content
 * @property {string} priority - Message priority
 * @property {string} parentId - Parent message ID for replies
 * @property {Array<File>} attachments - File attachments
 */

/**
 * Conversation creation data
 * @typedef {Object} CreateConversationData
 * @property {string} type - Conversation type
 * @property {string} title - Conversation title
 * @property {Array<string>} participantIds - Initial participants
 * @property {string} relatedAuctionId - Related auction ID
 * @property {Object} settings - Initial settings
 */

/**
 * Message attachment
 * @typedef {Object} MessageAttachment
 * @property {string} id - Attachment ID
 * @property {string} name - File name
 * @property {string} type - MIME type
 * @property {number} size - File size in bytes
 * @property {string} url - File URL
 * @property {string} thumbnailUrl - Thumbnail URL for images/videos
 * @property {Object} metadata - Additional metadata
 */

/**
 * Message validation rules
 */
export const MESSAGE_VALIDATION = {
  MAX_TEXT_LENGTH: 5000,
  MAX_TITLE_LENGTH: 100,
  MAX_ATTACHMENTS: 5,
  MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TOTAL_ATTACHMENT_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'webm', 'mov', 'avi'],
  SUPPORTED_AUDIO_FORMATS: ['mp3', 'wav', 'ogg', 'm4a'],
  SUPPORTED_DOCUMENT_FORMATS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  MAX_PARTICIPANTS: 50,
  MESSAGE_RATE_LIMIT: 60, // messages per minute
  SPAM_DETECTION_THRESHOLD: 10 // similar messages threshold
};

/**
 * System message templates
 */
export const SYSTEM_MESSAGE_TEMPLATES = {
  USER_JOINED: 'انضم {{userName}} إلى المحادثة',
  USER_LEFT: 'غادر {{userName}} المحادثة',
  AUCTION_STARTED: 'بدأ المزاد: {{auctionTitle}}',
  AUCTION_ENDED: 'انتهى المزاد: {{auctionTitle}}',
  BID_PLACED: 'تم وضع مزايدة بقيمة {{amount}}',
  BID_WON: 'تهانينا! فزت بالمزاد بقيمة {{amount}}',
  PAYMENT_RECEIVED: 'تم استلام الدفعة',
  ORDER_SHIPPED: 'تم شحن الطلب',
  CONVERSATION_CREATED: 'تم إنشاء المحادثة',
  MESSAGE_DELETED: 'تم حذف رسالة',
  USER_BANNED: 'تم حظر المستخدم {{userName}}'
};

/**
 * Message utility functions
 */
export const MessageUtils = {
  /**
   * Check if message is unread
   * @param {Message} message 
   * @param {string} userId 
   * @returns {boolean}
   */
  isUnread(message, userId) {
    return !message.delivery.readBy.includes(userId);
  },

  /**
   * Check if message is system message
   * @param {Message} message 
   * @returns {boolean}
   */
  isSystemMessage(message) {
    return message.type === MESSAGE_TYPE.SYSTEM;
  },

  /**
   * Check if message has attachments
   * @param {Message} message 
   * @returns {boolean}
   */
  hasAttachments(message) {
    return message.content.attachments && message.content.attachments.length > 0;
  },

  /**
   * Check if message is reply
   * @param {Message} message 
   * @returns {boolean}
   */
  isReply(message) {
    return message.thread && message.thread.parentId;
  },

  /**
   * Get message status display text
   * @param {string} status 
   * @returns {string}
   */
  getStatusText(status) {
    const statusTexts = {
      [MESSAGE_STATUS.SENT]: 'تم الإرسال',
      [MESSAGE_STATUS.DELIVERED]: 'تم التوصيل',
      [MESSAGE_STATUS.READ]: 'تم القراءة',
      [MESSAGE_STATUS.FAILED]: 'فشل الإرسال'
    };
    return statusTexts[status] || 'غير معروف';
  },

  /**
   * Get message type display text
   * @param {string} type 
   * @returns {string}
   */
  getTypeText(type) {
    const typeTexts = {
      [MESSAGE_TYPE.TEXT]: 'نص',
      [MESSAGE_TYPE.IMAGE]: 'صورة',
      [MESSAGE_TYPE.VIDEO]: 'فيديو',
      [MESSAGE_TYPE.AUDIO]: 'صوت',
      [MESSAGE_TYPE.FILE]: 'ملف',
      [MESSAGE_TYPE.SYSTEM]: 'نظام',
      [MESSAGE_TYPE.NOTIFICATION]: 'إشعار'
    };
    return typeTexts[type] || 'عادي';
  },

  /**
   * Format message timestamp
   * @param {Date} timestamp 
   * @returns {string}
   */
  formatTimestamp(timestamp) {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffMinutes = Math.floor((now - messageDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'الآن';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return messageDate.toLocaleDateString('ar-SA');
  },

  /**
   * Get conversation display name
   * @param {Conversation} conversation 
   * @param {string} currentUserId 
   * @returns {string}
   */
  getConversationDisplayName(conversation, currentUserId) {
    if (conversation.title) return conversation.title;
    
    if (conversation.type === CONVERSATION_TYPE.PRIVATE) {
      const otherParticipant = conversation.participants.find(p => p.userId !== currentUserId);
      return otherParticipant ? otherParticipant.name : 'محادثة خاصة';
    }
    
    if (conversation.type === CONVERSATION_TYPE.AUCTION) {
      return `مزاد: ${conversation.related.auctionTitle || 'غير محدد'}`;
    }
    
    if (conversation.type === CONVERSATION_TYPE.SUPPORT) {
      return 'الدعم الفني';
    }
    
    return 'محادثة';
  },

  /**
   * Count unread messages in conversation
   * @param {Array<Message>} messages 
   * @param {string} userId 
   * @returns {number}
   */
  countUnreadMessages(messages, userId) {
    return messages.filter(message => this.isUnread(message, userId)).length;
  },

  /**
   * Group messages by date
   * @param {Array<Message>} messages 
   * @returns {Object}
   */
  groupMessagesByDate(messages) {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    
    return groups;
  },

  /**
   * Validate message content
   * @param {Object} content 
   * @returns {Object}
   */
  validateMessageContent(content) {
    const result = {
      isValid: true,
      errors: []
    };

    if (!content.text && !content.attachments?.length) {
      result.isValid = false;
      result.errors.push('الرسالة يجب أن تحتوي على نص أو مرفقات');
    }

    if (content.text && content.text.length > MESSAGE_VALIDATION.MAX_TEXT_LENGTH) {
      result.isValid = false;
      result.errors.push(`النص يجب أن يكون أقل من ${MESSAGE_VALIDATION.MAX_TEXT_LENGTH} حرف`);
    }

    if (content.attachments && content.attachments.length > MESSAGE_VALIDATION.MAX_ATTACHMENTS) {
      result.isValid = false;
      result.errors.push(`الحد الأقصى للمرفقات هو ${MESSAGE_VALIDATION.MAX_ATTACHMENTS}`);
    }

    return result;
  },

  /**
   * Generate system message
   * @param {string} template 
   * @param {Object} data 
   * @returns {string}
   */
  generateSystemMessage(template, data) {
    let message = SYSTEM_MESSAGE_TEMPLATES[template] || template;
    
    Object.keys(data).forEach(key => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    });
    
    return message;
  },

  /**
   * Check if user can send message to conversation
   * @param {Conversation} conversation 
   * @param {string} userId 
   * @returns {boolean}
   */
  canSendMessage(conversation, userId) {
    const participant = conversation.participants.find(p => p.userId === userId);
    return participant && conversation.settings.allowNewMessages;
  },

  /**
   * Get message preview text
   * @param {Message} message 
   * @param {number} maxLength 
   * @returns {string}
   */
  getPreviewText(message, maxLength = 50) {
    if (message.type === MESSAGE_TYPE.SYSTEM) {
      return message.content.text || 'رسالة نظام';
    }
    
    if (message.content.text) {
      return message.content.text.length > maxLength 
        ? message.content.text.substring(0, maxLength) + '...'
        : message.content.text;
    }
    
    if (message.type === MESSAGE_TYPE.IMAGE) return '📷 صورة';
    if (message.type === MESSAGE_TYPE.VIDEO) return '🎥 فيديو';
    if (message.type === MESSAGE_TYPE.AUDIO) return '🎵 صوت';
    if (message.type === MESSAGE_TYPE.FILE) return '📎 ملف';
    
    return 'رسالة';
  }
};

export default {
  MESSAGE_STATUS,
  MESSAGE_TYPE,
  CONVERSATION_TYPE,
  MESSAGE_PRIORITY,
  MESSAGE_VALIDATION,
  SYSTEM_MESSAGE_TEMPLATES,
  MessageUtils
};