import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';

export default function AuctionGallery({ images = [], title, videoUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const videoRef = useRef(null);

  const allMedia = [
    ...(videoUrl ? [{ type: 'video', url: videoUrl, thumbnail: images[0] }] : []),
    ...images.map(url => ({ type: 'image', url }))
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
    setIsVideoMode(allMedia[currentIndex - 1 < 0 ? allMedia.length - 1 : currentIndex - 1]?.type === 'video');
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % allMedia.length;
    setCurrentIndex(nextIndex);
    setIsVideoMode(allMedia[nextIndex]?.type === 'video');
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setIsVideoMode(allMedia[index]?.type === 'video');
  };

  const handleVideoToggle = () => {
    if (!videoRef.current) return;
    
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const openFullscreen = (index) => {
    setFullscreenIndex(index);
    setShowFullscreen(true);
  };

  const closeFullscreen = () => {
    setShowFullscreen(false);
  };

  const handleFullscreenPrevious = () => {
    setFullscreenIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const handleFullscreenNext = () => {
    setFullscreenIndex((prev) => (prev + 1) % allMedia.length);
  };

  if (!allMedia.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
          <span className="text-gray-500">لا توجد صور متاحة</span>
        </div>
      </div>
    );
  }

  const currentMedia = allMedia[currentIndex];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Main Display */}
        <div className="relative aspect-video bg-gray-900">
          {isVideoMode && currentMedia?.type === 'video' ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted={isMuted}
                poster={currentMedia.thumbnail}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src={currentMedia.url} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
              
              {/* Video Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center group">
                <button
                  onClick={handleVideoToggle}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  {isVideoPlaying ? (
                    <Pause className="h-8 w-8 text-gray-900" />
                  ) : (
                    <Play className="h-8 w-8 text-gray-900" />
                  )}
                </button>
              </div>
              
              {/* Video Control Bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVideoToggle}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all duration-200"
                  >
                    {isVideoPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={handleMuteToggle}
                    className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all duration-200"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => openFullscreen(currentIndex)}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all duration-200"
                >
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={currentMedia?.url}
                alt={title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openFullscreen(currentIndex)}
                loading="lazy"
              />
              <button
                onClick={() => openFullscreen(currentIndex)}
                className="absolute top-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all duration-200"
              >
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>
            </>
          )}

          {/* Media Counter */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {allMedia.length}
          </div>
        </div>

        {/* Thumbnails */}
        {allMedia.length > 1 && (
          <div className="p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allMedia.map((media, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                    index === currentIndex
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  <img
                    src={media.type === 'video' ? media.thumbnail : media.url}
                    alt={`${title} - صورة ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {media.type === 'video' && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation */}
          {allMedia.length > 1 && (
            <>
              <button
                onClick={handleFullscreenPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
              <button
                onClick={handleFullscreenNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm">
            {fullscreenIndex + 1} / {allMedia.length}
          </div>

          {/* Media Display */}
          <div className="w-full h-full flex items-center justify-center p-4">
            {allMedia[fullscreenIndex]?.type === 'video' ? (
              <video
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
                poster={allMedia[fullscreenIndex].thumbnail}
              >
                <source src={allMedia[fullscreenIndex].url} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
            ) : (
              <img
                src={allMedia[fullscreenIndex]?.url}
                alt={`${title} - صورة ${fullscreenIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}