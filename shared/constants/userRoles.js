/**
 * User role constants and permissions
 * This module defines all user roles and their associated permissions
 */

/**
 * Core user roles
 */
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  SELLER: 'seller',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

/**
 * Role hierarchy (higher number = more permissions)
 */
export const ROLE_HIERARCHY = {
  [USER_ROLES.GUEST]: 0,
  [USER_ROLES.USER]: 10,
  [USER_ROLES.SELLER]: 20,
  [USER_ROLES.MODERATOR]: 30,
  [USER_ROLES.ADMIN]: 40,
  [USER_ROLES.SUPER_ADMIN]: 50
};

/**
 * Core permissions
 */
export const PERMISSIONS = {
  // Auction permissions
  VIEW_AUCTIONS: 'auctions:view',
  CREATE_AUCTION: 'auctions:create',
  EDIT_AUCTION: 'auctions:edit',
  DELETE_AUCTION: 'auctions:delete',
  APPROVE_AUCTION: 'auctions:approve',
  SUSPEND_AUCTION: 'auctions:suspend',
  MODERATE_AUCTION: 'auctions:moderate',
  VIEW_AUCTION_ANALYTICS: 'auctions:analytics',
  EXPORT_AUCTION_DATA: 'auctions:export',
  
  // Bidding permissions
  PLACE_BID: 'bids:place',
  VIEW_BID_HISTORY: 'bids:view_history',
  CANCEL_BID: 'bids:cancel',
  MODERATE_BIDS: 'bids:moderate',
  VIEW_ALL_BIDS: 'bids:view_all',
  EXPORT_BID_DATA: 'bids:export',
  
  // User management permissions
  VIEW_USERS: 'users:view',
  EDIT_USER: 'users:edit',
  DELETE_USER: 'users:delete',
  BAN_USER: 'users:ban',
  VERIFY_USER: 'users:verify',
  VIEW_USER_DETAILS: 'users:view_details',
  IMPERSONATE_USER: 'users:impersonate',
  EXPORT_USER_DATA: 'users:export',
  
  // Profile permissions
  VIEW_PROFILE: 'profile:view',
  EDIT_PROFILE: 'profile:edit',
  UPLOAD_AVATAR: 'profile:upload_avatar',
  VIEW_PRIVATE_PROFILE: 'profile:view_private',
  
  // Media permissions
  UPLOAD_MEDIA: 'media:upload',
  DELETE_MEDIA: 'media:delete',
  MODERATE_MEDIA: 'media:moderate',
  VIEW_MEDIA_ANALYTICS: 'media:analytics',
  
  // Message permissions
  SEND_MESSAGE: 'messages:send',
  RECEIVE_MESSAGE: 'messages:receive',
  DELETE_MESSAGE: 'messages:delete',
  MODERATE_MESSAGES: 'messages:moderate',
  VIEW_ALL_MESSAGES: 'messages:view_all',
  
  // Comment permissions
  POST_COMMENT: 'comments:post',
  EDIT_COMMENT: 'comments:edit',
  DELETE_COMMENT: 'comments:delete',
  MODERATE_COMMENTS: 'comments:moderate',
  VIEW_HIDDEN_COMMENTS: 'comments:view_hidden',
  
  // Notification permissions
  RECEIVE_NOTIFICATIONS: 'notifications:receive',
  SEND_NOTIFICATIONS: 'notifications:send',
  MANAGE_NOTIFICATIONS: 'notifications:manage',
  VIEW_NOTIFICATION_ANALYTICS: 'notifications:analytics',
  
  // Report permissions
  SUBMIT_REPORT: 'reports:submit',
  VIEW_REPORTS: 'reports:view',
  HANDLE_REPORTS: 'reports:handle',
  DELETE_REPORTS: 'reports:delete',
  EXPORT_REPORT_DATA: 'reports:export',
  
  // Administrative permissions
  VIEW_ADMIN_DASHBOARD: 'admin:dashboard',
  MANAGE_SETTINGS: 'admin:settings',
  VIEW_ANALYTICS: 'admin:analytics',
  MANAGE_CATEGORIES: 'admin:categories',
  MANAGE_ROLES: 'admin:roles',
  BACKUP_DATA: 'admin:backup',
  RESTORE_DATA: 'admin:restore',
  VIEW_LOGS: 'admin:logs',
  MANAGE_INTEGRATIONS: 'admin:integrations',
  
  // Financial permissions
  VIEW_PAYMENTS: 'finance:view_payments',
  PROCESS_REFUNDS: 'finance:refunds',
  VIEW_TRANSACTIONS: 'finance:transactions',
  EXPORT_FINANCIAL_DATA: 'finance:export',
  MANAGE_PAYOUTS: 'finance:payouts',
  
  // Support permissions
  ACCESS_SUPPORT: 'support:access',
  HANDLE_SUPPORT_TICKETS: 'support:tickets',
  VIEW_SUPPORT_ANALYTICS: 'support:analytics',
  MANAGE_FAQ: 'support:faq'
};

