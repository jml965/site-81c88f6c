import React, { useState, useRef } from 'react';
import { Send, Image, Smile, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function CommentForm({
  onSubmit,
  onCancel,
  placeholder = "اكتب تعليقك هنا...",
  submitLabel = "إرسال",
  cancelLabel = "إلغاء",
  replyTo = null,
  maxLength = 1000,
  minLength = 3,
  showCancel = false,
  autoFocus = false,
  className = ""
}) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Common emojis for quick access
  const commonEmojis = [
    '😀', '😂', '😍', '👍', '👎', '❤️', '🔥', '👏',
    '😢', '😮', '😡', '🤔', '👌', '💯', '🙏', '✨'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('يجب تسجيل الدخول للتعليق');
      return;
    }

    const trimmedContent = content.trim();
    
    if (trimmedContent.length < minLength) {
      toast.error(`التعليق يجب أن يحتوي على ${minLength} أحرف على الأقل`);
      return;
    }

    if (trimmedContent.length > maxLength) {
      toast.error(`التعليق لا يجب أن يتجاوز ${maxLength} حرف`);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        content: trimmedContent,
        replyTo: replyTo?.id
      });
      setContent('');
      setShowEmojiPicker(false);
      toast.success('تم إرسال التعليق بنجاح');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error.message || 'فشل في إرسال التعليق');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setShowEmojiPicker(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setContent(value);
    }
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      
      if (newContent.length <= maxLength) {
        setContent(newContent);
        
        // Restore cursor position after emoji
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
      }
    }
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle image upload logic here
      toast.info('ميزة رفع الصور ستكون متاحة قريباً');
    }
  };

  if (!user) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600 mb-4">يجب تسجيل الدخول للتعليق</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {replyTo && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
          <span className="text-gray-600">رد على</span>
          <span className="font-medium text-gray-800 mr-1">@{replyTo.user.name}</span>
          <span className="text-gray-500 mr-1 line-clamp-1">
            {replyTo.content.length > 50 ? `${replyTo.content.substring(0, 50)}...` : replyTo.content}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">{user.name}</span>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[80px]"
            rows={3}
            autoFocus={autoFocus}
            disabled={submitting}
            style={{ direction: 'rtl' }}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-2 left-2 text-xs text-gray-400">
            {content.length}/{maxLength}
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">الرموز التعبيرية</span>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-lg transition-colors ${
                showEmojiPicker 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="إضافة رمز تعبيري"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Image Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="إرفاق صورة"
            >
              <Image className="w-5 h-5" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {showCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                {cancelLabel}
              </button>
            )}
            
            <button
              type="submit"
              disabled={submitting || content.trim().length < minLength}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? 'جاري الإرسال...' : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}