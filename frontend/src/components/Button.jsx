import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 active:scale-95',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 active:scale-95',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 active:scale-95',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 active:scale-95',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500'
  };
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const iconClasses = {
    left: 'mr-2',
    right: 'ml-2'
  };
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      )}
      
      {Icon && !loading && iconPosition === 'left' && (
        <Icon className={`w-4 h-4 ${iconClasses.left}`} />
      )}
      
      {children}
      
      {Icon && !loading && iconPosition === 'right' && (
        <Icon className={`w-4 h-4 ${iconClasses.right}`} />
      )}
    </button>
  );
};

// Specialized button components
export const PrimaryButton = ({ children, ...props }) => (
  <Button variant="primary" {...props}>{children}</Button>
);

export const SecondaryButton = ({ children, ...props }) => (
  <Button variant="secondary" {...props}>{children}</Button>
);

export const DangerButton = ({ children, ...props }) => (
  <Button variant="danger" {...props}>{children}</Button>
);

export const OutlineButton = ({ children, ...props }) => (
  <Button variant="outline" {...props}>{children}</Button>
);

export const GhostButton = ({ children, ...props }) => (
  <Button variant="ghost" {...props}>{children}</Button>
);

export const LinkButton = ({ children, ...props }) => (
  <Button variant="link" {...props}>{children}</Button>
);

export const BidButton = ({ amount, onBid, loading, disabled }) => (
  <Button
    variant="success"
    size="lg"
    loading={loading}
    disabled={disabled}
    onClick={onBid}
    className="w-full font-bold text-lg"
  >
    {loading ? 'جاري المزايدة...' : `مزايدة بـ ${amount?.toLocaleString('ar-SA')} ريال`}
  </Button>
);

export const QuickBidButton = ({ increase, onQuickBid, currentPrice }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => onQuickBid(increase)}
    className="text-blue-600 border-blue-600 hover:bg-blue-50"
  >
    +{increase}
  </Button>
);

export default Button;