/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني
 * @returns {Object} نتيجة التحقق
 */
const validateEmail = (email) => {
  const result = {
    valid: false,
    message: '',
    errors: []
  };

  // التحقق من وجود القيمة
  if (!email) {
    result.message = 'البريد الإلكتروني مطلوب';
    result.errors.push('required');
    return result;
  }

  // التحقق من النوع
  if (typeof email !== 'string') {
    result.message = 'البريد الإلكتروني يجب أن يكون نصاً';
    result.errors.push('type');
    return result;
  }

  // التحقق من الطول
  if (email.length > 254) {
    result.message = 'البريد الإلكتروني طويل جداً (الحد الأقصى 254 حرف)';
    result.errors.push('maxLength');
    return result;
  }

  // تنظيف البريد الإلكتروني
  const cleanEmail = email.trim().toLowerCase();

  // نمط التحقق من البريد الإلكتروني المحسن
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(cleanEmail)) {
    result.message = 'تنسيق البريد الإلكتروني غير صحيح';
    result.errors.push('format');
    return result;
  }

  // التحقق من النقاط المتتالية
  if (cleanEmail.includes('..')) {
    result.message = 'البريد الإلكتروني لا يمكن أن يحتوي على نقطتين متتاليتين';
    result.errors.push('consecutiveDots');
    return result;
  }

  // التحقق من النقطة في بداية أو نهاية الجزء المحلي
  const localPart = cleanEmail.split('@')[0];
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    result.message = 'البريد الإلكتروني لا يمكن أن يبدأ أو ينتهي بنقطة';
    result.errors.push('dotPosition');
    return result;
  }

  // قائمة النطاقات المحظورة (المؤقتة)
  const forbiddenDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com'
  ];
  
  const domain = cleanEmail.split('@')[1];
  if (forbiddenDomains.includes(domain)) {
    result.message = 'هذا النطاق غير مسموح';
    result.errors.push('forbiddenDomain');
    return result;
  }

  result.valid = true;
  result.message = 'البريد الإلكتروني صحيح';
  return result;
};

/**
 * التحقق من صحة كلمة المرور
 * @param {string} password - كلمة المرور
 * @param {Object} options - خيارات التحقق
 * @returns {Object} نتيجة التحقق
 */
