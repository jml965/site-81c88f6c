/**
 * User type definitions and interfaces
 */

/**
 * User role constants
 */
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

/**
 * User status constants
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  PENDING_VERIFICATION: 'pending_verification'
};

/**
 * User verification status
 */
export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

/**
 * User interface
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} username - Unique username
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} fullName - Full display name
 * @property {string} avatar - Profile picture URL
 * @property {string} phone - Phone number
 * @property {string} role - User role from USER_ROLES
 * @property {string} status - User status from USER_STATUS
 * @property {string} verificationStatus - Verification status
 * @property {Object} profile - Extended profile information
 * @property {string} profile.bio - User biography
 * @property {string} profile.location - User location
 * @property {Date} profile.birthDate - Birth date
 * @property {string} profile.gender - Gender
 * @property {string} profile.nationalId - National ID (for verification)
 * @property {Array<string>} profile.interests - User interests
 * @property {Object} profile.preferences - User preferences
 * @property {Object} profile.address - Address information
 * @property {string} profile.address.street - Street address
 * @property {string} profile.address.city - City
 * @property {string} profile.address.state - State/Province
 * @property {string} profile.address.country - Country
 * @property {string} profile.address.postalCode - Postal code
 * @property {Object} stats - User statistics
 * @property {number} stats.auctionsWon - Number of auctions won
 * @property {number} stats.auctionsParticipated - Auctions participated in
 * @property {number} stats.totalBids - Total bids placed
 * @property {number} stats.successfulBids - Successful bids
 * @property {number} stats.rating - User rating (1-5)
 * @property {number} stats.reviewCount - Number of reviews
 * @property {number} stats.followersCount - Number of followers
 * @property {number} stats.followingCount - Number of following
 * @property {Object} seller - Seller-specific information (if role is seller)
 * @property {string} seller.businessName - Business name
 * @property {string} seller.businessLicense - Business license number
 * @property {string} seller.businessType - Type of business
 * @property {Object} seller.bankAccount - Bank account information
 * @property {number} seller.totalSales - Total sales amount
 * @property {number} seller.auctionsCreated - Number of auctions created
 * @property {number} seller.successfulSales - Number of successful sales
 * @property {number} seller.rating - Seller rating
 * @property {Array<Object>} seller.reviews - Seller reviews
 * @property {Object} settings - User settings
 * @property {boolean} settings.emailNotifications - Email notifications enabled
 * @property {boolean} settings.pushNotifications - Push notifications enabled
 * @property {boolean} settings.smsNotifications - SMS notifications enabled
 * @property {string} settings.language - Preferred language
 * @property {string} settings.timezone - User timezone
 * @property {string} settings.currency - Preferred currency
 * @property {Object} settings.privacy - Privacy settings
 * @property {boolean} settings.privacy.showEmail - Show email publicly
 * @property {boolean} settings.privacy.showPhone - Show phone publicly
 * @property {boolean} settings.privacy.showLocation - Show location publicly
 * @property {Array<string>} devices - Registered devices for notifications
 * @property {Date} lastLoginAt - Last login timestamp
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} emailVerifiedAt - Email verification timestamp
 * @property {Date} phoneVerifiedAt - Phone verification timestamp
 */

/**
 * User profile update data
 * @typedef {Object} UserProfileUpdate
 * @property {string} firstName - Updated first name
 * @property {string} lastName - Updated last name
 * @property {string} bio - Updated biography
 * @property {string} location - Updated location
 * @property {Date} birthDate - Updated birth date
 * @property {string} phone - Updated phone number
 * @property {Object} address - Updated address
 * @property {Array<string>} interests - Updated interests
 * @property {File} avatar - New avatar image
 */

/**
 * User registration data
 * @typedef {Object} UserRegistration
 * @property {string} email - Email address
 * @property {string} password - Password
 * @property {string} confirmPassword - Password confirmation
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} phone - Phone number
 * @property {string} role - Desired role (user/seller)
 * @property {boolean} agreeToTerms - Terms agreement
 * @property {boolean} agreeToPrivacy - Privacy policy agreement
 */

/**
 * User login data
 * @typedef {Object} UserLogin
 * @property {string} emailOrUsername - Email or username
 * @property {string} password - Password
 * @property {boolean} rememberMe - Remember login
 * @property {string} deviceId - Device identifier
 */

/**
 * User validation rules
 */
export const USER_VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+966|966|0)?[5][0-9]{8}$/, // Saudi phone format
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]{3,20}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp']
};

/**
 * User permissions by role
 */
export const USER_PERMISSIONS = {
  [USER_ROLES.GUEST]: [
    'view_auctions',
    'view_public_profiles'
  ],
  [USER_ROLES.USER]: [
    'view_auctions',
    'participate_auctions',
    'place_bids',
    'send_messages',
    'comment_auctions',
    'like_auctions',
    'follow_users',
    'report_content',
    'view_profiles',
    'update_profile'
  ],
  [USER_ROLES.SELLER]: [
    'view_auctions',
    'participate_auctions',
    'place_bids',
    'send_messages',
    'comment_auctions',
    'like_auctions',
    'follow_users',
    'report_content',
    'view_profiles',
    'update_profile',
    'create_auctions',
    'manage_own_auctions',
    'upload_media',
    'view_sales_analytics'
  ],
  [USER_ROLES.MODERATOR]: [
    'view_auctions',
    'participate_auctions',
    'place_bids',
    'send_messages',
    'comment_auctions',
    'like_auctions',
    'follow_users',
    'report_content',
    'view_profiles',
    'update_profile',
    'moderate_content',
    'review_reports',
    'suspend_users',
    'delete_comments',
    'manage_auctions'
  ],
  [USER_ROLES.ADMIN]: [
    '*' // All permissions
  ]
};

