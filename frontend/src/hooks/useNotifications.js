import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationApi } from '../services/notificationApi';
import { useSocket } from '../contexts/SocketContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const notificationSound = useRef(null);

  // Initialize notification sound
  useEffect(() => {
    notificationSound.current = new Audio('/sounds/notification.mp3');
    notificationSound.current.volume = 0.3;
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (pageNum = 1, reset = false) => {
    if (!user || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await notificationApi.getNotifications({
        page: pageNum,
        limit: 20,
        sort: 'created_at:desc'
      });

      setNotifications(prev => 
        reset ? response.data : [...prev, ...response.data]
      );
      setUnreadCount(response.unreadCount);
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('فشل في تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  }, [user, loading]);

  // Refresh notifications (reset pagination)
  const refreshNotifications = useCallback(() => {
    fetchNotifications(1, true);
  }, [fetchNotifications]);

  // Load more notifications
  const loadMoreNotifications = useCallback(() => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1, false);
    }
  }, [hasMore, loading, page, fetchNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw new Error('فشل في تحديد الإشعار كمقروء');
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(notification => 
          ({ ...notification, is_read: true })
        )
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      throw new Error('فشل في تحديد جميع الإشعارات كمقروءة');
    }
  }, []);

  // Delete single notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const filtered = prev.filter(n => n.id !== notificationId);
        
        // Update unread count if deleted notification was unread
        if (notification && !notification.is_read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        
        return filtered;
      });
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw new Error('فشل في حذف الإشعار');
    }
  }, []);

  // Delete all read notifications
  const deleteAllRead = useCallback(async () => {
    try {
      await notificationApi.deleteAllRead();
      
      setNotifications(prev => 
        prev.filter(notification => !notification.is_read)
      );
    } catch (err) {
      console.error('Error deleting read notifications:', err);
      throw new Error('فشل في حذف الإشعارات المقروءة');
    }
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (notificationSound.current) {
      notificationSound.current.currentTime = 0;
      notificationSound.current.play().catch(err => {
        console.log('Could not play notification sound:', err);
      });
    }
  }, []);

  // Handle real-time notifications via socket
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Play sound for new notifications
      playNotificationSound();
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title || 'إشعار جديد', {
          body: notification.message,
          icon: '/icons/notification-icon.png',
          tag: notification.id
        });
      }
    };

    const handleNotificationRead = ({ notificationId }) => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleNotificationDeleted = ({ notificationId }) => {
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const filtered = prev.filter(n => n.id !== notificationId);
        
        // Update unread count if deleted notification was unread
        if (notification && !notification.is_read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        
        return filtered;
      });
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('notification_read', handleNotificationRead);
    socket.on('notification_deleted', handleNotificationDeleted);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.off('notification_read', handleNotificationRead);
      socket.off('notification_deleted', handleNotificationDeleted);
    };
  }, [socket, user, playNotificationSound]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Initial fetch when user changes
  useEffect(() => {
    if (user) {
      refreshNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    }
  }, [user, refreshNotifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.is_read);
  }, [notifications]);

  // Check if there are unread notifications of specific type
  const hasUnreadOfType = useCallback((type) => {
    return notifications.some(notification => 
      notification.type === type && !notification.is_read
    );
  }, [notifications]);

  // Get unread count by type
  const getUnreadCountByType = useCallback((type) => {
    return notifications.filter(notification => 
      notification.type === type && !notification.is_read
    ).length;
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    page,
    
    // Actions
    fetchNotifications,
    refreshNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    playNotificationSound,
    
    // Utility functions
    getNotificationsByType,
    getUnreadNotifications,
    hasUnreadOfType,
    getUnreadCountByType
  };
};

export default useNotifications;