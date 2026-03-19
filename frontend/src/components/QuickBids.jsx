import React, { useState } from 'react';
import { useBidding } from '../hooks/useBidding';
import { Plus, Zap, TrendingUp, Target } from 'lucide-react';

const QuickBids = ({ auctionId, currentPrice, minIncrement, auctionStatus, userId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAmount, setSubmittingAmount] = useState(null);
  const { placeBid } = useBidding(auctionId);

  // Generate smart quick bid amounts
  const generateQuickBids = () => {
    const baseAmount = currentPrice + minIncrement;
    const increments = [1, 2, 5, 10, 20, 50];
    
    return increments.map(multiplier => {
      const amount = currentPrice + (minIncrement * multiplier);
      return {
        amount,
        label: `+${formatCurrency(minIncrement * multiplier)}`,
        isRecommended: multiplier === 2 || multiplier === 5,
        icon: multiplier <= 2 ? Plus : multiplier <= 10 ? Zap : TrendingUp
      };
    }).filter(bid => bid.amount > currentPrice);
  };

  const quickBids = generateQuickBids();

  const handleQuickBid = async (amount) => {
    if (!userId || auctionStatus !== 'active' || isSubmitting) return;

    setIsSubmitting(true);
    setSubmittingAmount(amount);

    try {
      await placeBid(amount);
    } catch (error) {
      console.error('Quick bid error:', error);
    } finally {
      setIsSubmitting(false);
      setSubmittingAmount(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (auctionStatus !== 'active' || !userId) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-800">مزايدة سريعة</h3>
      </div>

      {/* Current Price Info */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">السعر الحالي</span>
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(currentPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">الحد الأدنى للزيادة</span>
          <span className="text-sm font-medium text-gray-700">
            {formatCurrency(minIncrement)}
          </span>
        </div>
      </div>

      {/* Quick Bid Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {quickBids.slice(0, 4).map((bid, index) => {
            const IconComponent = bid.icon;
            const isSubmittingThis = submittingAmount === bid.amount;
            
            return (
              <button
                key={index}
                onClick={() => handleQuickBid(bid.amount)}
                disabled={isSubmitting}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200
                  ${bid.isRecommended 
                    ? 'border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-700' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  }
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                  ${isSubmittingThis ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {bid.isRecommended && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    مُوصى
                  </div>
                )}
                
                {isSubmittingThis ? (
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                ) : (
                  <IconComponent className="w-6 h-6 mb-2" />
                )}
                
                <span className="text-sm font-medium mb-1">{bid.label}</span>
                <span className="text-lg font-bold">
                  {formatCurrency(bid.amount)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Extended Options */}
        {quickBids.length > 4 && (
          <div className="border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-500 mb-3 text-center">زيادات أكبر</p>
            <div className="grid grid-cols-2 gap-2">
              {quickBids.slice(4).map((bid, index) => {
                const IconComponent = bid.icon;
                const isSubmittingThis = submittingAmount === bid.amount;
                
                return (
                  <button
                    key={index + 4}
                    onClick={() => handleQuickBid(bid.amount)}
                    disabled={isSubmitting}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                      border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'}
                      ${isSubmittingThis ? 'ring-2 ring-purple-500' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {isSubmittingThis ? (
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{bid.label}</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCurrency(bid.amount)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
        <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          نصائح المزايدة السريعة
        </h4>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• استخدم الأزرار الموصى بها للمزايدة الذكية</li>
          <li>• كلما زادت المزايدة، زادت فرصة الفوز</li>
          <li>• راقب الوقت المتبقي قبل وضع مزايدتك</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <span>المزايدة التالية: {formatCurrency(currentPrice + minIncrement)}</span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {quickBids.length} خيارات متاحة
        </span>
      </div>
    </div>
  );
};

export default QuickBids;