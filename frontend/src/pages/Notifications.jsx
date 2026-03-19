import React, { useState, useEffect } from 'react';
import { Bell, Filter, Check, Trash2, Archive, Settings, RefreshCw } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationList from '../components/NotificationList';
import NotificationBadge from '../components/NotificationBadge';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedType, setSelectedType] = useState('all'); // all, bid, message, auction, follow
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user, refreshNotifications]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkMarkAsRead = async () => {
    for (const id of selectedIds) {
      await markAsRead(id);
    }
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      await deleteNotification(id);
    }
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const filteredNotifications = notifications.filter(notification => {
    // Filter by read status
    if (filter === 'unread' && notification.is_read) return false;
    if (filter === 'read' && !notification.is_read) return false;
    
    // Filter by type
    if (selectedType !== 'all' && notification.type !== selectedType) return false;
    
    return true;
  });

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع', count: notifications.length },
    { value: 'bid', label: 'المزايدات', count: notifications.filter(n => n.type === 'bid').length },
    { value: 'auction', label: 'المزادات', count: notifications.filter(n => n.type === 'auction').length },
    { value: 'message', label: 'الرسائل', count: notifications.filter(n => n.type === 'message').length },
    { value: 'follow', label: 'المتابعات', count: notifications.filter(n => n.type === 'follow').length },
    { value: 'system', label: 'النظام', count: notifications.filter(n => n.type === 'system').length }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-600">يرجى تسجيل الدخول لعرض الإشعارات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="relative">
                <Bell className="h-8 w-8 text-indigo-600" />
                <NotificationBadge count={unreadCount} className="absolute -top-2 -right-2" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
                <p className="text-sm text-gray-600">
                  لديك {unreadCount} إشعار غير مقروء من أصل {notifications.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={refreshNotifications}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setIsSelectMode(!isSelectMode)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isSelectMode ? 'إلغاء التحديد' : 'تحديد متعدد'}
              </button>
              
              <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">الحالة:</span>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  {[
                    { value: 'all', label: 'الكل' },
                    { value: 'unread', label: 'غير مقروء' },
                    { value: 'read', label: 'مقروء' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                        filter === option.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-sm font-medium text-gray-700">النوع:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {isSelectMode && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">
                      تحديد الكل ({selectedIds.length} محدد)
                    </span>
                  </div>
                  
                  {selectedIds.length > 0 && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={handleBulkMarkAsRead}
                        className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Check className="h-3 w-3" />
                        <span>تحديد كمقروء</span>
                      </button>
                      
                      <button
                        onClick={handleBulkDelete}
                        className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>حذف</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || loading}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>تحديد الكل كمقروء ({unreadCount})</span>
          </button>
          
          <button
            onClick={deleteAllRead}
            disabled={notifications.filter(n => n.is_read).length === 0 || loading}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Archive className="h-4 w-4" />
            <span>حذف المقروء ({notifications.filter(n => n.is_read).length})</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={refreshNotifications}
              className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Notifications List */}
        <NotificationList
          notifications={filteredNotifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          selectedIds={selectedIds}
          onSelect={(id) => {
            if (isSelectMode) {
              setSelectedIds(prev => 
                prev.includes(id) 
                  ? prev.filter(selectedId => selectedId !== id)
                  : [...prev, id]
              );
            }
          }}
          selectMode={isSelectMode}
        />

        {/* Empty State */}
        {!loading && filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'unread' 
                ? 'جميع إشعاراتك مقروءة'
                : 'ستظهر الإشعارات هنا عند توفرها'
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => {
                  setFilter('all');
                  setSelectedType('all');
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                عرض جميع الإشعارات
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;