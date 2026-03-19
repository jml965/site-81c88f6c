import React from 'react';

// Base skeleton component
const Skeleton = ({ 
  width, 
  height, 
  className = '',
  shape = 'rounded',
  animation = 'pulse'
}) => {
  const shapes = {
    rounded: 'rounded',
    'rounded-lg': 'rounded-lg',
    'rounded-xl': 'rounded-xl',
    'rounded-2xl': 'rounded-2xl',
    'rounded-full': 'rounded-full',
    square: 'rounded-none'
  };
  
  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer',
    none: ''
  };
  
  const style = {
    width: width || undefined,
    height: height || undefined
  };
  
  return (
    <div 
      className={`bg-gray-200 ${shapes[shape]} ${animations[animation]} ${className}`}
      style={style}
    />
  );
};

// Text skeleton
export const TextSkeleton = ({ 
  lines = 1, 
  className = '',
  lastLineWidth = '75%'
}) => {
  if (lines === 1) {
    return <Skeleton className={`h-4 ${className}`} />;
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines - 1 }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
      <Skeleton className="h-4" width={lastLineWidth} />
    </div>
  );
};

// Avatar skeleton
export const AvatarSkeleton = ({ size = 'md' }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };
  
  return (
    <Skeleton 
      className={sizes[size]} 
      shape="rounded-full" 
    />
  );
};

// Button skeleton
export const ButtonSkeleton = ({ size = 'md', width = 'auto' }) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-14'
  };
  
  const widths = {
    auto: 'w-24',
    full: 'w-full',
    sm: 'w-20',
    md: 'w-32',
    lg: 'w-40'
  };
  
  return (
    <Skeleton 
      className={`${sizes[size]} ${widths[width]}`} 
      shape="rounded-xl" 
    />
  );
};

// Card skeleton
export const CardSkeleton = ({ 
  showImage = true,
  showAvatar = false,
  imageHeight = 'h-48',
  className = ''
}) => (
  <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${className}`}>
    {showImage && (
      <Skeleton className={`w-full ${imageHeight}`} shape="square" />
    )}
    
    <div className="p-4 space-y-3">
      {showAvatar && (
        <div className="flex items-center gap-3">
          <AvatarSkeleton size="sm" />
          <Skeleton className="h-4 w-24" />
        </div>
      )}
      
      <TextSkeleton lines={2} />
      
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

// Auction card skeleton
export const AuctionCardSkeleton = () => (
  <CardSkeleton 
    showImage={true}
    imageHeight="aspect-video"
    className="group hover:shadow-lg transition-shadow"
  />
);

// Auction list skeleton
export const AuctionListSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <AuctionCardSkeleton key={index} />
    ))}
  </div>
);

// Bid item skeleton
export const BidItemSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    <div className="flex items-center gap-3">
      <AvatarSkeleton size="sm" />
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <div className="text-right">
      <Skeleton className="h-5 w-24 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

// Bid history skeleton
export const BidHistorySkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, index) => (
      <BidItemSkeleton key={index} />
    ))}
  </div>
);

// Comment skeleton
export const CommentSkeleton = () => (
  <div className="flex gap-3 p-4">
    <AvatarSkeleton size="sm" />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <TextSkeleton lines={2} />
      <div className="flex items-center gap-4 mt-3">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

// Comments list skeleton
export const CommentsListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <CommentSkeleton key={index} />
    ))}
  </div>
);

// Video player skeleton
export const VideoPlayerSkeleton = () => (
  <div className="aspect-video bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
    <div className="text-center">
      <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  </div>
);

// Timeline skeleton
export const TimelineSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="w-full h-2 rounded-full" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="flex justify-between text-xs">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-6 w-6 rounded-full" />
      ))}
    </div>
  </div>
);

// Price display skeleton
export const PriceSkeleton = ({ size = 'lg' }) => {
  const sizes = {
    sm: 'h-5 w-20',
    md: 'h-6 w-24',
    lg: 'h-8 w-32',
    xl: 'h-10 w-40'
  };
  
  return <Skeleton className={sizes[size]} />;
};

// Auction room skeleton
export const AuctionRoomSkeleton = () => (
  <div className="space-y-6">
    {/* Video section */}
    <VideoPlayerSkeleton />
    
    {/* Timeline */}
    <TimelineSkeleton />
    
    {/* Price and info */}
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <Skeleton className="h-4 w-16 mx-auto mb-2" />
        <PriceSkeleton size="xl" className="mx-auto" />
      </div>
      <div className="text-center">
        <Skeleton className="h-4 w-20 mx-auto mb-2" />
        <Skeleton className="h-6 w-24 mx-auto" />
      </div>
    </div>
    
    {/* Bidding section */}
    <div className="space-y-4">
      <Skeleton className="w-full h-12 rounded-xl" />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <ButtonSkeleton key={index} width="full" />
        ))}
      </div>
      <ButtonSkeleton width="full" size="lg" />
    </div>
    
    {/* Bid history */}
    <div>
      <Skeleton className="h-6 w-32 mb-4" />
      <BidHistorySkeleton count={3} />
    </div>
  </div>
);

// Navigation skeleton
export const NavigationSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-white shadow-sm">
    <div className="flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="h-6 w-32" />
    </div>
    
    <div className="flex items-center gap-4">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="w-8 h-8 rounded-lg" />
      <AvatarSkeleton size="sm" />
    </div>
  </div>
);

// Form field skeleton
export const FormFieldSkeleton = ({ showLabel = true }) => (
  <div className="space-y-2">
    {showLabel && <Skeleton className="h-4 w-24" />}
    <Skeleton className="h-12 w-full rounded-xl" />
  </div>
);

// Form skeleton
export const FormSkeleton = ({ fields = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, index) => (
      <FormFieldSkeleton key={index} />
    ))}
    <ButtonSkeleton width="full" size="lg" />
  </div>
);

export default Skeleton;