import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Video, 
  Image as ImageIcon, 
  Calendar, 
  DollarSign, 
  Clock, 
  Tag, 
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';
import AuctionForm from '../components/AuctionForm';
import VideoUpload from '../components/VideoUpload';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startingPrice: '',
    minimumIncrement: '',
    startTime: '',
    duration: 60, // minutes
    videoFile: null,
    images: [],
    tags: [],
    condition: 'new',
    location: '',
    specifications: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(false);

  const steps = [
    { id: 1, title: 'معلومات أساسية', icon: FileText },
    { id: 2, title: 'الوسائط', icon: Video },
    { id: 3, title: 'التوقيت والأسعار', icon: Calendar },
    { id: 4, title: 'المراجعة والنشر', icon: CheckCircle }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddTag = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'العنوان مطلوب';
        if (!formData.description.trim()) newErrors.description = 'الوصف مطلوب';
        if (!formData.category) newErrors.category = 'التصنيف مطلوب';
        if (!formData.condition) newErrors.condition = 'حالة المنتج مطلوبة';
        break;

      case 2:
        if (!formData.videoFile) newErrors.videoFile = 'فيديو المزاد مطلوب';
        break;

      case 3:
        if (!formData.startingPrice || formData.startingPrice <= 0) {
          newErrors.startingPrice = 'سعر البداية مطلوب ويجب أن يكون أكبر من صفر';
        }
        if (!formData.minimumIncrement || formData.minimumIncrement <= 0) {
          newErrors.minimumIncrement = 'أقل زيادة مطلوبة ويجب أن تكون أكبر من صفر';
        }
        if (!formData.startTime) newErrors.startTime = 'وقت بداية المزاد مطلوب';
        if (!formData.duration || formData.duration < 5) {
          newErrors.duration = 'مدة المزاد يجب أن تكون 5 دقائق على الأقل';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return; // Validate all required fields

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'images') {
          formData[key].forEach((file, index) => {
            submitData.append(`image_${index}`, file);
          });
        } else if (key !== 'videoFile') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add video file
      if (formData.videoFile) {
        submitData.append('video', formData.videoFile);
      }

      const response = await fetch('/api/auctions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });

      if (response.ok) {
        const auction = await response.json();
        navigate(`/auction/${auction.id}`);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'حدث خطأ أثناء إنشاء المزاد' });
      }
    } catch (error) {
      setErrors({ submit: 'حدث خطأ أثناء إنشاء المزاد' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان المزاد *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="أدخل عنوان واضح وجذاب للمزاد"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="اكتب وصفاً تفصيلياً للمنتج أو الخدمة"
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حالة المنتج *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.condition ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="new">جديد</option>
                  <option value="like_new">شبه جديد</option>
                  <option value="good">جيد</option>
                  <option value="fair">مقبول</option>
                  <option value="poor">يحتاج إصلاح</option>
                </select>
                {errors.condition && <p className="text-red-600 text-sm mt-1">{errors.condition}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="المدينة أو المنطقة"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المواصفات والتفاصيل</label>
              <textarea
                value={formData.specifications}
                onChange={(e) => handleInputChange('specifications', e.target.value)}
                placeholder="اكتب المواصفات التقنية أو التفاصيل الإضافية"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العلامات (Tags)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="اضغط Enter لإضافة علامة"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <VideoUpload
              onVideoSelect={(file) => handleInputChange('videoFile', file)}
              selectedVideo={formData.videoFile}
              error={errors.videoFile}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">صور إضافية</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">اسحب الصور هنا أو انقر لتحديد</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    handleInputChange('images', [...formData.images, ...files]);
                  }}
                  className="hidden"
                  id="images-upload"
                />
                <label
                  htmlFor="images-upload"
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  اختيار الصور
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          handleInputChange('images', newImages);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">سعر البداية (ريال) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.startingPrice}
                    onChange={(e) => handleInputChange('startingPrice', parseFloat(e.target.value) || '')}
                    placeholder="100"
                    min="1"
                    step="0.01"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.startingPrice ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.startingPrice && <p className="text-red-600 text-sm mt-1">{errors.startingPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">أقل زيادة (ريال) *</label>
                <div className="relative">
                  <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.minimumIncrement}
                    onChange={(e) => handleInputChange('minimumIncrement', parseFloat(e.target.value) || '')}
                    placeholder="5"
                    min="0.01"
                    step="0.01"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.minimumIncrement ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.minimumIncrement && <p className="text-red-600 text-sm mt-1">{errors.minimumIncrement}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وقت بداية المزاد *</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.startTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startTime && <p className="text-red-600 text-sm mt-1">{errors.startTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">مدة المزاد (بالدقائق) *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value={5}>5 دقائق</option>
                  <option value={10}>10 دقائق</option>
                  <option value={15}>15 دقيقة</option>
                  <option value={30}>30 دقيقة</option>
                  <option value={60}>ساعة واحدة</option>
                  <option value={120}>ساعتان</option>
                  <option value={180}>3 ساعات</option>
                  <option value={360}>6 ساعات</option>
                  <option value={720}>12 ساعة</option>
                  <option value={1440}>24 ساعة</option>
                </select>
              </div>
              {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-900">مراجعة تفاصيل المزاد</h3>
              </div>
              <p className="text-blue-700">تأكد من صحة جميع المعلومات قبل نشر المزاد</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">معلومات أساسية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">العنوان:</span>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div>
                  <span className="text-gray-600">التصنيف:</span>
                  <p className="font-medium">{categories.find(c => c.id === formData.category)?.name || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">حالة المنتج:</span>
                  <p className="font-medium">
                    {formData.condition === 'new' && 'جديد'}
                    {formData.condition === 'like_new' && 'شبه جديد'}
                    {formData.condition === 'good' && 'جيد'}
                    {formData.condition === 'fair' && 'مقبول'}
                    {formData.condition === 'poor' && 'يحتاج إصلاح'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">الموقع:</span>
                  <p className="font-medium">{formData.location || '-'}</p>
                </div>
              </div>
              
              {formData.description && (
                <div className="mt-4">
                  <span className="text-gray-600">الوصف:</span>
                  <p className="font-medium mt-1">{formData.description}</p>
                </div>
              )}

              {formData.tags.length > 0 && (
                <div className="mt-4">
                  <span className="text-gray-600">العلامات:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">الأسعار والتوقيت</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">سعر البداية:</span>
                  <p className="font-medium">{formData.startingPrice} ريال</p>
                </div>
                <div>
                  <span className="text-gray-600">أقل زيادة:</span>
                  <p className="font-medium">{formData.minimumIncrement} ريال</p>
                </div>
                <div>
                  <span className="text-gray-600">وقت البداية:</span>
                  <p className="font-medium">{new Date(formData.startTime).toLocaleString('ar-SA')}</p>
                </div>
                <div>
                  <span className="text-gray-600">مدة المزاد:</span>
                  <p className="font-medium">{formData.duration} دقيقة</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">الوسائط</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">فيديو المزاد:</span>
                  <p className="font-medium">
                    {formData.videoFile ? `${formData.videoFile.name} (${(formData.videoFile.size / 1024 / 1024).toFixed(1)} MB)` : 'لا يوجد'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">الصور الإضافية:</span>
                  <p className="font-medium">{formData.images.length} صورة</p>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة إلى لوحة البائع
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء مزاد جديد</h1>
          <p className="text-gray-600">اتبع الخطوات لإنشاء مزاد احترافي</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted ? 'bg-green-100 border-green-500' :
                    isActive ? 'bg-blue-100 border-blue-500' :
                    'bg-gray-100 border-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icon className={`w-6 h-6 ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                  <span className={`text-xs mt-2 text-center font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
            
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{steps[currentStep - 1].title}</h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            السابق
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              التالي
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  جاري الإنشاء...
                </>
              ) : (
                'نشر المزاد'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;