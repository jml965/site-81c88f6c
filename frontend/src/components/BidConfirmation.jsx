import React, { useState, useEffect } from 'react';
import { CheckCircle, X, AlertTriangle, Clock, DollarSign, Trophy, Users } from 'lucide-react';

const BidConfirmation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  bidAmount, 
  currentPrice, 
  auctionTitle, 
  timeRemaining, 
  participantCount,
  isSubmitting = false 
}) => {
  const [countdown, setCountdown] = useState(10);
  const [autoConfirm, setAutoConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(10);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (autoConfirm && !isSubmitting) {
            onConfirm();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, autoConfirm, onConfirm, isSubmitting]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const increaseAmount = bidAmount - currentPrice;
  const increasePercentage = ((increaseAmount / currentPrice) * 100).toFixed(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">تأكيد المزايدة</h3>
            </div>
            {!isSubmitting && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Auction Info */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              {auctionTitle}
            </h4>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{participantCount} مشارك</span>
              </div>
            </div>
          </div>

          {/* Bid Details */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">السعر الحالي:</span>
              <span className="text-lg font-bold text-gray-800">
                {formatCurrency(currentPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مزايدتك الجديدة:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(bidAmount)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-gray-600">الزيادة:</span>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">
                  +{formatCurrency(increaseAmount)}
                </span>
                <span className="block text-sm text-gray-500">
                  ({increasePercentage}% زيادة)
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">تنبيه مهم:</p>
                <ul className="space-y-1 text-xs">
                  <li>• مزايدتك ملزمة ولا يمكن إلغاؤها</li>
                  <li>• تأكد من المبلغ قبل التأكيد</li>
                  <li>• قد تتم مزايدات أخرى بعد مزايدتك</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Auto-confirm option */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoConfirm"
              checked={autoConfirm}
              onChange={(e) => setAutoConfirm(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoConfirm" className="text-sm text-gray-700">
              تأكيد تلقائي خلال {countdown} ثانية
            </label>
          </div>

          {/* Countdown */}
          {countdown > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {autoConfirm ? 'تأكيد تلقائي خلال' : 'إغلاق خلال'} {countdown} ثانية
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التسجيل...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                تأكيد المزايدة
              </>
            )}
          </button>
        </div>

        {/* Success indicator */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-800">جاري تسجيل المزايدة...</p>
              <p className="text-sm text-gray-600 mt-1">يرجى الانتظار</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidConfirmation;