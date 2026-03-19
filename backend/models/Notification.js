const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.ENUM(
      'auction_started',
      'auction_ending_soon',
      'auction_ended',
      'bid_outbid',
      'bid_won',
      'bid_placed',
      'new_message',
      'new_comment',
      'comment_reply',
      'auction_followed',
      'seller_followed',
      'auction_liked',
      'report_processed',
      'auction_approved',
      'auction_rejected',
      'payment_required',
      'system_announcement'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  relatedId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of related entity (auction, bid, message, etc.)'
  },
  relatedType: {
    type: DataTypes.ENUM(
      'auction',
      'bid',
      'message',
      'comment',
      'user',
      'report',
      'system'
    ),
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  actionUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL to navigate when notification is clicked'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Auto-delete notification after this date'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional metadata for notification processing'
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['isRead']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['userId', 'isRead']
    },
    {
      fields: ['relatedType', 'relatedId']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

// Associations
Notification.associate = (models) => {
  Notification.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

// Instance methods
Notification.prototype.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  return await this.save();
};

Notification.prototype.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

Notification.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Add computed properties
  values.isExpired = this.isExpired();
  values.timeAgo = this.getTimeAgo();
  
  return values;
};

Notification.prototype.getTimeAgo = function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInMinutes = Math.floor((now - created) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
  
  return created.toLocaleDateString('ar-SA');
};

// Static methods
Notification.getUnreadCount = async function(userId) {
  return await this.count({
    where: {
      userId,
      isRead: false
    }
  });
};

Notification.markAllAsRead = async function(userId) {
  return await this.update(
    { 
      isRead: true,
      readAt: new Date()
    },
    {
      where: {
        userId,
        isRead: false
      }
    }
  );
};

Notification.deleteExpired = async function() {
  return await this.destroy({
    where: {
      expiresAt: {
        [DataTypes.Op.lt]: new Date()
      }
    }
  });
};

module.exports = Notification;