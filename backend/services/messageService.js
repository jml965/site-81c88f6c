const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MessageService {
  // Get all conversations for a user
  async getUserConversations(userId) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
              isArchived: false
            }
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                  isOnline: true,
                  lastSeenAt: true
                }
              }
            }
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc'
            },
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
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderId: { not: userId },
                  readBy: {
                    none: {
                      userId: userId
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      return conversations.map(conversation => {
        const otherParticipant = conversation.participants.find(
          p => p.userId !== userId
        );
        
        return {
          id: conversation.id,
          type: conversation.type,
          title: conversation.title,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
          otherUser: otherParticipant?.user || null,
          lastMessage: conversation.messages[0] || null,
          unreadCount: conversation._count.messages
        };
      });
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw new Error('فشل في جلب المحادثات');
    }
  }

  // Get or create conversation between two users
  async getOrCreateConversation(userId1, userId2) {
    try {
      // Check if conversation already exists
      let conversation = await prisma.conversation.findFirst({
        where: {
          type: 'private',
          AND: [
            {
              participants: {
                some: { userId: userId1 }
              }
            },
            {
              participants: {
                some: { userId: userId2 }
              }
            }
          ]
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                  isOnline: true,
                  lastSeenAt: true
                }
              }
            }
          }
        }
      });

      // If conversation doesn't exist, create one
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            type: 'private',
            participants: {
              create: [
                { userId: userId1 },
                { userId: userId2 }
              ]
            }
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    isOnline: true,
                    lastSeenAt: true
                  }
                }
              }
            }
          }
        });
      }

      const otherParticipant = conversation.participants.find(
        p => p.userId !== userId1
      );

      return {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        otherUser: otherParticipant?.user || null
      };
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw new Error('فشل في إنشاء المحادثة');
    }
  }

  // Check if user has access to conversation
  async checkConversationAccess(conversationId, userId) {
    try {
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId
        }
      });
      
      return !!participant;
    } catch (error) {
      console.error('Error checking conversation access:', error);
      return false;
    }
  }

  // Get messages for a conversation with pagination
  async getMessages(conversationId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      
      const messages = await prisma.message.findMany({
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
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      });

      const totalMessages = await prisma.message.count({
        where: {
          conversationId,
          deletedAt: null
        }
      });

      const totalPages = Math.ceil(totalMessages / limit);

      return {
        messages: messages.reverse(), // Reverse to show oldest first
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error getting messages:', error);
      throw new Error('فشل في جلب الرسائل');
    }
  }

  // Send a message
  async sendMessage({ conversationId, senderId, content, messageType = 'text' }) {
    try {
      // Check if sender is blocked by any participant
      const blockedByParticipants = await prisma.conversationParticipant.findMany({
        where: {
          conversationId,
          userId: { not: senderId },
          blockedUsers: {
            some: {
              blockedUserId: senderId
            }
          }
        }
      });

      if (blockedByParticipants.length > 0) {
        throw new Error('لا يمكنك إرسال رسائل لهذا المستخدم');
      }

      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
          messageType
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
        }
      });

      // Update conversation's updatedAt
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.message === 'لا يمكنك إرسال رسائل لهذا المستخدم') {
        throw error;
      }
      throw new Error('فشل في إرسال الرسالة');
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId, userId) {
    try {
      const unreadMessages = await prisma.message.findMany({
        where: {
          conversationId,
          senderId: { not: userId },
          readBy: {
            none: {
              userId
            }
          }
        },
        select: { id: true }
      });

      if (unreadMessages.length > 0) {
        await prisma.messageRead.createMany({
          data: unreadMessages.map(msg => ({
            messageId: msg.id,
            userId,
            readAt: new Date()
          })),
          skipDuplicates: true
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('فشل في تحديث حالة الرسائل');
    }
  }

  // Check if user can delete message
  async canDeleteMessage(messageId, userId) {
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        select: { senderId: true }
      });
      
      return message && message.senderId === userId;
    } catch (error) {
      console.error('Error checking delete permission:', error);
      return false;
    }
  }

  // Delete a message (soft delete)
  async deleteMessage(messageId) {
    try {
      await prisma.message.update({
        where: { id: messageId },
        data: {
          deletedAt: new Date(),
          content: 'تم حذف هذه الرسالة'
        }
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('فشل في حذف الرسالة');
    }
  }

  // Get unread messages count for user
  async getUnreadMessagesCount(userId) {
    try {
      const count = await prisma.message.count({
        where: {
          senderId: { not: userId },
          conversation: {
            participants: {
              some: { userId }
            }
          },
          readBy: {
            none: { userId }
          },
          deletedAt: null
        }
      });
      
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw new Error('فشل في جلب عدد الرسائل غير المقروءة');
    }
  }

  // Search messages
  async searchMessages(userId, query, conversationId = null) {
    try {
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
        take: 50
      });

      return messages;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw new Error('فشل في البحث في الرسائل');
    }
  }

  // Create report
  async createReport({ reporterId, messageId, conversationId, reason, description }) {
    try {
      const report = await prisma.messageReport.create({
        data: {
          reporterId,
          messageId,
          conversationId,
          reason,
          description,
          status: 'pending'
        },
        include: {
          reporter: {
            select: {
              id: true,
              username: true
            }
          },
          message: {
            select: {
              id: true,
              content: true,
              sender: {
                select: {
                  id: true,
                  username: true
                }
              }
            }
          }
        }
      });
      
      return report;
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('فشل في تقديم البلاغ');
    }
  }

  // Block/unblock user
  async toggleBlockUser(userId, targetUserId) {
    try {
      const existingBlock = await prisma.userBlock.findUnique({
        where: {
          blockerUserId_blockedUserId: {
            blockerUserId: userId,
            blockedUserId: targetUserId
          }
        }
      });

      if (existingBlock) {
        // Unblock user
        await prisma.userBlock.delete({
          where: {
            blockerUserId_blockedUserId: {
              blockerUserId: userId,
              blockedUserId: targetUserId
            }
          }
        });
        return { blocked: false };
      } else {
        // Block user
        await prisma.userBlock.create({
          data: {
            blockerUserId: userId,
            blockedUserId: targetUserId
          }
        });
        return { blocked: true };
      }
    } catch (error) {
      console.error('Error toggling block user:', error);
      throw new Error('فشل في تحديث حالة الحظر');
    }
  }

  // Get blocked users
  async getBlockedUsers(userId) {
    try {
      const blocks = await prisma.userBlock.findMany({
        where: {
          blockerUserId: userId
        },
        include: {
          blockedUser: {
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
      
      return blocks.map(block => ({
        id: block.id,
        blockedAt: block.createdAt,
        user: block.blockedUser
      }));
    } catch (error) {
      console.error('Error getting blocked users:', error);
      throw new Error('فشل في جلب قائمة المحظورين');
    }
  }

  // Archive/unarchive conversation
  async toggleArchiveConversation(conversationId, userId) {
    try {
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId
        }
      });

      if (!participant) {
        throw new Error('غير مسموح لك بالوصول إلى هذه المحادثة');
      }

      const updatedParticipant = await prisma.conversationParticipant.update({
        where: {
          id: participant.id
        },
        data: {
          isArchived: !participant.isArchived
        }
      });

      return {
        archived: updatedParticipant.isArchived
      };
    } catch (error) {
      console.error('Error archiving conversation:', error);
      throw new Error('فشل في أرشفة المحادثة');
    }
  }
}

module.exports = new MessageService();