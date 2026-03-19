import { useState, useCallback, useRef } from 'react';
import { messageApi } from '../services/messageApi';
import { useAuth } from '../contexts/AuthContext';

export const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { socket } = useRealtime();
  const currentConversationId = useRef(null);

  // Calculate total unread count
  const unreadCount = conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);

  // Load all conversations for the current user
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await messageApi.getConversations();
      setConversations(response.data || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('فشل في تحميل المحادثات');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId, page = 1, limit = 50) => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    currentConversationId.current = conversationId;
    
    try {
      const response = await messageApi.getMessages(conversationId, { page, limit });
      const messages = response.data || [];
      
      // Sort messages by creation time (oldest first)
      const sortedMessages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      if (page === 1) {
        setCurrentMessages(sortedMessages);
      } else {
        // Prepend older messages for pagination
        setCurrentMessages(prev => [...sortedMessages, ...prev]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('فشل في تحميل الرسائل');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = useCallback(async (conversationId, content, type = 'text', metadata = {}) => {
    if (!conversationId || !content.trim()) return;
    
    try {
      const messageData = {
        conversationId,
        content: content.trim(),
        type,
        metadata
      };
      
      // Optimistic update - add message immediately
      const tempMessage = {
        id: `temp-${Date.now()}`,
        ...messageData,
        senderId: user.id,
        createdAt: new Date().toISOString(),
        status: 'sending'
      };
      
      setCurrentMessages(prev => [...prev, tempMessage]);
      
      // Send to server
      const response = await messageApi.sendMessage(messageData);
      const sentMessage = response.data;
      
      // Replace temp message with real message
      setCurrentMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? sentMessage : msg
        )
      );
      
      // Update conversation list - move to top and update last message
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: sentMessage,
              updatedAt: sentMessage.createdAt
            };
          }
          return conv;
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
      
      // Emit real-time event
      if (socket) {
        socket.emit('message_sent', {
          conversationId,
          message: sentMessage
        });
      }
      
      return sentMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Remove temp message on error
      setCurrentMessages(prev => 
        prev.filter(msg => msg.id !== `temp-${tempMessage.id}`)
      );
      
      throw new Error('فشل في إرسال الرسالة');
    }
  }, [user, socket]);

  // Create a new conversation
  const createConversation = useCallback(async (otherUserId, auctionId = null, initialMessage = null) => {
    if (!otherUserId) return;
    
    try {
      const conversationData = {
        participantIds: [user.id, otherUserId],
        auctionId,
        type: auctionId ? 'auction' : 'direct'
      };
      
      const response = await messageApi.createConversation(conversationData);
      const newConversation = response.data;
      
      // Add to conversations list
      setConversations(prev => [newConversation, ...prev]);
      
      // Send initial message if provided
      if (initialMessage) {
        await sendMessage(newConversation.id, initialMessage);
      }
      
      return newConversation;
    } catch (err) {
      console.error('Error creating conversation:', err);
      throw new Error('فشل في إنشاء المحادثة');
    }
  }, [user, sendMessage]);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId) => {
    if (!conversationId) return;
    
    try {
      await messageApi.markAsRead(conversationId);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      // Mark current messages as read
      setCurrentMessages(prev => 
        prev.map(msg => ({ 
          ...msg, 
          readAt: msg.readAt || new Date().toISOString() 
        }))
      );
      
      // Emit real-time event
      if (socket) {
        socket.emit('messages_read', {
          conversationId,
          userId: user.id
        });
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [user, socket]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId) => {
    if (!messageId) return;
    
    try {
      await messageApi.deleteMessage(messageId);
      
      // Remove from current messages
      setCurrentMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Emit real-time event
      if (socket) {
        socket.emit('message_deleted', {
          messageId,
          conversationId: currentConversationId.current
        });
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      throw new Error('فشل في حذف الرسالة');
    }
  }, [socket]);

  // Archive/unarchive conversation
  const archiveConversation = useCallback(async (conversationId, archive = true) => {
    if (!conversationId) return;
    
    try {
      await messageApi.archiveConversation(conversationId, archive);
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, isArchived: archive }
            : conv
        )
      );
    } catch (err) {
      console.error('Error archiving conversation:', err);
      throw new Error('فشل في أرشفة المحادثة');
    }
  }, []);

  // Real-time message handlers
  const handleNewMessage = useCallback((data) => {
    const { conversationId, message } = data;
    
    // Add to current messages if viewing this conversation
    if (conversationId === currentConversationId.current) {
      setCurrentMessages(prev => {
        // Check if message already exists (avoid duplicates)
        if (prev.find(msg => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    }
    
    // Update conversation list
    setConversations(prev => {
      const existingConv = prev.find(conv => conv.id === conversationId);
      
      if (existingConv) {
        return prev.map(conv => 
          conv.id === conversationId 
            ? {
                ...conv,
                lastMessage: message,
                updatedAt: message.createdAt,
                unreadCount: (conv.unreadCount || 0) + 1
              }
            : conv
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }
      
      // New conversation - reload to get full data
      loadConversations();
      return prev;
    });
  }, [loadConversations]);

  const handleMessageRead = useCallback((data) => {
    const { conversationId, userId } = data;
    
    // Update message read status in current messages
    if (conversationId === currentConversationId.current && userId !== user.id) {
      setCurrentMessages(prev => 
        prev.map(msg => 
          msg.senderId === user.id && !msg.readAt
            ? { ...msg, readAt: new Date().toISOString() }
            : msg
        )
      );
    }
  }, [user]);

  const handleMessageDeleted = useCallback((data) => {
    const { messageId, conversationId } = data;
    
    // Remove from current messages if viewing this conversation
    if (conversationId === currentConversationId.current) {
      setCurrentMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  }, []);

  // Set up real-time listeners
  React.useEffect(() => {
    if (!socket || !user) return;

    socket.on('new_message', handleNewMessage);
    socket.on('message_read', handleMessageRead);
    socket.on('message_deleted', handleMessageDeleted);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_read', handleMessageRead);
      socket.off('message_deleted', handleMessageDeleted);
    };
  }, [socket, user, handleNewMessage, handleMessageRead, handleMessageDeleted]);

  return {
    conversations,
    currentMessages,
    isLoading,
    error,
    unreadCount,
    loadConversations,
    loadMessages,
    sendMessage,
    createConversation,
    markAsRead,
    deleteMessage,
    archiveConversation
  };
};