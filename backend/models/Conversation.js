const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ConversationModel {
  constructor() {
    this.tableName = 'conversation';
  }

  // Create a new conversation
  async create(data) {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          type: data.type || 'private',
          title: data.title || null,
          description: data.description || null,
          metadata: data.metadata || null,
          auctionId: data.auctionId || null,
          createdById: data.createdById
        },
        include: {
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          auction: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('فشل في إنشاء المحادثة');
    }
  }

  // Create conversation with participants
  async createWithParticipants(conversationData, participantUserIds) {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          type: conversationData.type || 'private',
          title: conversationData.title || null,
          description: conversationData.description || null,
          metadata: conversationData.metadata || null,
          auctionId: conversationData.auctionId || null,
          createdById: conversationData.createdById,
          participants: {
            create: participantUserIds.map(userId => ({
              userId,
              role: userId === conversationData.createdById ? 'admin' : 'member'
            }))
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                  isOnline: true,
                  lastSeenAt: true
                }
              }
            }
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true
            }
          },
          auction: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error creating conversation with participants:', error);
      throw new Error('فشل في إنشاء المحادثة مع المشاركين');
    }
  }

  // Find conversation by ID
  async findById(id, includeMessages = false) {
    try {
      const includeOptions = {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                isOnline: true,
                lastSeenAt: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        },
        auction: {
          select: {
            id: true,
            title: true,
            status: true,
            seller: {
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
            messages: true,
            participants: true
          }
        }
      };

      if (includeMessages) {
        includeOptions.messages = {
          take: 20,
          orderBy: { createdAt: 'desc' },
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
        };
      }

      const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: includeOptions
      });

      return conversation;
    } catch (error) {
      console.error('Error finding conversation by ID:', error);
      throw new Error('فشل في البحث عن المحادثة');
    }
  }

  // Find private conversation between two users
  async findPrivateConversation(userId1, userId2) {
    try {
      const conversation = await prisma.conversation.findFirst({
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

      return conversation;
    } catch (error) {
      console.error('Error finding private conversation:', error);
      throw new Error('فشل في البحث عن المحادثة الخاصة');
    }
  }

  // Find conversations by user ID
  async findByUserId(userId, options = {}) {
    try {
      const {
        type,
        includeArchived = false,
        page = 1,
        limit = 20,
        orderBy = 'updatedAt',
        orderDirection = 'desc'
      } = options;

      const offset = (page - 1) * limit;
      const whereConditions = {
        participants: {
          some: {
            userId,
            isArchived: includeArchived ? undefined : false
          }
        }
      };

      if (type) {
        whereConditions.type = type;
      }

      const conversations = await prisma.conversation.findMany({
        where: whereConditions,
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
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
            orderBy: { createdAt: 'desc' },
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
          auction: {
            select: {
              id: true,
              title: true,
              status: true
            }
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderId: { not: userId },
                  readBy: {
                    none: { userId }
                  },
                  deletedAt: null
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

      return conversations;
    } catch (error) {
      console.error('Error finding conversations by user ID:', error);
      throw new Error('فشل في البحث عن محادثات المستخدم');
    }
  }

  // Find conversations by auction ID
  async findByAuctionId(auctionId) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: { auctionId },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true
                }
              }
            }
          },
          createdBy: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              messages: true,
              participants: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return conversations;
    } catch (error) {
      console.error('Error finding conversations by auction ID:', error);
      throw new Error('فشل في البحث عن محادثات المزاد');
    }
  }

  // Update conversation
  async update(id, data) {
    try {
      const updateData = {};
      
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.metadata !== undefined) updateData.metadata = data.metadata;
      if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;

      const conversation = await prisma.conversation.update({
        where: { id },
        data: updateData,
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatarUrl: true
                }
              }
            }
          }
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw new Error('فشل في تحديث المحادثة');
    }
  }

  // Delete conversation
  async delete(id) {
    try {
      // First delete all messages in the conversation
      await prisma.message.deleteMany({
        where: { conversationId: id }
      });

      // Delete all participants
      await prisma.conversationParticipant.deleteMany({
        where: { conversationId: id }
      });

      // Delete the conversation
      await prisma.conversation.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('فشل في حذف المحادثة');
    }
  }

  // Add participant to conversation
  async addParticipant(conversationId, userId, role = 'member') {
    try {
      const participant = await prisma.conversationParticipant.create({
        data: {
          conversationId,
          userId,
          role,
          joinedAt: new Date()
        },
        include: {
          user: {
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

      return participant;
    } catch (error) {
      console.error('Error adding participant:', error);
      throw new Error('فشل في إضافة المشارك');
    }
  }

  // Remove participant from conversation
  async removeParticipant(conversationId, userId) {
    try {
      await prisma.conversationParticipant.delete({
        where: {
          conversationId_userId: {
            conversationId,
            userId
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Error removing participant:', error);
      throw new Error('فشل في إزالة المشارك');
    }
  }

  // Update participant role
  async updateParticipantRole(conversationId, userId, role) {
    try {
      const participant = await prisma.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId
          }
        },
        data: { role },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return participant;
    } catch (error) {
      console.error('Error updating participant role:', error);
      throw new Error('فشل في تحديث دور المشارك');
    }
  }

  // Check if user is participant
  async isParticipant(conversationId, userId) {
    try {
      const participant = await prisma.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId
          }
        }
      });

      return !!participant;
    } catch (error) {
      console.error('Error checking participant:', error);
      return false;
    }
  }

  // Get conversation participants
  async getParticipants(conversationId) {
    try {
      const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              isOnline: true,
              lastSeenAt: true
            }
          }
        },
        orderBy: {
          joinedAt: 'asc'
        }
      });

      return participants;
    } catch (error) {
      console.error('Error getting participants:', error);
      throw new Error('فشل في جلب المشاركين');
    }
  }

  // Search conversations
  async search(userId, query, options = {}) {
    try {
      const { limit = 20 } = options;
      
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId }
          },
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              messages: {
                some: {
                  content: {
                    contains: query,
                    mode: 'insensitive'
                  },
                  deletedAt: null
                }
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
                  firstName: true,
                  lastName: true,
                  avatarUrl: true
                }
              }
            }
          },
          auction: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: limit
      });

      return conversations;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw new Error('فشل في البحث في المحادثات');
    }
  }

  // Count conversations for user
  async countByUserId(userId, options = {}) {
    try {
      const { type, includeArchived = false } = options;
      
      const whereConditions = {
        participants: {
          some: {
            userId,
            isArchived: includeArchived ? undefined : false
          }
        }
      };

      if (type) {
        whereConditions.type = type;
      }

      const count = await prisma.conversation.count({
        where: whereConditions
      });

      return count;
    } catch (error) {
      console.error('Error counting conversations:', error);
      throw new Error('فشل في عد المحادثات');
    }
  }
}

module.exports = new ConversationModel();