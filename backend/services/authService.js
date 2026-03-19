const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { validateEmail, validatePassword, validatePhone } = require('../utils/validation');
const User = require('../models/User');

class AuthService {
  /**
   * تسجيل مستخدم جديد
   */
  async registerUser(userData) {
    try {
      const { 
        username, 
        email, 
        password, 
        confirmPassword, 
        phone, 
        fullName, 
        userType = 'user',
        bio = null,
        avatar = null
      } = userData;

      // التحقق من البيانات المطلوبة
      if (!username || !email || !password || !confirmPassword || !fullName) {
        throw new Error('جميع البيانات المطلوبة غير مكتملة');
      }

      // التحقق من تطابق كلمات المرور
      if (password !== confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      // التحقق من صحة البيانات
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.message);
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      if (phone) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
          throw new Error(phoneValidation.message);
        }
      }

      // التحقق من وجود المستخدم
      const existingUser = await User.findByEmailOrUsername(email, username);
      if (existingUser) {
        throw new Error(existingUser.email === email ? 'البريد الإلكتروني مستخدم بالفعل' : 'اسم المستخدم مستخدم بالفعل');
      }

      // تشفير كلمة المرور
      const hashedPassword = await this.hashPassword(password);

      // إنشاء رمز التفعيل
      const verificationToken = this.generateVerificationToken();

