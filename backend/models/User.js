const pool = require('../config/database');

class User {
  /**
   * إنشاء مستخدم جديد
   * @param {Object} userData - بيانات المستخدم
   * @returns {Object} المستخدم الجديد
   */
  static async create(userData) {
    const {
      username,
      email,
      password,
      phone,
      fullName,
      userType = 'user',
      role = 'user',
      bio = null,
      avatar = null,
      isActive = false,
      isEmailVerified = false,
      verificationToken,
      createdAt = new Date(),
      updatedAt = new Date()
    } = userData;

    const query = `
      INSERT INTO users (
        username, email, password, phone, full_name, user_type, role,
        bio, avatar, is_active, is_email_verified, verification_token,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      username, email, password, phone, fullName, userType, role,
      bio, avatar, isActive, isEmailVerified, verificationToken,
      createdAt, updatedAt
    ];

    try {
      const result = await pool.query(query, values);
      return this.mapDatabaseUser(result.rows[0]);
    } catch (error) {
      console.error('Create user error:', error);
      
      // معالجة أخطاء قاعدة البيانات المحددة
      if (error.code === '23505') { // unique violation
        if (error.constraint.includes('email')) {
          throw new Error('البريد الإلكتروني مستخدم بالفعل');
        }
        if (error.constraint.includes('username')) {
          throw new Error('اسم المستخدم مستخدم بالفعل');
        }
      }
      
      throw new Error('فشل في إنشاء المستخدم');
    }
  }

  /**
   * البحث عن مستخدم بواسطة المعرف
   * @param {number} id - معرف المستخدم
   * @returns {Object|null} المستخدم أو null
   */
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_deleted = FALSE';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapDatabaseUser(result.rows[0]) : null;
    } catch (error) {
      console.error('Find user by ID error:', error);
      throw new Error('فشل في البحث عن المستخدم');
    }
  }

  /**
   * البحث عن مستخدم بواسطة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {Object|null} المستخدم أو null
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_deleted = FALSE';
    
    try {
      const result = await pool.query(query, [email.toLowerCase()]);
      return result.rows.length > 0 ? this.mapDatabaseUser(result.rows[0]) : null;
    } catch (error) {
      console.error('Find user by email error:', error);
      throw new Error('فشل في البحث عن المستخدم');
    }
  }

  /**
   * البحث عن مستخدم بواسطة اسم المستخدم
   * @param {string} username - اسم المستخدم
   * @returns {Object|null} المستخدم أو null
   */
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1 AND is_deleted = FALSE';
    
    try {
      const result = await pool.query(query, [username.toLowerCase()]);
      return result.rows.length > 0 ? this.mapDatabaseUser(result.rows[0]) : null;
    } catch (error) {
      console.error('Find user by username error:', error);
      throw new Error('فشل في البحث عن المستخدم');
    }
  }

  /**
   * البحث عن مستخدم بواسطة البريد الإلكتروني أو اسم المستخدم
   * @param {string} email - البريد الإلكتروني
   * @param {string} username - اسم المستخدم
   * @returns {Object|null} المستخدم أو null
   */
  static async findByEmailOrUsername(email, username) {
    const query = `
      SELECT * FROM users 
      WHERE (email = $1 OR username = $2) AND is_deleted = FALSE
      LIMIT 1
    `;
    
    try {
      const result = await pool.query(query, [email.toLowerCase(), username.toLowerCase()]);
      return result.rows.length > 0 ? this.mapDatabaseUser(result.rows[0]) : null;
    } catch (error) {
      console.error('Find user by email or username error:', error);
      throw new Error('فشل في البحث عن المستخدم');
    }
  }

  /**
   * البحث عن مستخدم بواسطة رمز التفعيل
   * @param {string} token - رمز التفعيل
   * @returns {Object|null} المستخدم أو null
   */
  static async findByVerificationToken(token) {
    const query = `
      SELECT * FROM users 
      WHERE verification_token = $1 AND is_deleted = FALSE
    `;
    
    try {
      const result = await pool.query(query, [token]);
      return result.rows.length > 0 ? this.mapDatabaseUser(result.rows[0]) : null;
    } catch (error) {
      console.error('Find user by verification token error:', error);
      throw new Error('فشل في البحث عن المستخدم');
    }
  }

  /**
   * البحث عن مستخدم بواسطة رمز إعادة تعيين كلمة المرور
   * @param {string} token - رمز إعادة التعيين
   * @returns {Object|null} المستخدم أو null
   */
  static async findByResetToken(token) {
    const query = `
      SELECT * FROM users 
      WHERE password_reset_token = $1 
      AND password_reset_expiry > NOW()
      AND is_deleted = FALSE
    `;
    
    try {
      const result = await pool.query(query, [token]);
      return result.rows.length > 0 ? this.mapDatabaseUser(result.rows[0]) : null;
    } catch (error) {
      console.error('Find user by reset token error:', error);
      throw new Error('فشل في البحث عن المستخدم');
    }
  }

  /**
   * تحديث بيانات المستخدم
   * @param {number} id - معرف المستخدم
   * @param {Object} updateData - البيانات المحدثة
   * @returns {Object|null} المستخدم المحدث أو null
   */
  static async updateById(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // بناء الاستعلام ديناميكياً
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        // تحويل camelCase إلى snake_case
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('لا توجد بيانات للتحديث');
    }

    // إضافة updated_at
    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    paramCount++;

    // إضافة معرف المستخدم
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND is_deleted = FALSE
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? this.mapDatabaseUser(result.rows[0]) : null;
    } catch (error) {
      console.error('Update user error:', error);
      
      if (error.code === '23505') {
        if (error.constraint.includes('email')) {
          throw new Error('البريد الإلكتروني مستخدم بالفعل');
        }
        if (error.constraint.includes('username')) {
          throw new Error('اسم المستخدم مستخدم بالفعل');
        }
      }
      
      throw new Error('فشل في تحديث بيانات المستخدم');
    }
  }

  /**
   * تحديث كلمة المرور
   * @param {number} id - معرف المستخدم
   * @param {string} hashedPassword - كلمة المرور المشفرة
   * @returns {boolean} نجح التحديث
   */
  static async updatePassword(id, hashedPassword) {
    const query = `
      UPDATE users 
      SET password = $1, 
          password_reset_token = NULL, 
          password_reset_expiry = NULL,
          updated_at = NOW()
      WHERE id = $2 AND is_deleted = FALSE
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [hashedPassword, id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error('فشل في تحديث كلمة المرور');
    }
  }