/**
 * Role-based permission mappings
 */
export const ROLE_PERMISSIONS = {
  [USER_ROLES.GUEST]: [
    PERMISSIONS.VIEW_AUCTIONS,
    PERMISSIONS.VIEW_PROFILE
  ],
  
  [USER_ROLES.USER]: [
    // Basic auction permissions
    PERMISSIONS.VIEW_AUCTIONS,
    PERMISSIONS.VIEW_BID_HISTORY,
    PERMISSIONS.PLACE_BID,
    
    // Profile permissions
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.UPLOAD_AVATAR,
    
    // Social permissions
    PERMISSIONS.POST_COMMENT,
    PERMISSIONS.EDIT_COMMENT,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.RECEIVE_MESSAGE,
    PERMISSIONS.DELETE_MESSAGE,
    
    // Notification permissions
    PERMISSIONS.RECEIVE_NOTIFICATIONS,
    
    // Report permissions
    PERMISSIONS.SUBMIT_REPORT,
    
    // Support permissions
    PERMISSIONS.ACCESS_SUPPORT
  ],
  
  [USER_ROLES.SELLER]: [
    // Inherit all user permissions
    ...ROLE_PERMISSIONS[USER_ROLES.USER],
    
    // Additional auction permissions
    PERMISSIONS.CREATE_AUCTION,
    PERMISSIONS.EDIT_AUCTION,
    PERMISSIONS.DELETE_AUCTION,
    PERMISSIONS.VIEW_AUCTION_ANALYTICS,
    PERMISSIONS.EXPORT_AUCTION_DATA,
    
    // Media permissions
    PERMISSIONS.UPLOAD_MEDIA,
    PERMISSIONS.DELETE_MEDIA,
    
    // Enhanced profile permissions
    PERMISSIONS.VIEW_PRIVATE_PROFILE,
    
    // Financial permissions
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_TRANSACTIONS
  ],
  
  [USER_ROLES.MODERATOR]: [
    // Inherit all seller permissions
    ...ROLE_PERMISSIONS[USER_ROLES.SELLER],
    
    // Moderation permissions
    PERMISSIONS.MODERATE_AUCTION,
    PERMISSIONS.MODERATE_BIDS,
    PERMISSIONS.MODERATE_COMMENTS,
    PERMISSIONS.MODERATE_MESSAGES,
    PERMISSIONS.MODERATE_MEDIA,
    
    // User management permissions
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.BAN_USER,
    PERMISSIONS.VIEW_USER_DETAILS,
    
    // Report handling
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.HANDLE_REPORTS,
    
    // Enhanced viewing permissions
    PERMISSIONS.VIEW_ALL_BIDS,
    PERMISSIONS.VIEW_ALL_MESSAGES,
    PERMISSIONS.VIEW_HIDDEN_COMMENTS,
    
    // Support permissions
    PERMISSIONS.HANDLE_SUPPORT_TICKETS,
    PERMISSIONS.VIEW_SUPPORT_ANALYTICS,
    PERMISSIONS.MANAGE_FAQ
  ],
  
  [USER_ROLES.ADMIN]: [
    // Inherit all moderator permissions
    ...ROLE_PERMISSIONS[USER_ROLES.MODERATOR],
    
    // Full auction control
    PERMISSIONS.APPROVE_AUCTION,
    PERMISSIONS.SUSPEND_AUCTION,
    
    // Enhanced user management
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VERIFY_USER,
    PERMISSIONS.IMPERSONATE_USER,
    PERMISSIONS.EXPORT_USER_DATA,
    
    // Administrative permissions
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_CATEGORIES,
    
    // Enhanced media permissions
    PERMISSIONS.VIEW_MEDIA_ANALYTICS,
    
    // Enhanced notification permissions
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.MANAGE_NOTIFICATIONS,
    PERMISSIONS.VIEW_NOTIFICATION_ANALYTICS,
    
    // Report management
    PERMISSIONS.DELETE_REPORTS,
    PERMISSIONS.EXPORT_REPORT_DATA,
    
    // Financial permissions
    PERMISSIONS.PROCESS_REFUNDS,
    PERMISSIONS.EXPORT_FINANCIAL_DATA,
    PERMISSIONS.MANAGE_PAYOUTS,
    
    // Data export permissions
    PERMISSIONS.EXPORT_BID_DATA,
    PERMISSIONS.VIEW_LOGS
  ],
  
  [USER_ROLES.SUPER_ADMIN]: [
    // All permissions - use wildcard for simplicity
    '*'
  ]
};