      // إنشاء المستخدم
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phone,
        fullName,
        userType,
        role: userType === 'seller' ? 'seller' : 'user',
        bio,
        avatar,
        isActive: false,
        isEmailVerified: false,
        verificationToken,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // إنشاء التوكن
      const tokenData = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        isEmailVerified: newUser.isEmailVerified
      };

      const token = generateToken(tokenData);
      const refreshToken = generateRefreshToken({ id: newUser.id, email: newUser.email });

      // حفظ refresh token
      await User.updateRefreshToken(newUser.id, refreshToken);

      // إزالة البيانات الحساسة
      const userResponse = this.sanitizeUser(newUser);

      return {
        success: true,
        user: userResponse,
        token,
        refreshToken,
        verificationToken // للاستخدام في إرسال البريد الإلكتروني
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * تسجيل الدخول
   */
  async loginUser(credentials) {
    try {
      const { email, password, rememberMe = false } = credentials;

      if (!email || !password) {
        throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
      }

      // البحث عن المستخدم
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('بيانات الدخول غير صحيحة');
      }

      // التحقق من كلمة المرور
      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('بيانات الدخول غير صحيحة');
      }

      // التحقق من حالة الحساب
      if (!user.isActive) {
        throw new Error('الحساب غير مفعل. يجب تفعيل الحساب أولاً من البريد الإلكتروني');
      }

      // تحديث آخر تسجيل دخول
      await User.updateLastLogin(user.id);

      // إنشاء التوكن
      const tokenExpiry = rememberMe ? '30d' : '24h';
      const tokenData = {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified
      };

      const token = generateToken(tokenData, tokenExpiry);
      const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

      // حفظ refresh token
      await User.updateRefreshToken(user.id, refreshToken);

      // إزالة البيانات الحساسة
      const userResponse = this.sanitizeUser(user);

      return {
        success: true,
        user: userResponse,
        token,
        refreshToken,
        expiresIn: tokenExpiry
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * تجديد التوكن
   */
  async refreshUserToken(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token مطلوب');
      }

      // التحقق من صحة refresh token
      const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // البحث عن المستخدم
      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Refresh token غير صحيح');
      }

      // التحقق من حالة المستخدم
      if (!user.isActive) {
        throw new Error('الحساب غير مفعل');
      }

      // إنشاء توكن جديد
      const tokenData = {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified
      };

      const newToken = generateToken(tokenData);
      const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email });

      // تحديث refresh token
      await User.updateRefreshToken(user.id, newRefreshToken);

      return {
        success: true,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: '24h'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * تسجيل الخروج
   */
  async logoutUser(userId) {
    try {
      // حذف refresh token
      await User.updateRefreshToken(userId, null);
      
      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * التحقق من البريد الإلكتروني
   */
  async verifyUserEmail(token) {
    try {
      if (!token) {
        throw new Error('رمز التفعيل مطلوب');
      }

      // البحث عن المستخدم برمز التفعيل
      const user = await User.findByVerificationToken(token);
      if (!user) {
        throw new Error('رمز التفعيل غير صحيح أو منتهي الصلاحية');
      }

      // تفعيل البريد الإلكتروني
      await User.verifyEmail(user.id);

      return {
        success: true,
        message: 'تم تفعيل البريد الإلكتروني بنجاح'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * إعادة إرسال رمز التفعيل
   */
  async resendVerificationToken(email) {
    try {
      if (!email) {
        throw new Error('البريد الإلكتروني مطلوب');
      }

      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      if (user.isEmailVerified) {
        throw new Error('البريد الإلكتروني مفعل بالفعل');
      }

      // إنشاء رمز تفعيل جديد
      const verificationToken = this.generateVerificationToken();
      await User.updateVerificationToken(user.id, verificationToken);

      return {
        success: true,
        verificationToken,
        message: 'تم إرسال رمز التفعيل إلى بريدك الإلكتروني'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * طلب إعادة تعيين كلمة المرور
   */
  async requestPasswordReset(email) {
    try {
      if (!email) {
        throw new Error('البريد الإلكتروني مطلوب');
      }

      const user = await User.findByEmail(email);
      if (!user) {
        // لأسباب أمنية، نعطي نفس الرد حتى لو كان المستخدم غير موجود
        return {
          success: true,
          message: 'إذا كان البريد الإلكتروني صحيحًا، ستصلك رسالة لإعادة تعيين كلمة المرور'
        };
      }

      // إنشاء رمز إعادة تعيين كلمة المرور
      const resetToken = this.generatePasswordResetToken();
      const resetExpiry = new Date(Date.now() + 3600000); // ساعة واحدة

      await User.updatePasswordResetToken(user.id, resetToken, resetExpiry);

      return {
        success: true,
        resetToken,
        message: 'إذا كان البريد الإلكتروني صحيحًا، ستصلك رسالة لإعادة تعيين كلمة المرور'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * إعادة تعيين كلمة المرور
   */
  async resetUserPassword(token, newPassword, confirmPassword) {
    try {
      if (!token || !newPassword || !confirmPassword) {
        throw new Error('جميع البيانات مطلوبة');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // البحث عن المستخدم برمز إعادة التعيين
      const user = await User.findByResetToken(token);
      if (!user) {
        throw new Error('رمز إعادة التعيين غير صحيح أو منتهي الصلاحية');
      }

      // تشفير كلمة المرور الجديدة
      const hashedPassword = await this.hashPassword(newPassword);

      // تحديث كلمة المرور وحذف رمز الإعادة
      await User.updatePassword(user.id, hashedPassword);

      return {
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * تغيير كلمة المرور للمستخدم المسجل
   */
  async changeUserPassword(userId, currentPassword, newPassword, confirmPassword) {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('جميع البيانات مطلوبة');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // التحقق من المستخدم وكلمة المرور الحالية
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
      }

      // تشفير كلمة المرور الجديدة
      const hashedNewPassword = await this.hashPassword(newPassword);

      // تحديث كلمة المرور
      await User.updatePassword(userId, hashedNewPassword);

      return {
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على بيانات المستخدم
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      return {
        success: true,
        user: this.sanitizeUser(user)
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * تحديث بيانات المستخدم
   */
  async updateUserProfile(userId, updateData) {
    try {
      const { fullName, phone, bio, avatar } = updateData;

      // التحقق من صحة رقم الهاتف إذا تم تقديمه
      if (phone) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
          throw new Error(phoneValidation.message);
        }
      }

      const dataToUpdate = {
        updatedAt: new Date()
      };

      if (fullName) dataToUpdate.fullName = fullName;
      if (phone !== undefined) dataToUpdate.phone = phone;
      if (bio !== undefined) dataToUpdate.bio = bio;
      if (avatar !== undefined) dataToUpdate.avatar = avatar;

      const updatedUser = await User.updateById(userId, dataToUpdate);
      
      if (!updatedUser) {
        throw new Error('المستخدم غير موجود');
      }

      return {
        success: true,
        user: this.sanitizeUser(updatedUser),
        message: 'تم تحديث البيانات بنجاح'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * التحقق من صحة التوكن
   */
  async validateToken(token) {
    try {
      const decoded = verifyToken(token, process.env.JWT_SECRET);
      return {
        success: true,
        user: decoded
      };
    } catch (error) {
      throw new Error('التوكن غير صحيح أو منتهي الصلاحية');
    }
  }

  // ========== دوال مساعدة ==========

  /**
   * تشفير كلمة المرور
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   * مقارنة كلمة المرور
   */
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * إنشاء رمز التفعيل
   */
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * إنشاء رمز إعادة تعيين كلمة المرور
   */
  generatePasswordResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * إزالة البيانات الحساسة من كائن المستخدم
   */
  sanitizeUser(user) {
    const sanitized = { ...user };
    delete sanitized.password;
    delete sanitized.verificationToken;
    delete sanitized.refreshToken;
    delete sanitized.passwordResetToken;
    delete sanitized.passwordResetExpiry;
    return sanitized;
  }

  /**
   * التحقق من صلاحيات المستخدم
   */
  hasPermission(userRole, requiredRole) {
    const roleHierarchy = {
      'admin': 4,
      'moderator': 3,
      'seller': 2,
      'user': 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  /**
   * التحقق من نشاط المستخدم
   */
  isUserActive(user) {
    return user.isActive && !user.isBlocked && !user.isDeleted;
  }

  /**
   * إنشاء بيانات جلسة المستخدم
   */
  createUserSession(user) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar
    };
  }
}

module.exports = new AuthService();