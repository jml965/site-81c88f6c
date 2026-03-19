import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Send, 
  ArrowRight, 
  User, 
  MoreVertical, 
  Image as ImageIcon,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info
} from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ 
  conversation, 
  messages, 
  onSendMessage, 
  onBack, 
  isLoading,
  currentUser 
}) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const otherUser = conversation?.otherUser || {};

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus input when conversation changes
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [conversation.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    const content = messageText.trim();
    setMessageText('');
    
    try {
      await onSendMessage(content, 'text');
    } catch (error) {
      console.error('Error sending message:', error);
      // Could show toast notification here
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Handle file upload logic
    try {
      const fileUrl = await uploadFile(file);
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      await onSendMessage(fileUrl, fileType);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setShowAttachmentMenu(false);
  };

  const uploadFile = async (file) => {
    // Simulate file upload - replace with actual upload logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return '';
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>اختر محادثة للبدء</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div>
              <h3 className="font-semibold text-gray-900">
                {otherUser.name || 'مستخدم مجهول'}
              </h3>
              <p className="text-xs text-gray-500">
                {otherUser.isOnline ? (
                  <span className="text-green-600">متصل الآن</span>
                ) : (
                  <span>آخر ظهور: {formatDistanceToNow(new Date(otherUser.lastSeen || Date.now()), { locale: ar, addSuffix: true })}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Auction Context */}
      {conversation.auction && (
        <div className="p-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <img
              src={conversation.auction.images?.[0] || '/placeholder-auction.jpg'}
              alt={conversation.auction.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">
                {conversation.auction.title}
              </h4>
              <p className="text-xs text-blue-600">
                السعر الحالي: {conversation.auction.currentPrice?.toLocaleString()} ريال
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading && messages.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-xs lg:max-w-md animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-2xl mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {Object.entries(messageGroups).map(([dateString, dateMessages]) => (
              <div key={dateString}>
                {/* Date Header */}
                <div className="flex items-center justify-center my-6">
                  <div className="bg-gray-200 px-4 py-2 rounded-full text-xs font-medium text-gray-600">
                    {formatDateHeader(dateString)}
                  </div>
                </div>
                
                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((message, index) => {
                    const prevMessage = dateMessages[index - 1];
                    const nextMessage = dateMessages[index + 1];
                    const isConsecutive = prevMessage && 
                      prevMessage.senderId === message.senderId &&
                      (new Date(message.createdAt) - new Date(prevMessage.createdAt)) < 60000; // 1 minute
                    
                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.senderId === currentUser.id}
                        isConsecutive={isConsecutive}
                        showAvatar={!isConsecutive && message.senderId !== currentUser.id}
                        senderAvatar={message.senderId === currentUser.id ? currentUser.avatar : otherUser.avatar}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>{otherUser.name} يكتب...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          {/* Attachment Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            {/* Attachment Menu */}
            {showAttachmentMenu && (
              <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                >
                  <ImageIcon className="w-4 h-4" />
                  صورة
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                >
                  <Paperclip className="w-4 h-4" />
                  ملف
                </button>
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={messageInputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
              rows={1}
              dir="rtl"
              style={{
                height: 'auto',
                minHeight: '48px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute left-3 bottom-3 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,*/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ChatWindow;