  /**
   * تحديث refresh token
   * @param {number} id - معرف المستخدم
   * @param {string} refreshToken - الرمز المميز للتجديد
   * @returns {boolean} نجح التحديث
   */
  static async updateRefreshToken(id, refreshToken) {
    const query = `
      UPDATE users 
      SET refresh_token = $1, updated_at = NOW()
      WHERE id = $2 AND is_deleted = FALSE
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [refreshToken, id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Update refresh token error:', error);
      throw new Error('فشل في تحديث رمز التجديد');
    }
  }

  /**
   * تحديث رمز التفعيل
   * @param {number} id - معرف المستخدم
   * @param {string} verificationToken - رمز التفعيل
   * @returns {boolean} نجح التحديث
   */
  static async updateVerificationToken(id, verificationToken) {
    const query = `
      UPDATE users 
      SET verification_token = $1, updated_at = NOW()
      WHERE id = $2 AND is_deleted = FALSE
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [verificationToken, id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Update verification token error:', error);
      throw new Error('فشل في تحديث رمز التفعيل');
    }
  }

  /**
   * تحديث رمز إعادة تعيين كلمة المرور
   * @param {number} id - معرف المستخدم
   * @param {string} resetToken - رمز إعادة التعيين
   * @param {Date} expiry - تاريخ انتهاء الصلاحية
   * @returns {boolean} نجح التحديث
   */
  static async updatePasswordResetToken(id, resetToken, expiry) {
    const query = `
      UPDATE users 
      SET password_reset_token = $1, 
          password_reset_expiry = $2,
          updated_at = NOW()
      WHERE id = $3 AND is_deleted = FALSE
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [resetToken, expiry, id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Update password reset token error:', error);
      throw new Error('فشل في تحديث رمز إعادة تعيين كلمة المرور');
    }
  }

  /**
   * تفعيل البريد الإلكتروني
   * @param {number} id - معرف المستخدم
   * @returns {boolean} نجح التفعيل
   */
  static async verifyEmail(id) {
    const query = `
      UPDATE users 
      SET is_email_verified = TRUE,
          is_active = TRUE,
          verification_token = NULL,
          email_verified_at = NOW(),
          updated_at = NOW()
      WHERE id = $1 AND is_deleted = FALSE
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Verify email error:', error);
      throw new Error('فشل في تفعيل البريد الإلكتروني');
    }
  }

  /**
   * تحديث آخر تسجيل دخول
   * @param {number} id - معرف المستخدم
   * @returns {boolean} نجح التحديث
   */
  static async updateLastLogin(id) {
    const query = `
      UPDATE users 
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND is_deleted = FALSE
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Update last login error:', error);
      throw new Error('فشل في تحديث آخر تسجيل دخول');
    }
  }

  /**
   * حظر/إلغاء حظر المستخدم
   * @param {number} id - معرف المستخدم
   * @param {boolean} isBlocked - حالة الحظر
   * @param {string} reason - سبب الحظر
   * @returns {boolean} نجح التحديث
   */
  static async updateBlockStatus(id, isBlocked, reason = null) {
    const query = `
      UPDATE users 
      SET is_blocked = $1,
          block_reason = $2,
          blocked_at = ${isBlocked ? 'NOW()' : 'NULL'},
          updated_at = NOW()
      WHERE id = $3 AND is_deleted = FALSE
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [isBlocked, reason, id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Update block status error:', error);
      throw new Error('فشل في تحديث حالة الحظر');
    }
  }

  /**
   * حذف المستخدم (soft delete)
   * @param {number} id - معرف المستخدم
   * @returns {boolean} نجح الحذف
   */
  static async deleteById(id) {
    const query = `
      UPDATE users 
      SET is_deleted = TRUE,
          deleted_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error('فشل في حذف المستخدم');
    }
  }

  /**
   * البحث عن المستخدمين مع الترقيم
   * @param {Object} options - خيارات البحث
   * @returns {Object} النتائج مع معلومات الترقيم
   */
  static async findWithPagination(options = {}) {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = null,
      userType = null,
      isActive = null,
      isEmailVerified = null,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    const conditions = ['is_deleted = FALSE'];
    const params = [];
    let paramCount = 1;

    // بناء شروط البحث
    if (search) {
      conditions.push(`(full_name ILIKE $${paramCount} OR username ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (role) {
      conditions.push(`role = $${paramCount}`);
      params.push(role);
      paramCount++;
    }

    if (userType) {
      conditions.push(`user_type = $${paramCount}`);
      params.push(userType);
      paramCount++;
    }

    if (isActive !== null) {
      conditions.push(`is_active = $${paramCount}`);
      params.push(isActive);
      paramCount++;
    }

    if (isEmailVerified !== null) {
      conditions.push(`is_email_verified = $${paramCount}`);
      params.push(isEmailVerified);
      paramCount++;
    }

    const whereClause = conditions.join(' AND ');
    const validSortColumns = ['id', 'username', 'email', 'full_name', 'created_at', 'last_login_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const orderBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    try {
      // عد إجمالي النتائج
      const countQuery = `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`;
      const countResult = await pool.query(countQuery, params);
      const total = parseInt(countResult.rows[0].total);

      // جلب البيانات
      const dataQuery = `
        SELECT id, username, email, full_name, user_type, role, bio, avatar,
               is_active, is_email_verified, is_blocked, 
               created_at, updated_at, last_login_at
        FROM users 
        WHERE ${whereClause}
        ORDER BY ${orderBy} ${order}
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;
      
      params.push(limit, offset);
      const dataResult = await pool.query(dataQuery, params);

      return {
        users: dataResult.rows.map(row => this.mapDatabaseUser(row)),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1
        }
      };

    } catch (error) {
      console.error('Find users with pagination error:', error);
      throw new Error('فشل في البحث عن المستخدمين');
    }
  }

  /**
   * إحصائيات المستخدمين
   * @returns {Object} الإحصائيات
   */
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_active = TRUE) as active_users,
        COUNT(*) FILTER (WHERE is_email_verified = TRUE) as verified_users,
        COUNT(*) FILTER (WHERE is_blocked = TRUE) as blocked_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
        COUNT(*) FILTER (WHERE role = 'seller') as seller_users,
        COUNT(*) FILTER (WHERE role = 'user') as regular_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d,
        COUNT(*) FILTER (WHERE last_login_at >= NOW() - INTERVAL '7 days') as active_users_7d
      FROM users 
      WHERE is_deleted = FALSE
    `;

    try {
      const result = await pool.query(query);
      const stats = result.rows[0];
      
      return {
        totalUsers: parseInt(stats.total_users),
        activeUsers: parseInt(stats.active_users),
        verifiedUsers: parseInt(stats.verified_users),
        blockedUsers: parseInt(stats.blocked_users),
        adminUsers: parseInt(stats.admin_users),
        sellerUsers: parseInt(stats.seller_users),
        regularUsers: parseInt(stats.regular_users),
        newUsers30Days: parseInt(stats.new_users_30d),
        activeUsers7Days: parseInt(stats.active_users_7d)
      };

    } catch (error) {
      console.error('Get user statistics error:', error);
      throw new Error('فشل في جلب إحصائيات المستخدمين');
    }
  }

  /**
   * تحويل بيانات قاعدة البيانات إلى تنسيق JavaScript
   * @param {Object} dbUser - بيانات المستخدم من قاعدة البيانات
   * @returns {Object} بيانات المستخدم منسقة
   */
  static mapDatabaseUser(dbUser) {
    if (!dbUser) return null;

    return {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      password: dbUser.password,
      phone: dbUser.phone,
      fullName: dbUser.full_name,
      userType: dbUser.user_type,
      role: dbUser.role,
      bio: dbUser.bio,
      avatar: dbUser.avatar,
      isActive: dbUser.is_active,
      isEmailVerified: dbUser.is_email_verified,
      isBlocked: dbUser.is_blocked,
      isDeleted: dbUser.is_deleted,
      blockReason: dbUser.block_reason,
      verificationToken: dbUser.verification_token,
      refreshToken: dbUser.refresh_token,
      passwordResetToken: dbUser.password_reset_token,
      passwordResetExpiry: dbUser.password_reset_expiry,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
      lastLoginAt: dbUser.last_login_at,
      emailVerifiedAt: dbUser.email_verified_at,
      blockedAt: dbUser.blocked_at,
      deletedAt: dbUser.deleted_at
    };
  }
}

module.exports = User;