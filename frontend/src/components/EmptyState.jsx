import React from 'react';
import { 
  Package, 
  Search, 
  Gavel, 
  MessageSquare, 
  Bell, 
  Heart, 
  Users, 
  Clock, 
  AlertCircle,
  Plus,
  Wifi,
  RefreshCw
} from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      iconBg: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      iconBg: 'w-24 h-24',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      iconBg: 'w-28 h-28',
      title: 'text-2xl',
      description: 'text-lg'
    }
  };
  
  const currentSize = sizes[size];
  
  return (
    <div className={`text-center ${currentSize.container} ${className}`}>
      <div className={`${currentSize.iconBg} bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6`}>
        <Icon className={`${currentSize.icon} text-gray-400`} />
      </div>
      
      {title && (
        <h3 className={`font-bold text-gray-900 mb-3 ${currentSize.title}`}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className={`text-gray-600 max-w-md mx-auto mb-6 leading-relaxed ${currentSize.description}`}>
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          icon={Plus}
          className="mx-auto"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// Specialized empty states for auction system
export const EmptyAuctions = ({ 
  title = 'لا توجد مزادات',
  description = 'لم يتم العثور على أي مزادات في الوقت الحالي.',
  showCreateButton = false,
  onCreateAuction
}) => (
  <EmptyState
    icon={Gavel}
    title={title}
    description={description}
    actionLabel={showCreateButton ? 'إنشاء مزاد جديد' : undefined}
    onAction={showCreateButton ? onCreateAuction : undefined}
  />
);

export const EmptySearchResults = ({ 
  searchTerm,
  onClearSearch
}) => (
  <EmptyState
    icon={Search}
    title="لم يتم العثور على نتائج"
    description={`لا توجد مزادات تطابق البحث "${searchTerm}". جرب كلمات مفتاحية مختلفة.`}
    actionLabel="مسح البحث"
    onAction={onClearSearch}
  />
);

export const EmptyBids = ({ 
  auctionTitle,
  showBidButton = true,
  onPlaceBid
}) => (
  <EmptyState
    icon={Gavel}
    title="لا توجد مزايدات بعد"
    description={`كن أول من يضع مزايدة على "${auctionTitle}"!`}
    actionLabel={showBidButton ? 'ضع مزايدتك الآن' : undefined}
    onAction={showBidButton ? onPlaceBid : undefined}
    size="sm"
  />
);

export const EmptyComments = ({ 
  showAddButton = true,
  onAddComment
}) => (
  <EmptyState
    icon={MessageSquare}
    title="لا توجد تعليقات"
    description="كن أول من يشارك رأيه في هذا المزاد!"
    actionLabel={showAddButton ? 'أضف تعليق' : undefined}
    onAction={showAddButton ? onAddComment : undefined}
    size="sm"
  />
);

export const EmptyNotifications = () => (
  <EmptyState
    icon={Bell}
    title="لا توجد إشعارات"
    description="ستظهر هنا جميع الإشعارات المهمة المتعلقة بالمزادات والمزايدات."
  />
);

export const EmptyMessages = ({ 
  showStartButton = true,
  onStartConversation
}) => (
  <EmptyState
    icon={MessageSquare}
    title="لا توجد رسائل"
    description="ابدأ محادثة مع البائعين أو اطرح استفساراتك."
    actionLabel={showStartButton ? 'بدء محادثة' : undefined}
    onAction={showStartButton ? onStartConversation : undefined}
  />
);

export const EmptyFavorites = () => (
  <EmptyState
    icon={Heart}
    title="لا توجد مفضلات"
    description="أضف المزادات التي تعجبك إلى المفضلة لمتابعتها بسهولة."
  />
);

export const EmptyFollowing = () => (
  <EmptyState
    icon={Users}
    title="لا تتابع أي مزادات"
    description="تابع المزادات والبائعين المفضلين لديك لتلقي التحديثات."
  />
);

export const AuctionEnded = ({ 
  winner,
  finalPrice,
  showResultsButton = true,
  onViewResults
}) => (
  <EmptyState
    icon={Clock}
    title="انتهى المزاد"
    description={
      winner && finalPrice
        ? `الفائز: ${winner} بمبلغ ${finalPrice.toLocaleString('ar-SA')} ريال`
        : 'تم إنهاء هذا المزاد'
    }
    actionLabel={showResultsButton ? 'عرض النتائج' : undefined}
    onAction={showResultsButton ? onViewResults : undefined}
    size="sm"
  />
);

export const AuctionNotStarted = ({ 
  startTime,
  showNotifyButton = true,
  onSetNotification
}) => (
  <EmptyState
    icon={Clock}
    title="لم يبدأ المزاد بعد"
    description={`سيبدأ المزاد في ${new Date(startTime).toLocaleDateString('ar-SA')} الساعة ${new Date(startTime).toLocaleTimeString('ar-SA')}`}
    actionLabel={showNotifyButton ? 'تذكيرني عند البداية' : undefined}
    onAction={showNotifyButton ? onSetNotification : undefined}
    size="sm"
  />
);

export const ConnectionLost = ({ onRetry }) => (
  <EmptyState
    icon={Wifi}
    title="فُقد الاتصال"
    description="تحقق من اتصال الإنترنت وأعد المحاولة."
    actionLabel="إعادة المحاولة"
    onAction={onRetry}
    size="sm"
    className="text-red-600"
  />
);

export const LoadingFailed = ({ 
  error,
  onRetry,
  showDetails = false
}) => (
  <EmptyState
    icon={AlertCircle}
    title="فشل في التحميل"
    description={
      showDetails && error
        ? `حدث خطأ: ${error.message || 'خطأ غير معروف'}`
        : 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.'
    }
    actionLabel="إعادة المحاولة"
    onAction={onRetry}
    size="sm"
  />
);

export const EmptyUserBids = ({ 
  showExploreButton = true,
  onExploreAuctions
}) => (
  <EmptyState
    icon={Gavel}
    title="لم تشارك في أي مزادات بعد"
    description="ابدأ في المشاركة واستكشف المزادات المتاحة!"
    actionLabel={showExploreButton ? 'استكشاف المزادات' : undefined}
    onAction={showExploreButton ? onExploreAuctions : undefined}
  />
);

export const EmptySellerAuctions = ({ 
  showCreateButton = true,
  onCreateAuction
}) => (
  <EmptyState
    icon={Package}
    title="لم تنشئ أي مزادات بعد"
    description="ابدأ في بيع منتجاتك وإنشاء مزادات جديدة!"
    actionLabel={showCreateButton ? 'إنشاء مزاد جديد' : undefined}
    onAction={showCreateButton ? onCreateAuction : undefined}
  />
);

export const MaintenanceMode = () => (
  <EmptyState
    icon={RefreshCw}
    title="المنصة قيد الصيانة"
    description="نعمل على تحسين المنصة. سنعود قريباً!"
    size="lg"
  />
);

export default EmptyState;