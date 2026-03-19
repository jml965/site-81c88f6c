import React, { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = ({ message, type = 'info', duration = 5000, persistent = false }) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration, persistent };
    
    setToasts(prev => [...prev, toast]);
    
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const removeAllToasts = () => {
    setToasts([]);
  };
  
  const toast = {
    success: (message, options = {}) => addToast({ message, type: 'success', ...options }),
    error: (message, options = {}) => addToast({ message, type: 'error', ...options }),
    warning: (message, options = {}) => addToast({ message, type: 'warning', ...options }),
    info: (message, options = {}) => addToast({ message, type: 'info', ...options }),
    custom: addToast,
    remove: removeToast,
    clear: removeAllToasts
  };
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;
  
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>,
    document.body
  );
};

// Toast Item
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);
  
  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };
  
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };
  
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };
  
  const Icon = icons[toast.type];
  
  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        ${colors[toast.type]}
        border rounded-xl p-4 shadow-lg backdrop-blur-sm
        max-w-sm w-full
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[toast.type]}`} />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">
            {toast.message}
          </p>
        </div>
        
        <button
          onClick={handleRemove}
          className="flex-shrink-0 rounded-lg p-1 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Specialized toast hooks
export const useSuccessToast = () => {
  const toast = useToast();
  return (message, options) => toast.success(message, options);
};

export const useErrorToast = () => {
  const toast = useToast();
  return (message, options) => toast.error(message, options);
};

export const useWarningToast = () => {
  const toast = useToast();
  return (message, options) => toast.warning(message, options);
};

export const useInfoToast = () => {
  const toast = useToast();
  return (message, options) => toast.info(message, options);
};

// Specialized toast messages for auction system
export const useBidToast = () => {
  const toast = useToast();
  
  return {
    bidPlaced: (amount) => {
      toast.success(`تم وضع مزايدتك بنجاح بمبلغ ${amount?.toLocaleString('ar-SA')} ريال`, {
        duration: 4000
      });
    },
    
    bidRejected: (reason) => {
      toast.error(`تم رفض المزايدة: ${reason}`, {
        duration: 6000
      });
    },
    
    outbid: (newAmount, bidder) => {
      toast.warning(`تم تجاوز مزايدتك! السعر الحالي: ${newAmount?.toLocaleString('ar-SA')} ريال`, {
        duration: 5000
      });
    },
    
    auctionEnding: (timeLeft) => {
      toast.warning(`المزاد ينتهي خلال ${timeLeft}!`, {
        duration: 3000
      });
    },
    
    auctionEnded: (winner, finalPrice) => {
      toast.info(`انتهى المزاد! الفائز: ${winner} بمبلغ ${finalPrice?.toLocaleString('ar-SA')} ريال`, {
        duration: 8000,
        persistent: true
      });
    },
    
    connectionLost: () => {
      toast.error('فُقد الاتصال. جاري إعادة المحاولة...', {
        persistent: true
      });
    },
    
    connectionRestored: () => {
      toast.success('تم استعادة الاتصال بنجاح');
    }
  };
};

export const useNotificationToast = () => {
  const toast = useToast();
  
  return {
    newMessage: (sender) => {
      toast.info(`رسالة جديدة من ${sender}`, {
        duration: 4000
      });
    },
    
    newComment: (commenter, auction) => {
      toast.info(`تعليق جديد من ${commenter} على ${auction}`, {
        duration: 4000
      });
    },
    
    auctionStarted: (title) => {
      toast.info(`بدأ المزاد: ${title}`, {
        duration: 5000
      });
    },
    
    followingAuctionUpdate: (title, update) => {
      toast.info(`${title}: ${update}`, {
        duration: 4000
      });
    }
  };
};

export default ToastProvider;