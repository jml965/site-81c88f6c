const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MessageModel {
  constructor() {
    this.tableName = 'message';
  }

  // Create a new message
  async create(data) {
    try {
      const message = await prisma.message.create({
        data: {
          conversationId: data.conversationId,
          senderId: data.senderId,
          content: data.content,
          messageType: data.messageType || 'text',
          metadata: data.metadata || null,
          replyToId: data.replyToId || null
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          conversation: {
            select: {
              id: true,
              type: true,
              title: true
            }
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('فشل في إنشاء الرسالة');
    }
  }

  // Find message by ID
  async findById(id, includeDeleted = false) {
    try {
      const whereCondition = { id };
      if (!includeDeleted) {
        whereCondition.deletedAt = null;
      }

      const message = await prisma.message.findUnique({
        where: whereCondition,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          conversation: {
            select: {
              id: true,
              type: true,
              title: true
            }
          },
          readBy: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true
                }
              }
            }
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      return message;
    } catch (error) {
      console.error('Error finding message by ID:', error);
      throw new Error('فشل في البحث عن الرسالة');
    }
  }

  // Find messages by conversation ID
  async findByConversationId(conversationId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        includeDeleted = false,
        orderBy = 'createdAt',
        orderDirection = 'desc'
      } = options;

      const offset = (page - 1) * limit;
      const whereCondition = { conversationId };
      
      if (!includeDeleted) {
        whereCondition.deletedAt = null;
      }

      const messages = await prisma.message.findMany({
        where: whereCondition,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          readBy: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true
                }
              }
            }
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          [orderBy]: orderDirection
        },
        skip: offset,
        take: limit
      });

      return messages;
    } catch (error) {
      console.error('Error finding messages by conversation ID:', error);
      throw new Error('فشل في البحث عن الرسائل');
    }
  }

  // Find messages by sender ID
  async findBySenderId(senderId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        includeDeleted = false
      } = options;

      const offset = (page - 1) * limit;
      const whereCondition = { senderId };
      
      if (!includeDeleted) {
        whereCondition.deletedAt = null;
      }

      const messages = await prisma.message.findMany({
        where: whereCondition,
        include: {
          conversation: {
            select: {
              id: true,
              type: true,
              title: true
            }
          },
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      });

      return messages;
    } catch (error) {
      console.error('Error finding messages by sender ID:', error);
      throw new Error('فشل في البحث عن رسائل المرسل');
    }
  }

  // Update message
  async update(id, data) {
    try {
      const updateData = {};
      
      if (data.content !== undefined) updateData.content = data.content;
      if (data.messageType !== undefined) updateData.messageType = data.messageType;
      if (data.metadata !== undefined) updateData.metadata = data.metadata;
      if (data.editedAt !== undefined) updateData.editedAt = data.editedAt;

      const message = await prisma.message.update({
        where: { id },
        data: updateData,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          conversation: {
            select: {
              id: true,
              type: true,
              title: true
            }
          }
        }
      });

      return message;
    } catch (error) {
      console.error('Error updating message:', error);
      throw new Error('فشل في تحديث الرسالة');
    }
  }

  // Soft delete message
  async softDelete(id) {
    try {
      const message = await prisma.message.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          content: 'تم حذف هذه الرسالة'
        }
      });

      return message;
    } catch (error) {
      console.error('Error soft deleting message:', error);
      throw new Error('فشل في حذف الرسالة');
    }
  }

  // Hard delete message (permanent)
  async hardDelete(id) {
    try {
      await prisma.message.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error hard deleting message:', error);
      throw new Error('فشل في الحذف النهائي للرسالة');
    }
  }

  // Search messages
  async search(userId, query, options = {}) {
    try {
      const {
        conversationId,
        messageType,
        dateFrom,
        dateTo,
        limit = 50
      } = options;

      const whereConditions = {
        content: {
          contains: query,
          mode: 'insensitive'
        },
        deletedAt: null,
        conversation: {
          participants: {
            some: { userId }
          }
        }
      };

      if (conversationId) {
        whereConditions.conversationId = conversationId;
      }

      if (messageType) {
        whereConditions.messageType = messageType;
      }

      if (dateFrom || dateTo) {
        whereConditions.createdAt = {};
        if (dateFrom) whereConditions.createdAt.gte = new Date(dateFrom);
        if (dateTo) whereConditions.createdAt.lte = new Date(dateTo);
      }

      const messages = await prisma.message.findMany({
        where: whereConditions,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          conversation: {
            select: {
              id: true,
              type: true,
              title: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit
      });

      return messages;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw new Error('فشل في البحث في الرسائل');
    }
  }

  // Count messages in conversation
  async countByConversationId(conversationId, includeDeleted = false) {
    try {
      const whereCondition = { conversationId };
      if (!includeDeleted) {
        whereCondition.deletedAt = null;
      }

      const count = await prisma.message.count({
        where: whereCondition
      });

      return count;
    } catch (error) {
      console.error('Error counting messages:', error);
      throw new Error('فشل في عد الرسائل');
    }
  }

  // Get unread messages for user in conversation
  async getUnreadByConversationId(conversationId, userId) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversationId,
          senderId: { not: userId },
          deletedAt: null,
          readBy: {
            none: { userId }
          }
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      return messages;
    } catch (error) {
      console.error('Error getting unread messages:', error);
      throw new Error('فشل في جلب الرسائل غير المقروءة');
    }
  }

  // Get latest message in conversation
  async getLatestByConversationId(conversationId) {
    try {
      const message = await prisma.message.findFirst({
        where: {
          conversationId,
          deletedAt: null
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return message;
    } catch (error) {
      console.error('Error getting latest message:', error);
      throw new Error('فشل في جلب آخر رسالة');
    }
  }

  // Bulk operations
  async bulkCreate(messages) {
    try {
      const createdMessages = await prisma.message.createMany({
        data: messages,
        skipDuplicates: true
      });

      return createdMessages;
    } catch (error) {
      console.error('Error bulk creating messages:', error);
      throw new Error('فشل في إنشاء الرسائل المتعددة');
    }
  }

  async bulkSoftDelete(messageIds) {
    try {
      const result = await prisma.message.updateMany({
        where: {
          id: { in: messageIds }
        },
        data: {
          deletedAt: new Date(),
          content: 'تم حذف هذه الرسالة'
        }
      });

      return result;
    } catch (error) {
      console.error('Error bulk soft deleting messages:', error);
      throw new Error('فشل في حذف الرسائل المتعددة');
    }
  }
}

module.exports = new MessageModel();