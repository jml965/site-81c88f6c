import React, { useState, useMemo } from 'react';
import { Crown, Trophy, Medal, Users, TrendingUp, Eye, EyeOff, Search, Filter } from 'lucide-react';

export default function ParticipantsList({ 
  participants = [], 
  currentUserId = null,
  showBidAmounts = false,
  compact = false,
  className = '' 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('bidAmount'); // 'bidAmount', 'bidCount', 'joinTime', 'name'
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Process and sort participants
  const processedParticipants = useMemo(() => {
    let filtered = participants;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by online status
    if (showOnlineOnly) {
      filtered = filtered.filter(p => p.isOnline);
    }

    // Sort participants
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'bidAmount':
          return (b.highestBid || 0) - (a.highestBid || 0);
        case 'bidCount':
          return (b.totalBids || 0) - (a.totalBids || 0);
        case 'joinTime':
          return new Date(b.joinTime) - new Date(a.joinTime);
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        default:
          return (b.highestBid || 0) - (a.highestBid || 0);
      }
    });

    return sorted;
  }, [participants, searchTerm, sortBy, showOnlineOnly]);

  const getRankIcon = (index, participant) => {
    if (index === 0 && participant.highestBid > 0) {
      return <Crown size={16} className="text-yellow-500" />;
    }
    if (index === 1 && participant.highestBid > 0) {
      return <Trophy size={16} className="text-gray-400" />;
    }
    if (index === 2 && participant.highestBid > 0) {
      return <Medal size={16} className="text-amber-600" />;
    }
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        participant.isOnline 
          ? 'bg-green-100 text-green-600' 
          : 'bg-gray-100 text-gray-400'
      }`}>
        {index + 1}
      </div>
    );
  };

  const getBidderLevel = (bidCount) => {
    if (bidCount >= 20) return { level: 'خبير', color: 'text-purple-600 bg-purple-100' };
    if (bidCount >= 10) return { level: 'متقدم', color: 'text-blue-600 bg-blue-100' };
    if (bidCount >= 5) return { level: 'نشط', color: 'text-green-600 bg-green-100' };
    if (bidCount >= 1) return { level: 'مبتدئ', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'متابع', color: 'text-gray-600 bg-gray-100' };
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return '--';
    return new Intl.NumberFormat('ar-SA').format(price);
  };

  const formatJoinTime = (time) => {
    const now = new Date();
    const joinTime = new Date(time);
    const diffMinutes = Math.floor((now - joinTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'الآن';
    if (diffMinutes < 60) return `منذ ${diffMinutes} د`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `منذ ${diffHours} س`;
    const diffDays = Math.floor(diffHours / 24);
    return `منذ ${diffDays} يوم`;
  };

  if (!participants.length) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 text-center ${className}`} dir="rtl">
        <Users size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">لا يوجد مشاركون بعد</h3>
        <p className="text-gray-500 text-sm">كن أول من ينضم لهذا المزاد</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`} dir="rtl">
      {/* Header */}
      {!compact && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">المشاركون</h3>
                <p className="text-sm text-gray-500">{processedParticipants.length} من {participants.length} مشارك</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className={`p-2 rounded-lg transition-colors ${
                  showOnlineOnly 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
                title="إظهار المتصلين فقط"
              >
                {showOnlineOnly ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              
              <button
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="إعدادات الخصوصية"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex space-x-3 space-x-reverse">
            <div className="flex-1 relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المشاركين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bidAmount">أعلى مزايدة</option>
              <option value="bidCount">عدد المزايدات</option>
              <option value="joinTime">وقت الانضمام</option>
              <option value="name">الاسم</option>
            </select>
          </div>
        </div>
      )}

      {/* Participants List */}
      <div className={`${compact ? 'p-3' : 'p-6'} max-h-96 overflow-y-auto`}>
        {processedParticipants.length === 0 ? (
          <div className="text-center py-8">
            <Search size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">لم يتم العثور على مشاركين</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processedParticipants.map((participant, index) => {
              const bidderLevel = getBidderLevel(participant.totalBids || 0);
              const isCurrentUser = participant.id === currentUserId;
              
              return (
                <div
                  key={participant.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isCurrentUser 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {/* Rank/Status */}
                    <div className="flex-shrink-0">
                      {getRankIcon(index, participant)}
                    </div>
                    
                    {/* Avatar and Info */}
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="relative">
                        <img
                          src={participant.avatar || '/default-avatar.png'}
                          alt={participant.name}
                          className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        {participant.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className={`text-sm font-medium ${
                            isCurrentUser ? 'text-blue-800' : 'text-gray-800'
                          }`}>
                            {participant.displayName || participant.name}
                            {isCurrentUser && <span className="text-blue-600 mr-1">(أنت)</span>}
                          </span>
                          
                          {!compact && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bidderLevel.color}`}>
                              {bidderLevel.level}
                            </span>
                          )}
                        </div>
                        
                        {!compact && (
                          <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                            <span>{participant.totalBids || 0} مزايدة</span>
                            <span>•</span>
                            <span>{formatJoinTime(participant.joinTime)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bid Amount */}
                  <div className="text-left">
                    {showBidAmounts && participant.highestBid > 0 ? (
                      <div>
                        <div className={`text-sm font-bold ${
                          index === 0 ? 'text-green-600' : 'text-gray-700'
                        }`}>
                          {formatPrice(participant.highestBid)} ر.س
                        </div>
                        {!compact && participant.lastBidTime && (
                          <div className="text-xs text-gray-500">
                            منذ {formatJoinTime(participant.lastBidTime)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        {participant.totalBids > 0 ? `${participant.totalBids} مزايدة` : 'متابع'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {!compact && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-bold text-green-600">
                {participants.filter(p => p.isOnline).length}
              </div>
              <div className="text-gray-600">متصل</div>
            </div>
            
            <div>
              <div className="text-lg font-bold text-blue-600">
                {participants.filter(p => (p.totalBids || 0) > 0).length}
              </div>
              <div className="text-gray-600">مزايد</div>
            </div>
            
            <div>
              <div className="text-lg font-bold text-purple-600">
                {participants.reduce((sum, p) => sum + (p.totalBids || 0), 0)}
              </div>
              <div className="text-gray-600">إجمالي المزايدات</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}