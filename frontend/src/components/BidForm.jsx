import React, { useState, useEffect, useRef } from 'react';
import { useBidding } from '../hooks/useBidding';
import { validateBid } from '../utils/bidValidation';
import { DollarSign, Plus, AlertCircle, CheckCircle } from 'lucide-react';

const BidForm = ({ auctionId, currentPrice, minIncrement, auctionStatus, userId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { placeBid } = useBidding(auctionId);
  const inputRef = useRef(null);

  // Quick bid amounts based on current price
  const quickBids = [
    currentPrice + minIncrement,
    currentPrice + (minIncrement * 2),
    currentPrice + (minIncrement * 5),
    currentPrice + (minIncrement * 10)
  ];

  useEffect(() => {
    // Clear messages after 3 seconds
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('يجب تسجيل الدخول للمزايدة');
      return;
    }

    if (auctionStatus !== 'active') {
      setError('المزاد غير نشط حالياً');
      return;
    }

    const amount = parseFloat(bidAmount);
    const validation = validateBid(amount, currentPrice, minIncrement);
    
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await placeBid(amount);
      setSuccess(`تم تسجيل مزايدتك بمبلغ ${amount.toLocaleString('ar-SA')} ريال`);
      setBidAmount('');
      inputRef.current?.focus();
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تسجيل المزايدة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickBid = async (amount) => {
    if (!userId) {
      setError('يجب تسجيل الدخول للمزايدة');
      return;
    }

    if (auctionStatus !== 'active') {
      setError('المزاد غير نشط حالياً');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await placeBid(amount);
      setSuccess(`تم تسجيل مزايدتك بمبلغ ${amount.toLocaleString('ar-SA')} ريال`);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تسجيل المزايدة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (auctionStatus === 'ended') {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <AlertCircle className="mx-auto mb-3 w-12 h-12 text-gray-400" />
        <p className="text-gray-600 font-semibold">انتهى المزاد</p>
        <p className="text-sm text-gray-500 mt-1">لا يمكن إضافة مزايدات جديدة</p>
      </div>
    );
  }

  if (auctionStatus === 'upcoming') {
    return (
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <AlertCircle className="mx-auto mb-3 w-12 h-12 text-blue-400" />
        <p className="text-blue-700 font-semibold">المزاد لم يبدأ بعد</p>
        <p className="text-sm text-blue-600 mt-1">انتظر حتى بداية المزاد للمشاركة</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="bg-amber-50 rounded-xl p-6 text-center">
        <AlertCircle className="mx-auto mb-3 w-12 h-12 text-amber-400" />
        <p className="text-amber-700 font-semibold">يجب تسجيل الدخول</p>
        <p className="text-sm text-amber-600 mt-1">قم بتسجيل الدخول للمشاركة في المزايدة</p>
        <button className="mt-4 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors">
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Current Price Display */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">السعر الحالي</h3>
        <div className="text-3xl font-bold text-green-600 mb-2">
          {formatCurrency(currentPrice)}
        </div>
        <p className="text-sm text-gray-500">
          الحد الأدنى للزيادة: {formatCurrency(minIncrement)}
        </p>
      </div>

      {/* Quick Bid Buttons */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">مزايدة سريعة</h4>
        <div className="grid grid-cols-2 gap-2">
          {quickBids.map((amount, index) => (
            <button
              key={index}
              onClick={() => handleQuickBid(amount)}
              disabled={isSubmitting}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg py-3 px-4 text-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {formatCurrency(amount)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Bid Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
            مزايدة مخصصة
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`أدخل مبلغ أكبر من ${formatCurrency(currentPrice + minIncrement)}`}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              min={currentPrice + minIncrement}
              step="1"
              disabled={isSubmitting}
            />
            <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !bidAmount}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري التسجيل...
            </>
          ) : (
            <>
              <DollarSign className="w-5 h-5" />
              تأكيد المزايدة
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {/* Bidding Tips */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">نصائح للمزايدة</h5>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• ضع مزايدتك قبل انتهاء الوقت بوقت كافٍ</li>
          <li>• تأكد من اتصال الإنترنت لديك</li>
          <li>• راقب آخر المزايدات باستمرار</li>
          <li>• لا تتردد في استخدام المزايدة السريعة</li>
        </ul>
      </div>
    </div>
  );
};

export default BidForm;