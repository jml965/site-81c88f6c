const auctionService = require('../services/auctionService');
const syncService = require('../services/syncService');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

class AuctionController {
  // Get all auctions with filtering
  async getAllAuctions(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        status,
        sort = 'created_at',
        order = 'DESC',
        search,
        seller_id,
        min_price,
        max_price
      } = req.query;

      const filters = {
        category,
        status,
        search,
        seller_id,
        min_price: min_price ? parseFloat(min_price) : undefined,
        max_price: max_price ? parseFloat(max_price) : undefined
      };

      const auctions = await auctionService.getAllAuctions({
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        sort,
        order
      });

      res.json({
        success: true,
        data: auctions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: auctions.total,
          pages: Math.ceil(auctions.total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get auctions error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب المزادات',
        error: error.message
      });
    }
  }

  // Get auction by ID with sync data
  async getAuctionById(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      const auction = await auctionService.getAuctionById(id, user_id);
      
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'المزاد غير موجود'
        });
      }

      // Get sync data if auction is active
      let syncData = null;
      if (auction.status === 'active') {
        syncData = await syncService.getAuctionSyncData(id);
      }

      res.json({
        success: true,
        data: {
          ...auction,
          sync: syncData
        }
      });
    } catch (error) {
      console.error('Get auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب المزاد',
        error: error.message
      });
    }
  }

  // Create new auction
  async createAuction(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const seller_id = req.user.id;
      const auctionData = {
        ...req.body,
        seller_id
      };

      const auction = await auctionService.createAuction(auctionData);

      res.status(201).json({
        success: true,
        message: 'تم إنشاء المزاد بنجاح',
        data: auction
      });
    } catch (error) {
      console.error('Create auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في إنشاء المزاد',
        error: error.message
      });
    }
  }

  // Update auction
  async updateAuction(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'بيانات غير صحيحة',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const user_id = req.user.id;
      const user_role = req.user.role;

      // Check if user owns the auction or is admin
      const auction = await auctionService.getAuctionById(id);
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'المزاد غير موجود'
        });
      }

      if (auction.seller_id !== user_id && user_role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'غير مصرح لك بتعديل هذا المزاد'
        });
      }

      const updatedAuction = await auctionService.updateAuction(id, req.body);

      res.json({
        success: true,
        message: 'تم تحديث المزاد بنجاح',
        data: updatedAuction
      });
    } catch (error) {
      console.error('Update auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في تحديث المزاد',
        error: error.message
      });
    }
  }

  // Delete auction
  async deleteAuction(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_role = req.user.role;

      // Check if user owns the auction or is admin
      const auction = await auctionService.getAuctionById(id);
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'المزاد غير موجود'
        });
      }

      if (auction.seller_id !== user_id && user_role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'غير مصرح لك بحذف هذا المزاد'
        });
      }

      await auctionService.deleteAuction(id);

      res.json({
        success: true,
        message: 'تم حذف المزاد بنجاح'
      });
    } catch (error) {
      console.error('Delete auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في حذف المزاد',
        error: error.message
      });
    }
  }

  // Start auction
  async startAuction(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_role = req.user.role;

      // Check permissions
      const auction = await auctionService.getAuctionById(id);
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'المزاد غير موجود'
        });
      }

      if (auction.seller_id !== user_id && user_role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'غير مصرح لك ببدء هذا المزاد'
        });
      }

      const startedAuction = await auctionService.startAuction(id);

      // Initialize sync service for this auction
      await syncService.initializeAuction(id);

      res.json({
        success: true,
        message: 'تم بدء المزاد بنجاح',
        data: startedAuction
      });
    } catch (error) {
      console.error('Start auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في بدء المزاد',
        error: error.message
      });
    }
  }

  // End auction
  async endAuction(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const user_role = req.user.role;

      // Check permissions
      const auction = await auctionService.getAuctionById(id);
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'المزاد غير موجود'
        });
      }

      if (auction.seller_id !== user_id && user_role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'غير مصرح لك بإنهاء هذا المزاد'
        });
      }

      const endedAuction = await auctionService.endAuction(id);

      res.json({
        success: true,
        message: 'تم إنهاء المزاد بنجاح',
        data: endedAuction
      });
    } catch (error) {
      console.error('End auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في إنهاء المزاد',
        error: error.message
      });
    }
  }

  // Get auction sync status
  async getAuctionSync(req, res) {
    try {
      const { id } = req.params;
      
      const auction = await auctionService.getAuctionById(id);
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'المزاد غير موجود'
        });
      }

      if (auction.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'المزاد غير نشط'
        });
      }

      const syncData = await syncService.getAuctionSyncData(id);

      res.json({
        success: true,
        data: syncData
      });
    } catch (error) {
      console.error('Get auction sync error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب بيانات المزامنة',
        error: error.message
      });
    }
  }

  // Join auction
  async joinAuction(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      
      const auction = await auctionService.getAuctionById(id);
      if (!auction) {
        return res.status(404).json({
          success: false,
          message: 'المزاد غير موجود'
        });
      }

      if (auction.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'المزاد غير نشط'
        });
      }

      // Add user to auction participants
      await auctionService.addParticipant(id, user_id);

      // Get current sync data
      const syncData = await syncService.getAuctionSyncData(id);

      res.json({
        success: true,
        message: 'تم الانضمام للمزاد بنجاح',
        data: {
          auction,
          sync: syncData
        }
      });
    } catch (error) {
      console.error('Join auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في الانضمام للمزاد',
        error: error.message
      });
    }
  }

  // Leave auction
  async leaveAuction(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      
      await auctionService.removeParticipant(id, user_id);

      res.json({
        success: true,
        message: 'تم مغادرة المزاد بنجاح'
      });
    } catch (error) {
      console.error('Leave auction error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في مغادرة المزاد',
        error: error.message
      });
    }
  }

  // Get auction participants
  async getParticipants(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const participants = await auctionService.getParticipants(id, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: participants
      });
    } catch (error) {
      console.error('Get participants error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب المشاركين',
        error: error.message
      });
    }
  }

  // Get auction statistics
  async getAuctionStats(req, res) {
    try {
      const { id } = req.params;
      
      const stats = await auctionService.getAuctionStats(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get auction stats error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب إحصائيات المزاد',
        error: error.message
      });
    }
  }

  // Get seller auctions
  async getSellerAuctions(req, res) {
    try {
      const { seller_id } = req.params;
      const {
        page = 1,
        limit = 12,
        status,
        sort = 'created_at',
        order = 'DESC'
      } = req.query;
      
      const auctions = await auctionService.getSellerAuctions(seller_id, {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        sort,
        order
      });

      res.json({
        success: true,
        data: auctions
      });
    } catch (error) {
      console.error('Get seller auctions error:', error);
      res.status(500).json({
        success: false,
        message: 'فشل في جلب مزادات البائع',
        error: error.message
      });
    }
  }
}

module.exports = new AuctionController();