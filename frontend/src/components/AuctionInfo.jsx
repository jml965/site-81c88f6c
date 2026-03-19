import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Shield, Truck, MapPin } from 'lucide-react';

export default function AuctionInfo({ auction }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!auction?.endTime) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('انتهى المزاد');
        setIsEnded(true);
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  const formatPrice = (price) => {
    return price?.toLocaleString('ar-SA') + ' ريال';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!auction) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <DollarSign className="h-5 w-5 ml-2" />
          معلومات المزاد
        </h3>
        
        {/* Current Price */}
        <div className="text-center mb-4">
          <div className="text-sm opacity-90 mb-1">السعر الحالي</div>
          <div className="text-3xl font-bold">{formatPrice(auction.currentPrice)}</div>
          <div className="text-sm opacity-90">
            بزيادة {formatPrice(auction.currentPrice - auction.startingPrice)} عن سعر البداية
          </div>
        </div>

        {/* Countdown */}
        <div className="text-center">
          <div className="text-sm opacity-90 mb-1">الوقت المتبقي</div>
          <div className={`text-xl font-bold ${isEnded ? 'text-red-200' : ''}`}>
            <Clock className="h-5 w-5 inline ml-1" />
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        {/* Pricing Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">سعر البداية</div>
            <div className="font-semibold text-gray-900">
              {formatPrice(auction.startingPrice)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">أقل زيادة</div>
            <div className="font-semibold text-gray-900">
              {formatPrice(auction.minIncrement)}
            </div>
          </div>
        </div>

        {/* Timing Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">بداية المزاد:</span>
            <span className="font-medium text-gray-900">
              {formatDate(auction.startTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">نهاية المزاد:</span>
            <span className="font-medium text-gray-900">
              {formatDate(auction.endTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">مدة المزاد:</span>
            <span className="font-medium text-gray-900">
              {auction.duration} دقيقة
            </span>
          </div>
        </div>

        {/* Item Details */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">تفاصيل القطعة</h4>
          
          {auction.condition && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الحالة:</span>
              <span className="font-medium text-gray-900">{auction.condition}</span>
            </div>
          )}
          
          {auction.material && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">المادة:</span>
              <span className="font-medium text-gray-900">{auction.material}</span>
            </div>
          )}
          
          {auction.dimensions && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الأبعاد:</span>
              <span className="font-medium text-gray-900">{auction.dimensions}</span>
            </div>
          )}
          
          {auction.weight && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الوزن:</span>
              <span className="font-medium text-gray-900">{auction.weight}</span>
            </div>
          )}
          
          {auction.origin && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">المنشأ:</span>
              <span className="font-medium text-gray-900">{auction.origin}</span>
            </div>
          )}
          
          {auction.age && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">العمر:</span>
              <span className="font-medium text-gray-900">{auction.age}</span>
            </div>
          )}
          
          {auction.rarity && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الندرة:</span>
              <span className="font-medium text-green-600">{auction.rarity}</span>
            </div>
          )}
        </div>

        {/* Authentication */}
        {auction.authentication && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-green-700 mb-1">
              <Shield className="h-4 w-4 ml-1" />
              <span className="font-medium">شهادة الأصالة</span>
            </div>
            <div className="text-sm text-green-600">{auction.authentication}</div>
          </div>
        )}

        {/* Shipping Info */}
        {auction.shippingInfo && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Truck className="h-4 w-4 ml-1" />
              معلومات الشحن
            </h4>
            <div className="space-y-2 text-sm">
              {auction.shippingInfo.available && (
                <div className="flex justify-between">
                  <span className="text-gray-600">التكلفة:</span>
                  <span className="text-gray-900">{auction.shippingInfo.cost}</span>
                </div>
              )}
              {auction.shippingInfo.time && (
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة:</span>
                  <span className="text-gray-900">{auction.shippingInfo.time}</span>
                </div>
              )}
              {auction.shippingInfo.insurance && (
                <div className="flex justify-between">
                  <span className="text-gray-600">التأمين:</span>
                  <span className="text-green-600">{auction.shippingInfo.insurance}</span>
                </div>
              )}
              {auction.shippingInfo.packaging && (
                <div className="text-gray-600">
                  {auction.shippingInfo.packaging}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 ml-1" />
          <span>{auction.location}</span>
        </div>

        {/* Rules */}
        {auction.rules && auction.rules.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">شروط المزاد</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              {auction.rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 ml-2">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}