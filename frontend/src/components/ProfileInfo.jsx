import React, { useState } from 'react';
import { Edit, Save, X, MapPin, Calendar, Mail, Phone, Globe, Award, Star, TrendingUp } from 'lucide-react';

const ProfileInfo = ({ profile, stats, onUpdate, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    phone: profile?.phone || '',
    website: profile?.website || ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      phone: profile?.phone || '',
      website: profile?.website || ''
    });
    setIsEditing(false);
  };

  const InfoItem = ({ icon: Icon, label, value, editable = false, type = 'text', name }) => {
    if (isEditing && editable && isOwnProfile) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Icon className="w-4 h-4" />
            {label}
          </label>
          {type === 'textarea' ? (
            <textarea
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={`أدخل ${label}`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`أدخل ${label}`}
            />
          )}
        </div>
      );
    }

    if (!value && !isOwnProfile) return null;

    return (
      <div className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
          <div className="text-gray-800">
            {value || (
              <span className="text-gray-400 italic">
                {isOwnProfile ? `لم يتم إضافة ${label.toLowerCase()} بعد` : 'غير محدد'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const achievements = [
    {
      icon: Award,
      title: 'مزايد متميز',
      description: 'حقق أكثر من 50 مزايدة ناجحة',
      earned: (stats?.wonBids || 0) >= 50,
      progress: Math.min((stats?.wonBids || 0) / 50 * 100, 100)
    },
    {
      icon: Star,
      title: 'نجم المنصة',
      description: 'حصل على تقييم 5 نجوم',
      earned: (profile?.rating || 0) >= 4.5,
      progress: Math.min((profile?.rating || 0) / 5 * 100, 100)
    },
    {
      icon: TrendingUp,
      title: 'مزايد نشط',
      description: 'شارك في أكثر من 100 مزاد',
      earned: (stats?.totalBids || 0) >= 100,
      progress: Math.min((stats?.totalBids || 0) / 100 * 100, 100)
    }
  ];

  return (
    <div className="space-y-8">
      {/* Edit Controls */}
      {isOwnProfile && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">المعلومات الشخصية</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'حفظ...' : 'حفظ'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                إلغاء
              </button>
            </div>
          )}
        </div>
      )}

      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <InfoItem
          icon={Edit}
          label="الاسم الكامل"
          value={profile?.name}
          editable={true}
          name="name"
        />
        
        <InfoItem
          icon={Mail}
          label="البريد الإلكتروني"
          value={profile?.email}
          editable={false}
        />
        
        <InfoItem
          icon={Phone}
          label="رقم الهاتف"
          value={profile?.phone}
          editable={true}
          name="phone"
        />
        
        <InfoItem
          icon={MapPin}
          label="الموقع"
          value={profile?.location}
          editable={true}
          name="location"
        />
        
        <InfoItem
          icon={Globe}
          label="الموقع الإلكتروني"
          value={profile?.website}
          editable={true}
          name="website"
          type="url"
        />
        
        <InfoItem
          icon={Calendar}
          label="تاريخ الانضمام"
          value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('ar-SA') : null}
          editable={false}
        />
      </div>

      {/* Bio */}
      <InfoItem
        icon={Edit}
        label="النبذة الشخصية"
        value={profile?.bio}
        editable={true}
        type="textarea"
        name="bio"
      />

      {/* Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">الإحصائيات</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {stats?.totalBids || 0}
              </span>
            </div>
            <p className="text-sm text-blue-700">إجمالي المزايدات</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {stats?.wonBids || 0}
              </span>
            </div>
            <p className="text-sm text-green-700">المزايدات الرابحة</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-6 h-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {(profile?.rating || 0).toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-purple-700">التقييم العام</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🏆</span>
              <span className="text-2xl font-bold text-amber-600">
                {achievements.filter(a => a.earned).length}
              </span>
            </div>
            <p className="text-sm text-amber-700">الإنجازات المحققة</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">الإنجازات</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div key={index} className={`p-6 rounded-xl border-2 transition-all ${
                achievement.earned 
                  ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100'
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.earned
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${
                      achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                  </div>
                </div>
                
                <p className={`text-sm mb-3 ${
                  achievement.earned ? 'text-yellow-700' : 'text-gray-600'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      achievement.earned ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                
                <div className={`text-xs mt-2 text-center ${
                  achievement.earned ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {achievement.earned ? 'مُحقق ✨' : `${achievement.progress.toFixed(0)}%`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">النشاط الأخير</h3>
        <div className="space-y-4">
          {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{activity.description}</p>
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>لا يوجد نشاط حديث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;