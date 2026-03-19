import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag,
  Plus,
  X,
  AlertCircle,
  Info
} from 'lucide-react';

const AuctionForm = ({ 
  formData, 
  onChange, 
  errors = {}, 
  categories = [],
  loading = false 
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag) && formData.tags?.length < 10) {
      onChange('tags', [...(formData.tags || []), tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = formData.tags?.filter(tag => tag !== tagToRemove) || [];
    onChange('tags', newTags);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('ar-SA').format(value);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const calculateEndTime = () => {
    if (!formData.startTime || !formData.duration) return '';
    const start = new Date(formData.startTime);
    const end = new Date(start.getTime() + (formData.duration * 60000));
    return end.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const conditionOptions = [
    { value: 'new', label: 'جديد', color: 'text-green-600' },
    { value: 'like_new', label: 'شبه جديد', color: 'text-blue-600' },
    { value: 'good', label: 'جيد', color: 'text-yellow-600' },
    { value: 'fair', label: 'مقبول', color: 'text-orange-600' },
    { value: 'poor', label: 'يحتاج إصلاح', color: 'text-red-600' }
  ];

  const durationOptions = [
    { value: 5, label: '5 دقائق', recommended: false },
    { value: 10, label: '10 دقائق', recommended: false },
    { value: 15, label: '15 دقيقة', recommended: false },
    { value: 30, label: '30 دقيقة', recommended: true },
    { value: 60, label: 'ساعة واحدة', recommended: true },
    { value: 120, label: 'ساعتان', recommended: false },
    { value: 180, label: '3 ساعات', recommended: false },
    { value: 360, label: '6 ساعات', recommended: false },
    { value: 720, label: '12 ساعة', recommended: false },
    { value: 1440, label: '24 ساعة', recommended: false }
  ];

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">المعلومات الأساسية</h3>
            <p className="text-sm text-gray-600">أدخل تفاصيل المنتج أو الخدمة</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان المزاد *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="اكتب عنواناً واضحاً وجذاباً للمزاد"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              maxLength={100}
            />
            {errors.title && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {(formData.title || '').length}/100 حرف
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف التفصيلي *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="اكتب وصفاً شاملاً ودقيقاً للمنتج أو الخدمة، يشمل المواصفات والحالة والمميزات"
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
              maxLength={1000}
            />
            {errors.description && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {(formData.description || '').length}/1000 حرف
            </div>
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف *
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <option value="">اختر التصنيف المناسب</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة المنتج *
              </label>
              <select
                value={formData.condition || 'new'}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.condition ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                {conditionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.condition && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.condition}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموقع
              <span className="text-xs text-gray-500 mr-1">(اختياري)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="المدينة أو المنطقة"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المواصفات والتفاصيل التقنية
              <span className="text-xs text-gray-500 mr-1">(اختياري)</span>
            </label>
            <textarea
              value={formData.specifications || ''}
              onChange={(e) => handleInputChange('specifications', e.target.value)}
              placeholder="اكتب المواصفات التقنية، الأبعاد، الوزن، المواد، أو أي تفاصيل إضافية مهمة"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {(formData.specifications || '').length}/500 حرف
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العلامات (Tags)
              <span className="text-xs text-gray-500 mr-1">(اختياري - حد أقصى 10)</span>
            </label>
            
            {/* Existing Tags */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-200 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
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
            )}

            {/* Add Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="أدخل علامة واضغط Enter"
                className="flex-1 px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                maxLength={20}
                disabled={formData.tags?.length >= 10}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || formData.tags?.length >= 10}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                إضافة
              </button>
            </div>
            
            <div className="text-xs text-gray-500 mt-1">
              العلامات تساعد في ظهور مزادك في نتائج البحث
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-green-50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">الأسعار</h3>
            <p className="text-sm text-gray-600">حدد سعر البداية وأقل زيادة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سعر البداية (ريال سعودي) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.startingPrice || ''}
                onChange={(e) => handleInputChange('startingPrice', parseFloat(e.target.value) || '')}
                placeholder="100"
                min="1"
                max="1000000"
                step="0.01"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.startingPrice ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              />
            </div>
            {errors.startingPrice && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.startingPrice}
              </div>
            )}
            {formData.startingPrice && (
              <div className="text-sm text-green-600 mt-1">
                {formatCurrency(formData.startingPrice)} ريال
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أقل زيادة مسموحة (ريال) *
            </label>
            <div className="relative">
              <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.minimumIncrement || ''}
                onChange={(e) => handleInputChange('minimumIncrement', parseFloat(e.target.value) || '')}
                placeholder="5"
                min="0.01"
                max="10000"
                step="0.01"
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.minimumIncrement ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              />
            </div>
            {errors.minimumIncrement && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.minimumIncrement}
              </div>
            )}
            {formData.minimumIncrement && (
              <div className="text-sm text-green-600 mt-1">
                {formatCurrency(formData.minimumIncrement)} ريال
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">نصائح للتسعير</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• اختر سعر بداية معقول ليجذب المزيد من المزايدين</li>
            <li>• أقل زيادة تساعد في تحديد سرعة ارتفاع السعر</li>
            <li>• زيادة صغيرة (5-10 ريال) تشجع على المشاركة</li>
          </ul>
        </div>
      </div>

      {/* Timing Section */}
      <div className="bg-orange-50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">التوقيت</h3>
            <p className="text-sm text-gray-600">حدد وقت بداية المزاد ومدته</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وقت بداية المزاد *
            </label>
            <input
              type="datetime-local"
              value={formData.startTime || ''}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              min={getMinDateTime()}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                errors.startTime ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
            />
            {errors.startTime && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.startTime}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدة المزاد *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.duration || 60}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.recommended && '(موصى به)'}
                  </option>
                ))}
              </select>
            </div>
            {errors.duration && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.duration}
              </div>
            )}
          </div>

          {/* Calculated End Time */}
          {formData.startTime && formData.duration && (
            <div className="bg-white border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">موعد انتهاء المزاد</span>
              </div>
              <p className="text-lg font-bold text-orange-600">
                {calculateEndTime()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionForm;