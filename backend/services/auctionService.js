const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const timeSync = require('../utils/timeSync');
const auctionSync = require('../utils/auctionSync');

class AuctionService {
  // Get all auctions with filtering and pagination
  async getAllAuctions({ page = 1, limit = 12, filters = {}, sort = 'created_at', order = 'DESC' }) {
    try {
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT 
          a.*,
          u.name as seller_name,
          u.avatar_url as seller_avatar,
          c.name as category_name,
          COUNT(DISTINCT ap.user_id) as participant_count,
          COUNT(DISTINCT b.id) as bid_count,
          MAX(b.amount) as current_price,
          COUNT(DISTINCT al.id) as like_count,
          AVG(ar.rating) as avg_rating
        FROM auctions a
        LEFT JOIN users u ON a.seller_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN auction_participants ap ON a.id = ap.auction_id
        LEFT JOIN bids b ON a.id = b.auction_id AND b.status = 'active'
        LEFT JOIN auction_likes al ON a.id = al.auction_id
        LEFT JOIN auction_reviews ar ON a.id = ar.auction_id
        WHERE a.status != 'deleted'
      `;
      
      const queryParams = [];
      let paramIndex = 1;
      
      // Apply filters
      if (filters.category) {
        query += ` AND a.category_id = $${paramIndex}`;
        queryParams.push(filters.category);
        paramIndex++;
      }
      
      if (filters.status) {
        query += ` AND a.status = $${paramIndex}`;
        queryParams.push(filters.status);
        paramIndex++;
      }
      
      if (filters.seller_id) {
        query += ` AND a.seller_id = $${paramIndex}`;
        queryParams.push(filters.seller_id);
        paramIndex++;
      }
      
      if (filters.search) {
        query += ` AND (a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`;
        queryParams.push(`%${filters.search}%`);
        paramIndex++;
      }
      
      if (filters.min_price) {
        query += ` AND COALESCE(MAX(b.amount), a.starting_price) >= $${paramIndex}`;
        queryParams.push(filters.min_price);
        paramIndex++;
      }
      
      if (filters.max_price) {
        query += ` AND COALESCE(MAX(b.amount), a.starting_price) <= $${paramIndex}`;
        queryParams.push(filters.max_price);
        paramIndex++;
      }
      
      query += ` GROUP BY a.id, u.name, u.avatar_url, c.name`;
      
      // Apply sorting
      const validSortFields = {
        'created_at': 'a.created_at',
        'start_time': 'a.start_time', 
        'end_time': 'a.end_time',
        'title': 'a.title',
        'starting_price': 'a.starting_price',
        'current_price': 'COALESCE(MAX(b.amount), a.starting_price)',
        'bid_count': 'COUNT(DISTINCT b.id)',
        'participant_count': 'COUNT(DISTINCT ap.user_id)',
        'like_count': 'COUNT(DISTINCT al.id)'
      };
      
      const sortField = validSortFields[sort] || 'a.created_at';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY ${sortField} ${sortOrder}`;
      
      // Add pagination
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);
      
      // Execute query
      const result = await db.query(query, queryParams);
      
      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(DISTINCT a.id) as total
        FROM auctions a
        LEFT JOIN users u ON a.seller_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        WHERE a.status != 'deleted'
      `;
      
      const countParams = [];
      let countParamIndex = 1;
      
      // Apply same filters for count
      if (filters.category) {
        countQuery += ` AND a.category_id = $${countParamIndex}`;
        countParams.push(filters.category);
        countParamIndex++;
      }
      
      if (filters.status) {
        countQuery += ` AND a.status = $${countParamIndex}`;
        countParams.push(filters.status);
        countParamIndex++;
      }
      
      if (filters.seller_id) {
        countQuery += ` AND a.seller_id = $${countParamIndex}`;
        countParams.push(filters.seller_id);
        countParamIndex++;
      }
      
      if (filters.search) {
        countQuery += ` AND (a.title ILIKE $${countParamIndex} OR a.description ILIKE $${countParamIndex})`;
        countParams.push(`%${filters.search}%`);
        countParamIndex++;
      }
      
      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);
      
      // Process results
      const auctions = result.rows.map(auction => {
        const currentTime = timeSync.getServerTime();
        const timeRemaining = auction.status === 'active' && auction.end_time 
          ? Math.max(0, new Date(auction.end_time).getTime() - currentTime)
          : 0;
          
        return {
          ...auction,
          current_price: parseFloat(auction.current_price || auction.starting_price),
          participant_count: parseInt(auction.participant_count || 0),
          bid_count: parseInt(auction.bid_count || 0),
          like_count: parseInt(auction.like_count || 0),
          avg_rating: parseFloat(auction.avg_rating || 0),
          time_remaining: timeRemaining,
          tags: auction.tags || []
        };
      });
      
      return {
        auctions,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get all auctions error:', error);
      throw new Error('فشل في جلب المزادات');
    }
  }
  
  // Get auction by ID with detailed information
  async getAuctionById(auctionId, userId = null) {
    try {
      const query = `
        SELECT 
          a.*,
          u.name as seller_name,
          u.avatar_url as seller_avatar,
          u.email as seller_email,
          u.phone as seller_phone,
          c.name as category_name,
          COUNT(DISTINCT ap.user_id) as participant_count,
          COUNT(DISTINCT b.id) as bid_count,
          MAX(b.amount) as current_price,
          COUNT(DISTINCT al.id) as like_count,
          COUNT(DISTINCT ac.id) as comment_count,
          AVG(ar.rating) as avg_rating,
          CASE WHEN ual.user_id IS NOT NULL THEN true ELSE false END as is_liked,
          CASE WHEN uaf.user_id IS NOT NULL THEN true ELSE false END as is_followed,
          CASE WHEN ap_user.user_id IS NOT NULL THEN true ELSE false END as is_participant
        FROM auctions a
        LEFT JOIN users u ON a.seller_id = u.id
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN auction_participants ap ON a.id = ap.auction_id
        LEFT JOIN bids b ON a.id = b.auction_id AND b.status = 'active'
        LEFT JOIN auction_likes al ON a.id = al.auction_id
        LEFT JOIN auction_comments ac ON a.id = ac.auction_id AND ac.status = 'active'
        LEFT JOIN auction_reviews ar ON a.id = ar.auction_id
        LEFT JOIN auction_likes ual ON a.id = ual.auction_id AND ual.user_id = $2
        LEFT JOIN auction_follows uaf ON a.id = uaf.auction_id AND uaf.user_id = $2
        LEFT JOIN auction_participants ap_user ON a.id = ap_user.auction_id AND ap_user.user_id = $2
        WHERE a.id = $1 AND a.status != 'deleted'
        GROUP BY a.id, u.name, u.avatar_url, u.email, u.phone, c.name, ual.user_id, uaf.user_id, ap_user.user_id
      `;
      
      const result = await db.query(query, [auctionId, userId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const auction = result.rows[0];
      
      // Get auction images
      const imagesQuery = `
        SELECT id, url, alt_text, is_cover, display_order
        FROM auction_images 
        WHERE auction_id = $1 
        ORDER BY is_cover DESC, display_order ASC
      `;
      const imagesResult = await db.query(imagesQuery, [auctionId]);
      
      // Get latest bids
      const bidsQuery = `
        SELECT 
          b.id,
          b.amount,
          b.created_at,
          u.name as bidder_name,
          u.avatar_url as bidder_avatar
        FROM bids b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.auction_id = $1 AND b.status = 'active'
        ORDER BY b.amount DESC, b.created_at DESC
        LIMIT 10
      `;
      const bidsResult = await db.query(bidsQuery, [auctionId]);
      
      const currentTime = timeSync.getServerTime();
      const timeRemaining = auction.status === 'active' && auction.end_time 
        ? Math.max(0, new Date(auction.end_time).getTime() - currentTime)
        : 0;
      
      return {
        ...auction,
        current_price: parseFloat(auction.current_price || auction.starting_price),
        participant_count: parseInt(auction.participant_count || 0),
        bid_count: parseInt(auction.bid_count || 0),
        like_count: parseInt(auction.like_count || 0),
        comment_count: parseInt(auction.comment_count || 0),
        avg_rating: parseFloat(auction.avg_rating || 0),
        time_remaining: timeRemaining,
        is_liked: auction.is_liked || false,
        is_followed: auction.is_followed || false,
        is_participant: auction.is_participant || false,
        tags: auction.tags || [],
        images: imagesResult.rows,
        recent_bids: bidsResult.rows
      };
    } catch (error) {
      console.error('Get auction by ID error:', error);
      throw new Error('فشل في جلب المزاد');
    }
  }
  
  // Create new auction
  async createAuction(auctionData) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      const {
        seller_id,
        title,
        description,
        category_id,
        starting_price,
        min_bid_increment,
        duration_minutes,
        start_time,
        video_url,
        cover_image_url,
        location,
        condition,
        tags = [],
        images = []
      } = auctionData;
      
      // Calculate end time
      const startDateTime = start_time ? new Date(start_time) : new Date();
      const endDateTime = new Date(startDateTime.getTime() + (duration_minutes * 60 * 1000));
      
      // Insert auction
      const auctionQuery = `
        INSERT INTO auctions (
          seller_id, title, description, category_id, starting_price, 
          min_bid_increment, start_time, end_time, video_url, 
          cover_image_url, location, condition, tags, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      
      const status = start_time && new Date(start_time) > new Date() ? 'scheduled' : 'pending';
      
      const auctionResult = await client.query(auctionQuery, [
        seller_id,
        title,
        description,
        category_id,
        starting_price,
        min_bid_increment,
        startDateTime,
        endDateTime,
        video_url,
        cover_image_url,
        location,
        condition,
        JSON.stringify(tags),
        status
      ]);
      
      const auction = auctionResult.rows[0];
      
      // Insert images if provided
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          await client.query(
            'INSERT INTO auction_images (auction_id, url, alt_text, is_cover, display_order) VALUES ($1, $2, $3, $4, $5)',
            [auction.id, image.url, image.alt_text || '', image.is_cover || false, i + 1]
          );
        }
      }
      
      // Create auction activity log
      await client.query(
        'INSERT INTO auction_logs (auction_id, action, description, metadata) VALUES ($1, $2, $3, $4)',
        [auction.id, 'created', 'تم إنشاء المزاد', JSON.stringify({ seller_id, title })]
      );
      
      await client.query('COMMIT');
      
      // Get the complete auction with relations
      return await this.getAuctionById(auction.id);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create auction error:', error);
      throw new Error('فشل في إنشاء المزاد');
    } finally {
      client.release();
    }
  }
  
  // Update auction
  async updateAuction(auctionId, updateData) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Check if auction exists and can be updated
      const existingAuction = await client.query(
        'SELECT * FROM auctions WHERE id = $1 AND status != \'deleted\'',
        [auctionId]
      );
      
      if (existingAuction.rows.length === 0) {
        throw new Error('المزاد غير موجود');
      }
      
      const auction = existingAuction.rows[0];
      
      // Prevent updating if auction is active or ended
      if (['active', 'ended', 'completed'].includes(auction.status)) {
        throw new Error('لا يمكن تعديل المزاد في هذه الحالة');
      }
      
      // Build update query dynamically
      const allowedFields = [
        'title', 'description', 'starting_price', 'min_bid_increment',
        'start_time', 'video_url', 'cover_image_url', 'location', 
        'condition', 'tags'
      ];
      
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;
      
      for (const field of allowedFields) {
        if (updateData.hasOwnProperty(field)) {
          updateFields.push(`${field} = $${paramIndex}`);
          
          if (field === 'tags') {
            updateValues.push(JSON.stringify(updateData[field]));
          } else {
            updateValues.push(updateData[field]);
          }
          paramIndex++;
        }
      }
      
      if (updateFields.length === 0) {
        throw new Error('لا يوجد حقول للتحديث');
      }
      
      // Update end_time if duration_minutes is provided
      if (updateData.duration_minutes && updateData.start_time) {
        const startDateTime = new Date(updateData.start_time);
        const endDateTime = new Date(startDateTime.getTime() + (updateData.duration_minutes * 60 * 1000));
        updateFields.push(`end_time = $${paramIndex}`);
        updateValues.push(endDateTime);
        paramIndex++;
      }
      
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(auctionId);
      
      const updateQuery = `
        UPDATE auctions 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const result = await client.query(updateQuery, updateValues);
      
      // Log the update
      await client.query(
        'INSERT INTO auction_logs (auction_id, action, description, metadata) VALUES ($1, $2, $3, $4)',
        [auctionId, 'updated', 'تم تحديث المزاد', JSON.stringify(updateData)]
      );
      
      await client.query('COMMIT');
      
      return await this.getAuctionById(auctionId);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Update auction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Start auction
  async startAuction(auctionId) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      const auction = await client.query(
        'SELECT * FROM auctions WHERE id = $1',
        [auctionId]
      );
      
      if (auction.rows.length === 0) {
        throw new Error('المزاد غير موجود');
      }
      
      const auctionData = auction.rows[0];
      
      if (auctionData.status !== 'scheduled' && auctionData.status !== 'pending') {
        throw new Error('لا يمكن بدء المزاد في هذه الحالة');
      }
      
      // Update auction status and timing
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + (auctionData.duration_minutes || 60) * 60 * 1000);
      
      const result = await client.query(
        `UPDATE auctions 
         SET status = 'active', start_time = $2, end_time = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [auctionId, startTime, endTime]
      );
      
      // Log the start
      await client.query(
        'INSERT INTO auction_logs (auction_id, action, description, metadata) VALUES ($1, $2, $3, $4)',
        [auctionId, 'started', 'تم بدء المزاد', JSON.stringify({ start_time: startTime, end_time: endTime })]
      );
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Start auction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // End auction
  async endAuction(auctionId) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      const auction = await client.query(
        'SELECT * FROM auctions WHERE id = $1',
        [auctionId]
      );
      
      if (auction.rows.length === 0) {
        throw new Error('المزاد غير موجود');
      }
      
      const auctionData = auction.rows[0];
      
      if (auctionData.status !== 'active') {
        throw new Error('المزاد ليس نشطاً');
      }
      
      // Get highest bid
      const highestBid = await client.query(
        'SELECT * FROM bids WHERE auction_id = $1 AND status = \'active\' ORDER BY amount DESC, created_at ASC LIMIT 1',
        [auctionId]
      );
      
      const status = highestBid.rows.length > 0 ? 'completed' : 'ended';
      const winnerId = highestBid.rows.length > 0 ? highestBid.rows[0].user_id : null;
      const finalPrice = highestBid.rows.length > 0 ? highestBid.rows[0].amount : auctionData.starting_price;
      
      // Update auction
      const result = await client.query(
        `UPDATE auctions 
         SET status = $2, end_time = CURRENT_TIMESTAMP, winner_id = $3, final_price = $4, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [auctionId, status, winnerId, finalPrice]
      );
      
      // Log the end
      await client.query(
        'INSERT INTO auction_logs (auction_id, action, description, metadata) VALUES ($1, $2, $3, $4)',
        [auctionId, 'ended', 'تم إنهاء المزاد', JSON.stringify({ status, winner_id: winnerId, final_price: finalPrice })]
      );
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('End auction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Delete auction (soft delete)
  async deleteAuction(auctionId) {
    try {
      const result = await db.query(
        'UPDATE auctions SET status = \'deleted\', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [auctionId]
      );
      
      if (result.rows.length === 0) {
        throw new Error('المزاد غير موجود');
      }
      
      // Log the deletion
      await db.query(
        'INSERT INTO auction_logs (auction_id, action, description) VALUES ($1, $2, $3)',
        [auctionId, 'deleted', 'تم حذف المزاد']
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Delete auction error:', error);
      throw new Error('فشل في حذف المزاد');
    }
  }
  
  // Add participant to auction
  async addParticipant(auctionId, userId) {
    try {
      // Check if already participant
      const existing = await db.query(
        'SELECT id FROM auction_participants WHERE auction_id = $1 AND user_id = $2',
        [auctionId, userId]
      );
      
      if (existing.rows.length > 0) {
        return existing.rows[0];
      }
      
      const result = await db.query(
        'INSERT INTO auction_participants (auction_id, user_id) VALUES ($1, $2) RETURNING *',
        [auctionId, userId]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Add participant error:', error);
      throw new Error('فشل في الانضمام للمزاد');
    }
  }
  
  // Remove participant from auction
  async removeParticipant(auctionId, userId) {
    try {
      const result = await db.query(
        'DELETE FROM auction_participants WHERE auction_id = $1 AND user_id = $2 RETURNING *',
        [auctionId, userId]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Remove participant error:', error);
      throw new Error('فشل في مغادرة المزاد');
    }
  }
  
  // Get auction participants
  async getParticipants(auctionId, { page = 1, limit = 20 }) {
    try {
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT 
          u.id,
          u.name,
          u.avatar_url,
          ap.joined_at,
          COUNT(DISTINCT b.id) as bid_count,
          MAX(b.amount) as highest_bid
        FROM auction_participants ap
        LEFT JOIN users u ON ap.user_id = u.id
        LEFT JOIN bids b ON ap.auction_id = b.auction_id AND ap.user_id = b.user_id AND b.status = 'active'
        WHERE ap.auction_id = $1
        GROUP BY u.id, u.name, u.avatar_url, ap.joined_at
        ORDER BY ap.joined_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await db.query(query, [auctionId, limit, offset]);
      
      // Get total count
      const countResult = await db.query(
        'SELECT COUNT(*) as total FROM auction_participants WHERE auction_id = $1',
        [auctionId]
      );
      
      return {
        participants: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        limit
      };
    } catch (error) {
      console.error('Get participants error:', error);
      throw new Error('فشل في جلب المشاركين');
    }
  }
  
  // Get auction statistics
  async getAuctionStats(auctionId) {
    try {
      const statsQuery = `
        SELECT 
          COUNT(DISTINCT ap.user_id) as participant_count,
          COUNT(DISTINCT b.id) as bid_count,
          COUNT(DISTINCT v.id) as view_count,
          COUNT(DISTINCT al.id) as like_count,
          COUNT(DISTINCT ac.id) as comment_count,
          MAX(b.amount) as current_price,
          MIN(b.amount) as min_bid,
          AVG(b.amount) as avg_bid
        FROM auctions a
        LEFT JOIN auction_participants ap ON a.id = ap.auction_id
        LEFT JOIN bids b ON a.id = b.auction_id AND b.status = 'active'
        LEFT JOIN auction_views v ON a.id = v.auction_id
        LEFT JOIN auction_likes al ON a.id = al.auction_id
        LEFT JOIN auction_comments ac ON a.id = ac.auction_id AND ac.status = 'active'
        WHERE a.id = $1
        GROUP BY a.id
      `;
      
      const result = await db.query(statsQuery, [auctionId]);
      
      if (result.rows.length === 0) {
        throw new Error('المزاد غير موجود');
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Get auction stats error:', error);
      throw error;
    }
  }
  
  // Get seller auctions
  async getSellerAuctions(sellerId, { page = 1, limit = 12, status, sort = 'created_at', order = 'DESC' }) {
    try {
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT 
          a.*,
          c.name as category_name,
          COUNT(DISTINCT ap.user_id) as participant_count,
          COUNT(DISTINCT b.id) as bid_count,
          MAX(b.amount) as current_price
        FROM auctions a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN auction_participants ap ON a.id = ap.auction_id
        LEFT JOIN bids b ON a.id = b.auction_id AND b.status = 'active'
        WHERE a.seller_id = $1 AND a.status != 'deleted'
      `;
      
      const queryParams = [sellerId];
      let paramIndex = 2;
      
      if (status) {
        query += ` AND a.status = $${paramIndex}`;
        queryParams.push(status);
        paramIndex++;
      }
      
      query += ` GROUP BY a.id, c.name`;
      
      // Apply sorting
      const validSortFields = {
        'created_at': 'a.created_at',
        'start_time': 'a.start_time',
        'end_time': 'a.end_time',
        'title': 'a.title',
        'starting_price': 'a.starting_price'
      };
      
      const sortField = validSortFields[sort] || 'a.created_at';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY ${sortField} ${sortOrder}`;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);
      
      const result = await db.query(query, queryParams);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM auctions WHERE seller_id = $1 AND status != \'deleted\'';
      const countParams = [sellerId];
      
      if (status) {
        countQuery += ' AND status = $2';
        countParams.push(status);
      }
      
      const countResult = await db.query(countQuery, countParams);
      
      return {
        auctions: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        limit
      };
    } catch (error) {
      console.error('Get seller auctions error:', error);
      throw new Error('فشل في جلب مزادات البائع');
    }
  }
}

module.exports = new AuctionService();