const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    allowArabic = true,
    forbidCommon = true
  } = options;

  const result = {
    valid: false,
    message: '',
    errors: [],
    strength: 'weak'
  };

  // التحقق من وجود القيمة
  if (!password) {
    result.message = 'كلمة المرور مطلوبة';
    result.errors.push('required');
    return result;
  }

  // التحقق من النوع
  if (typeof password !== 'string') {
    result.message = 'كلمة المرور يجب أن تكون نصاً';
    result.errors.push('type');
    return result;
  }

  // التحقق من الطول الأدنى
  if (password.length < minLength) {
    result.message = `كلمة المرور يجب أن تكون على الأقل ${minLength} أحرف`;
    result.errors.push('minLength');
    return result;
  }

  // التحقق من الطول الأقصى
  if (password.length > maxLength) {
    result.message = `كلمة المرور يجب ألا تتجاوز ${maxLength} حرف`;
    result.errors.push('maxLength');
    return result;
  }

  let strengthScore = 0;
  const requirements = [];

  // التحقق من الأحرف الكبيرة
  if (requireUppercase) {
    if (!/[A-Z]/.test(password)) {
      requirements.push('حرف كبير واحد على الأقل');
      result.errors.push('noUppercase');
    } else {
      strengthScore += 1;
    }
  }

  // التحقق من الأحرف الصغيرة
  if (requireLowercase) {
    if (!/[a-z]/.test(password)) {
      requirements.push('حرف صغير واحد على الأقل');
      result.errors.push('noLowercase');
    } else {
      strengthScore += 1;
    }
  }

  // التحقق من الأرقام
  if (requireNumbers) {
    if (!/[0-9]/.test(password)) {
      requirements.push('رقم واحد على الأقل');
      result.errors.push('noNumbers');
    } else {
      strengthScore += 1;
    }
  }

  // التحقق من الرموز الخاصة
  if (requireSpecialChars) {
    if (!/[!@#$%^&*(),.?":{}|<>_+=\-\[\]\\;'`~]/.test(password)) {
      requirements.push('رمز خاص واحد على الأقل (!@#$%^&* إلخ)');
      result.errors.push('noSpecialChars');
    } else {
      strengthScore += 1;
    }
  }

  // السماح بالأحرف العربية
  if (allowArabic) {
    if (/[\u0600-\u06FF]/.test(password)) {
      strengthScore += 0.5;
    }
  }

  // التحقق من كلمات المرور الشائعة
  if (forbidCommon) {
    const commonPasswords = [
      '12345678', 'password', '123456789', '12345', '1234567',
      'password123', '123456', 'qwertyuiop', 'qwerty123', 'admin123',
      'password1', '123123123', 'aaaaaaaaa', '111111111', '000000000'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      result.message = 'كلمة المرور شائعة جداً، يرجى اختيار كلمة مرور أقوى';
      result.errors.push('commonPassword');
      return result;
    }
  }

  // التحقق من الأنماط الضعيفة
  if (/^(.)\1{7,}$/.test(password)) { // تكرار نفس الحرف
    result.message = 'كلمة المرور لا يمكن أن تحتوي على نفس الحرف متكرراً';
    result.errors.push('repetitiveChars');
    return result;
  }

  if (/^(012|123|234|345|456|567|678|789|890)+$/.test(password)) { // تسلسل أرقام
    result.message = 'كلمة المرور لا يمكن أن تكون تسلسلاً من الأرقام';
    result.errors.push('sequentialNumbers');
    return result;
  }

  // إذا لم تتحقق جميع المتطلبات
  if (result.errors.length > 0) {
    result.message = `كلمة المرور يجب أن تحتوي على: ${requirements.join('، ')}`;
    return result;
  }

  // تحديد قوة كلمة المرور
  if (strengthScore >= 4) {
    result.strength = 'strong';
  } else if (strengthScore >= 3) {
    result.strength = 'medium';
  } else {
    result.strength = 'weak';
  }

  result.valid = true;
  result.message = 'كلمة المرور صحيحة';
  return result;
};

/**
 * التحقق من صحة رقم الهاتف
 * @param {string} phone - رقم الهاتف
 * @param {Object} options - خيارات التحقق
 * @returns {Object} نتيجة التحقق
 */
