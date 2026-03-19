import React from 'react';

const NotificationBadge = ({ 
  count = 0, 
  maxCount = 99, 
  className = '',
  showZero = false,
  size = 'default', // 'small', 'default', 'large'
  variant = 'red' // 'red', 'blue', 'green', 'gray', 'indigo'
}) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'h-4 w-4 text-xs min-w-[16px]';
      case 'large':
        return 'h-7 w-7 text-sm min-w-[28px]';
      default:
        return 'h-5 w-5 text-xs min-w-[20px]';
    }
  };

  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'blue':
        return 'bg-blue-600 text-white';
      case 'green':
        return 'bg-green-600 text-white';
      case 'gray':
        return 'bg-gray-600 text-white';
      case 'indigo':
        return 'bg-indigo-600 text-white';
      default:
        return 'bg-red-600 text-white';
    }
  };

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant);

  return (
    <span 
      className={`
        inline-flex items-center justify-center
        ${sizeClasses}
        ${variantClasses}
        rounded-full
        font-medium
        leading-none
        ${className}
      `}
      title={`${count} إشعار${count !== 1 ? 'ات' : ''} جديد${count !== 1 ? 'ة' : ''}`}
    >
      {displayCount}
    </span>
  );
};

// Preset badge components for common use cases
export const AuctionBadge = ({ count, className = '' }) => (
  <NotificationBadge 
    count={count} 
    variant="blue" 
    className={className} 
  />
);

export const BidBadge = ({ count, className = '' }) => (
  <NotificationBadge 
    count={count} 
    variant="green" 
    className={className} 
  />
);

export const MessageBadge = ({ count, className = '' }) => (
  <NotificationBadge 
    count={count} 
    variant="indigo" 
    className={className} 
  />
);

export const SystemBadge = ({ count, className = '' }) => (
  <NotificationBadge 
    count={count} 
    variant="gray" 
    className={className} 
  />
);

// Badge with pulse animation for urgent notifications
export const UrgentBadge = ({ count, className = '' }) => {
  if (count === 0) return null;
  
  return (
    <span className="relative">
      <NotificationBadge 
        count={count} 
        variant="red" 
        className={className} 
      />
      <span className="absolute inset-0 rounded-full bg-red-600 opacity-75 animate-ping" />
    </span>
  );
};

// Badge with custom icon
export const IconBadge = ({ 
  count, 
  icon: Icon, 
  iconSize = 16, 
  className = '',
  variant = 'red'
}) => {
  return (
    <div className="relative inline-block">
      <Icon size={iconSize} className="text-gray-600" />
      {count > 0 && (
        <NotificationBadge 
          count={count} 
          variant={variant} 
          size="small"
          className={`absolute -top-1 -right-1 ${className}`}
        />
      )}
    </div>
  );
};

export default NotificationBadge;