const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bidService = require('../services/bidService');
const { validateBid } = require('../utils/bidValidation');

const prisma = new PrismaClient();

/**
 * Socket authentication middleware
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return next(new Error('User not found or inactive'));
    }

    socket.userId = user.id;
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Invalid authentication token'));
  }
};

/**
 * Initialize bid socket handlers
 */
const initializeBidSocket = (io) => {
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected to bid socket`);

    /**
     * Join auction room
     */
    socket.on('joinAuction', async (data) => {
      try {
        const { auctionId } = data;
        
        if (!auctionId || isNaN(parseInt(auctionId))) {
          return socket.emit('error', { message: 'معرف المزاد غير صحيح' });
        }

        // Verify auction exists and user can access it
        const auction = await prisma.auction.findUnique({
          where: { id: parseInt(auctionId) },
          select: { id: true, title: true, status: true, startTime: true, endTime: true }
        });

        if (!auction) {
          return socket.emit('error', { message: 'المزاد غير موجود' });
        }

        const roomName = `auction-${auctionId}`;
        await socket.join(roomName);
        socket.currentAuction = parseInt(auctionId);

        // Send current auction state
        const auctionState = await bidService.getAuctionCurrentState(parseInt(auctionId));
        socket.emit('auctionJoined', {
          auctionId: parseInt(auctionId),
          roomName,
          state: auctionState
        });

        // Notify room about new participant
        socket.to(roomName).emit('userJoined', {
          userId: socket.userId,
          username: socket.user.username,
          timestamp: new Date().toISOString()
        });

        // Get room participant count
        const roomSockets = await io.in(roomName).fetchSockets();
        io.to(roomName).emit('participantCountUpdate', {
          count: roomSockets.length
        });

        console.log(`User ${socket.user.username} joined auction ${auctionId}`);
      } catch (error) {
        console.error('Error joining auction:', error);
        socket.emit('error', { message: 'حدث خطأ في الانضمام للمزاد' });
      }
    });

    /**
     * Leave auction room
     */
    socket.on('leaveAuction', async (data) => {
      try {
        const { auctionId } = data;
        const roomName = `auction-${auctionId}`;
        
        await socket.leave(roomName);
        socket.currentAuction = null;

        // Notify room about user leaving
        socket.to(roomName).emit('userLeft', {
          userId: socket.userId,
          username: socket.user.username,
          timestamp: new Date().toISOString()
        });

        // Update participant count
        const roomSockets = await io.in(roomName).fetchSockets();
        io.to(roomName).emit('participantCountUpdate', {
          count: roomSockets.length
        });

        socket.emit('auctionLeft', { auctionId });
        console.log(`User ${socket.user.username} left auction ${auctionId}`);
      } catch (error) {
        console.error('Error leaving auction:', error);
      }
    });

    /**
     * Place bid via socket
     */
    socket.on('placeBid', async (data) => {
      try {
        const { auctionId, amount } = data;
        
        // Validate input
        const validation = validateBid({ auctionId, amount, userId: socket.userId });
        if (!validation.isValid) {
          return socket.emit('bidError', {
            message: 'بيانات المزايدة غير صحيحة',
            errors: validation.errors
          });
        }

        // Check if user is in auction room
        if (socket.currentAuction !== parseInt(auctionId)) {
          return socket.emit('bidError', {
            message: 'يجب الانضمام للمزاد أولاً'
          });
        }

        // Create bid using service
        const result = await bidService.createBid({
          userId: socket.userId,
          auctionId: parseInt(auctionId),
          amount: parseFloat(amount)
        });

        if (!result.success) {
          return socket.emit('bidError', {
            message: result.message
          });
        }

        const roomName = `auction-${auctionId}`;
        
        // Emit successful bid to user
        socket.emit('bidPlaced', {
          bid: result.bid,
          auction: result.auction,
          message: 'تم تسجيل المزايدة بنجاح'
        });

        // Emit bid update to all users in room
        io.to(roomName).emit('bidUpdate', {
          bid: result.bid,
          auction: result.auction,
          currentPrice: result.auction.currentPrice,
          bidCount: result.auction.bidCount,
          timestamp: new Date().toISOString()
        });

        // Emit bid animation event for UI effects
        io.to(roomName).emit('newBidAnimation', {
          bidder: result.bid.user.username,
          amount: result.bid.amount,
          timestamp: result.bid.timestamp
        });

        console.log(`Bid placed: ${amount} by ${socket.user.username} in auction ${auctionId}`);
      } catch (error) {
        console.error('Error placing bid via socket:', error);
        socket.emit('bidError', {
          message: 'حدث خطأ في تسجيل المزايدة'
        });
      }
    });

    /**
     * Get real-time auction sync
     */
    socket.on('requestAuctionSync', async (data) => {
      try {
        const { auctionId } = data;
        
        if (!auctionId || socket.currentAuction !== parseInt(auctionId)) {
          return socket.emit('error', { message: 'معرف المزاد غير صحيح' });
        }

        const auctionState = await bidService.getAuctionCurrentState(parseInt(auctionId));
        socket.emit('auctionSync', {
          auctionId: parseInt(auctionId),
          state: auctionState,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error syncing auction:', error);
        socket.emit('error', { message: 'حدث خطأ في مزامنة المزاد' });
      }
    });

    /**
     * Handle typing indicators for comments
     */
    socket.on('typing', (data) => {
      const { auctionId, isTyping } = data;
      const roomName = `auction-${auctionId}`;
      
      socket.to(roomName).emit('userTyping', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping
      });
    });

    /**
     * Handle user activity ping
     */
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    /**
     * Handle disconnection
     */
    socket.on('disconnect', async (reason) => {
      try {
        if (socket.currentAuction) {
          const roomName = `auction-${socket.currentAuction}`;
          
          // Notify room about user disconnect
          socket.to(roomName).emit('userDisconnected', {
            userId: socket.userId,
            username: socket.user.username,
            reason,
            timestamp: new Date().toISOString()
          });

          // Update participant count
          const roomSockets = await io.in(roomName).fetchSockets();
          io.to(roomName).emit('participantCountUpdate', {
            count: roomSockets.length
          });
        }

        console.log(`User ${socket.user?.username || socket.userId} disconnected: ${reason}`);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });

    /**
     * Error handling
     */
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      socket.emit('error', { message: 'حدث خطأ في الاتصال' });
    });
  });

  /**
   * Emit auction status changes
   */
  const emitAuctionStatusChange = async (auctionId, status, data = {}) => {
    try {
      const roomName = `auction-${auctionId}`;
      io.to(roomName).emit('auctionStatusChange', {
        auctionId,
        status,
        timestamp: new Date().toISOString(),
        ...data
      });
    } catch (error) {
      console.error('Error emitting auction status change:', error);
    }
  };

  /**
   * Emit auction end notification
   */
  const emitAuctionEnd = async (auctionId, winner, finalPrice) => {
    try {
      const roomName = `auction-${auctionId}`;
      io.to(roomName).emit('auctionEnded', {
        auctionId,
        winner,
        finalPrice,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error emitting auction end:', error);
    }
  };

  /**
   * Emit admin bid cancellation
   */
  const emitBidCancellation = async (auctionId, bidId, newCurrentPrice) => {
    try {
      const roomName = `auction-${auctionId}`;
      io.to(roomName).emit('bidCancelled', {
        auctionId,
        bidId,
        newCurrentPrice,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error emitting bid cancellation:', error);
    }
  };

  return {
    emitAuctionStatusChange,
    emitAuctionEnd,
    emitBidCancellation
  };
};

module.exports = {
  initializeBidSocket,
  authenticateSocket
};