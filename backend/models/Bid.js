const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Bid Model
 * Represents a bid placed by a user in an auction
 */
const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'auctions',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      isDecimal: true
    }
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deviceInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isAutomatic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'للمزايدات الآلية في المستقبل'
  },
  proxyBidId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'للمزايدات بالوكالة'
  }
}, {
  tableName: 'bids',
  timestamps: true,
  paranoid: false, // No soft deletes for bids - use isActive instead
  indexes: [
    {
      name: 'idx_bid_auction',
      fields: ['auctionId']
    },
    {
      name: 'idx_bid_user',
      fields: ['userId']
    },
    {
      name: 'idx_bid_amount',
      fields: ['amount']
    },
    {
      name: 'idx_bid_timestamp',
      fields: ['timestamp']
    },
    {
      name: 'idx_bid_active',
      fields: ['isActive']
    },
    {
      name: 'idx_bid_auction_amount',
      fields: ['auctionId', 'amount']
    },
    {
      name: 'idx_bid_auction_timestamp',
      fields: ['auctionId', 'timestamp']
    }
  ]
});

/**
 * Instance Methods
 */
Bid.prototype.cancel = function(adminId, reason) {
  this.isActive = false;
  this.cancelledAt = new Date();
  this.cancelledBy = adminId;
  this.cancellationReason = reason;
  return this.save();
};

Bid.prototype.isWinning = async function() {
  const highestBid = await Bid.findOne({
    where: {
      auctionId: this.auctionId,
      isActive: true
    },
    order: [['amount', 'DESC']]
  });
  
  return highestBid && highestBid.id === this.id;
};

Bid.prototype.toSafeJSON = function() {
  const bid = this.toJSON();
  // Remove sensitive information
  delete bid.ipAddress;
  delete bid.userAgent;
  delete bid.deviceInfo;
  return bid;
};

/**
 * Static Methods
 */
Bid.getHighestForAuction = async function(auctionId) {
  return await this.findOne({
    where: {
      auctionId,
      isActive: true
    },
    include: [
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }
    ],
    order: [['amount', 'DESC']]
  });
};

Bid.getAuctionStats = async function(auctionId) {
  const [stats] = await sequelize.query(`
    SELECT 
      COUNT(*) as total_bids,
      COUNT(DISTINCT user_id) as unique_bidders,
      MIN(amount) as min_bid,
      MAX(amount) as max_bid,
      AVG(amount) as avg_bid,
      STDDEV(amount) as bid_variance
    FROM bids 
    WHERE auction_id = :auctionId AND is_active = true
  `, {
    replacements: { auctionId },
    type: sequelize.QueryTypes.SELECT
  });
  
  return stats;
};

Bid.getUserWinningBids = async function(userId) {
  const [winningBids] = await sequelize.query(`
    SELECT DISTINCT ON (b.auction_id) 
      b.*,
      a.title as auction_title,
      a.status as auction_status,
      a.end_time as auction_end_time
    FROM bids b
    JOIN auctions a ON b.auction_id = a.id
    WHERE b.user_id = :userId 
      AND b.is_active = true
      AND NOT EXISTS (
        SELECT 1 FROM bids b2 
        WHERE b2.auction_id = b.auction_id 
          AND b2.is_active = true 
          AND b2.amount > b.amount
      )
    ORDER BY b.auction_id, b.amount DESC
  `, {
    replacements: { userId },
    type: sequelize.QueryTypes.SELECT
  });
  
  return winningBids;
};

Bid.getBidTimeline = async function(auctionId, startTime = null, endTime = null) {
  let whereClause = 'WHERE b.auction_id = :auctionId AND b.is_active = true';
  const replacements = { auctionId };
  
  if (startTime) {
    whereClause += ' AND b.timestamp >= :startTime';
    replacements.startTime = startTime;
  }
  
  if (endTime) {
    whereClause += ' AND b.timestamp <= :endTime';
    replacements.endTime = endTime;
  }
  
  const [timeline] = await sequelize.query(`
    SELECT 
      b.id,
      b.amount,
      b.timestamp,
      u.username,
      u.avatar
    FROM bids b
    JOIN users u ON b.user_id = u.id
    ${whereClause}
    ORDER BY b.timestamp ASC
  `, {
    replacements,
    type: sequelize.QueryTypes.SELECT
  });
  
  return timeline;
};

/**
 * Hooks
 */
Bid.addHook('beforeCreate', (bid, options) => {
  // Set server timestamp to ensure consistency
  bid.timestamp = new Date();
});

Bid.addHook('afterCreate', async (bid, options) => {
  try {
    // Update auction current price and bid count
    await sequelize.models.Auction.update(
      {
        currentPrice: bid.amount,
        bidCount: sequelize.literal('bid_count + 1'),
        lastBidTime: bid.timestamp
      },
      {
        where: { id: bid.auctionId },
        transaction: options.transaction
      }
    );

    // Create timeline event
    await sequelize.models.BidTimelineEvent.create(
      {
        auctionId: bid.auctionId,
        bidId: bid.id,
        userId: bid.userId,
        amount: bid.amount,
        timestamp: bid.timestamp,
        eventType: 'BID_PLACED'
      },
      { transaction: options.transaction }
    );
  } catch (error) {
    console.error('Error in bid afterCreate hook:', error);
  }
});

Bid.addHook('afterUpdate', async (bid, options) => {
  if (bid.changed('isActive') && !bid.isActive) {
    // Bid was cancelled, create timeline event
    await sequelize.models.BidTimelineEvent.create(
      {
        auctionId: bid.auctionId,
        bidId: bid.id,
        userId: bid.userId,
        amount: bid.amount,
        timestamp: new Date(),
        eventType: 'BID_CANCELLED'
      },
      { transaction: options.transaction }
    );
  }
});

/**
 * Model Associations
 * These will be defined in the associations file
 */
Bid.associate = function(models) {
  // User who placed the bid
  Bid.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  // Auction the bid belongs to
  Bid.belongsTo(models.Auction, {
    foreignKey: 'auctionId',
    as: 'auction',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  // Admin who cancelled the bid
  Bid.belongsTo(models.User, {
    foreignKey: 'cancelledBy',
    as: 'cancelledByUser',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  });

  // Timeline events
  Bid.hasMany(models.BidTimelineEvent, {
    foreignKey: 'bidId',
    as: 'timelineEvents',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });
};

/**
 * Model Scopes
 */
Bid.addScope('active', {
  where: { isActive: true }
});

Bid.addScope('cancelled', {
  where: { isActive: false }
});

Bid.addScope('withUser', {
  include: [
    {
      model: sequelize.models.User,
      as: 'user',
      attributes: ['id', 'username', 'avatar']
    }
  ]
});

Bid.addScope('withAuction', {
  include: [
    {
      model: sequelize.models.Auction,
      as: 'auction',
      attributes: ['id', 'title', 'status', 'currentPrice', 'endTime']
    }
  ]
});

Bid.addScope('recent', {
  order: [['timestamp', 'DESC']]
});

Bid.addScope('highestFirst', {
  order: [['amount', 'DESC']]
});

module.exports = Bid;