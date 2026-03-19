import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Check, 
  CheckCheck, 
  MoreHorizontal, 
  Copy, 
  Reply, 
  Forward,
  Trash2,
  User,
  Download,
  Eye
} from 'lucide-react';

const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  isConsecutive, 
  showAvatar, 
  senderAvatar 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } else {
        return date.toLocaleDateString('ar-SA', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      return '';
    }
  };

  const getMessageStatus = () => {
    if (!isOwnMessage) return null;
    
    if (message.readAt) {
      return (
        <CheckCheck className="w-4 h-4 text-blue-500" title="تمت القراءة" />
      );
    } else if (message.deliveredAt) {
      return (
        <CheckCheck className="w-4 h-4 text-gray-400" title="تم التسليم" />
      );
    } else {
      return (
        <Check className="w-4 h-4 text-gray-400" title="تم الإرسال" />
      );
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setShowMenu(false);
    // Could show toast notification here
  };

  const handleDeleteMessage = () => {
    // Handle message deletion
    setShowMenu(false);
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative">
            {isImageLoading && (
              <div className="w-64 h-48 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <img
              src={message.content}
              alt="صورة مرسلة"
              className={`max-w-64 max-h-80 rounded-lg object-cover cursor-pointer transition-opacity ${
                isImageLoading ? 'opacity-0 absolute' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              onClick={() => setShowFullImage(true)}
              loading="lazy"
            />
            {!isImageLoading && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                انقر للعرض
              </div>
            )}
          </div>
        );
        
      case 'file':
        const fileName = message.fileName || 'ملف مرفق';
        const fileSize = message.fileSize || '';
        
        return (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-64">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileName}
              </p>
              {fileSize && (
                <p className="text-xs text-gray-500">{fileSize}</p>
              )}
            </div>
          </div>
        );
        
      case 'text':
      default:
        return (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        );
    }
  };

  return (
    <>
      <div className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        {/* Avatar for received messages */}
        {showAvatar && !isOwnMessage && (
          <div className="flex-shrink-0 mb-1">
            {senderAvatar ? (
              <img
                src={senderAvatar}
                alt="المرسل"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        )}
        
        {/* Spacer for consecutive messages */}
        {!showAvatar && !isOwnMessage && (
          <div className="w-8 flex-shrink-0"></div>
        )}
        
        {/* Message Container */}
        <div className={`relative max-w-xs lg:max-w-md group ${
          isOwnMessage ? 'order-1' : 'order-2'
        }`}>
          {/* Message Bubble */}
          <div
            className={`relative px-4 py-3 rounded-2xl break-words ${
              isOwnMessage
                ? 'bg-blue-500 text-white rounded-br-md'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
            } ${isConsecutive ? 'mt-1' : 'mt-3'}`}
          >
            {renderMessageContent()}
            
            {/* Message Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`absolute top-2 ${isOwnMessage ? 'left-2' : 'right-2'} 
                opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full 
                ${isOwnMessage ? 'hover:bg-white/20' : 'hover:bg-gray-100'}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {/* Message Menu */}
            {showMenu && (
              <div className={`absolute top-8 ${isOwnMessage ? 'left-0' : 'right-0'} 
                bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-32`}
                onMouseLeave={() => setShowMenu(false)}
              >
                {message.type === 'text' && (
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ
                  </button>
                )}
                
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMenu(false)}
                >
                  <Reply className="w-4 h-4" />
                  رد
                </button>
                
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMenu(false)}
                >
                  <Forward className="w-4 h-4" />
                  إعادة توجيه
                </button>
                
                {isOwnMessage && (
                  <button
                    onClick={handleDeleteMessage}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Message Timestamp and Status */}
          {!isConsecutive && (
            <div className={`flex items-center gap-1 mt-1 px-1 ${
              isOwnMessage ? 'justify-end' : 'justify-start'
            }`}>
              <span className="text-xs text-gray-500">
                {formatMessageTime(message.createdAt)}
              </span>
              {getMessageStatus()}
            </div>
          )}
        </div>
      </div>
      
      {/* Full Image Modal */}
      {showFullImage && message.type === 'image' && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={message.content}
              alt="صورة مرسلة"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;