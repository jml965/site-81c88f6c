import React from 'react';
import { 
  Clock, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Crown, 
  TrendingUp,
  Eye,
  Users,
  Heart,
  Star
} from 'lucide-react';

const Badge = ({ 
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  pulse = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    orange: 'bg-orange-100 text-orange-800',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    dark: 'bg-gray-800 text-white',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
    live: 'bg-red-500 text-white',
    premium: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
  };
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
    xl: 'px-5 py-2 text-base'
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  };
  
  const pulseClass = pulse ? 'animate-pulse' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${pulseClass} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizes[size]} mr-1`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizes[size]} ml-1`} />
      )}
    </span>
  );
};

// Specialized badges for auction system
export const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    pending: {
      variant: 'warning',
      icon: Clock,
      text: 'في الانتظار'
    },
    active: {
      variant: 'success',
      icon: Play,
      text: 'نشط',
      pulse: true
    },
    live: {
      variant: 'live',
      icon: Play,
      text: 'مباشر',
      pulse: true
    },
    ended: {
      variant: 'default',
      icon: CheckCircle,
      text: 'انتهى'
    },
    cancelled: {
      variant: 'danger',
      icon: XCircle,
      text: 'ملغي'
    },
    draft: {
      variant: 'outline',
      icon: AlertTriangle,
      text: 'مسودة'
    }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      pulse={config.pulse}
      {...props}
    >
      {config.text}
    </Badge>
  );
};

export const PriorityBadge = ({ priority, ...props }) => {
  const priorities = {
    low: { variant: 'default', text: 'عادي' },
    medium: { variant: 'warning', text: 'مهم' },
    high: { variant: 'danger', text: 'عاجل' },
    premium: { variant: 'premium', icon: Crown, text: 'مميز' }
  };
  
  const config = priorities[priority] || priorities.low;
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      {...props}
    >
      {config.text}
    </Badge>
  );
};

export const CategoryBadge = ({ category, ...props }) => {
  const categories = {
    cars: { variant: 'primary', text: 'سيارات' },
    electronics: { variant: 'info', text: 'إلكترونيات' },
    jewelry: { variant: 'premium', text: 'مجوهرات' },
    antiques: { variant: 'orange', text: 'تحف' },
    art: { variant: 'purple', text: 'فن' },
    collectibles: { variant: 'pink', text: 'مقتنيات' },
    real_estate: { variant: 'success', text: 'عقارات' },
    livestock: { variant: 'warning', text: 'حيوانات' },
    other: { variant: 'default', text: 'أخرى' }
  };
  
  const config = categories[category] || categories.other;
  
  return (
    <Badge variant={config.variant} {...props}>
      {config.text}
    </Badge>
  );
};

export const CountBadge = ({ count, type = 'default', ...props }) => {
  if (count === 0) return null;
  
  const types = {
    default: { variant: 'default' },
    views: { variant: 'info', icon: Eye },
    participants: { variant: 'success', icon: Users },
    likes: { variant: 'danger', icon: Heart },
    bids: { variant: 'primary', icon: TrendingUp },
    rating: { variant: 'warning', icon: Star }
  };
  
  const config = types[type] || types.default;
  
  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      size="sm"
      {...props}
    >
      {count > 999 ? `${(count / 1000).toFixed(1)}ك` : count.toLocaleString('ar-SA')}
    </Badge>
  );
};

export const TimeBadge = ({ timeLeft, urgent = false, ...props }) => {
  const variant = urgent ? 'danger' : 'warning';
  
  return (
    <Badge
      variant={variant}
      icon={Clock}
      pulse={urgent}
      {...props}
    >
      {timeLeft}
    </Badge>
  );
};

export const PriceBadge = ({ price, currency = 'ريال', highlight = false, ...props }) => {
  const variant = highlight ? 'gradient' : 'success';
  
  return (
    <Badge
      variant={variant}
      size="lg"
      {...props}
    >
      {price?.toLocaleString('ar-SA')} {currency}
    </Badge>
  );
};

export const NewBadge = ({ ...props }) => (
  <Badge
    variant="danger"
    size="xs"
    pulse
    {...props}
  >
    جديد
  </Badge>
);

export const HotBadge = ({ ...props }) => (
  <Badge
    variant="live"
    size="xs"
    pulse
    {...props}
  >
    🔥 مميز
  </Badge>
);

export const VerifiedBadge = ({ ...props }) => (
  <Badge
    variant="success"
    icon={CheckCircle}
    size="sm"
    {...props}
  >
    موثق
  </Badge>
);

export const FeaturedBadge = ({ ...props }) => (
  <Badge
    variant="premium"
    icon={Crown}
    size="sm"
    {...props}
  >
    مميز
  </Badge>
);

export const LiveBadge = ({ ...props }) => (
  <Badge
    variant="live"
    size="sm"
    pulse
    {...props}
  >
    🔴 مباشر
  </Badge>
);

export const NotificationBadge = ({ count, ...props }) => {
  if (!count || count === 0) return null;
  
  return (
    <Badge
      variant="danger"
      size="xs"
      className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full text-xs font-bold flex items-center justify-center"
      {...props}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

// Badge group for multiple badges
export const BadgeGroup = ({ children, className = '' }) => (
  <div className={`flex flex-wrap items-center gap-2 ${className}`}>
    {children}
  </div>
);

// Interactive badge (clickable)
export const InteractiveBadge = ({ onClick, disabled = false, ...props }) => {
  const hoverClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'hover:scale-105 active:scale-95 cursor-pointer transition-transform';
  
  return (
    <Badge
      className={hoverClasses}
      onClick={disabled ? undefined : onClick}
      {...props}
    />
  );
};

export default Badge;