import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Settings, Heart, Eye, TrendingUp, Calendar, Award, Camera } from 'lucide-react';
import Layout from '../layouts/MainLayout';
import ProfileInfo from '../components/ProfileInfo';
import MyBids from '../components/MyBids';
import MyFollows from '../components/MyFollows';
import AccountSettings from '../components/AccountSettings';
import { useProfile } from '../hooks/useProfile';
import { useAuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState('info');
  
  const { 
    profile, 
    stats, 
    loading, 
    error,
    fetchProfile,
    updateProfile,
    isOwnProfile
  } = useProfile(userId);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else if (currentUser) {
      navigate(`/profile/${currentUser.id}`);
    } else {
      navigate('/login');
    }
  }, [userId, currentUser]);

  const tabs = [
    {
      id: 'info',
      label: 'المعلومات الشخصية',
      icon: User,
      component: ProfileInfo
    },
    {
      id: 'bids',
      label: 'مزايداتي',
      icon: TrendingUp,
      component: MyBids,
      count: stats?.totalBids || 0,
      visible: isOwnProfile || true
    },
    {
      id: 'follows',
      label: 'المتابعات',
      icon: Heart,
      component: MyFollows,
      count: stats?.totalFollows || 0
    },
    {
      id: 'settings',
      label: 'إعدادات الحساب',
      icon: Settings,
      component: AccountSettings,
      visible: isOwnProfile
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Profile Header Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
                <div className="flex gap-4">
                  <div className="h-16 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex gap-4 mb-6 overflow-x-auto">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse flex-shrink-0"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">خطأ في تحميل الملف الشخصي</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchProfile()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">المستخدم غير موجود</h3>
            <p className="text-gray-600 mb-4">لا يمكن العثور على هذا المستخدم</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const visibleTabs = tabs.filter(tab => tab.visible !== false);
  const ActiveComponent = visibleTabs.find(tab => tab.id === activeTab)?.component || ProfileInfo;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {profile.name?.charAt(0) || 'م'}
                  </span>
                )}
              </div>
              {isOwnProfile && (
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {profile.name || 'مستخدم'}
                  </h1>
                  <p className="text-gray-600 mb-2">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-gray-700 max-w-2xl leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>
                
                {!isOwnProfile && (
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      متابعة
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      رسالة
                    </button>
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats?.totalBids || 0}
                  </div>
                  <div className="text-sm text-blue-700">مزايدة</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {stats?.wonBids || 0}
                  </div>
                  <div className="text-sm text-green-700">فوز</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {stats?.totalFollows || 0}
                  </div>
                  <div className="text-sm text-purple-700">متابعة</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    {stats?.profileViews || 0}
                  </div>
                  <div className="text-sm text-amber-700">مشاهدة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {visibleTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Tab Content */}
          <div className="min-h-[400px]">
            <ActiveComponent 
              profile={profile}
              stats={stats}
              onUpdate={updateProfile}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;