/**
 * User utility functions
 */
export const UserUtils = {
  /**
   * Get user full name
   * @param {User} user 
   * @returns {string}
   */
  getFullName(user) {
    return `${user.firstName} ${user.lastName}`.trim();
  },

  /**
   * Get user display name (full name or username)
   * @param {User} user 
   * @returns {string}
   */
  getDisplayName(user) {
    const fullName = this.getFullName(user);
    return fullName || user.username || user.email;
  },

  /**
   * Get user initials for avatar placeholder
   * @param {User} user 
   * @returns {string}
   */
  getInitials(user) {
    const name = this.getDisplayName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  /**
   * Check if user has specific role
   * @param {User} user 
   * @param {string} role 
   * @returns {boolean}
   */
  hasRole(user, role) {
    return user.role === role;
  },

  /**
   * Check if user has permission
   * @param {User} user 
   * @param {string} permission 
   * @returns {boolean}
   */
  hasPermission(user, permission) {
    const userPermissions = USER_PERMISSIONS[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  },

  /**
   * Check if user is active
   * @param {User} user 
   * @returns {boolean}
   */
  isActive(user) {
    return user.status === USER_STATUS.ACTIVE;
  },

  /**
   * Check if user is verified
   * @param {User} user 
   * @returns {boolean}
   */
  isVerified(user) {
    return user.verificationStatus === VERIFICATION_STATUS.VERIFIED;
  },

  /**
   * Check if user is seller
   * @param {User} user 
   * @returns {boolean}
   */
  isSeller(user) {
    return user.role === USER_ROLES.SELLER;
  },

  /**
   * Check if user is admin or moderator
   * @param {User} user 
   * @returns {boolean}
   */
  isStaff(user) {
    return [USER_ROLES.ADMIN, USER_ROLES.MODERATOR].includes(user.role);
  },

  /**
   * Get user status display text
   * @param {string} status 
   * @returns {string}
   */
  getStatusText(status) {
    const statusTexts = {
      [USER_STATUS.ACTIVE]: 'نشط',
      [USER_STATUS.INACTIVE]: 'غير نشط',
      [USER_STATUS.SUSPENDED]: 'معلق',
      [USER_STATUS.BANNED]: 'محظور',
      [USER_STATUS.PENDING_VERIFICATION]: 'في انتظار التحقق'
    };
    return statusTexts[status] || 'غير معروف';
  },

  /**
   * Get user role display text
   * @param {string} role 
   * @returns {string}
   */
  getRoleText(role) {
    const roleTexts = {
      [USER_ROLES.GUEST]: 'زائر',
      [USER_ROLES.USER]: 'مستخدم',
      [USER_ROLES.SELLER]: 'بائع',
      [USER_ROLES.ADMIN]: 'مدير',
      [USER_ROLES.MODERATOR]: 'مشرف'
    };
    return roleTexts[role] || 'غير معروف';
  },

  /**
   * Validate email format
   * @param {string} email 
   * @returns {boolean}
   */
  isValidEmail(email) {
    return USER_VALIDATION.EMAIL_REGEX.test(email);
  },

  /**
   * Validate phone format
   * @param {string} phone 
   * @returns {boolean}
   */
  isValidPhone(phone) {
    return USER_VALIDATION.PHONE_REGEX.test(phone);
  },

  /**
   * Validate password strength
   * @param {string} password 
   * @returns {Object}
   */
  validatePassword(password) {
    const result = {
      isValid: true,
      errors: []
    };

    if (password.length < USER_VALIDATION.PASSWORD_MIN_LENGTH) {
      result.isValid = false;
      result.errors.push(`كلمة المرور يجب أن تكون ${USER_VALIDATION.PASSWORD_MIN_LENGTH} أحرف على الأقل`);
    }

    if (!USER_VALIDATION.PASSWORD_REGEX.test(password)) {
      result.isValid = false;
      result.errors.push('كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص');
    }

    return result;
  },

  /**
   * Calculate user success rate
   * @param {User} user 
   * @returns {number}
   */
  getSuccessRate(user) {
    if (!user.stats.totalBids) return 0;
    return Math.round((user.stats.successfulBids / user.stats.totalBids) * 100);
  },

  /**
   * Get user experience level
   * @param {User} user 
   * @returns {string}
   */
  getExperienceLevel(user) {
    const auctionsCount = user.stats.auctionsParticipated || 0;
    
    if (auctionsCount === 0) return 'جديد';
    if (auctionsCount < 5) return 'مبتدئ';
    if (auctionsCount < 20) return 'متوسط';
    if (auctionsCount < 50) return 'متقدم';
    return 'خبير';
  }
};

export default {
  USER_ROLES,
  USER_STATUS,
  VERIFICATION_STATUS,
  USER_VALIDATION,
  USER_PERMISSIONS,
  UserUtils
};