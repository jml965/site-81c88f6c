import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize, Users, Heart, MessageSquare, Share2, Flag, Clock, Gavel, TrendingUp } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import SyncTimeline from '../components/SyncTimeline';
import BidPanel from '../components/BidPanel';
import CurrentPrice from '../components/CurrentPrice';
import ParticipantsList from '../components/ParticipantsList';
import useAuctionSync from '../hooks/useAuctionSync';

export default function AuctionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showParticipants, setShowParticipants] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const {
    auctionData,
    currentTime,
    isPlaying,
    syncProgress,
    timeLeft,
    participants,
    bidHistory,
    comments,
    isConnected,
    loading,
    error,
    placeBid,
    addComment,
    toggleLike,
    toggleFollow,
    reportAuction
  } = useAuctionSync(id);

  const [bidAmount, setBidAmount] = useState('');
  const [quickBidAmounts] = useState([50, 100, 200, 500]);

  const handleBidSubmit = useCallback(async (amount) => {
    try {
      await placeBid(amount);
      setBidAmount('');
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
  }, [placeBid]);

  const handleQuickBid = useCallback((amount) => {
    const newBidAmount = (auctionData?.currentPrice || 0) + amount;
    handleBidSubmit(newBidAmount);
  }, [auctionData?.currentPrice, handleBidSubmit]);

  const handleCommentSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await addComment(newComment.trim());
        setNewComment('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  }, [newComment, addComment]);

  const handleLike = useCallback(async () => {
    try {
      await toggleLike();
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }, [isLiked, toggleLike]);

  const handleFollow = useCallback(async () => {
    try {
      await toggleFollow();
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  }, [isFollowing, toggleFollow]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: auctionData?.title,
        text: `شاهد هذا المزاد: ${auctionData?.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  }, [auctionData?.title]);

  const handleReport = useCallback(async () => {
    const reason = prompt('سبب الإبلاغ:');
    if (reason) {
      try {
        await reportAuction(reason);
        // Show success message
      } catch (error) {
        console.error('Failed to report auction:', error);
      }
    }
  }, [reportAuction]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المزاد...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">خطأ في تحميل المزاد</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/auctions')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            العودة للمزادات
          </button>
        </div>
      </div>
    );
  }

  if (!auctionData) return null;

  return (
    <div className="min-h-screen bg-gray-50 rtl" dir="rtl">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-red-500 text-white text-center py-2 text-sm">
          انقطع الاتصال - جاري إعادة المحاولة...
        </div>
      )}

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Video Section */}
        <div className="relative bg-black">
          <VideoPlayer
            src={auctionData.videoUrl}
            poster={auctionData.thumbnailUrl}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTimeUpdate={(time) => {}}
          />
          
          {/* Sync Timeline */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
            <SyncTimeline
              duration={auctionData.duration}
              currentTime={currentTime}
              progress={syncProgress}
              events={auctionData.timelineEvents}
              bids={bidHistory}
            />
          </div>
        </div>

        {/* Current Price */}
        <div className="bg-white border-b border-gray-200">
          <CurrentPrice
            currentPrice={auctionData.currentPrice}
            startingPrice={auctionData.startingPrice}
            currency="ر.س"
            timeLeft={timeLeft}
            status={auctionData.status}
            highestBidder={auctionData.highestBidder}
            totalBids={bidHistory.length}
          />
        </div>

        {/* Action Buttons */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span>{auctionData.likesCount}</span>
              </button>
              
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <MessageSquare size={16} />
                <span>{comments.length}</span>
              </button>

              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <Users size={16} />
                <span>{participants.length}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={handleFollow}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isFollowing 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isFollowing ? 'متابع' : 'متابعة'}
              </button>
              
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 size={16} />
              </button>
              
              <button
                onClick={handleReport}
                className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <Flag size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bid Panel */}
        {auctionData.status === 'active' && (
          <div className="bg-white border-b border-gray-200">
            <BidPanel
              currentPrice={auctionData.currentPrice}
              minimumIncrement={auctionData.minimumIncrement}
              onPlaceBid={handleBidSubmit}
              onQuickBid={handleQuickBid}
              quickBidAmounts={quickBidAmounts}
              currency="ر.س"
              disabled={auctionData.status !== 'active'}
            />
          </div>
        )}

        {/* Participants List */}
        {showParticipants && (
          <div className="bg-white border-b border-gray-200 max-h-60 overflow-y-auto">
            <ParticipantsList
              participants={participants}
              currentUserId="user123"
            />
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="bg-white">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">التعليقات</h3>
              
              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="flex space-x-2 space-x-reverse">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="اكتب تعليقك هنا..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    إرسال
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment.id} className="flex space-x-3 space-x-reverse">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-800">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bid History */}
        <div className="bg-white">
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">سجل المزايدات</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {bidHistory.slice(0, 10).map((bid, index) => (
                <div key={bid.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="font-medium text-gray-800">{bid.amount} ر.س</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">{bid.bidder.name}</div>
                    <div className="text-xs text-gray-500">{bid.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-6 p-6">
          {/* Video and Timeline */}
          <div className="col-span-3">
            <div className="bg-black rounded-xl overflow-hidden relative">
              <VideoPlayer
                src={auctionData.videoUrl}
                poster={auctionData.thumbnailUrl}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onTimeUpdate={(time) => {}}
              />
              
              {/* Sync Timeline */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                <SyncTimeline
                  duration={auctionData.duration}
                  currentTime={currentTime}
                  progress={syncProgress}
                  events={auctionData.timelineEvents}
                  bids={bidHistory}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl mt-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 space-x-reverse">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium transition-colors ${
                      isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                    <span>إعجاب ({auctionData.likesCount})</span>
                  </button>
                  
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing ? 'متابع' : 'متابعة'}
                  </button>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 size={18} />
                    <span>مشاركة</span>
                  </button>
                  
                  <button
                    onClick={handleReport}
                    className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                  >
                    <Flag size={18} />
                    <span>إبلاغ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Current Price */}
            <CurrentPrice
              currentPrice={auctionData.currentPrice}
              startingPrice={auctionData.startingPrice}
              currency="ر.س"
              timeLeft={timeLeft}
              status={auctionData.status}
              highestBidder={auctionData.highestBidder}
              totalBids={bidHistory.length}
            />

            {/* Bid Panel */}
            {auctionData.status === 'active' && (
              <BidPanel
                currentPrice={auctionData.currentPrice}
                minimumIncrement={auctionData.minimumIncrement}
                onPlaceBid={handleBidSubmit}
                onQuickBid={handleQuickBid}
                quickBidAmounts={quickBidAmounts}
                currency="ر.س"
                disabled={auctionData.status !== 'active'}
              />
            )}

            {/* Participants */}
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">المشاركون</h3>
                <span className="text-sm text-gray-500">{participants.length} مشارك</span>
              </div>
              <ParticipantsList
                participants={participants.slice(0, 5)}
                currentUserId="user123"
              />
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">التعليقات</h3>
              
              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="flex space-x-2 space-x-reverse">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="اكتب تعليقك..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.slice(0, 5).map(comment => (
                  <div key={comment.id} className="flex space-x-2 space-x-reverse">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs text-gray-800">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">سجل المزايدات</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bidHistory.slice(0, 8).map((bid, index) => (
                  <div key={bid.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="font-medium text-sm text-gray-800">{bid.amount} ر.س</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-600">{bid.bidder.name}</div>
                      <div className="text-xs text-gray-500">{bid.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}