import React, { useState, useEffect } from 'react';
import {
  Users,
  Gavel,
  TrendingUp,
  DollarSign,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Star,
  Heart
} from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminStats({ timeRange = 'week' }) {
  const { stats, loading, error } = useAdmin();
  const [currentStats, setCurrentStats] = useState(null);
  const [previousStats, setPreviousStats] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch stats based on timeRange
    // For now, we'll use the mock data
    if (stats) {
      setCurrentStats(stats);
      // Mock previous period stats for comparison
      setPreviousStats({
        totalUsers: stats.totalUsers * 0.85,
        totalAuctions: stats.totalAuctions * 0.9,
        totalBids: stats.totalBids * 0.8,
        totalRevenue: stats.totalRevenue * 0.75,
        activeAuctions: stats.activeAuctions * 0.95,
        todayViews: stats.todayViews * 0.9,
        pendingReports: stats.pendingReports * 1.2,
        totalComments: stats.totalComments * 0.88
      });
    }
  }, [stats, timeRange]);

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatGrowth = (growth) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <TrendingUp className="h-4 w-4 text-gray-600" />;
  };

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: currentStats?.totalUsers || 0,
      previous: previousStats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'إجمالي المزادات',
      value: currentStats?.totalAuctions || 0,
      previous: previousStats?.totalAuctions || 0,
      icon: Gavel,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'المزادات النشطة',
      value: currentStats?.activeAuctions || 0,
      previous: previousStats?.activeAuctions || 0,
      icon: Activity,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'إجمالي المزايدات',
      value: currentStats?.totalBids || 0,
      previous: previousStats?.totalBids || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'إجمالي الإيرادات',
      value: currentStats?.totalRevenue || 0,
      previous: previousStats?.totalRevenue || 0,
      icon: DollarSign,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      format: 'currency'
    },
    {
      title: 'المشاهدات اليوم',
      value: currentStats?.todayViews || 0,
      previous: previousStats?.todayViews || 0,
      icon: Eye,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      title: 'إجمالي التعليقات',
      value: currentStats?.totalComments || 0,
      previous: previousStats?.totalComments || 0,
      icon: MessageSquare,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'البلاغات المعلقة',
      value: currentStats?.pendingReports || 0,
      previous: previousStats?.pendingReports || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  const formatValue = (value, format) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('ar-SA', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value) + ' ر.س';
    }
    return new Intl.NumberFormat('ar-SA').format(value);
  };

  const getTimeRangeText = (range) => {
    switch (range) {
      case 'today':
        return 'اليوم';
      case 'week':
        return 'هذا الأسبوع';
      case 'month':
        return 'هذا الشهر';
      case 'year':
        return 'هذا العام';
      default:
        return 'الفترة المحددة';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">خطأ في تحميل الإحصائيات</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">الإحصائيات الرئيسية</h2>
        <div className="text-sm text-gray-600">
          البيانات لفترة: {getTimeRangeText(timeRange)}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const growth = calculateGrowth(stat.value, stat.previous);
          
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center gap-1">
                  {getGrowthIcon(growth)}
                  <span className={`text-sm font-medium ${getGrowthColor(growth)}`}>
                    {formatGrowth(growth)}
                  </span>
                </div>
              </div>
              
              {/* Value */}
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(stat.value, stat.format)}
              </div>
              
              {/* Title */}
              <div className="text-gray-600 text-sm">{stat.title}</div>
              
              {/* Growth Details */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>الفترة السابقة</span>
                  <span>{formatValue(stat.previous, stat.format)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Top Performance Indicator */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Star className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">الأداء العام</h3>
          </div>
          <div className="text-2xl font-bold mb-1">
            {currentStats?.totalAuctions > 0 ? 
              ((currentStats?.activeAuctions / currentStats?.totalAuctions) * 100).toFixed(1) : 0
            }%
          </div>
          <div className="text-green-100 text-sm">معدل المزادات النشطة</div>
        </div>

        {/* User Engagement */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">تفاعل المستخدمين</h3>
          </div>
          <div className="text-2xl font-bold mb-1">
            {currentStats?.totalUsers > 0 ? 
              (currentStats?.totalBids / currentStats?.totalUsers).toFixed(1) : 0
            }
          </div>
          <div className="text-blue-100 text-sm">متوسط المزايدات لكل مستخدم</div>
        </div>

        {/* System Health */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">صحة النظام</h3>
          </div>
          <div className="text-2xl font-bold mb-1">
            {currentStats?.pendingReports < 10 ? 'ممتاز' : 
             currentStats?.pendingReports < 25 ? 'جيد' : 'يحتاج متابعة'
            }
          </div>
          <div className="text-purple-100 text-sm">
            {currentStats?.pendingReports || 0} بلاغ معلق
          </div>
        </div>
      </div>
    </div>
  );
}