const validatePhone = (phone, options = {}) => {
  const {
    requireCountryCode = true,
    allowedCountries = ['SA', 'AE', 'EG', 'JO', 'LB', 'SY', 'IQ', 'KW', 'QA', 'BH', 'OM'],
    format = 'international' // international, national, e164
  } = options;

  const result = {
    valid: false,
    message: '',
    errors: [],
    formatted: null,
    country: null
  };

  // التحقق من وجود القيمة
  if (!phone) {
    result.message = 'رقم الهاتف مطلوب';
    result.errors.push('required');
    return result;
  }

  // التحقق من النوع
  if (typeof phone !== 'string') {
    result.message = 'رقم الهاتف يجب أن يكون نصاً';
    result.errors.push('type');
    return result;
  }

  // تنظيف رقم الهاتف
  let cleanPhone = phone.replace(/[^+\d]/g, ''); // إزالة جميع الأحرف عدا الأرقام والـ +

  // التحقق من الطول
  if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    result.message = 'رقم الهاتف غير صحيح (يجب أن يكون بين 8-15 رقم)';
    result.errors.push('length');
    return result;
  }

  // أنماط أرقام الهواتف للدول العربية
  const phonePatterns = {
    SA: /^(\+966|966|0)?(1|5)[0-9]{8}$/, // السعودية
    AE: /^(\+971|971|0)?(2|3|4|6|7|9|50|51|52|54|55|56|58)[0-9]{7}$/, // الإمارات
    EG: /^(\+20|20|0)?(1)[0-9]{9}$/, // مصر
    JO: /^(\+962|962|0)?(7|77|78|79)[0-9]{7}$/, // الأردن
    LB: /^(\+961|961|0)?(3|70|71|76|78|79|81)[0-9]{6}$/, // لبنان
    KW: /^(\+965|965)?(2|5|6|9)[0-9]{7}$/, // الكويت
    QA: /^(\+974|974)?(3|5|6|7)[0-9]{7}$/, // قطر
    BH: /^(\+973|973)?(3|6)[0-9]{7}$/, // البحرين
    OM: /^(\+968|968)?(9)[0-9]{7}$/ // عمان
  };

  let matchedCountry = null;
  let isValidFormat = false;

  // التحقق من التطابق مع أنماط الدول المسموحة
  for (const country of allowedCountries) {
    if (phonePatterns[country] && phonePatterns[country].test(cleanPhone)) {
      matchedCountry = country;
      isValidFormat = true;
      break;
    }
  }

  if (!isValidFormat) {
    result.message = 'تنسيق رقم الهاتف غير صحيح أو غير مدعوم';
    result.errors.push('format');
    return result;
  }

  // التحقق من رمز الدولة إذا كان مطلوباً
  if (requireCountryCode && !cleanPhone.startsWith('+')) {
    result.message = 'رقم الهاتف يجب أن يبدأ برمز الدولة (+)';
    result.errors.push('countryCode');
    return result;
  }

  // تنسيق رقم الهاتف
  let formattedPhone = cleanPhone;
  
  // إضافة رمز الدولة إذا لم يكن موجوداً
  if (!formattedPhone.startsWith('+')) {
    const countryCodes = {
      SA: '+966',
      AE: '+971',
      EG: '+20',
      JO: '+962',
      LB: '+961',
      KW: '+965',
      QA: '+974',
      BH: '+973',
      OM: '+968'
    };
    
    if (matchedCountry && countryCodes[matchedCountry]) {
      // إزالة الصفر البادئ إذا كان موجوداً
      let nationalNumber = formattedPhone;
      if (nationalNumber.startsWith('0')) {
        nationalNumber = nationalNumber.substring(1);
      }
      formattedPhone = countryCodes[matchedCountry] + nationalNumber;
    }
  }

  result.valid = true;
  result.message = 'رقم الهاتف صحيح';
  result.formatted = formattedPhone;
  result.country = matchedCountry;
  return result;
};

/**
 * التحقق من صحة اسم المستخدم
 * @param {string} username - اسم المستخدم
 * @param {Object} options - خيارات التحقق
 * @returns {Object} نتيجة التحقق
 */
