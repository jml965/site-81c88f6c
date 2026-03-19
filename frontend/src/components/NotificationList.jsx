import React from 'react';
import NotificationCard from './NotificationCard';
import { Loader } from 'lucide-react';

const NotificationList = ({
  notifications = [],
  loading = false,
  onMarkAsRead,
  onDelete,
  selectedIds = [],
  onSelect,
  selectMode = false
}) => {
  // Group notifications by date
  const groupNotificationsByDate = (notifications) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    notifications.forEach(notification => {
      const notificationDate = new Date(notification.created_at);
      let groupKey;

      if (notificationDate.toDateString() === today.toDateString()) {
        groupKey = 'اليوم';
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        groupKey = 'أمس';
      } else if (notificationDate >= oneWeekAgo) {
        groupKey = 'هذا الأسبوع';
      } else {
        // Group by month for older notifications
        groupKey = notificationDate.toLocaleDateString('ar', { 
          year: 'numeric', 
          month: 'long' 
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    // Sort groups by date (most recent first)
    const sortedGroups = Object.keys(groups).sort((a, b) => {
      const order = ['اليوم', 'أمس', 'هذا الأسبوع'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      } else {
        // Sort month groups by date
        return new Date(groups[b][0].created_at) - new Date(groups[a][0].created_at);
      }
    });

    return sortedGroups.map(groupKey => ({
      title: groupKey,
      notifications: groups[groupKey]
    }));
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="animate-pulse flex space-x-4 space-x-reverse">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="space-y-6">
      {groupedNotifications.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-3">
          {/* Group Header */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {group.notifications.length}
            </span>
          </div>

          {/* Notifications in this group */}
          <div className="space-y-3">
            {group.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
                isSelected={selectedIds.includes(notification.id)}
                onSelect={() => onSelect && onSelect(notification.id)}
                selectMode={selectMode}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Loading more indicator */}
      {loading && notifications.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
            <Loader className="h-5 w-5 animate-spin" />
            <span className="text-sm">جاري تحميل المزيد...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;