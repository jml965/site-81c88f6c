import React, { useMemo, useCallback } from 'react';
import { Clock, Gavel, TrendingUp, Star, AlertCircle } from 'lucide-react';

export default function SyncTimeline({ 
  duration = 0, 
  currentTime = 0, 
  progress = 0, 
  events = [], 
  bids = [],
  className = ''
}) {
  // Calculate timeline markers and events
  const timelineData = useMemo(() => {
    if (!duration) return { markers: [], bidMarkers: [], eventMarkers: [] };

    // Generate time markers (every 10% of duration)
    const markers = [];
    for (let i = 0; i <= 10; i++) {
      const time = (duration * i) / 10;
      const position = (time / duration) * 100;
      markers.push({ time, position, label: formatTime(time) });
    }

    // Generate bid markers
    const bidMarkers = bids.map(bid => ({
      id: bid.id,
      time: bid.timestamp,
      position: (bid.timestamp / duration) * 100,
      amount: bid.amount,
      bidder: bid.bidder,
      type: 'bid'
    })).filter(marker => marker.position <= 100);

    // Generate event markers
    const eventMarkers = events.map(event => ({
      id: event.id,
      time: event.timestamp,
      position: (event.timestamp / duration) * 100,
      title: event.title,
      description: event.description,
      type: event.type || 'event',
      icon: getEventIcon(event.type)
    })).filter(marker => marker.position <= 100);

    return { markers, bidMarkers, eventMarkers };
  }, [duration, bids, events]);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getEventIcon = useCallback((type) => {
    switch (type) {
      case 'highlight': return Star;
      case 'price_change': return TrendingUp;
      case 'milestone': return AlertCircle;
      default: return Clock;
    }
  }, []);

  const currentPosition = duration ? (currentTime / duration) * 100 : 0;

  if (!duration) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center text-gray-400">
          <Clock size={20} className="ml-2" />
          <span>جاري تحميل الخط الزمني...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`} dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-white">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Clock size={16} />
          <span className="text-sm font-medium">الخط الزمني للمزاد</span>
        </div>
        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Main Timeline Bar */}
        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-6">
          {/* Progress Fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-200 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
          
          {/* Current Time Indicator */}
          <div 
            className="absolute top-0 h-full w-0.5 bg-white shadow-lg transition-all duration-200 ease-out"
            style={{ left: `${Math.min(currentPosition, 100)}%` }}
          />
          
          {/* Current Time Thumb */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-blue-500 transition-all duration-200 ease-out"
            style={{ left: `${Math.min(currentPosition, 100)}%`, marginLeft: '-6px' }}
          />
        </div>

        {/* Bid Markers */}
        <div className="absolute -top-8 left-0 right-0 h-8">
          {timelineData.bidMarkers.map(marker => {
            const isRecent = marker.time >= currentTime - 30; // Last 30 seconds
            const isActive = Math.abs(marker.time - currentTime) < 5; // Within 5 seconds
            
            return (
              <div
                key={marker.id}
                className="absolute group cursor-pointer"
                style={{ left: `${marker.position}%` }}
              >
                {/* Bid Marker */}
                <div className={`w-2 h-6 rounded-full transition-all duration-200 transform hover:scale-110 ${
                  isActive 
                    ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                    : isRecent 
                    ? 'bg-yellow-400' 
                    : 'bg-blue-400'
                }`} />
                
                {/* Bid Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    <div className="font-bold">{marker.amount} ر.س</div>
                    <div className="text-gray-300">{marker.bidder.name}</div>
                    <div className="text-gray-400">{formatTime(marker.time)}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Markers */}
        <div className="absolute -bottom-8 left-0 right-0 h-8">
          {timelineData.eventMarkers.map(marker => {
            const IconComponent = marker.icon;
            const isPast = marker.time <= currentTime;
            
            return (
              <div
                key={marker.id}
                className="absolute group cursor-pointer"
                style={{ left: `${marker.position}%` }}
              >
                {/* Event Marker */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
                  isPast 
                    ? 'bg-gray-500 text-gray-300' 
                    : marker.type === 'highlight' 
                    ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50' 
                    : marker.type === 'milestone'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-blue-500 text-white'
                }`}>
                  <IconComponent size={12} />
                </div>
                
                {/* Event Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/90 backdrop-blur-sm text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap max-w-32">
                    <div className="font-bold mb-1">{marker.title}</div>
                    {marker.description && (
                      <div className="text-gray-300 mb-1">{marker.description}</div>
                    )}
                    <div className="text-gray-400">{formatTime(marker.time)}</div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Markers */}
        <div className="flex justify-between text-xs text-gray-400 mt-10">
          {timelineData.markers.map((marker, index) => (
            <div key={index} className="text-center">
              <div className={`w-px h-2 mx-auto mb-1 ${
                marker.time <= currentTime ? 'bg-blue-400' : 'bg-gray-600'
              }`} />
              <span>{marker.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 space-x-reverse mt-4 text-xs text-gray-400">
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <span>مزايدات سابقة</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
          <span>مزايدات حديثة</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>مزايدة نشطة</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <Star size={12} className="text-yellow-500" />
          <span>أحداث مميزة</span>
        </div>
      </div>

      {/* Current Status */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 space-x-reverse bg-gray-700 rounded-full px-4 py-2 text-sm text-white">
          <div className={`w-2 h-2 rounded-full ${
            progress >= 100 ? 'bg-red-500' : progress > 90 ? 'bg-yellow-500' : 'bg-green-500'
          }`} />
          <span>
            {progress >= 100 
              ? 'انتهى المزاد' 
              : progress > 90 
              ? 'اللحظات الأخيرة' 
              : 'المزاد نشط'
            }
          </span>
        </div>
      </div>
    </div>
  );
}