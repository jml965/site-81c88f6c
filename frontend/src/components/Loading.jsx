import React from 'react';
import { Loader2, Play, Gavel, Clock, TrendingUp } from 'lucide-react';

// Basic loading spinner
const Loading = ({ 
  size = 'md', 
  className = '',
  text = 'جاري التحميل...',
  showText = true
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizes[size]}`} />
      {showText && text && (
        <p className="mt-3 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Full page loading
export const PageLoading = ({ text = 'جاري تحميل الصفحة...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Gavel className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        <div className="absolute -bottom-2 -right-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">مزاد موشن</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  </div>
);

// Inline loading for buttons
export const ButtonLoading = ({ size = 'sm' }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  };
  
  return <Loader2 className={`animate-spin ${sizes[size]}`} />;
};

// Loading for video player
export const VideoLoading = () => (
  <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
    <div className="text-center text-white">
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <Play className="w-8 h-8 fill-current ml-1" />
        </div>
        <div className="absolute -bottom-1 -right-1">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
      <p className="text-sm font-medium">جاري تحميل الفيديو...</p>
      <p className="text-xs text-white/70 mt-1">قد يستغرق بضع ثوانٍ</p>
    </div>
  </div>
);

// Loading for auction room
export const AuctionRoomLoading = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <div className="bg-white shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1">
          <div className="w-48 h-5 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
    
    {/* Video section */}
    <div className="p-4">
      <VideoLoading />
      
      {/* Timeline skeleton */}
      <div className="mt-4 space-y-3">
        <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex justify-between">
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
    
    {/* Price and bidding section */}
    <div className="bg-white border-t p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
        <div className="text-center">
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="w-full h-12 bg-blue-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

// Loading for bid history
export const BidHistoryLoading = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="text-right">
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

// Loading for auction cards
export const AuctionCardLoading = () => (
  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <div className="aspect-video bg-gray-200 animate-pulse" />
    <div className="p-4">
      <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-3" />
      <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mb-3" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading for data fetching with retry
export const DataLoading = ({ 
  text = 'جاري تحميل البيانات...', 
  onRetry, 
  showRetry = false,
  error = false
}) => (
  <div className="py-12 text-center">
    {error ? (
      <div>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">حدث خطأ في التحميل</h3>
        <p className="text-gray-600 mb-4">تعذر تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        )}
      </div>
    ) : (
      <div>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <p className="text-gray-600">{text}</p>
      </div>
    )}
  </div>
);

// Loading overlay for forms
export const FormLoading = ({ text = 'جاري الحفظ...' }) => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
    <div className="text-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  </div>
);

export default Loading;