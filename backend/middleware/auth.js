const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const logger = require('../utils/logger');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/env');

// Generate JWT tokens
const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
    issuer: 'mazad-motion',
    audience: 'mazad-motion-users'
  });
  
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
    issuer: 'mazad-motion',
    audience: 'mazad-motion-users'
  });
  
  return { accessToken, refreshToken };
};

// Verify JWT token
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret, {
      issuer: 'mazad-motion',
      audience: 'mazad-motion-users'
    });
  } catch (error) {
    logger.warn('Token verification failed:', error.message);
    return null;
  }
};

// Extract token from request headers
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return authHeader;
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'missing_token',
        message: 'يجب تسجيل الدخول للوصول لهذه الميزة',
        englishMessage: 'Authentication token is required'
      });
    }
    
    const decoded = verifyToken(token, JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'invalid_token',
        message: 'رمز المصادقة غير صحيح',
        englishMessage: 'Invalid authentication token'
      });
    }
    
    // Get user details from database
    const userResult = await query(
      `SELECT u.*, p.full_name, p.phone, p.avatar_url, p.location, p.bio,
              r.name as role_name, r.permissions
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'user_not_found',
        message: 'المستخدم غير موجود أو محظور',
        englishMessage: 'User not found or deactivated'
      });
    }
    
    const user = userResult.rows[0];
    
    // Check if user is banned
    if (user.is_banned) {
      return res.status(403).json({
        success: false,
        error: 'user_banned',
        message: 'تم حظر حسابك، الرجاء التواصل مع الإدارة',
        englishMessage: 'Your account has been banned'
      });
    }
    
    // Update last activity
    await query(
      'UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
      phone: user.phone,
      avatarUrl: user.avatar_url,
      location: user.location,
      bio: user.bio,
      role: user.role_name,
      permissions: user.permissions ? JSON.parse(user.permissions) : [],
      emailVerified: user.email_verified_at !== null,
      createdAt: user.created_at,
      lastActivity: user.last_activity
    };
    
    logger.debug(`User authenticated: ${user.username} (${user.id})`);
    next();
    
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'auth_error',
      message: 'حدث خطأ في المصادقة',
      englishMessage: 'Authentication error occurred'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = verifyToken(token, JWT_SECRET);
    
    if (!decoded) {
      req.user = null;
      return next();
    }
    
    // Get user details from database
    const userResult = await query(
      `SELECT u.*, p.full_name, p.phone, p.avatar_url, p.location, p.bio,
              r.name as role_name, r.permissions
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      req.user = null;
      return next();
    }
    
    const user = userResult.rows[0];
    
    if (user.is_banned) {
      req.user = null;
      return next();
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
      phone: user.phone,
      avatarUrl: user.avatar_url,
      location: user.location,
      bio: user.bio,
      role: user.role_name,
      permissions: user.permissions ? JSON.parse(user.permissions) : [],
      emailVerified: user.email_verified_at !== null,
      createdAt: user.created_at,
      lastActivity: user.last_activity
    };
    
    // Update last activity
    await query(
      'UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    next();
    
  } catch (error) {
    logger.error('Optional authentication error:', error);
    req.user = null;
    next();
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'authentication_required',
        message: 'يجب تسجيل الدخول أولاً',
        englishMessage: 'Authentication required'
      });
    }
    
    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'insufficient_permissions',
        message: 'ليس لديك صلاحية للوصول لهذه الميزة',
        englishMessage: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Permission-based authorization middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'authentication_required',
        message: 'يجب تسجيل الدخول أولاً',
        englishMessage: 'Authentication required'
      });
    }
    
    const userPermissions = req.user.permissions || [];
    
    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      return res.status(403).json({
        success: false,
        error: 'insufficient_permissions',
        message: 'ليس لديك صلاحية لتنفيذ هذا الإجراء',
        englishMessage: 'You do not have permission to perform this action'
      });
    }
    
    next();
  };
};

// Admin authorization middleware
const requireAdmin = requireRole(['admin', 'super_admin']);

// Seller authorization middleware
const requireSeller = requireRole(['seller', 'admin', 'super_admin']);

// Moderator authorization middleware
const requireModerator = requireRole(['moderator', 'admin', 'super_admin']);

// Email verification middleware
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'authentication_required',
      message: 'يجب تسجيل الدخول أولاً',
      englishMessage: 'Authentication required'
    });
  }
  
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      error: 'email_not_verified',
      message: 'يجب تأكيد البريد الإلكتروني أولاً',
      englishMessage: 'Email verification required'
    });
  }
  
  next();
};

// Refresh token middleware
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'missing_refresh_token',
        message: 'رمز التحديث مطلوب',
        englishMessage: 'Refresh token is required'
      });
    }
    
    const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'invalid_refresh_token',
        message: 'رمز التحديث غير صحيح',
        englishMessage: 'Invalid refresh token'
      });
    }
    
    // Get user details
    const userResult = await query(
      'SELECT id, email, username, role_id FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'user_not_found',
        message: 'المستخدم غير موجود',
        englishMessage: 'User not found'
      });
    }
    
    const user = userResult.rows[0];
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
      roleId: user.role_id
    });
    
    req.tokens = tokens;
    next();
    
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'token_refresh_error',
      message: 'حدث خطأ في تحديث الرمز',
      englishMessage: 'Token refresh error occurred'
    });
  }
};

module.exports = {
  generateTokens,
  verifyToken,
  authenticate,
  optionalAuth,
  requireRole,
  requirePermission,
  requireAdmin,
  requireSeller,
  requireModerator,
  requireEmailVerification,
  refreshToken
};