import React, { useState } from 'react';
import { Settings, Bell, Shield, Eye, Trash2, Key, Mail, Phone, Globe, Save, AlertTriangle } from 'lucide-react';

const AccountSettings = ({ profile, onUpdate, isOwnProfile }) => {
  const [activeSection, setActiveSection] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      auctionStart: true,
      auctionEnd: true,
      bidOutbid: true,
      bidWon: true,
      newMessage: true,
      newComment: false,
      newFollower: true,
      systemUpdates: false,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'public', // public, private, followers
      showBiddingHistory: true,
      showFollowers: true,
      showFollowing: true,
      allowMessages: true,
      allowComments: true,
      showOnline: true,
      showLastSeen: false
    },
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30, // minutes
      allowMultipleSessions: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // في التطبيق الحقيقي، سيتم حفظ الإعدادات عبر API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
      alert('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ في حفظ الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      // في التطبيق الحقيقي، سيتم تغيير كلمة المرور عبر API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password change requested');
      alert('تم تغيير كلمة المرور بنجاح!');
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('حدث خطأ في تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // في التطبيق الحقيقي، سيتم حذف الحساب عبر API مع تأكيد إضافي
    alert('ميزة حذف الحساب ستكون متاحة قريباً');
    setShowDeleteModal(false);
  };

  if (!isOwnProfile) {
    return (
      <div className="text-center py-8">
        <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-600 mb-2">غير مسموح</h3>
        <p className="text-gray-500">لا يمكنك عرض إعدادات حساب المستخدمين الآخرين</p>
      </div>
    );
  }

  const sections = [
    {
      id: 'notifications',
      label: 'الإشعارات',
      icon: Bell,
      description: 'إدارة إشعارات البريد الإلكتروني والتطبيق'
    },
    {
      id: 'privacy',
      label: 'الخصوصية',
      icon: Eye,
      description: 'التحكم في من يمكنه رؤية معلوماتك'
    },
    {
      id: 'security',
      label: 'الأمان',
      icon: Shield,
      description: 'إعدادات كلمة المرور والأمان'
    },
    {
      id: 'account',
      label: 'إدارة الحساب',
      icon: Settings,
      description: 'إعدادات الحساب العامة'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">إعدادات الحساب</h2>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg text-right transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{section.label}</div>
                    <div className={`text-sm ${
                      activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">إعدادات الإشعارات</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-800">إشعارات البريد الإلكتروني</div>
                          <div className="text-sm text-gray-600">استقبال إشعارات عبر البريد الإلكتروني</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-800">إشعارات SMS</div>
                          <div className="text-sm text-gray-600">استقبال إشعارات عبر الرسائل النصية</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-800">إشعارات التطبيق</div>
                          <div className="text-sm text-gray-600">استقبال إشعارات داخل التطبيق</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-4">إشعارات المزادات</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: 'auctionStart', label: 'بداية المزاد', desc: 'عند بدء المزادات التي تتابعها' },
                      { key: 'auctionEnd', label: 'نهاية المزاد', desc: 'عند اقتراب انتهاء المزاد' },
                      { key: 'bidOutbid', label: 'تجاوز المزايدة', desc: 'عند تجاوز مزايدتك' },
                      { key: 'bidWon', label: 'الفوز بالمزاد', desc: 'عند فوزك في المزاد' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key]}
                            onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-4">إشعارات اجتماعية</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: 'newMessage', label: 'رسائل جديدة', desc: 'عند وصول رسائل جديدة' },
                      { key: 'newComment', label: 'تعليقات جديدة', desc: 'عند إضافة تعليقات على مزاداتك' },
                      { key: 'newFollower', label: 'متابع جديد', desc: 'عند حصولك على متابع جديد' },
                      { key: 'marketingEmails', label: 'رسائل تسويقية', desc: 'عروض وأخبار المنصة' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key]}
                            onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">إعدادات الخصوصية</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block font-medium text-gray-800 mb-2">مستوى ظهور الملف الشخصي</label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="public">عام - يمكن للجميع رؤية ملفي الشخصي</option>
                        <option value="followers">للمتابعين - يمكن للمتابعين فقط رؤية التفاصيل</option>
                        <option value="private">خاص - مخفي عن الجميع</option>
                      </select>
                    </div>

                    {[
                      { key: 'showBiddingHistory', label: 'إظهار تاريخ المزايدات', desc: 'السماح للآخرين برؤية مزايداتي' },
                      { key: 'showFollowers', label: 'إظهار المتابعين', desc: 'السماح للآخرين برؤية من يتابعني' },
                      { key: 'showFollowing', label: 'إظهار المتابَعين', desc: 'السماح للآخرين برؤية من أتابعهم' },
                      { key: 'allowMessages', label: 'السماح بالرسائل', desc: 'السماح للآخرين بإرسال رسائل لي' },
                      { key: 'allowComments', label: 'السماح بالتعليقات', desc: 'السماح للآخرين بالتعليق على مزاداتي' },
                      { key: 'showOnline', label: 'إظهار حالة الاتصال', desc: 'إظهار ما إذا كنت متصلاً الآن' },
                      { key: 'showLastSeen', label: 'إظهار آخر ظهور', desc: 'إظهار متى كانت آخر مرة ظهرت فيها' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy[item.key]}
                            onChange={(e) => handleSettingChange('privacy', item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">إعدادات الأمان</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-800">المصادقة الثنائية</div>
                            <div className="text-sm text-gray-600">طبقة حماية إضافية لحسابك</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorEnabled}
                            onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {settings.security.twoFactorEnabled && (
                        <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                          <p className="mb-2">المصادقة الثنائية مُفعَّلة. ستحتاج لرمز التحقق عند تسجيل الدخول.</p>
                          <button className="text-blue-600 hover:text-blue-800 underline">
                            إعداد تطبيق المصادقة
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-800">كلمة المرور</div>
                          <div className="text-sm text-gray-600">آخر تغيير: منذ 3 أشهر</div>
                        </div>
                        <button
                          onClick={() => setShowChangePassword(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Key className="w-4 h-4" />
                          تغيير كلمة المرور
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-800">إشعارات تسجيل الدخول</div>
                        <div className="text-sm text-gray-600">تلقي إشعار عند تسجيل الدخول من جهاز جديد</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.loginNotifications}
                          onChange={(e) => handleSettingChange('security', 'loginNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block font-medium text-gray-800 mb-2">انتهاء صلاحية الجلسة</label>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={15}>15 دقيقة</option>
                        <option value={30}>30 دقيقة</option>
                        <option value={60}>ساعة واحدة</option>
                        <option value={120}>ساعتان</option>
                        <option value={0}>لا تنتهي صلاحيتها</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-800">السماح بعدة جلسات</div>
                        <div className="text-sm text-gray-600">السماح بتسجيل الدخول من أجهزة متعددة</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.allowMultipleSessions}
                          onChange={(e) => handleSettingChange('security', 'allowMultipleSessions', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Management */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">إدارة الحساب</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div className="font-medium text-gray-800">البريد الإلكتروني</div>
                      </div>
                      <div className="text-gray-700 mb-2">{profile?.email}</div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                        تغيير البريد الإلكتروني
                      </button>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div className="font-medium text-gray-800">رقم الهاتف</div>
                      </div>
                      <div className="text-gray-700 mb-2">
                        {profile?.phone || 'لم يتم إضافة رقم هاتف'}
                      </div>
                      <button className="text-green-600 hover:text-green-800 text-sm underline">
                        {profile?.phone ? 'تغيير' : 'إضافة'} رقم الهاتف
                      </button>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <div className="font-medium text-gray-800">تصدير البيانات</div>
                      </div>
                      <p className="text-gray-700 mb-3">
                        يمكنك تحميل نسخة من جميع بياناتك على المنصة
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Globe className="w-4 h-4" />
                        تحميل البيانات
                      </button>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div className="font-medium text-gray-800">منطقة الخطر</div>
                      </div>
                      <p className="text-gray-700 mb-4">
                        حذف الحساب نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف الحساب
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">تغيير كلمة المرور</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={8}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={8}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'جارٍ التغيير...' : 'تغيير كلمة المرور'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد حذف الحساب</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من رغبتك في حذف حسابك نهائياً؟ 
                سيتم حذف جميع بياناتك ولن يمكن استرجاعها.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  نعم، احذف الحساب
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;