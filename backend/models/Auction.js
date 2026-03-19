const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Auction {
  constructor(data = {}) {
    this.id = data.id;
    this.seller_id = data.seller_id;
    this.title = data.title;
    this.description = data.description;
    this.category_id = data.category_id;
    this.starting_price = data.starting_price;
    this.current_price = data.current_price;
    this.final_price = data.final_price;
    this.min_bid_increment = data.min_bid_increment;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.duration_minutes = data.duration_minutes;
    this.video_url = data.video_url;
    this.video_duration = data.video_duration;
    this.cover_image_url = data.cover_image_url;
    this.location = data.location;
    this.condition = data.condition;
    this.tags = data.tags || [];
    this.status = data.status || 'draft';
    this.winner_id = data.winner_id;
    this.view_count = data.view_count || 0;
    this.participant_count = data.participant_count || 0;
    this.bid_count = data.bid_count || 0;
    this.like_count = data.like_count || 0;
    this.comment_count = data.comment_count || 0;
    this.is_featured = data.is_featured || false;
    this.auto_extend = data.auto_extend || false;
    this.extend_minutes = data.extend_minutes || 5;
    this.reserve_price = data.reserve_price;
    this.buyout_price = data.buyout_price;
    this.shipping_cost = data.shipping_cost;
    this.shipping_info = data.shipping_info;
    this.return_policy = data.return_policy;
    this.terms_conditions = data.terms_conditions;
    this.metadata = data.metadata || {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Validation methods
  validate() {
    const errors = [];

    if (!this.seller_id) {
      errors.push('معرف البائع مطلوب');
    }

    if (!this.title || this.title.trim().length < 5) {
      errors.push('عنوان المزاد يجب أن يكون 5 أحرف على الأقل');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('وصف المزاد يجب أن يكون 10 أحرف على الأقل');
    }

    if (!this.category_id || this.category_id < 1) {
      errors.push('تصنيف المزاد مطلوب');
    }

    if (!this.starting_price || this.starting_price <= 0) {
      errors.push('سعر البداية يجب أن يكون أكبر من صفر');
    }

    if (!this.min_bid_increment || this.min_bid_increment <= 0) {
      errors.push('أقل زيادة يجب أن تكون أكبر من صفر');
    }

    if (!this.duration_minutes || this.duration_minutes < 5) {
      errors.push('مدة المزاد يجب أن تكون 5 دقائق على الأقل');
    }

    if (this.reserve_price && this.reserve_price < this.starting_price) {
      errors.push('السعر الاحتياطي يجب أن يكون أكبر من سعر البداية');
    }

    if (this.buyout_price && this.buyout_price <= this.starting_price) {
      errors.push('سعر الشراء المباشر يجب أن يكون أكبر من سعر البداية');
    }

    return errors;
  }

  validateForUpdate() {
    const errors = [];

    if (this.title && this.title.trim().length < 5) {
      errors.push('عنوان المزاد يجب أن يكون 5 أحرف على الأقل');
    }

    if (this.description && this.description.trim().length < 10) {
      errors.push('وصف المزاد يجب أن يكون 10 أحرف على الأقل');
    }

    if (this.starting_price && this.starting_price <= 0) {
      errors.push('سعر البداية يجب أن يكون أكبر من صفر');
    }

    if (this.min_bid_increment && this.min_bid_increment <= 0) {
      errors.push('أقل زيادة يجب أن تكون أكبر من صفر');
    }

    if (this.duration_minutes && this.duration_minutes < 5) {
      errors.push('مدة المزاد يجب أن تكون 5 دقائق على الأقل');
    }

    return errors;
  }

  // Status validation
  canBeUpdated() {
    return ['draft', 'pending', 'scheduled'].includes(this.status);
  }

  canBeStarted() {
    return ['pending', 'scheduled'].includes(this.status);
  }

  canBeEnded() {
    return this.status === 'active';
  }

  canBeDeleted() {
    return ['draft', 'pending', 'scheduled', 'ended', 'cancelled'].includes(this.status);
  }

  isActive() {
    return this.status === 'active';
  }

  isEnded() {
    return ['ended', 'completed', 'cancelled'].includes(this.status);
  }

  // Time calculations
  getTimeRemaining() {
    if (!this.end_time || !this.isActive()) {
      return 0;
    }

    const now = new Date().getTime();
    const endTime = new Date(this.end_time).getTime();
    return Math.max(0, endTime - now);
  }

  getElapsedTime() {
    if (!this.start_time) {
      return 0;
    }

    const now = new Date().getTime();
    const startTime = new Date(this.start_time).getTime();
    return Math.max(0, now - startTime);
  }

  getProgress() {
    if (!this.start_time || !this.end_time) {
      return 0;
    }

    const startTime = new Date(this.start_time).getTime();
    const endTime = new Date(this.end_time).getTime();
    const now = new Date().getTime();
    
    const duration = endTime - startTime;
    const elapsed = now - startTime;
    
    return Math.min(1, Math.max(0, elapsed / duration));
  }

  // Price calculations
  getCurrentPrice() {
    return this.current_price || this.starting_price;
  }

  getMinimumBid() {
    const currentPrice = this.getCurrentPrice();
    return currentPrice + this.min_bid_increment;
  }

  // Reserve price check
  hasMetReservePrice() {
    if (!this.reserve_price) {
      return true; // No reserve price set
    }
    return this.getCurrentPrice() >= this.reserve_price;
  }

  // Buyout price check
  canBeBoughtOut() {
    if (!this.buyout_price || !this.isActive()) {
      return false;
    }
    return this.getCurrentPrice() < this.buyout_price;
  }

  // Auto-extend check
  shouldAutoExtend(lastBidTime) {
    if (!this.auto_extend || !this.isActive()) {
      return false;
    }

    const timeRemaining = this.getTimeRemaining();
    const extendThreshold = 2 * 60 * 1000; // 2 minutes
    const timeSinceLastBid = new Date().getTime() - new Date(lastBidTime).getTime();
    const recentBidThreshold = 30 * 1000; // 30 seconds

    return timeRemaining < extendThreshold && timeSinceLastBid < recentBidThreshold;
  }

  // Database operations
  async save() {
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      if (this.id) {
        // Update existing auction
        const query = `
          UPDATE auctions SET
            title = $1, description = $2, category_id = $3, starting_price = $4,
            min_bid_increment = $5, start_time = $6, end_time = $7, duration_minutes = $8,
            video_url = $9, video_duration = $10, cover_image_url = $11, location = $12,
            condition = $13, tags = $14, status = $15, reserve_price = $16,
            buyout_price = $17, shipping_cost = $18, shipping_info = $19,
            return_policy = $20, terms_conditions = $21, auto_extend = $22,
            extend_minutes = $23, metadata = $24, updated_at = CURRENT_TIMESTAMP
          WHERE id = $25
          RETURNING *
        `;
        
        const values = [
          this.title, this.description, this.category_id, this.starting_price,
          this.min_bid_increment, this.start_time, this.end_time, this.duration_minutes,
          this.video_url, this.video_duration, this.cover_image_url, this.location,
          this.condition, JSON.stringify(this.tags), this.status, this.reserve_price,
          this.buyout_price, this.shipping_cost, this.shipping_info,
          this.return_policy, this.terms_conditions, this.auto_extend,
          this.extend_minutes, JSON.stringify(this.metadata), this.id
        ];
        
        const result = await client.query(query, values);
        Object.assign(this, result.rows[0]);
      } else {
        // Insert new auction
        const query = `
          INSERT INTO auctions (
            seller_id, title, description, category_id, starting_price,
            min_bid_increment, start_time, end_time, duration_minutes,
            video_url, video_duration, cover_image_url, location,
            condition, tags, status, reserve_price, buyout_price,
            shipping_cost, shipping_info, return_policy, terms_conditions,
            auto_extend, extend_minutes, metadata
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
          )
          RETURNING *
        `;
        
        const values = [
          this.seller_id, this.title, this.description, this.category_id, this.starting_price,
          this.min_bid_increment, this.start_time, this.end_time, this.duration_minutes,
          this.video_url, this.video_duration, this.cover_image_url, this.location,
          this.condition, JSON.stringify(this.tags), this.status, this.reserve_price,
          this.buyout_price, this.shipping_cost, this.shipping_info,
          this.return_policy, this.terms_conditions, this.auto_extend,
          this.extend_minutes, JSON.stringify(this.metadata)
        ];
        
        const result = await client.query(query, values);
        Object.assign(this, result.rows[0]);
      }
      
      await client.query('COMMIT');
      return this;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete auction without ID');
    }

    if (!this.canBeDeleted()) {
      throw new Error('Cannot delete auction in current status');
    }

    await db.query(
      'UPDATE auctions SET status = \'deleted\', updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [this.id]
    );

    this.status = 'deleted';
    return this;
  }

  // Static methods
  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM auctions WHERE id = $1 AND status != \'deleted\'',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const data = result.rows[0];
    data.tags = JSON.parse(data.tags || '[]');
    data.metadata = JSON.parse(data.metadata || '{}');

    return new Auction(data);
  }

  static async findBySeller(sellerId, options = {}) {
    const { limit = 20, offset = 0, status } = options;
    
    let query = 'SELECT * FROM auctions WHERE seller_id = $1 AND status != \'deleted\'';
    const params = [sellerId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    return result.rows.map(row => {
      row.tags = JSON.parse(row.tags || '[]');
      row.metadata = JSON.parse(row.metadata || '{}');
      return new Auction(row);
    });
  }

  static async findByCategory(categoryId, options = {}) {
    const { limit = 20, offset = 0, status = 'active' } = options;
    
    const query = `
      SELECT * FROM auctions 
      WHERE category_id = $1 AND status = $2 AND status != 'deleted'
      ORDER BY created_at DESC 
      LIMIT $3 OFFSET $4
    `;

    const result = await db.query(query, [categoryId, status, limit, offset]);

    return result.rows.map(row => {
      row.tags = JSON.parse(row.tags || '[]');
      row.metadata = JSON.parse(row.metadata || '{}');
      return new Auction(row);
    });
  }

  static async findActive() {
    const query = `
      SELECT * FROM auctions 
      WHERE status = 'active' 
      ORDER BY end_time ASC
    `;

    const result = await db.query(query);

    return result.rows.map(row => {
      row.tags = JSON.parse(row.tags || '[]');
      row.metadata = JSON.parse(row.metadata || '{}');
      return new Auction(row);
    });
  }

  static async findScheduled() {
    const query = `
      SELECT * FROM auctions 
      WHERE status = 'scheduled' AND start_time <= CURRENT_TIMESTAMP
      ORDER BY start_time ASC
    `;

    const result = await db.query(query);

    return result.rows.map(row => {
      row.tags = JSON.parse(row.tags || '[]');
      row.metadata = JSON.parse(row.metadata || '{}');
      return new Auction(row);
    });
  }

  static async search(searchTerm, options = {}) {
    const { limit = 20, offset = 0, category_id, status = 'active' } = options;
    
    let query = `
      SELECT * FROM auctions 
      WHERE (title ILIKE $1 OR description ILIKE $1) 
        AND status = $2 AND status != 'deleted'
    `;
    
    const params = [`%${searchTerm}%`, status];
    
    if (category_id) {
      query += ' AND category_id = $3';
      params.push(category_id);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);

    return result.rows.map(row => {
      row.tags = JSON.parse(row.tags || '[]');
      row.metadata = JSON.parse(row.metadata || '{}');
      return new Auction(row);
    });
  }

  // Transform to JSON for API response
  toJSON() {
    return {
      id: this.id,
      seller_id: this.seller_id,
      title: this.title,
      description: this.description,
      category_id: this.category_id,
      starting_price: parseFloat(this.starting_price || 0),
      current_price: parseFloat(this.current_price || this.starting_price || 0),
      final_price: this.final_price ? parseFloat(this.final_price) : null,
      min_bid_increment: parseFloat(this.min_bid_increment || 0),
      start_time: this.start_time,
      end_time: this.end_time,
      duration_minutes: this.duration_minutes,
      video_url: this.video_url,
      video_duration: this.video_duration,
      cover_image_url: this.cover_image_url,
      location: this.location,
      condition: this.condition,
      tags: this.tags,
      status: this.status,
      winner_id: this.winner_id,
      view_count: this.view_count,
      participant_count: this.participant_count,
      bid_count: this.bid_count,
      like_count: this.like_count,
      comment_count: this.comment_count,
      is_featured: this.is_featured,
      auto_extend: this.auto_extend,
      extend_minutes: this.extend_minutes,
      reserve_price: this.reserve_price ? parseFloat(this.reserve_price) : null,
      buyout_price: this.buyout_price ? parseFloat(this.buyout_price) : null,
      shipping_cost: this.shipping_cost ? parseFloat(this.shipping_cost) : null,
      shipping_info: this.shipping_info,
      return_policy: this.return_policy,
      terms_conditions: this.terms_conditions,
      time_remaining: this.getTimeRemaining(),
      elapsed_time: this.getElapsedTime(),
      progress: this.getProgress(),
      minimum_bid: this.getMinimumBid(),
      has_met_reserve: this.hasMetReservePrice(),
      can_buyout: this.canBeBoughtOut(),
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Auction;