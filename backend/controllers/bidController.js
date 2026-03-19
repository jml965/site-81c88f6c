const bidService = require('../services/bidService');
const { validateBid, validateUpdateBid } = require('../utils/bidValidation');
const { io } = require('../socket/socketServer');

/**
 * Create new bid
 */
const createBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const userId = req.user.id;

    // Validate input
    const validation = validateBid({ auctionId, amount, userId });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'بيانات المزايدة غير صحيحة',
        errors: validation.errors
      });
    }

    // Create bid
    const result = await bidService.createBid({
      userId,
      auctionId: parseInt(auctionId),
      amount: parseFloat(amount)
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Emit real-time update to all users in auction room
    io.to(`auction-${auctionId}`).emit('bidUpdate', {
      bid: result.bid,
      auction: result.auction,
      currentPrice: result.auction.currentPrice,
      bidCount: result.auction.bidCount,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'تم تسجيل المزايدة بنجاح',
      data: {
        bid: result.bid,
        auction: result.auction
      }
    });
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

/**
 * Get bids for auction
 */
const getAuctionBids = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { page = 1, limit = 20, sort = 'desc' } = req.query;

    if (!auctionId || isNaN(parseInt(auctionId))) {
      return res.status(400).json({
        success: false,
        message: 'معرف المزاد غير صحيح'
      });
    }

    const bids = await bidService.getAuctionBids({
      auctionId: parseInt(auctionId),
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    });

    res.json({
      success: true,
      data: bids
    });
  } catch (error) {
    console.error('Error fetching auction bids:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

/**
 * Get user bids
 */
const getUserBids = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status = 'all' } = req.query;

    const bids = await bidService.getUserBids({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });

    res.json({
      success: true,
      data: bids
    });
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

/**
 * Get bid statistics
 */
const getBidStats = async (req, res) => {
  try {
    const { auctionId } = req.params;

    if (!auctionId || isNaN(parseInt(auctionId))) {
      return res.status(400).json({
        success: false,
        message: 'معرف المزاد غير صحيح'
      });
    }

    const stats = await bidService.getBidStatistics(parseInt(auctionId));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching bid statistics:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

/**
 * Get real-time auction state
 */
const getAuctionState = async (req, res) => {
  try {
    const { auctionId } = req.params;

    if (!auctionId || isNaN(parseInt(auctionId))) {
      return res.status(400).json({
        success: false,
        message: 'معرف المزاد غير صحيح'
      });
    }

    const state = await bidService.getAuctionCurrentState(parseInt(auctionId));

    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'المزاد غير موجود'
      });
    }

    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    console.error('Error fetching auction state:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

/**
 * Cancel bid (admin only)
 */
const cancelBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    if (!bidId || isNaN(parseInt(bidId))) {
      return res.status(400).json({
        success: false,
        message: 'معرف المزايدة غير صحيح'
      });
    }

    const result = await bidService.cancelBid({
      bidId: parseInt(bidId),
      adminId,
      reason
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Emit update to auction room
    io.to(`auction-${result.bid.auctionId}`).emit('bidCancelled', {
      bidId: result.bid.id,
      auctionId: result.bid.auctionId,
      newCurrentPrice: result.newCurrentPrice,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'تم إلغاء المزايدة بنجاح',
      data: result
    });
  } catch (error) {
    console.error('Error cancelling bid:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

/**
 * Get highest bidders for auction
 */
const getHighestBidders = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { limit = 10 } = req.query;

    if (!auctionId || isNaN(parseInt(auctionId))) {
      return res.status(400).json({
        success: false,
        message: 'معرف المزاد غير صحيح'
      });
    }

    const bidders = await bidService.getHighestBidders({
      auctionId: parseInt(auctionId),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: bidders
    });
  } catch (error) {
    console.error('Error fetching highest bidders:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

/**
 * Get bid timeline for auction synchronization
 */
const getBidTimeline = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { startTime, endTime } = req.query;

    if (!auctionId || isNaN(parseInt(auctionId))) {
      return res.status(400).json({
        success: false,
        message: 'معرف المزاد غير صحيح'
      });
    }

    const timeline = await bidService.getBidTimeline({
      auctionId: parseInt(auctionId),
      startTime: startTime ? new Date(startTime) : null,
      endTime: endTime ? new Date(endTime) : null
    });

    res.json({
      success: true,
      data: timeline
    });
  } catch (error) {
    console.error('Error fetching bid timeline:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في النظام'
    });
  }
};

module.exports = {
  createBid,
  getAuctionBids,
  getUserBids,
  getBidStats,
  getAuctionState,
  cancelBid,
  getHighestBidders,
  getBidTimeline
};