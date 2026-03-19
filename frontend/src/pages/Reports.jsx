import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Gavel,
  Calendar,
  Download,
  Filter,
  Eye,
  Clock,
  Activity,
  Target,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

export default function Reports() {
  const { reports, loading, error, generateReport } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportType, setReportType] = useState('overview');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    auctions: false,
    users: false,
    revenue: false,
    performance: false
  });

  const periodOptions = [
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'quarter', label: 'هذا الربع' },
    { value: 'year', label: 'هذا العام' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'نظرة عامة' },
    { value: 'auctions', label: 'تقرير المزادات' },
    { value: 'users', label: 'تقرير المستخدمين' },
    { value: 'revenue', label: 'تقرير الإيرادات' },
    { value: 'performance', label: 'تقرير الأداء' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleGenerateReport = async () => {
    const params = {
      type: reportType,
      period: selectedPeriod,
      ...(selectedPeriod === 'custom' && customDateRange.start && customDateRange.end && {
        startDate: customDateRange.start,
        endDate: customDateRange.end
      })
    };
    
    try {
      await generateReport(params);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ar-SA').format(num || 0);
  };

  const formatPercentage = (num) => {
    return `${(num || 0).toFixed(1)}%`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير والإحصائيات</h1>
            <p className="text-gray-600">تحليل شامل لأداء المنصة والمزادات</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => window.location.reload()}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleGenerateReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              تصدير التقرير
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Period Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الفترة الزمنية</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقرير</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Custom Date Range */}
            {selectedPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Gavel className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(reports?.overview?.auctionsGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(reports?.overview?.auctionsGrowth)}`}>
                  {formatPercentage(reports?.overview?.auctionsGrowth)}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(reports?.overview?.totalAuctions)}
            </div>
            <div className="text-gray-600 text-sm">إجمالي المزادات</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(reports?.overview?.usersGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(reports?.overview?.usersGrowth)}`}>
                  {formatPercentage(reports?.overview?.usersGrowth)}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(reports?.overview?.totalUsers)}
            </div>
            <div className="text-gray-600 text-sm">إجمالي المستخدمين</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(reports?.overview?.revenueGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(reports?.overview?.revenueGrowth)}`}>
                  {formatPercentage(reports?.overview?.revenueGrowth)}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(reports?.overview?.totalRevenue).replace('SAR', 'ر.س')}
            </div>
            <div className="text-gray-600 text-sm">إجمالي الإيرادات</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1">
                {getGrowthIcon(reports?.overview?.bidsGrowth)}
                <span className={`text-sm font-medium ${getGrowthColor(reports?.overview?.bidsGrowth)}`}>
                  {formatPercentage(reports?.overview?.bidsGrowth)}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(reports?.overview?.totalBids)}
            </div>
            <div className="text-gray-600 text-sm">إجمالي المزايدات</div>
          </div>
        </div>

        {/* Detailed Reports Sections */}
        <div className="space-y-6">
          {/* Auctions Report */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('auctions')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Gavel className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">تقرير المزادات</h2>
              </div>
              {expandedSections.auctions ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.auctions && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">
                      {formatNumber(reports?.auctions?.live || 0)}
                    </div>
                    <div className="text-blue-700 text-sm">مزادات مباشرة</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-green-600">
                      {formatNumber(reports?.auctions?.completed || 0)}
                    </div>
                    <div className="text-green-700 text-sm">مزادات مكتملة</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-yellow-600">
                      {formatNumber(reports?.auctions?.scheduled || 0)}
                    </div>
                    <div className="text-yellow-700 text-sm">مزادات مجدولة</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-gray-600">
                      {formatPercentage(reports?.auctions?.successRate)}
                    </div>
                    <div className="text-gray-700 text-sm">معدل النجاح</div>
                  </div>
                </div>
                
                {/* Top Categories */}
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">التصنيفات الأكثر نشاطاً</h3>
                  <div className="space-y-3">
                    {reports?.auctions?.topCategories?.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium">
                            #{index + 1}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{formatNumber(category.count)} مزاد</span>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(category.totalValue).replace('SAR', 'ر.س')}
                          </span>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Users Report */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('users')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">تقرير المستخدمين</h2>
              </div>
              {expandedSections.users ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.users && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-green-600">
                      {formatNumber(reports?.users?.active || 0)}
                    </div>
                    <div className="text-green-700 text-sm">مستخدمون نشطون</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">
                      {formatNumber(reports?.users?.newRegistrations || 0)}
                    </div>
                    <div className="text-blue-700 text-sm">تسجيلات جديدة</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-purple-600">
                      {formatNumber(reports?.users?.sellers || 0)}
                    </div>
                    <div className="text-purple-700 text-sm">بائعون</div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-orange-600">
                      {formatPercentage(reports?.users?.retentionRate)}
                    </div>
                    <div className="text-orange-700 text-sm">معدل الاستبقاء</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Revenue Report */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('revenue')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">تقرير الإيرادات</h2>
              </div>
              {expandedSections.revenue ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.revenue && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-purple-600">
                      {formatCurrency(reports?.revenue?.commissions).replace('SAR', 'ر.س')}
                    </div>
                    <div className="text-purple-700 text-sm">العمولات</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(reports?.revenue?.subscriptions).replace('SAR', 'ر.س')}
                    </div>
                    <div className="text-blue-700 text-sm">الاشتراكات</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(reports?.revenue?.averageTransactionValue).replace('SAR', 'ر.س')}
                    </div>
                    <div className="text-green-700 text-sm">متوسط قيمة المعاملة</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Performance Report */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => toggleSection('performance')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">تقرير الأداء</h2>
              </div>
              {expandedSections.performance ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.performance && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-orange-600">
                      {formatNumber(reports?.performance?.totalViews || 0)}
                    </div>
                    <div className="text-orange-700 text-sm">إجمالي المشاهدات</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-blue-600">
                      {formatPercentage(reports?.performance?.engagementRate)}
                    </div>
                    <div className="text-blue-700 text-sm">معدل التفاعل</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-green-600">
                      {formatNumber(reports?.performance?.averageBidsPerAuction)}
                    </div>
                    <div className="text-green-700 text-sm">متوسط المزايدات لكل مزاد</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-xl font-bold text-purple-600">
                      {formatNumber(reports?.performance?.averageSessionDuration || 0)}
                    </div>
                    <div className="text-purple-700 text-sm">متوسط مدة الجلسة (دقيقة)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}