import React, { useState, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileVideo,
  Loader2
} from 'lucide-react';

const VideoUpload = ({ 
  onVideoSelect, 
  selectedVideo = null, 
  error = null,
  maxSize = 500, // MB
  acceptedFormats = ['mp4', 'webm', 'ogg', 'mov', 'avi'],
  maxDuration = 600 // seconds (10 minutes)
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [validationError, setValidationError] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Validate video file
  const validateVideo = (file) => {
    return new Promise((resolve, reject) => {
      // Check file type
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        reject(`نوع الملف غير مدعوم. الأنواع المدعومة: ${acceptedFormats.join(', ')}`);
        return;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        reject(`حجم الملف كبير جداً. الحد الأقصى: ${maxSize} ميجابايت`);
        return;
      }

      // Create video element to check duration and get metadata
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        
        // Check duration
        if (video.duration > maxDuration) {
          reject(`مدة الفيديو طويلة جداً. الحد الأقصى: ${formatDuration(maxDuration)}`);
          return;
        }

        const info = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          size: file.size,
          type: file.type,
          name: file.name
        };
        
        resolve(info);
      };
      
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject('ملف الفيديو تالف أو غير صالح');
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file) return;

    setUploading(true);
    setValidationError(null);
    
    try {
      const info = await validateVideo(file);
      setVideoInfo(info);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      onVideoSelect(file);
    } catch (error) {
      setValidationError(error);
      setVideoInfo(null);
      setPreviewUrl(null);
      onVideoSelect(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Handle video play/pause
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle video events
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  // Remove selected video
  const handleRemoveVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setVideoInfo(null);
    setValidationError(null);
    setIsPlaying(false);
    onVideoSelect(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          فيديو المزاد *
        </label>
        <p className="text-xs text-gray-500 mb-4">
          ارفع فيديو يعرض المنتج بوضوح. الحد الأقصى: {maxSize} ميجابايت، {formatDuration(maxDuration)}
        </p>
      </div>

      {!selectedVideo ? (
        /* Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragOver 
              ? 'border-blue-400 bg-blue-50' 
              : error || validationError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
              <div>
                <p className="text-lg font-medium text-gray-900">جاري التحقق من الفيديو...</p>
                <p className="text-sm text-gray-500">يرجى الانتظار</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                error || validationError ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {error || validationError ? (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <Video className="w-8 h-8 text-blue-600" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {dragOver ? 'أفلت الفيديو هنا' : 'ارفع فيديو المزاد'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  اسحب الفيديو إلى هنا أو انقر للاختيار
                </p>
                
                <div className="bg-white border border-blue-200 text-blue-600 px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  اختيار الفيديو
                </div>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>الأنواع المدعومة: {acceptedFormats.map(f => f.toUpperCase()).join(', ')}</p>
                <p>الحد الأقصى: {maxSize} MB، {formatDuration(maxDuration)}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Video Preview */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="relative">
            <video
              ref={videoRef}
              src={previewUrl}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              className="w-full aspect-video object-cover"
              controls={false}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="w-16 h-16 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-gray-900 transition-all transform hover:scale-110"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={handleRemoveVideo}
              className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Video Info */}
          {videoInfo && (
            <div className="p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">الفيديو جاهز للرفع</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">الحجم</p>
                    <p className="font-medium">{formatFileSize(videoInfo.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">المدة</p>
                    <p className="font-medium">{formatDuration(videoInfo.duration)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">الدقة</p>
                    <p className="font-medium">{videoInfo.width} × {videoInfo.height}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600">اسم الملف</p>
                  <p className="font-medium truncate" title={videoInfo.name}>
                    {videoInfo.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Messages */}
      {(error || validationError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">خطأ في رفع الفيديو</p>
              <p className="text-sm text-red-700 mt-1">{error || validationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.map(format => `.${format}`).join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">نصائح لفيديو ناجح</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• اعرض المنتج من زوايا متعددة</li>
          <li>• استخدم إضاءة جيدة وواضحة</li>
          <li>• تأكد من وضوح الصوت إذا كان هناك تعليق</li>
          <li>• اجعل الفيديو قصيراً ومركزاً (2-5 دقائق)</li>
          <li>• أظهر تفاصيل مهمة مثل العلامات التجارية أو العيوب</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoUpload;