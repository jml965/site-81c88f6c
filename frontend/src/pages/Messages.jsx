import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useMessages } from '../hooks/useMessages';
import { MessageSquare, Search, Filter } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, unread, archived
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { 
    conversations, 
    currentMessages, 
    isLoading, 
    unreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsRead
  } = useMessages();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      if (selectedConversation.unreadCount > 0) {
        markAsRead(selectedConversation.id);
      }
    }
  }, [selectedConversation, loadMessages, markAsRead]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (content, type = 'text') => {
    if (selectedConversation) {
      await sendMessage(selectedConversation.id, content, type);
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterType) {
      case 'unread':
        return matchesSearch && conv.unreadCount > 0;
      case 'archived':
        return matchesSearch && conv.isArchived;
      default:
        return matchesSearch && !conv.isArchived;
    }
  });

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">تسجيل الدخول مطلوب</h2>
            <p className="text-gray-500">يجب تسجيل الدخول لعرض الرسائل</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">الرسائل</h1>
                  {unreadCount > 0 && (
                    <p className="text-sm text-gray-600">
                      {unreadCount} رسالة غير مقروءة
                    </p>
                  )}
                </div>
              </div>
              
              {/* Mobile back button */}
              {isMobile && selectedConversation && (
                <button
                  onClick={handleBackToList}
                  className="lg:hidden px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  العودة
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              >
                <option value="all">جميع المحادثات</option>
                <option value="unread">غير المقروءة</option>
                <option value="archived">الأرشيف</option>
              </select>
            </div>
          </div>

          {/* Messages Layout */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-280px)]">
            <div className="flex h-full">
              {/* Chat List */}
              <div className={`${
                isMobile && selectedConversation ? 'hidden' : 'block'
              } w-full md:w-1/3 lg:w-1/4 border-l border-gray-200 flex flex-col`}>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">المحادثات</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <ChatList
                    conversations={filteredConversations}
                    selectedConversation={selectedConversation}
                    onConversationSelect={handleConversationSelect}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Chat Window */}
              <div className={`${
                isMobile && !selectedConversation ? 'hidden' : 'block'
              } flex-1 flex flex-col`}>
                {selectedConversation ? (
                  <ChatWindow
                    conversation={selectedConversation}
                    messages={currentMessages}
                    onSendMessage={handleSendMessage}
                    onBack={handleBackToList}
                    isLoading={isLoading}
                    currentUser={user}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                      <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">اختر محادثة</h3>
                      <p className="text-gray-500 max-w-sm">
                        اختر محادثة من القائمة لبدء المراسلة أو ابدأ محادثة جديدة
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;