const validateUsername = (username, options = {}) => {
  const {
    minLength = 3,
    maxLength = 30,
    allowNumbers = true,
    allowUnderscores = true,
    allowDots = true,
    allowArabic = false,
    caseSensitive = false
  } = options;

  const result = {
    valid: false,
    message: '',
    errors: []
  };

  // التحقق من وجود القيمة
  if (!username) {
    result.message = 'اسم المستخدم مطلوب';
    result.errors.push('required');
    return result;
  }

  // التحقق من النوع
  if (typeof username !== 'string') {
    result.message = 'اسم المستخدم يجب أن يكون نصاً';
    result.errors.push('type');
    return result;
  }

  // تنظيف اسم المستخدم
  const cleanUsername = caseSensitive ? username.trim() : username.trim().toLowerCase();

  // التحقق من الطول
  if (cleanUsername.length < minLength) {
    result.message = `اسم المستخدم يجب أن يكون على الأقل ${minLength} أحرف`;
    result.errors.push('minLength');
    return result;
  }

  if (cleanUsername.length > maxLength) {
    result.message = `اسم المستخدم يجب ألا يتجاوز ${maxLength} حرف`;
    result.errors.push('maxLength');
    return result;
  }

  // التحقق من البداية والنهاية
  if (!/^[a-zA-Z]/.test(cleanUsername)) {
    result.message = 'اسم المستخدم يجب أن يبدأ بحرف';
    result.errors.push('startWithLetter');
    return result;
  }

  if (!/[a-zA-Z0-9]$/.test(cleanUsername)) {
    result.message = 'اسم المستخدم يجب أن ينتهي بحرف أو رقم';
    result.errors.push('endWithAlphanumeric');
    return result;
  }

  // بناء النمط المسموح
  let allowedPattern = 'a-zA-Z';
  if (allowNumbers) allowedPattern += '0-9';
  if (allowUnderscores) allowedPattern += '_';
  if (allowDots) allowedPattern += '\\.';
  if (allowArabic) allowedPattern += '\u0600-\u06FF';

  const regex = new RegExp(`^[${allowedPattern}]+$`);
  if (!regex.test(cleanUsername)) {
    result.message = 'اسم المستخدم يحتوي على أحرف غير مسموحة';
    result.errors.push('invalidChars');
    return result;
  }

  // التحقق من النقاط المتتالية
  if (allowDots && cleanUsername.includes('..')) {
    result.message = 'اسم المستخدم لا يمكن أن يحتوي على نقطتين متتاليتين';
    result.errors.push('consecutiveDots');
    return result;
  }

  // التحقق من الشرطات السفلية المتتالية
  if (allowUnderscores && cleanUsername.includes('__')) {
    result.message = 'اسم المستخدم لا يمكن أن يحتوي على شرطتين سفليتين متتاليتين';
    result.errors.push('consecutiveUnderscores');
    return result;
  }

  // قائمة أسماء المستخدمين المحجوزة
  const reservedUsernames = [
    'admin', 'administrator', 'root', 'api', 'www', 'ftp', 'mail',
    'email', 'user', 'users', 'account', 'accounts', 'profile', 'profiles',
    'settings', 'config', 'help', 'support', 'about', 'contact', 'info',
    'blog', 'news', 'forum', 'shop', 'store', 'buy', 'sell', 'auction',
    'bid', 'bids', 'seller', 'buyer', 'payment', 'checkout', 'cart',
    'signin', 'signup', 'login', 'logout', 'register', 'auth'
  ];

  if (reservedUsernames.includes(cleanUsername)) {
    result.message = 'اسم المستخدم محجوز، يرجى اختيار اسم آخر';
    result.errors.push('reserved');
    return result;
  }

  result.valid = true;
  result.message = 'اسم المستخدم صحيح';
  return result;
};

/**
 * التحقق من صحة الاسم الكامل
 * @param {string} fullName - الاسم الكامل
 * @param {Object} options - خيارات التحقق
 * @returns {Object} نتيجة التحقق
 */
const validateFullName = (fullName, options = {}) => {
  const {
    minLength = 2,
    maxLength = 100,
    allowNumbers = false,
    allowSpecialChars = false,
    allowArabic = true,
    allowEnglish = true,
    requireMultipleWords = true
  } = options;

  const result = {
    valid: false,
    message: '',
    errors: []
  };

  // التحقق من وجود القيمة
  if (!fullName) {
    result.message = 'الاسم الكامل مطلوب';
    result.errors.push('required');
    return result;
  }

  // التحقق من النوع
  if (typeof fullName !== 'string') {
    result.message = 'الاسم الكامل يجب أن يكون نصاً';
    result.errors.push('type');
    return result;
  }

  // تنظيف الاسم
  const cleanName = fullName.trim().replace(/\s+/g, ' ');

  // التحقق من الطول
  if (cleanName.length < minLength) {
    result.message = `الاسم الكامل يجب أن يكون على الأقل ${minLength} أحرف`;
    result.errors.push('minLength');
    return result;
  }

  if (cleanName.length > maxLength) {
    result.message = `الاسم الكامل يجب ألا يتجاوز ${maxLength} حرف`;
    result.errors.push('maxLength');
    return result;
  }

  // التحقق من عدد الكلمات
  const words = cleanName.split(' ');
  if (requireMultipleWords && words.length < 2) {
    result.message = 'الاسم الكامل يجب أن يحتوي على اسمين على الأقل';
    result.errors.push('multipleWords');
    return result;
  }

  // بناء النمط المسموح
  let allowedPattern = '';
  if (allowEnglish) allowedPattern += 'a-zA-Z';
  if (allowArabic) allowedPattern += '\u0600-\u06FF';
  if (allowNumbers) allowedPattern += '0-9';
  if (allowSpecialChars) allowedPattern += '\\-\\.';
  allowedPattern += '\\s'; // السماح بالمسافات

  const regex = new RegExp(`^[${allowedPattern}]+$`);
  if (!regex.test(cleanName)) {
    result.message = 'الاسم الكامل يحتوي على أحرف غير مسموحة';
    result.errors.push('invalidChars');
    return result;
  }

  // التحقق من أن كل كلمة تبدأ بحرف
  const invalidWords = words.filter(word => !/^[a-zA-Z\u0600-\u06FF]/.test(word));
  if (invalidWords.length > 0) {
    result.message = 'كل كلمة في الاسم يجب أن تبدأ بحرف';
    result.errors.push('wordStartsWithLetter');
    return result;
  }

  result.valid = true;
  result.message = 'الاسم الكامل صحيح';
  return result;
};

