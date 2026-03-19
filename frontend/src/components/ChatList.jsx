import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MessageCircle, User, Clock, Check, CheckCheck } from 'lucide-react';

const ChatList = ({ 
  conversations, 
  selectedConversation, 
  onConversationSelect, 
  isLoading 
}) => {
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { locale: ar, addSuffix: true });
      } else {
        return date.toLocaleDateString('ar-SA', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (error) {
      return '';
    }
  };

  const getMessageStatusIcon = (message, conversation) => {
    if (!message || conversation.otherUser?.id === message.senderId) {
      return null; // Don't show status for received messages
    }

    if (message.readAt) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    } else if (message.deliveredAt) {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    } else {
      return <Check className="w-4 h-4 text-gray-400" />;
    }
  };

  const truncateMessage = (content, maxLength = 50) => {
    if (!content) return 'رسالة جديدة';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="p-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="mb-4 animate-pulse">
            <div className="flex items-center gap-3 p-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد محادثات</h3>
        <p className="text-gray-500">ابدأ محادثة جديدة عبر التفاعل مع المزادات</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?.id === conversation.id;
        const otherUser = conversation.otherUser || {};
        
        return (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="relative flex-shrink-0">
                {otherUser.avatar ? (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name || 'المستخدم'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                
                {/* Online Status */}
                {otherUser.isOnline && (
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                
                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                    {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                  </div>
                )}
              </div>

              {/* Conversation Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium truncate ${
                    conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {otherUser.name || 'مستخدم مجهول'}
                  </h4>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatMessageTime(conversation.lastMessage?.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate flex-1 ml-2 ${
                    conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {conversation.lastMessage?.type === 'image' && '📷 صورة'}
                    {conversation.lastMessage?.type === 'file' && '📎 ملف'}
                    {conversation.lastMessage?.type === 'text' && 
                      truncateMessage(conversation.lastMessage?.content)
                    }
                    {!conversation.lastMessage && 'محادثة جديدة'}
                  </p>
                  
                  {/* Message Status */}
                  <div className="flex-shrink-0">
                    {getMessageStatusIcon(conversation.lastMessage, conversation)}
                  </div>
                </div>
                
                {/* Auction Context */}
                {conversation.auction && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg inline-block">
                    <span>مزاد: {conversation.auction.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;