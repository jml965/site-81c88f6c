import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Gavel,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  Clock,
  Activity,
  BarChart3,
  PlayCircle,
  Eye,
  Heart,
  Calendar
} from 'lucide-react';
import AdminStats from '../components/AdminStats';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminDashboard() {
  const { 
    stats, 
    recentAuctions, 
    recentUsers, 
    recentBids,
    systemHealth,
    loading, 
    error 
  } = useAdmin();

  const [timeRange, setTimeRange] = useState('week');
  const [refreshKey, setRefreshKey] = useState(0);

  const quickActions = [
    {
      title: 'إدارة المزادات',
      description: 'مراجعة المزادات وإدارتها',
      icon: Gavel,
      link: '/admin/auctions',
      color: 'bg-blue-500',
      count: stats?.totalAuctions || 0
    },
    {
      title: 'إدارة المستخدمين',
      description: 'مراجعة المستخدمين والحسابات',
      icon: Users,
      link: '/admin/users',
      color: 'bg-green-500',
      count: stats?.totalUsers || 0
    },
    {
      title: 'التقارير',
      description: 'عرض التقارير والإحصائيات',
      icon: BarChart3,
      link: '/admin/reports',
      color: 'bg-purple-500',
      count: stats?.totalReports || 0
    }
  ];

  const recentActivity = [
    ...(recentAuctions?.slice(0, 3).map(auction => ({
      id: `auction_${auction.id}`,
      type: 'auction',
      title: `مزاد جديد: ${auction.title}`,
      description: `بواسطة ${auction.seller?.name}`,
      time: auction.createdAt,
      status: auction.status,
      icon: Gavel
    })) || []),
    ...(recentBids?.slice(0, 3).map(bid => ({
      id: `bid_${bid.id}`,
      type: 'bid',
      title: `مزايدة جديدة: ${bid.amount} ر.س`,
      description: `على مزاد ${bid.auction?.title}`,
      time: bid.createdAt,
      status: 'active',
      icon: TrendingUp
    })) || []),
    ...(recentUsers?.slice(0, 3).map(user => ({
      id: `user_${user.id}`,
      type: 'user',
      title: `مستخدم جديد: ${user.name}`,
      description: user.email,
      time: user.createdAt,
      status: user.isActive ? 'active' : 'inactive',
      icon: Users
    })) || [])
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'live':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-50';
      case 'ended':
      case 'completed':
        return 'text-gray-600 bg-gray-50';
      case 'inactive':
      case 'suspended':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
      case 'live':
        return 'نشط';
      case 'pending':
      case 'scheduled':
        return 'قادم';
      case 'ended':
      case 'completed':
        return 'منتهي';
      case 'inactive':
      case 'suspended':
        return 'معطل';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم الإدارية</h1>
            <p className="text-gray-600">مرحباً بك في لوحة إدارة منصة المزادات</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="year">هذا العام</option>
            </select>
            <button
              onClick={handleRefresh}
              className="bg-white border border-gray-200 rounded-xl p-2 hover:bg-gray-50 transition-colors"
            >
              <Activity className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <AdminStats key={refreshKey} timeRange={timeRange} />

        {/* System Health */}
        {systemHealth && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">حالة النظام</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-700">قاعدة البيانات</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  systemHealth.database === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemHealth.database === 'healthy' ? 'سليمة' : 'خطأ'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.redis === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-700">الذاكرة المؤقتة</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  systemHealth.redis === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemHealth.redis === 'healthy' ? 'سليمة' : 'خطأ'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.websocket === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-700">الاتصال المباشر</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  systemHealth.websocket === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {systemHealth.websocket === 'healthy' ? 'سليم' : 'خطأ'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.title}
                to={action.link}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`${action.color} p-3 rounded-xl text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{action.description}</p>
                    <div className="text-2xl font-bold text-gray-900">{action.count.toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">النشاط الأخير</h2>
              <Link 
                to="/admin/activity" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                      <p className="text-gray-600 text-xs">{activity.description}</p>
                    </div>
                    <div className="text-left">
                      <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                        {getStatusText(activity.status)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.time).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">لا يوجد نشاط حديث</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">مقاييس الأداء</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <PlayCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">المزادات النشطة</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {stats?.activeAuctions || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">المزايدات اليوم</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {stats?.todayBids || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">الإيرادات اليوم</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {(stats?.todayRevenue || 0).toLocaleString()} ر.س
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-900">المشاهدات اليوم</span>
                </div>
                <span className="text-xl font-bold text-orange-600">
                  {(stats?.todayViews || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}