/**
 * التحقق من صحة عنوان URL
 * @param {string} url - الرابط
 * @param {Object} options - خيارات التحقق
 * @returns {Object} نتيجة التحقق
 */
const validateURL = (url, options = {}) => {
  const {
    requireProtocol = true,
    allowedProtocols = ['http', 'https'],
    allowLocalhost = false,
    requireDomain = true
  } = options;

  const result = {
    valid: false,
    message: '',
    errors: []
  };

  // التحقق من وجود القيمة
  if (!url) {
    result.message = 'الرابط مطلوب';
    result.errors.push('required');
    return result;
  }

  // التحقق من النوع
  if (typeof url !== 'string') {
    result.message = 'الرابط يجب أن يكون نصاً';
    result.errors.push('type');
    return result;
  }

  try {
    const parsedURL = new URL(url);

    // التحقق من البروتوكول
    if (requireProtocol && !allowedProtocols.includes(parsedURL.protocol.slice(0, -1))) {
      result.message = `البروتوكول غير مدعوم. البروتوكولات المسموحة: ${allowedProtocols.join('، ')}`;
      result.errors.push('protocol');
      return result;
    }

    // التحقق من localhost
    if (!allowLocalhost && (parsedURL.hostname === 'localhost' || parsedURL.hostname === '127.0.0.1')) {
      result.message = 'الروابط المحلية غير مسموحة';
      result.errors.push('localhost');
      return result;
    }

    // التحقق من وجود النطاق
    if (requireDomain && !parsedURL.hostname) {
      result.message = 'الرابط يجب أن يحتوي على نطاق صحيح';
      result.errors.push('domain');
      return result;
    }

    result.valid = true;
    result.message = 'الرابط صحيح';
    return result;

  } catch (error) {
    result.message = 'تنسيق الرابط غير صحيح';
    result.errors.push('format');
    return result;
  }
};

/**
 * دالة تحقق عامة من البيانات
 * @param {Object} data - البيانات المراد التحقق منها
 * @param {Object} rules - قواعد التحقق
 * @returns {Object} نتيجة التحقق
 */
const validateData = (data, rules) => {
  const result = {
    valid: true,
    errors: {},
    messages: []
  };

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];
    let fieldValid = true;
    const fieldErrors = [];

    for (const rule of fieldRules) {
      let validation;
      
      switch (rule.type) {
        case 'email':
          validation = validateEmail(value);
          break;
        case 'password':
          validation = validatePassword(value, rule.options);
          break;
        case 'phone':
          validation = validatePhone(value, rule.options);
          break;
        case 'username':
          validation = validateUsername(value, rule.options);
          break;
        case 'fullName':
          validation = validateFullName(value, rule.options);
          break;
        case 'url':
          validation = validateURL(value, rule.options);
          break;
        default:
          continue;
      }

      if (!validation.valid) {
        fieldValid = false;
        fieldErrors.push(validation.message);
        result.valid = false;
      }
    }

    if (!fieldValid) {
      result.errors[field] = fieldErrors;
      result.messages.push(`${field}: ${fieldErrors.join('، ')}`);
    }
  }

  return result;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
  validateFullName,
  validateURL,
  validateData
};