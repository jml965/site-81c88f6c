/**
 * Validation utility functions
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  const result = { isValid: false, error: '' };
  
  if (!email) {
    result.error = 'البريد الإلكتروني مطلوب';
    return result;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result.error = 'البريد الإلكتروني غير صحيح';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = options;
  
  const result = { isValid: false, error: '', strength: 'ضعيف' };
  
  if (!password) {
    result.error = 'كلمة المرور مطلوبة';
    return result;
  }
  
  if (password.length < minLength) {
    result.error = `كلمة المرور يجب أن تكون ${minLength} أحرف على الأقل`;
    return result;
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    result.error = 'كلمة المرور يجب أن تحتوي على حرف كبير';
    return result;
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    result.error = 'كلمة المرور يجب أن تحتوي على حرف صغير';
    return result;
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    result.error = 'كلمة المرور يجب أن تحتوي على رقم';
    return result;
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.error = 'كلمة المرور يجب أن تحتوي على رمز خاص';
    return result;
  }
  
  // Calculate password strength
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  if (strength <= 2) result.strength = 'ضعيف';
  else if (strength <= 4) result.strength = 'متوسط';
  else result.strength = 'قوي';
  
  result.isValid = true;
  return result;
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code
 * @returns {Object} Validation result
 */
export const validatePhone = (phone, countryCode = '+966') => {
  const result = { isValid: false, error: '' };
  
  if (!phone) {
    result.error = 'رقم الهاتف مطلوب';
    return result;
  }
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  if (countryCode === '+966') {
    // Saudi phone validation
    if (digits.length !== 9) {
      result.error = 'رقم الهاتف يجب أن يكون 9 أرقام';
      return result;
    }
    
    if (!digits.startsWith('5')) {
      result.error = 'رقم الهاتف يجب أن يبدأ بـ 5';
      return result;
    }
  } else {
    // Generic phone validation
    if (digits.length < 7 || digits.length > 15) {
      result.error = 'رقم الهاتف غير صحيح';
      return result;
    }
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate bid amount
 * @param {number} amount - Bid amount
 * @param {number} currentPrice - Current auction price
 * @param {number} minIncrement - Minimum bid increment
 * @param {number} maxBid - Maximum allowed bid (optional)
 * @returns {Object} Validation result
 */
export const validateBid = (amount, currentPrice, minIncrement, maxBid = null) => {
  const result = { isValid: false, error: '' };
  
  if (!amount || isNaN(amount)) {
    result.error = 'مبلغ المزايدة مطلوب';
    return result;
  }
  
  if (amount <= 0) {
    result.error = 'مبلغ المزايدة يجب أن يكون أكبر من صفر';
    return result;
  }
  
  if (amount <= currentPrice) {
    result.error = 'مبلغ المزايدة يجب أن يكون أكبر من السعر الحالي';
    return result;
  }
  
  if (amount < currentPrice + minIncrement) {
    result.error = `الحد الأدنى للزيادة هو ${minIncrement} ريال`;
    return result;
  }
  
  if (maxBid && amount > maxBid) {
    result.error = `الحد الأقصى للمزايدة هو ${maxBid} ريال`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate auction title
 * @param {string} title - Auction title
 * @returns {Object} Validation result
 */
export const validateAuctionTitle = (title) => {
  const result = { isValid: false, error: '' };
  
  if (!title || !title.trim()) {
    result.error = 'عنوان المزاد مطلوب';
    return result;
  }
  
  if (title.trim().length < 5) {
    result.error = 'عنوان المزاد يجب أن يكون 5 أحرف على الأقل';
    return result;
  }
  
  if (title.trim().length > 100) {
    result.error = 'عنوان المزاد يجب أن يكون أقل من 100 حرف';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate auction description
 * @param {string} description - Auction description
 * @returns {Object} Validation result
 */
export const validateAuctionDescription = (description) => {
  const result = { isValid: false, error: '' };
  
  if (!description || !description.trim()) {
    result.error = 'وصف المزاد مطلوب';
    return result;
  }
  
  if (description.trim().length < 20) {
    result.error = 'وصف المزاد يجب أن يكون 20 حرف على الأقل';
    return result;
  }
  
  if (description.trim().length > 2000) {
    result.error = 'وصف المزاد يجب أن يكون أقل من 2000 حرف';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate starting price
 * @param {number} price - Starting price
 * @returns {Object} Validation result
 */
export const validateStartingPrice = (price) => {
  const result = { isValid: false, error: '' };
  
  if (!price || isNaN(price)) {
    result.error = 'سعر البداية مطلوب';
    return result;
  }
  
  if (price <= 0) {
    result.error = 'سعر البداية يجب أن يكون أكبر من صفر';
    return result;
  }
  
  if (price > 1000000) {
    result.error = 'سعر البداية يجب أن يكون أقل من مليون ريال';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate minimum increment
 * @param {number} increment - Minimum increment
 * @param {number} startingPrice - Starting price for reference
 * @returns {Object} Validation result
 */
export const validateMinIncrement = (increment, startingPrice = 0) => {
  const result = { isValid: false, error: '' };
  
  if (!increment || isNaN(increment)) {
    result.error = 'أقل زيادة مطلوبة';
    return result;
  }
  
  if (increment <= 0) {
    result.error = 'أقل زيادة يجب أن تكون أكبر من صفر';
    return result;
  }
  
  if (startingPrice > 0 && increment > startingPrice * 0.5) {
    result.error = 'أقل زيادة كبيرة جداً بالنسبة لسعر البداية';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate auction dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {Object} Validation result
 */
export const validateAuctionDates = (startDate, endDate) => {
  const result = { isValid: false, error: '' };
  
  if (!startDate) {
    result.error = 'تاريخ البداية مطلوب';
    return result;
  }
  
  if (!endDate) {
    result.error = 'تاريخ النهاية مطلوب';
    return result;
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (start <= now) {
    result.error = 'تاريخ البداية يجب أن يكون في المستقبل';
    return result;
  }
  
  if (end <= start) {
    result.error = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    return result;
  }
  
  const duration = end.getTime() - start.getTime();
  const minDuration = 30 * 60 * 1000; // 30 minutes
  const maxDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  if (duration < minDuration) {
    result.error = 'مدة المزاد يجب أن تكون 30 دقيقة على الأقل';
    return result;
  }
  
  if (duration > maxDuration) {
    result.error = 'مدة المزاد يجب أن تكون أقل من 7 أيام';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = [],
    maxSize = 10 * 1024 * 1024, // 10MB
    minSize = 0,
    required = false
  } = options;
  
  const result = { isValid: false, error: '' };
  
  if (!file) {
    if (required) {
      result.error = 'الملف مطلوب';
      return result;
    }
    result.isValid = true;
    return result;
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    result.error = 'نوع الملف غير مدعوم';
    return result;
  }
  
  if (file.size > maxSize) {
    result.error = `حجم الملف كبير جداً. الحد الأقصى ${Math.floor(maxSize / 1024 / 1024)} ميجابايت`;
    return result;
  }
  
  if (file.size < minSize) {
    result.error = `حجم الملف صغير جداً. الحد الأدنى ${Math.floor(minSize / 1024)} كيلوبايت`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate comment text
 * @param {string} text - Comment text
 * @returns {Object} Validation result
 */
export const validateComment = (text) => {
  const result = { isValid: false, error: '' };
  
  if (!text || !text.trim()) {
    result.error = 'نص التعليق مطلوب';
    return result;
  }
  
  if (text.trim().length < 2) {
    result.error = 'التعليق قصير جداً';
    return result;
  }
  
  if (text.trim().length > 500) {
    result.error = 'التعليق طويل جداً (500 حرف كحد أقصى)';
    return result;
  }
  
  // Check for spam patterns
  const spamPatterns = [
    /(..)\1{4,}/g, // Repeated characters
    /^[A-Z\s!]{10,}$/g, // All caps
    /(.)\1{10,}/g // Character repeated too many times
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      result.error = 'التعليق يحتوي على نص غير مرغوب فيه';
      return result;
    }
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {Object} Validation result
 */
export const validateSearchQuery = (query) => {
  const result = { isValid: false, error: '' };
  
  if (!query || !query.trim()) {
    result.error = 'كلمة البحث مطلوبة';
    return result;
  }
  
  if (query.trim().length < 2) {
    result.error = 'كلمة البحث قصيرة جداً';
    return result;
  }
  
  if (query.trim().length > 100) {
    result.error = 'كلمة البحث طويلة جداً';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate username
 * @param {string} username - Username
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  const result = { isValid: false, error: '' };
  
  if (!username || !username.trim()) {
    result.error = 'اسم المستخدم مطلوب';
    return result;
  }
  
  if (username.length < 3) {
    result.error = 'اسم المستخدم قصير جداً (3 أحرف كحد أدنى)';
    return result;
  }
  
  if (username.length > 30) {
    result.error = 'اسم المستخدم طويل جداً (30 حرف كحد أقصى)';
    return result;
  }
  
  if (!/^[a-zA-Z0-9_\u0600-\u06FF]+$/.test(username)) {
    result.error = 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * Validate form data
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  for (const field in rules) {
    const fieldRules = rules[field];
    const value = data[field];
    
    for (const rule of fieldRules) {
      let result;
      
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && !value.trim())) {
            result = { isValid: false, error: rule.message || `${field} مطلوب` };
          } else {
            result = { isValid: true };
          }
          break;
          
        case 'email':
          result = validateEmail(value);
          break;
          
        case 'phone':
          result = validatePhone(value, rule.countryCode);
          break;
          
        case 'minLength':
          if (value && value.length < rule.value) {
            result = { isValid: false, error: rule.message || `الحد الأدنى ${rule.value} أحرف` };
          } else {
            result = { isValid: true };
          }
          break;
          
        case 'maxLength':
          if (value && value.length > rule.value) {
            result = { isValid: false, error: rule.message || `الحد الأقصى ${rule.value} حرف` };
          } else {
            result = { isValid: true };
          }
          break;
          
        case 'min':
          if (value && value < rule.value) {
            result = { isValid: false, error: rule.message || `الحد الأدنى ${rule.value}` };
          } else {
            result = { isValid: true };
          }
          break;
          
        case 'max':
          if (value && value > rule.value) {
            result = { isValid: false, error: rule.message || `الحد الأقصى ${rule.value}` };
          } else {
            result = { isValid: true };
          }
          break;
          
        case 'pattern':
          if (value && !rule.value.test(value)) {
            result = { isValid: false, error: rule.message || 'التنسيق غير صحيح' };
          } else {
            result = { isValid: true };
          }
          break;
          
        default:
          result = { isValid: true };
      }
      
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  }
  
  return { isValid, errors };
};