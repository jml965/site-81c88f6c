const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { validateEmail, validatePassword, validatePhone } = require('../utils/validation');
const User = require('../models/User');
const crypto = require('crypto');

class AuthController {
  // تسجيل مستخدم جديد
  async register(req, res) {
    try {
      const { 
        username, 
        email, 
        password, 
        confirmPassword, 
        phone, 
        fullName,
        userType = 'user' // user, seller
      } = req.body;

      // التحقق من البيانات المطلوبة
      if (!username || !email || !password || !confirmPassword || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'جميع البيانات مطلوبة',
          errors: {
            required: 'اسم المستخدم والإيميل وكلمة المرور والاسم الكامل مطلوبة'
          }
        });
      }

      // التحقق من تطابق كلمات المرور
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'كلمات المرور غير متطابقة',
          errors: {
            password: 'كلمة المرور وتأكيد كلمة المرور يجب أن يكونا متطابقين'
          }
        });
      }

      // التحقق من صحة البيانات
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني غير صحيح',
          errors: { email: emailValidation.message }
        });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          success: false,
          message: 'كلمة المرور غير صحيحة',
          errors: { password: passwordValidation.message }
        });
      }

      if (phone) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
          return res.status(400).json({
            success: false,
            message: 'رقم الهاتف غير صحيح',
            errors: { phone: phoneValidation.message }
          });
        }
      }

      // التحقق من وجود المستخدم
      const existingUser = await User.findByEmailOrUsername(email, username);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: existingUser.email === email ? 'البريد الإلكتروني مستخدم بالفعل' : 'اسم المستخدم مستخدم بالفعل',
          errors: {
            duplicate: existingUser.email === email ? 'email' : 'username'
          }
        });
      }

      // تشفير كلمة المرور
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // إنشاء رمز التفعيل
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // إنشاء المستخدم
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        phone,
        fullName,
        userType,
        role: userType === 'seller' ? 'seller' : 'user',
        isActive: false,
        isEmailVerified: false,
        verificationToken,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // إزالة كلمة المرور من الاستجابة
      const userResponse = { ...newUser };
      delete userResponse.password;
      delete userResponse.verificationToken;

      // إنشاء التوكن
      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
        isEmailVerified: newUser.isEmailVerified
      });

      const refreshToken = generateRefreshToken({
        id: newUser.id,
        email: newUser.email
      });

      // حفظ refresh token
      await User.updateRefreshToken(newUser.id, refreshToken);

      // TODO: إرسال إيميل التفعيل
      // await sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        success: true,
        message: 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك',
        data: {
          user: userResponse,
          token,
          refreshToken,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في الخادم',
        errors: {
          server: 'فشل في إنشاء الحساب، حاول مرة أخرى'
        }
      });
    }
  }

  // تسجيل الدخول
  async login(req, res) {
    try {
      const { email, password, rememberMe = false } = req.body;

      // التحقق من البيانات المطلوبة
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني وكلمة المرور مطلوبان',
          errors: {
            required: 'يجب إدخال البريد الإلكتروني وكلمة المرور'
          }
        });
      }

      // البحث عن المستخدم
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'بيانات الدخول غير صحيحة',
          errors: {
            credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          }
        });
      }

      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'بيانات الدخول غير صحيحة',
          errors: {
            credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          }
        });
      }

      // التحقق من حالة الحساب
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'الحساب غير مفعل',
          errors: {
            account: 'يجب تفعيل الحساب أولاً من البريد الإلكتروني'
          }
        });
      }

      // تحديث آخر تسجيل دخول
      await User.updateLastLogin(user.id);

      // إنشاء التوكن
      const tokenExpiry = rememberMe ? '30d' : '24h';
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified
      }, tokenExpiry);

      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email
      });

      // حفظ refresh token
      await User.updateRefreshToken(user.id, refreshToken);

      // إزالة البيانات الحساسة
      const userResponse = { ...user };
      delete userResponse.password;
      delete userResponse.verificationToken;
      delete userResponse.refreshToken;

      res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: {
          user: userResponse,
          token,
          refreshToken,
          expiresIn: tokenExpiry
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في الخادم',
        errors: {
          server: 'فشل في تسجيل الدخول، حاول مرة أخرى'
        }
      });
    }
  }

  // تسجيل الخروج
  async logout(req, res) {
    try {
      const userId = req.user.id;

      // حذف refresh token
      await User.updateRefreshToken(userId, null);

      res.json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في تسجيل الخروج'
      });
    }
  }

  // تجديد التوكن
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token مطلوب'
        });
      }

      // التحقق من صحة refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // البحث عن المستخدم
      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token غير صحيح'
        });
      }

      // إنشاء توكن جديد
      const newToken = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified
      });

      const newRefreshToken = generateRefreshToken({
        id: user.id,
        email: user.email
      });

      // تحديث refresh token
      await User.updateRefreshToken(user.id, newRefreshToken);

      res.json({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Refresh token غير صحيح أو منتهي الصلاحية'
      });
    }
  }

  // التحقق من البريد الإلكتروني
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'رمز التفعيل مطلوب'
        });
      }

      // البحث عن المستخدم برمز التفعيل
      const user = await User.findByVerificationToken(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'رمز التفعيل غير صحيح أو منتهي الصلاحية'
        });
      }

      // تفعيل البريد الإلكتروني
      await User.verifyEmail(user.id);

      res.json({
        success: true,
        message: 'تم تفعيل البريد الإلكتروني بنجاح'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في تفعيل البريد الإلكتروني'
      });
    }
  }

  // إعادة إرسال رمز التفعيل
  async resendVerification(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مطلوب'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مفعل بالفعل'
        });
      }

      // إنشاء رمز تفعيل جديد
      const verificationToken = crypto.randomBytes(32).toString('hex');
      await User.updateVerificationToken(user.id, verificationToken);

      // TODO: إرسال إيميل التفعيل
      // await sendVerificationEmail(email, verificationToken);

      res.json({
        success: true,
        message: 'تم إرسال رمز التفعيل إلى بريدك الإلكتروني'
      });

    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في إرسال رمز التفعيل'
      });
    }
  }

  // نسيان كلمة المرور
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مطلوب'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        // لأسباب أمنية، نعطي نفس الرد حتى لو كان المستخدم غير موجود
        return res.json({
          success: true,
          message: 'إذا كان البريد الإلكتروني صحيحًا، ستصلك رسالة لإعادة تعيين كلمة المرور'
        });
      }

      // إنشاء رمز إعادة تعيين كلمة المرور
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpiry = new Date(Date.now() + 3600000); // ساعة واحدة

      await User.updatePasswordResetToken(user.id, resetToken, resetExpiry);

      // TODO: إرسال إيميل إعادة تعيين كلمة المرور
      // await sendPasswordResetEmail(email, resetToken);

      res.json({
        success: true,
        message: 'إذا كان البريد الإلكتروني صحيحًا، ستصلك رسالة لإعادة تعيين كلمة المرور'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في إرسال رسالة إعادة تعيين كلمة المرور'
      });
    }
  }

  // إعادة تعيين كلمة المرور
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'جميع البيانات مطلوبة'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'كلمات المرور غير متطابقة'
        });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          success: false,
          message: 'كلمة المرور غير صحيحة',
          errors: { password: passwordValidation.message }
        });
      }

      // البحث عن المستخدم برمز إعادة التعيين
      const user = await User.findByResetToken(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'رمز إعادة التعيين غير صحيح أو منتهي الصلاحية'
        });
      }

      // تشفير كلمة المرور الجديدة
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // تحديث كلمة المرور وحذف رمز الإعادة
      await User.updatePassword(user.id, hashedPassword);

      res.json({
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في إعادة تعيين كلمة المرور'
      });
    }
  }

  // الحصول على بيانات المستخدم الحالي
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      // إزالة البيانات الحساسة
      const userResponse = { ...user };
      delete userResponse.password;
      delete userResponse.verificationToken;
      delete userResponse.refreshToken;
      delete userResponse.passwordResetToken;
      delete userResponse.passwordResetExpiry;

      res.json({
        success: true,
        data: { user: userResponse }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في جلب بيانات المستخدم'
      });
    }
  }

  // تحديث بيانات المستخدم
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, phone, bio, avatar } = req.body;

      // التحقق من صحة رقم الهاتف إذا تم تقديمه
      if (phone) {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
          return res.status(400).json({
            success: false,
            message: 'رقم الهاتف غير صحيح',
            errors: { phone: phoneValidation.message }
          });
        }
      }

      const updateData = {
        updatedAt: new Date()
      };

      if (fullName) updateData.fullName = fullName;
      if (phone !== undefined) updateData.phone = phone;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar !== undefined) updateData.avatar = avatar;

      const updatedUser = await User.updateById(userId, updateData);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      // إزالة البيانات الحساسة
      const userResponse = { ...updatedUser };
      delete userResponse.password;
      delete userResponse.verificationToken;
      delete userResponse.refreshToken;
      delete userResponse.passwordResetToken;
      delete userResponse.passwordResetExpiry;

      res.json({
        success: true,
        message: 'تم تحديث البيانات بنجاح',
        data: { user: userResponse }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في تحديث البيانات'
      });
    }
  }

  // تغيير كلمة المرور
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword, confirmNewPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({
          success: false,
          message: 'جميع البيانات مطلوبة'
        });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          success: false,
          message: 'كلمة المرور الجديدة وتأكيدها غير متطابقين'
        });
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          success: false,
          message: 'كلمة المرور الجديدة غير صحيحة',
          errors: { newPassword: passwordValidation.message }
        });
      }

      // التحقق من المستخدم وكلمة المرور الحالية
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'المستخدم غير موجود'
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'كلمة المرور الحالية غير صحيحة'
        });
      }

      // تشفير كلمة المرور الجديدة
      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // تحديث كلمة المرور
      await User.updatePassword(userId, hashedNewPassword);

      res.json({
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ في تغيير كلمة المرور'
      });
    }
  }
}

module.exports = new AuthController();