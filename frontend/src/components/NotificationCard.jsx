import React, { useState } from 'react';
import { 
  Gavel, 
  MessageCircle, 
  Heart, 
  Users, 
  Clock, 
  Trophy, 
  AlertTriangle,
  Settings,
  Bell,
  CheckCircle,
  Trash2,
  ExternalLink,
  MoreVertical,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  isSelected = false,
  onSelect,
  selectMode = false
}) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getNotificationIcon = (type, subtype) => {
    const iconClass = "h-8 w-8 rounded-full p-2";
    
    switch (type) {
      case 'bid':
        return <Gavel className={`${iconClass} bg-green-100 text-green-600`} />;
      case 'auction':
        switch (subtype) {
          case 'started':
            return <Bell className={`${iconClass} bg-blue-100 text-blue-600`} />;
          case 'ending_soon':
            return <Clock className={`${iconClass} bg-orange-100 text-orange-600`} />;
          case 'ended':
            return <Trophy className={`${iconClass} bg-purple-100 text-purple-600`} />;
          case 'won':
            return <Trophy className={`${iconClass} bg-yellow-100 text-yellow-600`} />;
          case 'lost':
            return <X className={`${iconClass} bg-red-100 text-red-600`} />;
          default:
            return <Gavel className={`${iconClass} bg-blue-100 text-blue-600`} />;
        }
      case 'message':
        return <MessageCircle className={`${iconClass} bg-indigo-100 text-indigo-600`} />;
      case 'follow':
        return <Users className={`${iconClass} bg-pink-100 text-pink-600`} />;
      case 'like':
        return <Heart className={`${iconClass} bg-red-100 text-red-600`} />;
      case 'system':
        return <Settings className={`${iconClass} bg-gray-100 text-gray-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} bg-yellow-100 text-yellow-600`} />;
      default:
        return <Bell className={`${iconClass} bg-gray-100 text-gray-600`} />;
    }
  };

  const getNotificationContent = (notification) => {
    const { type, subtype, title, message, data } = notification;
    
    switch (type) {
      case 'bid':
        switch (subtype) {
          case 'outbid':
            return {
              title: 'تم تجاوز مزايدتك',
              message: `تم تجاوز مزايدتك في مزاد "${data?.auction_title || 'مزاد'}" بمبلغ ${data?.new_amount || '0'} ريال`,
              action: 'عرض المزاد',
              link: `/auction/${data?.auction_id}`
            };
          case 'bid_accepted':
            return {
              title: 'تم قبول مزايدتك',
              message: `تم قبول مزايدتك في مزاد "${data?.auction_title || 'مزاد'}" بمبلغ ${data?.amount || '0'} ريال`,
              action: 'عرض المزاد',
              link: `/auction/${data?.auction_id}`
            };
          case 'winning':
            return {
              title: 'أنت في المقدمة!',
              message: `مزايدتك الحالية في مزاد "${data?.auction_title || 'مزاد'}" هي الأعلى بمبلغ ${data?.amount || '0'} ريال`,
              action: 'عرض المزاد',
              link: `/auction/${data?.auction_id}`
            };
          default:
            return { title, message, action: 'عرض التفاصيل' };
        }
      
      case 'auction':
        switch (subtype) {
          case 'started':
            return {
              title: 'بدء مزاد جديد',
              message: `بدأ مزاد "${data?.auction_title || 'مزاد'}" الآن`,
              action: 'دخول المزاد',
              link: `/auction/${data?.auction_id}/room`
            };
          case 'ending_soon':
            return {
              title: 'قرب انتهاء المزاد',
              message: `مزاد "${data?.auction_title || 'مزاد'}" سينتهي خلال ${data?.minutes_left || '5'} دقائق`,
              action: 'دخول المزاد',
              link: `/auction/${data?.auction_id}/room`
            };
          case 'ended':
            return {
              title: 'انتهى المزاد',
              message: `انتهى مزاد "${data?.auction_title || 'مزاد'}" بسعر نهائي ${data?.final_amount || '0'} ريال`,
              action: 'عرض النتائج',
              link: `/auction/${data?.auction_id}/results`
            };
          case 'won':
            return {
              title: '🎉 مبروك! لقد فزت',
              message: `فزت في مزاد "${data?.auction_title || 'مزاد'}" بمبلغ ${data?.winning_amount || '0'} ريال`,
              action: 'عرض التفاصيل',
              link: `/auction/${data?.auction_id}/results`
            };
          case 'lost':
            return {
              title: 'انتهى المزاد',
              message: `انتهى مزاد "${data?.auction_title || 'مزاد'}" وفاز مزايد آخر بمبلغ ${data?.winning_amount || '0'} ريال`,
              action: 'عرض النتائج',
              link: `/auction/${data?.auction_id}/results`
            };
          default:
            return { title, message, action: 'عرض المزاد', link: `/auction/${data?.auction_id}` };
        }
      
      case 'message':
        return {
          title: 'رسالة جديدة',
          message: `رسالة جديدة من ${data?.sender_name || 'مستخدم'}`,
          action: 'عرض الرسائل',
          link: `/messages${data?.conversation_id ? `/${data.conversation_id}` : ''}`
        };
      
      case 'follow':
        return {
          title: 'متابع جديد',
          message: `${data?.follower_name || 'مستخدم'} بدأ بمتابعتك`,
          action: 'عرض الملف الشخصي',
          link: `/profile/${data?.follower_id}`
        };
      
      case 'like':
        return {
          title: 'إعجاب جديد',
          message: `أعجب ${data?.liker_name || 'مستخدم'} بمزادك "${data?.auction_title || 'مزاد'}"`,
          action: 'عرض المزاد',
          link: `/auction/${data?.auction_id}`
        };
      
      case 'system':
        return {
          title: title || 'إشعار من النظام',
          message: message || 'إشعار جديد من النظام',
          action: 'عرض التفاصيل'
        };
      
      default:
        return { title: title || 'إشعار جديد', message, action: 'عرض التفاصيل' };
    }
  };

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    if (onMarkAsRead && !notification.is_read) {
      await onMarkAsRead(notification.id);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (onDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(notification.id);
      } catch (error) {
        console.error('Error deleting notification:', error);
        setIsDeleting(false);
      }
    }
  };

  const handleCardClick = () => {
    if (selectMode) {
      onSelect && onSelect();
    } else {
      const content = getNotificationContent(notification);
      if (content.link) {
        navigate(content.link);
        // Mark as read when navigating
        if (!notification.is_read) {
          onMarkAsRead && onMarkAsRead(notification.id);
        }
      }
    }
  };

  const content = getNotificationContent(notification);
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { 
    addSuffix: true, 
    locale: ar 
  });

  return (
    <div 
      className={`relative bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
        !notification.is_read 
          ? 'border-indigo-200 shadow-sm' 
          : 'border-gray-200'
      } ${
        selectMode ? 'cursor-pointer' : content.link ? 'cursor-pointer' : ''
      } ${
        isSelected ? 'ring-2 ring-indigo-500 border-indigo-500' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      {selectMode && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect && onSelect()}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full"></div>
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3 space-x-reverse">
          {/* Icon */}
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.type, notification.subtype)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className={`text-sm font-medium ${
                !notification.is_read ? 'text-gray-900' : 'text-gray-700'
              } truncate`}>
                {content.title}
              </h4>
              
              {!selectMode && (
                <div className="relative flex-shrink-0 mr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(!showActions);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {showActions && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                      {!notification.is_read && (
                        <button
                          onClick={handleMarkAsRead}
                          className="flex items-center space-x-2 space-x-reverse w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>تحديد كمقروء</span>
                        </button>
                      )}
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center space-x-2 space-x-reverse w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{isDeleting ? 'جاري الحذف...' : 'حذف'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <p className={`text-sm mb-3 ${
              !notification.is_read ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {content.message}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{timeAgo}</span>
              
              {content.action && content.link && !selectMode && (
                <button className="flex items-center space-x-1 space-x-reverse text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  <span>{content.action}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(false);
          }}
        />
      )}
    </div>
  );
};

export default NotificationCard;