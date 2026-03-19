const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { rateLimitBidding } = require('../middleware/rateLimiter');

// Apply authentication to all bid routes
router.use(authenticateToken);

/**
 * @route   POST /api/bids
 * @desc    Create new bid
 * @access  Private (Users only)
 */
router.post('/', rateLimitBidding, bidController.createBid);

/**
 * @route   GET /api/bids/auction/:auctionId
 * @desc    Get all bids for specific auction
 * @access  Private
 */
router.get('/auction/:auctionId', bidController.getAuctionBids);

/**
 * @route   GET /api/bids/user/me
 * @desc    Get current user's bids
 * @access  Private
 */
router.get('/user/me', bidController.getUserBids);

/**
 * @route   GET /api/bids/auction/:auctionId/stats
 * @desc    Get bid statistics for auction
 * @access  Private
 */
router.get('/auction/:auctionId/stats', bidController.getBidStats);

/**
 * @route   GET /api/bids/auction/:auctionId/state
 * @desc    Get real-time auction state
 * @access  Private
 */
router.get('/auction/:auctionId/state', bidController.getAuctionState);

/**
 * @route   GET /api/bids/auction/:auctionId/bidders
 * @desc    Get highest bidders for auction
 * @access  Private
 */
router.get('/auction/:auctionId/bidders', bidController.getHighestBidders);

/**
 * @route   GET /api/bids/auction/:auctionId/timeline
 * @desc    Get bid timeline for synchronization
 * @access  Private
 */
router.get('/auction/:auctionId/timeline', bidController.getBidTimeline);

/**
 * @route   DELETE /api/bids/:bidId/cancel
 * @desc    Cancel bid (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:bidId/cancel', requireRole('admin'), bidController.cancelBid);

module.exports = router;