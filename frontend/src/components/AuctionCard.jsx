import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  Eye, 
  Heart, 
  Share2, 
  Flag, 
  Play,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';

const AuctionCard = ({ auction, viewMode = 'grid' }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(auction.likes || 0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      const startTime = new Date(auction.startTime).getTime();
      
      if (auction.status === 'upcoming') {
        const distance = startTime - now;
        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            setTimeLeft(`${days} يوم و ${hours} ساعة`);
          } else if (hours > 0) {
            setTimeLeft(`${hours} ساعة و ${minutes} دقيقة`);
          } else {
            setTimeLeft(`${minutes} دقيقة`);
          }
        }
      } else if (auction.status === 'active') {
        const distance = endTime - now;
        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          if (hours > 0) {
            setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          } else {
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
          }
        } else {
          setTimeLeft('انتهى');
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime, auction.startTime, auction.status]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    
    // TODO: API call to like/unlike auction
  };

  const handleFollow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsFollowing(!isFollowing);
    
    // TODO: API call to follow/unfollow auction
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: auction.title,
        text: auction.description,
        url: window.location.origin + `/auctions/${auction.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/auctions/${auction.id}`);
      // TODO: Show toast notification
    }
  };

  const handleReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // TODO: Open report modal
    console.log('Report auction:', auction.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'upcoming':
        return 'قادم';
      case 'ended':
        return 'انتهى';
      case 'cancelled':
        return 'ملغى';
      default:
        return 'غير معروف';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/auctions/${auction.id}`}>
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative md:w-80 h-64 md:h-auto overflow-hidden">
              <img
                src={auction.thumbnailUrl}
                alt={auction.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
                  {getStatusText(auction.status)}
                </span>
              </div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {auction.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {auction.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{auction.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(auction.startTime).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 mr-4">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleReport}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Price and Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatPrice(auction.currentPrice)}
                  </div>
                  <div className="text-sm text-gray-500">
                    السعر الحالي
                  </div>
                </div>
                
                <div className="text-left">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{auction.participantsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{auction.viewsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{likes}</span>
                    </div>
                  </div>
                  
                  {auction.status === 'active' && (
                    <div className="flex items-center gap-1 text-red-600 font-medium">
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft}</span>
                    </div>
                  )}
                  
                  {auction.status === 'upcoming' && (
                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                      <Clock className="w-4 h-4" />
                      <span>يبدأ خلال {timeLeft}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link to={`/auctions/${auction.id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={auction.thumbnailUrl}
            alt={auction.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auction.status)}`}>
              {getStatusText(auction.status)}
            </span>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {auction.category}
            </span>
          </div>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Time Left */}
          {(auction.status === 'active' || auction.status === 'upcoming') && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {auction.status === 'active' ? timeLeft : `يبدأ خلال ${timeLeft}`}
                </span>
              </div>
            </div>
          )}
          
          {/* Winner Badge */}
          {auction.status === 'ended' && auction.winnerId && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>تم البيع</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {auction.title}
            </h3>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {auction.description}
          </p>
          
          {/* Price */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatPrice(auction.currentPrice)}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>السعر الحالي</span>
              {auction.bidCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {auction.bidCount} مزايدة
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{auction.participantsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{auction.viewsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{likes}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{auction.location}</span>
            </div>
          </div>
          
          {/* Seller Info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={auction.seller.avatar}
                  alt={auction.seller.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {auction.seller.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{auction.seller.rating}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleFollow}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isFollowing
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isFollowing ? 'متابع' : 'متابعة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;