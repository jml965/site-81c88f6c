import { useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuthContext();
  
  const isOwnProfile = !userId || userId === currentUser?.id;

  // Mock API calls - في التطبيق الحقيقي سيتم استبدالها بـ API حقيقي
  const mockProfileData = {
    id: userId || currentUser?.id,
    name: 'أحمد محمد السالم',
    username: 'ahmed_salem',
    email: 'ahmed.salem@example.com',
    phone: '+966501234567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'مهتم بالمزادات والسيارات الكلاسيكية، خبرة أكثر من 10 سنوات في المزادات العقارية والسيارات الفاخرة. أسعى دائماً للحصول على أفضل الصفقات.',
    location: 'الرياض، المملكة العربية السعودية',
    website: 'https://ahmed-salem.com',
    rating: 4.8,
    createdAt: '2023-01-15T10:30:00Z',
    lastSeen: '2024-01-20T14:25:00Z',
    isVerified: true,
    isOnline: true
  };

  const mockStatsData = {
    totalBids: 156,
    wonBids: 23,
    totalFollows: 45,
    totalFollowers: 128,
    profileViews: 3420,
    successRate: 14.7, // (wonBids / totalBids) * 100
    averageBidAmount: 45000,
    totalSpent: 1035000,
    favoriteCategories: ['سيارات', 'عقارات', 'إلكترونيات'],
    monthlyStats: {
      bids: 12,
      wins: 2,
      views: 245
    },
    recentActivity: [
      {
        id: '1',
        type: 'bid',
        description: 'قام بمزايدة على سيارة مرسيدس C200',
        timestamp: 'منذ ساعتين',
        amount: 85000
      },
      {
        id: '2',
        type: 'won',
        description: 'فاز بمزاد لوحة فنية أصلية',
        timestamp: 'أمس',
        amount: 12500
      },
      {
        id: '3',
        type: 'follow',
        description: 'بدأ متابعة بائع جديد',
        timestamp: 'منذ 3 أيام'
      },
      {
        id: '4',
        type: 'comment',
        description: 'أضاف تعليقاً على مزاد ساعة رولكس',
        timestamp: 'منذ 5 أيام'
      },
      {
        id: '5',
        type: 'bid',
        description: 'قام بمزايدة على جهاز MacBook Pro',
        timestamp: 'منذ أسبوع',
        amount: 8500
      }
    ]
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // في التطبيق الحقيقي، سيتم استدعاء API هنا
      // const response = await fetch(`/api/profiles/${userId || currentUser?.id}`);
      // const profileData = await response.json();
      // const statsResponse = await fetch(`/api/profiles/${userId || currentUser?.id}/stats`);
      // const statsData = await statsResponse.json();
      
      if (userId && userId !== currentUser?.id) {
        // عرض ملف شخصي لمستخدم آخر - قد تكون بعض البيانات محدودة
        const otherUserProfile = {
          ...mockProfileData,
          id: userId,
          name: 'سارة أحمد محمود',
          username: 'sara_ahmed',
          email: isOwnProfile ? mockProfileData.email : null, // إخفاء البريد الإلكتروني للآخرين
          phone: isOwnProfile ? mockProfileData.phone : null, // إخفاء الهاتف للآخرين
          bio: 'فنانة ومجمعة للوحات الفنية الأصلية، متخصصة في الفن المعاصر والكلاسيكي.',
          location: 'جدة، المملكة العربية السعودية',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop'
        };
        
        const otherUserStats = {
          ...mockStatsData,
          totalBids: 89,
          wonBids: 12,
          totalFollows: 28,
          totalFollowers: 67,
          profileViews: 1840
        };
        
        setProfile(otherUserProfile);
        setStats(otherUserStats);
      } else {
        // عرض الملف الشخصي الخاص
        setProfile(mockProfileData);
        setStats(mockStatsData);
      }
      
    } catch (err) {
      setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, currentUser?.id, isOwnProfile]);

  const updateProfile = useCallback(async (updates) => {
    if (!isOwnProfile) {
      throw new Error('لا يمكنك تعديل ملف شخصي آخر');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // في التطبيق الحقيقي، سيتم استدعاء API هنا
      // const response = await fetch(`/api/profiles/${currentUser.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // const updatedProfile = await response.json();
      
      const updatedProfile = {
        ...profile,
        ...updates
      };
      
      setProfile(updatedProfile);
      
      return updatedProfile;
    } catch (err) {
      setError('فشل في تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.');
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, isOwnProfile]);

  const followUser = useCallback(async (targetUserId) => {
    if (isOwnProfile || targetUserId === currentUser?.id) {
      throw new Error('لا يمكنك متابعة نفسك');
    }
    
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // في التطبيق الحقيقي، سيتم استدعاء API هنا
      // const response = await fetch(`/api/users/${targetUserId}/follow`, {
      //   method: 'POST'
      // });
      
      console.log('Following user:', targetUserId);
      
      // تحديث الإحصائيات المحلية
      setStats(prev => ({
        ...prev,
        totalFollows: prev.totalFollows + 1
      }));
      
    } catch (err) {
      console.error('Error following user:', err);
      throw err;
    }
  }, [isOwnProfile, currentUser?.id]);

  const unfollowUser = useCallback(async (targetUserId) => {
    if (isOwnProfile || targetUserId === currentUser?.id) {
      throw new Error('لا يمكنك إلغاء متابعة نفسك');
    }
    
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // في التطبيق الحقيقي، سيتم استدعاء API هنا
      // const response = await fetch(`/api/users/${targetUserId}/unfollow`, {
      //   method: 'POST'
      // });
      
      console.log('Unfollowing user:', targetUserId);
      
      // تحديث الإحصائيات المحلية
      setStats(prev => ({
        ...prev,
        totalFollows: Math.max(0, prev.totalFollows - 1)
      }));
      
    } catch (err) {
      console.error('Error unfollowing user:', err);
      throw err;
    }
  }, [isOwnProfile, currentUser?.id]);

  const updateAvatar = useCallback(async (file) => {
    if (!isOwnProfile) {
      throw new Error('لا يمكنك تعديل صورة ملف شخصي آخر');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // محاكاة رفع الصورة
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // في التطبيق الحقيقي، سيتم رفع الصورة هنا
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await fetch(`/api/profiles/${currentUser.id}/avatar`, {
      //   method: 'POST',
      //   body: formData
      // });
      // const result = await response.json();
      
      const newAvatarUrl = URL.createObjectURL(file);
      
      const updatedProfile = {
        ...profile,
        avatar: newAvatarUrl
      };
      
      setProfile(updatedProfile);
      
      return newAvatarUrl;
    } catch (err) {
      setError('فشل في تحديث الصورة الشخصية. يرجى المحاولة مرة أخرى.');
      console.error('Error updating avatar:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile, isOwnProfile]);

  const getProfileUrl = useCallback((userId) => {
    return `/profile/${userId || currentUser?.id}`;
  }, [currentUser?.id]);

  const refreshStats = useCallback(async () => {
    try {
      // محاكاة استدعاء API لتحديث الإحصائيات
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // في التطبيق الحقيقي، سيتم استدعاء API هنا
      // const response = await fetch(`/api/profiles/${userId || currentUser?.id}/stats`);
      // const statsData = await response.json();
      
      // تحديث الإحصائيات بقيم جديدة (محاكاة)
      const updatedStats = {
        ...stats,
        profileViews: stats.profileViews + Math.floor(Math.random() * 10),
        monthlyStats: {
          ...stats.monthlyStats,
          views: stats.monthlyStats.views + Math.floor(Math.random() * 5)
        }
      };
      
      setStats(updatedStats);
      
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, [stats, userId, currentUser?.id]);

  return {
    profile,
    stats,
    loading,
    error,
    isOwnProfile,
    fetchProfile,
    updateProfile,
    followUser,
    unfollowUser,
    updateAvatar,
    getProfileUrl,
    refreshStats
  };
};