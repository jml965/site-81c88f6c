import React, { useState, useCallback, useEffect } from 'react';
import { Gavel, Plus, Minus, TrendingUp, AlertCircle, Check, X } from 'lucide-react';

export default function BidPanel({ 
  currentPrice = 0, 
  minimumIncrement = 10, 
  onPlaceBid, 
  onQuickBid,
  quickBidAmounts = [50, 100, 200, 500],
  currency = 'ر.س',
  disabled = false,
  className = ''
}) {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customIncrement, setCustomIncrement] = useState(minimumIncrement);

  const minimumBid = currentPrice + minimumIncrement;

  // Reset states when currentPrice changes
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [currentPrice]);

  // Clear messages after delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const validateBid = useCallback((amount) => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return 'يرجى إدخال مبلغ صحيح';
    }
    
    if (numAmount < minimumBid) {
      return `الحد الأدنى للمزايدة هو ${minimumBid.toLocaleString()} ${currency}`;
    }
    
    if (numAmount % minimumIncrement !== 0 && minimumIncrement > 1) {
      return `المبلغ يجب أن يكون من مضاعفات ${minimumIncrement} ${currency}`;
    }
    
    return null;
  }, [minimumBid, minimumIncrement, currency]);

  const handleBidSubmit = useCallback(async (amount) => {
    if (disabled || isSubmitting) return;
    
    const validationError = validateBid(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await onPlaceBid(parseFloat(amount));
      setSuccess('تم تسجيل مزايدتك بنجاح!');
      setBidAmount('');
    } catch (error) {
      setError(error.message || 'حدث خطأ أثناء تسجيل المزايدة');
    } finally {
      setIsSubmitting(false);
    }
  }, [disabled, isSubmitting, validateBid, onPlaceBid]);

  const handleQuickBid = useCallback(async (increment) => {
    if (disabled || isSubmitting) return;
    
    const amount = currentPrice + increment;
    setIsSubmitting(true);
    setError('');
    
    try {
      await onQuickBid(increment);
      setSuccess(`تم رفع المزايدة بـ ${increment} ${currency}`);
    } catch (error) {
      setError(error.message || 'حدث خطأ أثناء المزايدة السريعة');
    } finally {
      setIsSubmitting(false);
    }
  }, [disabled, isSubmitting, currentPrice, onQuickBid, currency]);

  const handleCustomBidSubmit = useCallback((e) => {
    e.preventDefault();
    handleBidSubmit(bidAmount);
  }, [bidAmount, handleBidSubmit]);

  const handleIncrementChange = useCallback((delta) => {
    setCustomIncrement(prev => Math.max(minimumIncrement, prev + delta));
  }, [minimumIncrement]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('ar-SA').format(price);
  }, []);

  if (disabled) {
    return (
      <div className={`bg-gray-100 rounded-xl p-6 ${className}`} dir="rtl">
        <div className="text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-600 mb-2">المزاد غير نشط</h3>
          <p className="text-gray-500">لا يمكن تسجيل مزايدات في الوقت الحالي</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Gavel size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">تسجيل مزايدة</h3>
            <p className="text-sm text-gray-500">السعر الحالي: {formatPrice(currentPrice)} {currency}</p>
          </div>
        </div>
        <div className="text-left">
          <div className="text-sm text-gray-500">الحد الأدنى</div>
          <div className="text-lg font-bold text-green-600">{formatPrice(minimumBid)} {currency}</div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center space-x-2 space-x-reverse bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <X size={16} className="text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-center space-x-2 space-x-reverse bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <Check size={16} className="text-green-500" />
          <span className="text-sm text-green-700">{success}</span>
        </div>
      )}

      {/* Quick Bid Buttons */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">مزايدة سريعة</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickBidAmounts.map(amount => {
            const newPrice = currentPrice + amount;
            return (
              <button
                key={amount}
                onClick={() => handleQuickBid(amount)}
                disabled={isSubmitting}
                className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="text-sm opacity-90">+{formatPrice(amount)}</div>
                <div className="text-xs opacity-75">{formatPrice(newPrice)} {currency}</div>
                {isSubmitting && (
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Bid Form */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">مزايدة مخصصة</h4>
        
        <form onSubmit={handleCustomBidSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ ({currency})</label>
            <div className="relative">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`الحد الأدنى: ${formatPrice(minimumBid)}`}
                min={minimumBid}
                step={minimumIncrement}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
                disabled={isSubmitting}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">
                {currency}
              </div>
            </div>
          </div>

          {/* Increment Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">زيادة سريعة</label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => handleIncrementChange(-minimumIncrement)}
                disabled={customIncrement <= minimumIncrement}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={16} />
              </button>
              
              <div className="flex-1 text-center py-2 border border-gray-300 rounded-lg bg-gray-50">
                <span className="text-sm font-medium">{formatPrice(customIncrement)} {currency}</span>
              </div>
              
              <button
                type="button"
                onClick={() => handleIncrementChange(minimumIncrement)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus size={16} />
              </button>
              
              <button
                type="button"
                onClick={() => setBidAmount(String(currentPrice + customIncrement))}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                تطبيق
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !bidAmount}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 space-x-reverse"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>جاري التسجيل...</span>
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                <span>تسجيل المزايدة</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bid Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="text-sm font-medium text-blue-800 mb-2">إرشادات المزايدة</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• الحد الأدنى للزيادة: {formatPrice(minimumIncrement)} {currency}</li>
          <li>• يتم تسجيل المزايدات فوراً وبشكل نهائي</li>
          <li>• تأكد من المبلغ قبل التسجيل</li>
          <li>• المزايدة الأعلى تفوز عند انتهاء الوقت</li>
        </ul>
      </div>
    </div>
  );
}