/**
 * Role display names in Arabic
 */
export const ROLE_NAMES = {
  [USER_ROLES.GUEST]: 'زائر',
  [USER_ROLES.USER]: 'مستخدم',
  [USER_ROLES.SELLER]: 'بائع',
  [USER_ROLES.MODERATOR]: 'مشرف',
  [USER_ROLES.ADMIN]: 'مدير',
  [USER_ROLES.SUPER_ADMIN]: 'مدير عام'
};

/**
 * Role descriptions in Arabic
 */
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.GUEST]: 'يمكنه مشاهدة المزادات فقط',
  [USER_ROLES.USER]: 'يمكنه المشاركة في المزادات والمزايدة',
  [USER_ROLES.SELLER]: 'يمكنه إنشاء وإدارة المزادات الخاصة به',
  [USER_ROLES.MODERATOR]: 'يمكنه الإشراف على المحتوى والمستخدمين',
  [USER_ROLES.ADMIN]: 'يمكنه إدارة النظام والمستخدمين',
  [USER_ROLES.SUPER_ADMIN]: 'صلاحيات كاملة لإدارة النظام'
};

/**
 * Role colors for UI display
 */
export const ROLE_COLORS = {
  [USER_ROLES.GUEST]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    badge: 'bg-gray-500'
  },
  [USER_ROLES.USER]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    badge: 'bg-blue-500'
  },
  [USER_ROLES.SELLER]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    badge: 'bg-green-500'
  },
  [USER_ROLES.MODERATOR]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    badge: 'bg-purple-500'
  },
  [USER_ROLES.ADMIN]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    badge: 'bg-red-500'
  },
  [USER_ROLES.SUPER_ADMIN]: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    badge: 'bg-indigo-500'
  }
};

/**
 * Permission categories for UI organization
 */
export const PERMISSION_CATEGORIES = {
  AUCTIONS: {
    name: 'المزادات',
    permissions: [
      PERMISSIONS.VIEW_AUCTIONS,
      PERMISSIONS.CREATE_AUCTION,
      PERMISSIONS.EDIT_AUCTION,
      PERMISSIONS.DELETE_AUCTION,
      PERMISSIONS.APPROVE_AUCTION,
      PERMISSIONS.SUSPEND_AUCTION,
      PERMISSIONS.MODERATE_AUCTION,
      PERMISSIONS.VIEW_AUCTION_ANALYTICS,
      PERMISSIONS.EXPORT_AUCTION_DATA
    ]
  },
  BIDDING: {
    name: 'المزايدات',
    permissions: [
      PERMISSIONS.PLACE_BID,
      PERMISSIONS.VIEW_BID_HISTORY,
      PERMISSIONS.CANCEL_BID,
      PERMISSIONS.MODERATE_BIDS,
      PERMISSIONS.VIEW_ALL_BIDS,
      PERMISSIONS.EXPORT_BID_DATA
    ]
  },
  USERS: {
    name: 'المستخدمين',
    permissions: [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.EDIT_USER,
      PERMISSIONS.DELETE_USER,
      PERMISSIONS.BAN_USER,
      PERMISSIONS.VERIFY_USER,
      PERMISSIONS.VIEW_USER_DETAILS,
      PERMISSIONS.IMPERSONATE_USER,
      PERMISSIONS.EXPORT_USER_DATA
    ]
  },
  CONTENT: {
    name: 'المحتوى',
    permissions: [
      PERMISSIONS.POST_COMMENT,
      PERMISSIONS.EDIT_COMMENT,
      PERMISSIONS.DELETE_COMMENT,
      PERMISSIONS.MODERATE_COMMENTS,
      PERMISSIONS.VIEW_HIDDEN_COMMENTS,
      PERMISSIONS.UPLOAD_MEDIA,
      PERMISSIONS.DELETE_MEDIA,
      PERMISSIONS.MODERATE_MEDIA
    ]
  },
  COMMUNICATION: {
    name: 'التواصل',
    permissions: [
      PERMISSIONS.SEND_MESSAGE,
      PERMISSIONS.RECEIVE_MESSAGE,
      PERMISSIONS.DELETE_MESSAGE,
      PERMISSIONS.MODERATE_MESSAGES,
      PERMISSIONS.VIEW_ALL_MESSAGES,
      PERMISSIONS.RECEIVE_NOTIFICATIONS,
      PERMISSIONS.SEND_NOTIFICATIONS,
      PERMISSIONS.MANAGE_NOTIFICATIONS
    ]
  },
  ADMINISTRATION: {
    name: 'الإدارة',
    permissions: [
      PERMISSIONS.VIEW_ADMIN_DASHBOARD,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_CATEGORIES,
      PERMISSIONS.MANAGE_ROLES,
      PERMISSIONS.BACKUP_DATA,
      PERMISSIONS.RESTORE_DATA,
      PERMISSIONS.VIEW_LOGS
    ]
  }
};

/**
 * Role utility functions
 */
export const RoleUtils = {
  /**
   * Check if user has specific permission
   * @param {string} userRole User's role
   * @param {string} permission Permission to check
   * @returns {boolean}
   */
  hasPermission(userRole, permission) {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes('*') || rolePermissions.includes(permission);
  },

  /**
   * Check if user has any of the specified permissions
   * @param {string} userRole User's role
   * @param {Array<string>} permissions Permissions to check
   * @returns {boolean}
   */
  hasAnyPermission(userRole, permissions) {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  },

  /**
   * Check if user has all specified permissions
   * @param {string} userRole User's role
   * @param {Array<string>} permissions Permissions to check
   * @returns {boolean}
   */
  hasAllPermissions(userRole, permissions) {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  },

  /**
   * Check if role is higher than another role
   * @param {string} role1 First role
   * @param {string} role2 Second role
   * @returns {boolean}
   */
  isRoleHigher(role1, role2) {
    return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
  },

  /**
   * Check if role is equal or higher than another role
   * @param {string} role1 First role
   * @param {string} role2 Second role
   * @returns {boolean}
   */
  isRoleEqualOrHigher(role1, role2) {
    return ROLE_HIERARCHY[role1] >= ROLE_HIERARCHY[role2];
  },

  /**
   * Get role display name
   * @param {string} role Role identifier
   * @returns {string}
   */
  getRoleName(role) {
    return ROLE_NAMES[role] || 'غير معروف';
  },

  /**
   * Get role description
   * @param {string} role Role identifier
   * @returns {string}
   */
  getRoleDescription(role) {
    return ROLE_DESCRIPTIONS[role] || '';
  },

  /**
   * Get role colors for UI
   * @param {string} role Role identifier
   * @returns {Object}
   */
  getRoleColors(role) {
    return ROLE_COLORS[role] || ROLE_COLORS[USER_ROLES.GUEST];
  },

  /**
   * Get all permissions for a role
   * @param {string} role Role identifier
   * @returns {Array<string>}
   */
  getRolePermissions(role) {
    return ROLE_PERMISSIONS[role] || [];
  },

  /**
   * Get roles that have a specific permission
   * @param {string} permission Permission to check
   * @returns {Array<string>}
   */
  getRolesWithPermission(permission) {
    return Object.entries(ROLE_PERMISSIONS)
      .filter(([role, permissions]) => 
        permissions.includes('*') || permissions.includes(permission))
      .map(([role]) => role);
  },

  /**
   * Check if role can perform action on target role
   * @param {string} actorRole Role performing the action
   * @param {string} targetRole Target role
   * @returns {boolean}
   */
  canActOnRole(actorRole, targetRole) {
    // Super admin can act on anyone
    if (actorRole === USER_ROLES.SUPER_ADMIN) return true;
    
    // Admin can act on moderator and below
    if (actorRole === USER_ROLES.ADMIN && targetRole !== USER_ROLES.SUPER_ADMIN) return true;
    
    // Moderator can act on seller and below
    if (actorRole === USER_ROLES.MODERATOR && 
        [USER_ROLES.USER, USER_ROLES.SELLER].includes(targetRole)) return true;
    
    // Users can only act on themselves (handled elsewhere)
    return false;
  },

  /**
   * Get available roles for assignment
   * @param {string} assignerRole Role of the user assigning
   * @returns {Array<string>}
   */
  getAssignableRoles(assignerRole) {
    if (assignerRole === USER_ROLES.SUPER_ADMIN) {
      return Object.values(USER_ROLES);
    }
    
    if (assignerRole === USER_ROLES.ADMIN) {
      return [USER_ROLES.USER, USER_ROLES.SELLER, USER_ROLES.MODERATOR];
    }
    
    if (assignerRole === USER_ROLES.MODERATOR) {
      return [USER_ROLES.USER, USER_ROLES.SELLER];
    }
    
    return [];
  },

  /**
   * Check if role is staff (moderator or above)
   * @param {string} role Role to check
   * @returns {boolean}
   */
  isStaff(role) {
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[USER_ROLES.MODERATOR];
  },

  /**
   * Check if role is admin (admin or above)
   * @param {string} role Role to check
   * @returns {boolean}
   */
  isAdmin(role) {
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[USER_ROLES.ADMIN];
  }
};

export default {
  USER_ROLES,
  ROLE_HIERARCHY,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLE_NAMES,
  ROLE_DESCRIPTIONS,
  ROLE_COLORS,
  PERMISSION_CATEGORIES,
  RoleUtils
};