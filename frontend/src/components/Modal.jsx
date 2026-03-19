import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = ''
}) => {
  const modalRef = useRef();
  const previousActiveElement = useRef();
  
  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);
  
  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);
  
  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  };
  
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          tabIndex={-1}
          className={`relative w-full ${sizes[size]} transform rounded-2xl bg-white shadow-2xl transition-all ${className}`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-4">
              {title && (
                <h3 className="text-lg font-bold text-gray-900">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className={title || showCloseButton ? 'px-6 pb-6' : 'p-6'}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Specialized modal components
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'تأكيد', 
  message, 
  confirmText = 'تأكيد', 
  cancelText = 'إلغاء',
  variant = 'danger'
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="text-center">
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="flex gap-3 justify-center">
        <Button
          variant={variant}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
        
        <Button
          variant="outline"
          onClick={onClose}
        >
          {cancelText}
        </Button>
      </div>
    </div>
  </Modal>
);

export const AlertModal = ({ 
  isOpen, 
  onClose, 
  title = 'تنبيه', 
  message, 
  buttonText = 'حسناً',
  variant = 'primary'
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="text-center">
      <p className="text-gray-600 mb-6">{message}</p>
      
      <Button
        variant={variant}
        onClick={onClose}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  </Modal>
);

export const BidConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  bidAmount, 
  auctionTitle,
  loading = false
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="تأكيد المزايدة" size="md">
    <div className="text-center">
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h4 className="font-bold text-lg text-blue-900 mb-2">{auctionTitle}</h4>
        <p className="text-2xl font-bold text-blue-600">
          {bidAmount?.toLocaleString('ar-SA')} ريال
        </p>
      </div>
      
      <p className="text-gray-600 mb-6">
        هل تريد تأكيد مزايدتك بمبلغ {bidAmount?.toLocaleString('ar-SA')} ريال؟
      </p>
      
      <div className="flex gap-3">
        <Button
          variant="success"
          onClick={onConfirm}
          loading={loading}
          className="flex-1"
        >
          {loading ? 'جاري التأكيد...' : 'تأكيد المزايدة'}
        </Button>
        
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="flex-1"
        >
          إلغاء
        </Button>
      </div>
    </div>
  </Modal>
);

export const ImageModal = ({ isOpen, onClose, imageUrl, title }) => (
  <Modal 
    isOpen={isOpen} 
    onClose={onClose} 
    size="4xl" 
    className="bg-black/90"
    showCloseButton={true}
  >
    <div className="relative">
      <img 
        src={imageUrl} 
        alt={title}
        className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
      />
      {title && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-3 rounded-lg">
          <p className="text-center font-medium">{title}</p>
        </div>
      )}
    </div>
  </Modal>
);

export default Modal;